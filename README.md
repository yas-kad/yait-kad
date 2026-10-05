# Yassin Ait Kaddour — Portfolio

React + TypeScript + Tailwind portfolio with verified résumé content and project captures. A small, optional assistant replaces the former UI Lab. See `CONTENT_SOURCES.md` for attribution boundaries.

## Local development

Node.js 22+, then `npm install` and `npm run dev`. Open http://localhost:5173.

Create `.env.local` using `.env.example` and set `GEMINI_API_KEY` to enable live answers. Keep all keys server-only. Restart after server/env changes. The same `/api/chat` handler runs behind Express locally and as one Vercel Node function in production. Without a key, the panel gives a friendly offline response and keeps résumé/contact links available. It never substitutes fake AI answers.

## Architecture and content

- `/` introduces Yassin as a software engineer and features AndaPlay and StayRoom with large project covers and captions, followed by a sticky profile sidebar beside an introduction, employment history, education, and skills. Agenz is presented in employment history; search points to that experience and project navigation includes only AndaPlay and StayRoom. `/work/andaplay` and `/work/stayroom` are dedicated detail pages (the legacy `/work/agenz` URL is retained without promotional links) rendered by `src/components/ProjectPage.tsx`. Native links support history and direct URLs; Express provides the local SPA fallback and `vercel.json` rewrites `/work/:project` to the app. Configure the same fallback on other static hosts.
- `src/components/navigation/SiteHeader.tsx` provides the reference-inspired pill navigation. Its lazy-loaded `SearchDialog.tsx` filters local portfolio destinations, prioritizes exact titles, supports Cmd/Ctrl+K, arrow keys, Enter, Escape, and keyboard focus containment. AI Assistant opens the same lazy chat from any page.
- `src/components/PortfolioSections.tsx` and `src/portfolio-sections.css` own the image-led projects, open experience, About, skills, education, and contact sections. Their styles are scoped independently of the approved hero and navbar.
- `src/editorial.css` contains the selected design's responsive styling and uses the small `public/images/hero-atmosphere.webp` background. `design-qa.md` records the reference comparison and browser checks.
- `src/components/chat/AssistantLauncher.tsx`: small floating launcher. The panel and its CSS are dynamically imported on first click, with no initial chat request or preload. A chunk-loading failure is contained by an error boundary. The launcher itself adds a small amount of JavaScript/CSS; no claim of zero performance cost is made.
- `src/components/chat/ChatPanel.tsx`: native modal dialog for focus containment, Escape, focus restoration, scrollable transcript, suggested questions, and mobile full-screen sheet. It never opens automatically.
- `src/hooks/useChat.ts`: in-memory messages, streaming, timeout, retry, and cancellation. Closing the panel aborts the request and clears the conversation. Partial failed answers are discarded; retries replace the failed answer without duplicating the question.
- `src/content/assistant-knowledge.md`: the sole factual reference for the assistant, prefilled from the verified portfolio with the owner's approval. Edit the five sections as facts change. The Markdown is bundled only with the server function, never imported into the frontend. Update this and `src/data/portfolioData.ts` together when facts change.
- `server/prompt.ts`: third-person, concise, knowledge-only instructions, explicit unknown-answer fallback and off-topic/injection refusal. These are model instructions, not a mathematical guarantee of factual accuracy or prompt secrecy; no secrets are placed in the prompt. No browsing/tools are enabled.
- `server/chat-handler.ts`: portable Web Request/Response handler, Zod validation, streamed NDJSON events, safe errors, no conversation logs/storage.
- `api/chat.ts`: Vercel Node entrypoint. `vercel.json` includes the knowledge Markdown in the function bundle and gives the function a 30-second duration.

## Production configuration (Vercel)

