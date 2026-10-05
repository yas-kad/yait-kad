import { z } from 'zod';
import type { ChatEvent, ChatMessage } from '../shared/chat';
import { MAX_HISTORY, MAX_MESSAGE_LENGTH } from '../shared/chat';
import type { RateLimiter } from './rate-limit';

export const chatSchema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH) }).strict()).min(1).max(MAX_HISTORY),
  website: z.string().max(200).optional().default(''),
}).strict().refine(value => value.messages.at(-1)?.role === 'user'
  && value.messages.every((message, i) => i === 0 || message.role !== value.messages[i - 1].role), 'Invalid conversation order');

export type ChatGenerator = (messages: ChatMessage[], signal: AbortSignal) => AsyncIterable<string>;
type Dependencies = { generate?: ChatGenerator; limiter: RateLimiter; clientKey: (ip: string) => string; dailyLimit?: number };
const commonHeaders = { 'Cache-Control': 'no-store, no-transform', 'X-Content-Type-Options': 'nosniff' };
function error(status: number, code: string, message: string, retryAfter?: number) {
  return Response.json({ code, message }, { status, headers: { ...commonHeaders, ...(retryAfter ? { 'Retry-After': String(retryAfter) } : {}) } });
}
async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('INVALID_JSON');
  const chunks: Uint8Array[] = []; let total = 0;
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      total += value.byteLength;
      if (total > 16000) { await reader.cancel(); throw new Error('BODY_TOO_LARGE'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
}

export function createChatHandler({ generate, limiter, clientKey, dailyLimit = 100 }: Dependencies) {
  return async function handle(request: Request, ip: string): Promise<Response> {
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { ...commonHeaders, Allow: 'POST' } });
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return error(403, 'INVALID_ORIGIN', 'Please open the assistant from the portfolio.');
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return error(415, 'INVALID_CONTENT_TYPE', 'Please send a JSON request.');
    let raw: unknown;
    try { raw = await readBody(request); }
    catch (cause) { return cause instanceof Error && cause.message === 'BODY_TOO_LARGE'
      ? error(413, 'BODY_TOO_LARGE', 'That request is too long. Please shorten your question.')
      : error(400, 'INVALID_JSON', 'That request could not be read. Please try again.'); }
    const parsed = chatSchema.safeParse(raw);
    if (!parsed.success) return error(400, 'INVALID_REQUEST', 'Use up to 6 alternating messages, with no more than 500 characters each.');
    if (parsed.data.website) return error(400, 'BOT_DETECTED', 'That request could not be accepted. Please try again.');
    if (!generate) return error(503, 'ASSISTANT_UNAVAILABLE', 'The assistant is offline. You can still explore the projects, read the résumé, or contact Yassin directly.');
    try {
      const personal = await limiter.consume(clientKey(ip), 10, 600);
      if (!personal.allowed) return error(429, 'RATE_LIMITED', 'You’ve reached the question limit. Please try again in a few minutes.', personal.retryAfter);
      const daily = await limiter.consume('daily', dailyLimit, 86400);
      if (!daily.allowed) return error(429, 'DAILY_LIMIT', 'The assistant has reached today’s limit. Please contact Yassin directly or try again tomorrow.', daily.retryAfter);
    } catch { return error(503, 'PROTECTION_UNAVAILABLE', 'The assistant is temporarily unavailable. Please try again later.'); }
    if (request.signal.aborted) return error(408, 'REQUEST_ABORTED', 'The request was cancelled.');

    const controller = new AbortController();
    const cancel = () => controller.abort();
    request.signal.addEventListener('abort', cancel, { once: true });
    const timeout = setTimeout(cancel, 25000);
    const cleanup = () => { clearTimeout(timeout); request.signal.removeEventListener('abort', cancel); };
    const encoder = new TextEncoder();
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      async start(output) {
        const send = (event: ChatEvent) => { if (!cancelled) output.enqueue(encoder.encode(`${JSON.stringify(event)}\n`)); };
        try {
          let length = 0;
          for await (const text of generate(parsed.data.messages, controller.signal)) {
            if (controller.signal.aborted) throw new Error('ABORTED');
            length += text.length;
            if (length > 4000) throw new Error('OUTPUT_TOO_LONG');
            if (text) send({ type: 'delta', text });
          }
          if (!length) throw new Error('EMPTY_RESPONSE');
          send({ type: 'done' });
        } catch {
          send({ type: 'error', code: 'GENERATION_FAILED', message: 'The answer couldn’t be completed. Please retry or contact Yassin directly.' });
        } finally { controller.abort(); cleanup(); if (!cancelled) output.close(); }
      },
      cancel() { cancelled = true; controller.abort(); cleanup(); },
    });
    return new Response(stream, { headers: { ...commonHeaders, 'Content-Type': 'application/x-ndjson; charset=utf-8', 'X-Accel-Buffering': 'no' } });
  };
}
