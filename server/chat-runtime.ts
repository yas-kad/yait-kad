import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createHmac, randomBytes } from 'node:crypto';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { buildPrompt } from './prompt';
import { createChatHandler, type ChatGenerator } from './chat-handler';
import { memoryLimiter, redisLimiter, type RateLimiter } from './rate-limit';

export function createRuntime(env: NodeJS.ProcessEnv = process.env) {
  const production = env.NODE_ENV === 'production' || env.VERCEL === '1';
  const secret = env.CHAT_RATE_LIMIT_SECRET || (production ? '' : randomBytes(32).toString('hex'));
  const hasSharedStore = Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN && secret.length >= 32);
  const unavailable: RateLimiter = { async consume() { throw new Error('SHARED_STORE_REQUIRED'); } };
  let limiter: RateLimiter = production ? unavailable : memoryLimiter();
  if (hasSharedStore) {
    try { limiter = redisLimiter(env.UPSTASH_REDIS_REST_URL!, env.UPSTASH_REDIS_REST_TOKEN!); } catch { limiter = unavailable; }
  }
  let generate: ChatGenerator | undefined;
  const key = env.GEMINI_API_KEY;
  if (env.ASSISTANT_ENABLED !== 'false' && key && !['your_key_here', 'MY_GEMINI_API_KEY'].includes(key)) {
    try {
      const knowledge = readFileSync(path.join(process.cwd(), 'src/content/assistant-knowledge.md'), 'utf8');
      const systemInstruction = buildPrompt(knowledge);
      const ai = new GoogleGenAI({ apiKey: key, httpOptions: { timeout: 25000 } });
      generate = async function* (messages, signal) {
        const result = await ai.models.generateContentStream({
          model: env.GEMINI_MODEL || 'gemini-3.8-flash',
          contents: messages.map(message => ({ role: message.role === 'assistant' ? 'model' : 'user', parts: [{ text: message.content }] })),
          config: { systemInstruction, maxOutputTokens: 400, temperature: 0.2, thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }, abortSignal: signal },
        });
        for await (const chunk of result) if (chunk.text) yield chunk.text;
      };
    } catch { /* Missing knowledge disables the assistant without exposing paths or secrets. */ }
  }
  const daily = Number(env.CHAT_DAILY_LIMIT || 100);
  return createChatHandler({ generate, limiter,
    clientKey: ip => `ip:${createHmac('sha256', secret).update(ip).digest('hex')}`,
    dailyLimit: Number.isInteger(daily) && daily > 0 ? daily : 100,
  });
}
