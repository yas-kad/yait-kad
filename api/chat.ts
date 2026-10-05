import { createRuntime } from '../server/chat-runtime';

const handle = createRuntime();
// Vercel overwrites x-forwarded-for. Do not reuse this trust policy on other hosts.
export default {
  fetch(request: Request) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    return handle(request, ip);
  },
};
