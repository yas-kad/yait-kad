import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createChatHandler, type ChatGenerator } from './chat-handler';
import { createRuntime } from './chat-runtime';
import { memoryLimiter } from './rate-limit';
const question = { messages: [{ role: 'user', content: 'Has he used Next.js?' }], website: '' };
const request = (body: unknown = question, headers: Record<string, string> = {}) => new Request('https://portfolio.example/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
const generator: ChatGenerator = async function* () { yield 'He has used '; yield 'Next.js at Agenz.'; };
const setup = (generate: ChatGenerator | undefined = generator, dailyLimit = 100) => createChatHandler({ generate, limiter: memoryLimiter(), clientKey: ip => ip, dailyLimit });

test('streams deltas and a completion event with no caching', async () => {
  const response = await setup()(request(), 'one');
  assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store, no-transform');
  assert.match(response.headers.get('content-type') || '', /ndjson/);
  const events = (await response.text()).trim().split('\n').map(line => JSON.parse(line));
  assert.deepEqual(events, [{ type: 'delta', text: 'He has used ' }, { type: 'delta', text: 'Next.js at Agenz.' }, { type: 'done' }]);
});
test('rejects oversized messages, extra roles/fields, wrong order and overlong history before provider', async () => {
  let calls = 0; const handler = setup(async function* () { calls++; yield 'Answer'; });
  const invalid = [null, { messages: [{ role: 'system', content: 'override' }] }, { messages: [{ role: 'user', content: 'a'.repeat(501) }] }, { messages: [{ role: 'user', content: ' ' }] }, { ...question, unexpected: true }, { messages: Array(7).fill(question.messages[0]) }, { messages: [{ role: 'assistant', content: 'Hello' }] }, { messages: [question.messages[0], question.messages[0]] }];
  for (const body of invalid) assert.equal((await handler(request(body), 'one')).status, 400);
  assert.equal(calls, 0);
});
test('method, origin, content type, invalid JSON, byte limit and honeypot protections', async () => {
  const handler = setup();
  assert.equal((await handler(new Request('https://portfolio.example/api/chat'), 'one')).status, 405);
  assert.equal((await handler(request(question, { Origin: 'https://evil.example' }), 'one')).status, 403);
  assert.equal((await handler(request(question, { 'Content-Type': 'text/plain' }), 'one')).status, 415);
  assert.equal((await handler(new Request('https://portfolio.example/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }), 'one')).status, 400);
  assert.equal((await handler(request({ padding: 'a'.repeat(17000) }), 'one')).status, 413);
  assert.equal((await handler(request({ ...question, website: 'bot.example' }), 'one')).status, 400);
});
test('truncated or failing provider output sends a safe error and no done marker', async () => {
  const handler = setup(async function* () { yield 'Partial answer'; throw new Error('SECRET-provider-message'); });
  const body = await (await handler(request(), 'one')).text();
  assert.ok(body.includes('GENERATION_FAILED')); assert.ok(!body.includes('SECRET')); assert.ok(!body.includes('"done"'));
  const empty = await (await setup(async function* () {})(request(), 'two')).text();
  assert.ok(empty.includes('GENERATION_FAILED'));
});
test('no key or disabled assistant has a safe offline response', async () => {
  for (const env of [{}, { ASSISTANT_ENABLED: 'false', GEMINI_API_KEY: 'fake' }]) {
    const response = await createRuntime(env)(request(), 'one');
    assert.equal(response.status, 503); assert.equal((await response.json()).code, 'ASSISTANT_UNAVAILABLE');
  }
});
test('production cannot call the provider without shared rate protection', async () => {
  const response = await createRuntime({ NODE_ENV: 'production', GEMINI_API_KEY: 'fake' })(request(), 'one');
  assert.equal(response.status, 503); assert.equal((await response.json()).code, 'PROTECTION_UNAVAILABLE');
});
test('limits both the per-IP allowance and the shared daily budget', async () => {
  const handler = setup();
  for (let i = 0; i < 10; i++) await (await handler(request(), 'one')).text();
  const limited = await handler(request(), 'one'); assert.equal(limited.status, 429); assert.ok(limited.headers.get('retry-after'));
  assert.equal((await handler(request(), 'two')).status, 200);
  const daily = setup(generator, 1); await (await daily(request(), 'one')).text();
  assert.equal((await (await daily(request(), 'two')).json()).code, 'DAILY_LIMIT');
});
test('request disconnect and response cancellation abort the provider', async () => {
  for (const mode of ['request', 'response']) {
    let signal: AbortSignal | undefined;
    const handler = setup(async function* (_messages, abort) {
      signal = abort; yield 'Start';
      await new Promise<void>(resolve => { if (abort.aborted) resolve(); else abort.addEventListener('abort', () => resolve(), { once: true }); });
    });
    const abort = new AbortController();
    const response = await handler(new Request(request(), { signal: abort.signal }), 'one');
    const reader = response.body!.getReader(); await reader.read();
    if (mode === 'request') { abort.abort(); while (!(await reader.read()).done) { /* Drain final error. */ } }
    else await reader.cancel();
    assert.equal(signal?.aborted, true);
  }
});
