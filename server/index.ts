import 'dotenv/config';
import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { createRuntime } from './chat-runtime';

dotenv.config({ path: '.env.local', quiet: true });
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = express();
app.disable('x-powered-by');
const proxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
if (Number.isInteger(proxyHops) && proxyHops > 0 && proxyHops <= 5) app.set('trust proxy', proxyHops);
const chat = createRuntime();
app.all('/api/chat', express.raw({ type: () => true, limit: '16kb' }), async (req, res) => {
  const controller = new AbortController();
  const abort = () => controller.abort();
  res.on('close', abort);
  req.on('aborted', abort);
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) headers.set(key, Array.isArray(value) ? value.join(',') : value);
    }
    const request = new Request(`${req.protocol}://${req.get('host')}${req.originalUrl}`, {
      method: req.method, headers, signal: controller.signal,
      ...(req.method !== 'GET' && req.method !== 'HEAD' ? { body: Buffer.isBuffer(req.body) ? req.body.toString('utf8') : '' } : {}),
    });
    const response = await chat(request, req.ip || 'unknown');
    if (controller.signal.aborted) return;
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.flushHeaders();
    const reader = response.body?.getReader();
    if (reader) {
      const cancelReader = () => { void reader.cancel().catch(() => {}); };
      controller.signal.addEventListener('abort', cancelReader, { once: true });
      try {
        while (!controller.signal.aborted) {
          const { done, value } = await reader.read(); if (done) break;
          if (!res.write(value)) await once(res, 'drain', { signal: controller.signal });
        }
      } finally { controller.signal.removeEventListener('abort', cancelReader); reader.releaseLock(); }
    }
    res.end();
  } catch {
    if (!res.headersSent && !controller.signal.aborted) res.status(500).json({ code: 'INTERNAL_ERROR', message: 'The assistant is temporarily unavailable.' });
    else res.end();
  } finally { res.off('close', abort); req.off('aborted', abort); }
});
app.use('/api', (_req, res) => res.status(404).json({ code: 'NOT_FOUND', message: 'Not found.' }));
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const tooLarge = typeof err === 'object' && err !== null && 'type' in err && err.type === 'entity.too.large';
  res.status(tooLarge ? 413 : 400).json({ code: tooLarge ? 'BODY_TOO_LARGE' : 'INVALID_REQUEST', message: 'That request could not be accepted. Please shorten your question.' });
});
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(root, 'dist'), { index: false }));
  app.get('*', (req, res) => { if (req.accepts('html')) res.sendFile(path.join(root, 'dist/index.html')); else res.sendStatus(404); });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}
const port = Number(process.env.PORT || 5173);
app.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`Portfolio: http://localhost:${port}`));
