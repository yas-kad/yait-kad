import assert from 'node:assert/strict';
import { test } from 'node:test';
import { memoryLimiter, redisLimiter } from './rate-limit';

test('allows ten attempts per client then blocks until the window expires', async () => {
  let time = 0; const limiter = memoryLimiter(() => time);
  for (let i = 0; i < 10; i++) assert.equal((await limiter.consume('alice', 10, 600)).allowed, true);
  assert.deepEqual(await limiter.consume('alice', 10, 600), { allowed: false, retryAfter: 600 });
  assert.equal((await limiter.consume('bob', 10, 600)).allowed, true);
  time = 599001;
  assert.deepEqual(await limiter.consume('alice', 10, 600), { allowed: false, retryAfter: 1 });
  time = 600000;
  assert.equal((await limiter.consume('alice', 10, 600)).allowed, true);
});
test('concurrent calls cannot exceed the configured allowance', async () => {
  const limiter = memoryLimiter();
  const results = await Promise.all(Array.from({ length: 40 }, () => limiter.consume('same', 10, 600)));
  assert.equal(results.filter(result => result.allowed).length, 10);
});
test('shared limiter uses one atomic EVAL with no conversations', async () => {
  const mock: typeof fetch = async (_input, init) => {
    const command = JSON.parse(String(init?.body));
    assert.equal(command[0], 'EVAL'); assert.equal(command[2], '1');
    assert.deepEqual(command.slice(3), ['portfolio-chat:ip:hashed', '10', '600']);
    assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer token');
    return Response.json({ result: [0, 120] });
  };
  assert.deepEqual(await redisLimiter('https://redis.example', 'token', mock).consume('ip:hashed', 10, 600), { allowed: false, retryAfter: 120 });
});
test('shared store errors fail closed', async () => {
  for (const response of [new Response('', { status: 503 }), Response.json({ error: 'bad token' }), Response.json({ result: [1, -1] })]) {
    const limiter = redisLimiter('https://redis.example', 'token', async () => response);
    await assert.rejects(limiter.consume('hashed', 10, 600));
  }
  assert.throws(() => redisLimiter('http://redis.example', 'token'));
});