1. Import this directory as a **Vite** project, Node.js **22.x**, build `npm run build`, output `dist`. Keep the included `vercel.json`; `/api/chat` must route to the function, not a SPA fallback. No deployment has been performed by this task.
2. Set server secrets `GEMINI_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and a random `CHAT_RATE_LIMIT_SECRET` of at least 32 characters. Use one shared Upstash Redis database for rate counters across instances. Use separate databases/secrets for preview and production if independent budgets are desired.
3. Set `GEMINI_MODEL` to an available model (default `gemini-3.8-flash`), `CHAT_DAILY_LIMIT=100`, and `ASSISTANT_ENABLED=true`.
4. Set the public **build-time** flag `VITE_ASSISTANT_ENABLED=true`. Set it to `false` and rebuild to remove the assistant entirely. Set server `ASSISTANT_ENABLED=false` to stop new provider calls without a frontend build. The portfolio does not depend on either flag.
5. Configure provider spending controls/alerts and conservative request quotas in Google AI Studio / the linked Cloud billing project. Billing alerts may not be hard caps. Review Vercel spend limits and Upstash limits too. The app's request budget is an additional safeguard, not a dollar spending guarantee.
6. Before making it public, ask the assistant about Next.js scale, measurable results, StayRoom, AndaPlay ownership, unavailable hiring details, unrelated coding tasks, and attempts to override its rules. Check short, grounded responses. Test a preview deployment's streaming and trusted-IP limits. Local automated tests use an injected generator and do not verify live provider accuracy.

Required variables and optional local settings are documented in `.env.example`. Never put a secret in a `VITE_` variable. Do not commit `.env.local`.

A traditional Node host can instead run `npm run build` then `npm start`, with `HOST=0.0.0.0`, its `PORT`, and the same production secrets. Set `TRUST_PROXY_HOPS` only to that host's known proxy topology. A static-only host can serve the portfolio with the assistant disabled.

## Limits, privacy, and failures

- Server-enforced maximum: 500 characters per message, six alternating conversation messages ending in a user question, 16 KB request body; rejects extra keys and system-role messages. Frontend sends only the latest six; long previous answers are truncated to 500 characters for history. Up to 20 messages remain visible while the panel is open.
- Ten requests per IP per ten-minute fixed window. A shared daily budget defaults to 100 attempted generations per 24-hour window from the first request. Failed provider attempts count toward limits. Returns HTTP 429 and `Retry-After`.
- Production uses atomic Redis counters with expiry. IPs are HMACed with a server secret before storage. No questions, answers, or raw IPs are stored in Redis. Missing/broken rate protection fails closed. Development uses bounded process-local counters unless Redis is configured.
- 400 provider output tokens, 25-second server timeout, 30-second client timeout, disconnect/close cancellation. Cancellation is best-effort at the provider; already-generated tokens may still be billed.
- Honeypot `website` field is checked before generation. To add Turnstile/hCaptcha later, collect a widget token, add a bounded schema field, and verify it server-side before consuming the provider budget. A honeypot is a basic filter, not complete bot prevention; consider Vercel firewall controls for high-volume abuse.
- JSON errors have a stable `code` and safe `message`. Streaming uses newline-delimited JSON: `delta`, `done`, or `error`. Truncated streams without `done` are treated as failures. Model output renders as plain text; no model HTML, scripts, or arbitrary links are executed.
- No application conversation logs, browser persistence, or analytics. Questions and recent history are sent to Google Gemini for inference; provider and hosting data policies still apply. The UI tells visitors not to enter sensitive information.
- The Vercel adapter trusts Vercel's overwritten `x-forwarded-for` header; the local adapter uses Express's configured trusted-proxy policy. Do not copy Vercel's policy to an arbitrary host.

## Verification

`npm run lint` (strict TypeScript), `npm test` (prompt, limiter, validation, streaming, cancellation, offline mode and production fail-closed behavior), `npm run build`.

Documentation used:
- [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js)
- [Vercel forwarded headers](https://vercel.com/docs/headers/request-headers)
- [Gemini content API](https://ai.google.dev/api/generate-content)
- [Gemini models](https://ai.google.dev/gemini-api/docs/models)
- [Upstash REST API](https://upstash.com/docs/redis/features/restapi)
