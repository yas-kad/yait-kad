import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_HISTORY, MAX_MESSAGE_LENGTH, type ChatMessage } from '../../shared/chat';

export type DisplayMessage = ChatMessage & { id: number };
type ChatError = { message: string; code: string };
class ResponseError extends Error { constructor(message: string, readonly code: string) { super(message); } }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }

export function useChat() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'streaming'>('idle');
  const [error, setError] = useState<ChatError | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const controller = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  const retryMessages = useRef<DisplayMessage[] | null>(null);
  const stop = useCallback(() => { controller.current?.abort(); controller.current = null; }, []);
  useEffect(() => stop, [stop]);

  const run = useCallback(async (conversation: DisplayMessage[], website: string) => {
    if (controller.current) return;
    const abort = new AbortController(); controller.current = abort;
    const answerId = ++sequence.current;
    retryMessages.current = conversation;
    setMessages(conversation); setError(null); setStatus('loading'); setAnnouncement('Preparing an answer.');
    const timeout = window.setTimeout(() => abort.abort(), 30000);
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', signal: abort.signal, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation.slice(-MAX_HISTORY).map(({ role, content }) => ({ role, content: content.slice(0, MAX_MESSAGE_LENGTH) })), website }),
      });
      if (!response.ok) {
        const data: unknown = await response.json().catch(() => null);
        throw new ResponseError(isRecord(data) && typeof data.message === 'string' ? data.message : 'The assistant is unavailable. Please try again.', isRecord(data) && typeof data.code === 'string' ? data.code : 'REQUEST_FAILED');
      }
      if (!response.headers.get('content-type')?.includes('application/x-ndjson') || !response.body) throw new Error('INVALID_STREAM');
      reader = response.body.getReader();
      const decoder = new TextDecoder(); let buffer = ''; let answer = ''; let doneEvent = false;
      const processLine = (line: string) => {
        if (!line.trim()) return;
        const event: unknown = JSON.parse(line);
        if (!isRecord(event)) throw new Error('INVALID_EVENT');
        if (event.type === 'error') throw new ResponseError(typeof event.message === 'string' ? event.message : 'The answer was interrupted. Please retry.', 'GENERATION_FAILED');
        if (event.type === 'done') { doneEvent = true; return; }
        if (event.type !== 'delta' || typeof event.text !== 'string' || doneEvent) throw new Error('INVALID_EVENT');
        answer += event.text;
        if (answer.length > 4000) throw new Error('OUTPUT_TOO_LONG');
        setStatus('streaming');
        setMessages([...conversation, { id: answerId, role: 'assistant' as const, content: answer }].slice(-20));
      };
      while (true) {
        const chunk = await reader.read();
        buffer += decoder.decode(chunk.value, { stream: !chunk.done });
        if (buffer.length > 32000) throw new Error('INVALID_STREAM');
        const lines = buffer.split('\n'); buffer = lines.pop() || '';
        for (const line of lines) processLine(line);
        if (chunk.done) break;
      }
      if (buffer.trim()) processLine(buffer);
      if (!doneEvent || !answer.trim()) throw new Error('INCOMPLETE_STREAM');
      retryMessages.current = null;
      setAnnouncement(`Assistant: ${answer}`);
    } catch (cause) {
      // Closing unmounts the panel and aborts silently. Timeouts remain actionable.
      if (controller.current === abort) {
        setMessages(conversation);
        const problem = cause instanceof ResponseError ? { message: cause.message, code: cause.code }
          : { message: abort.signal.aborted ? 'The answer took too long. Please retry.' : 'The answer couldn’t be completed. Check your connection and retry.', code: 'NETWORK_ERROR' };
        setError(problem); setAnnouncement(problem.message);
      }
    } finally {
      window.clearTimeout(timeout);
      if (reader) { await reader.cancel().catch(() => {}); reader.releaseLock(); }
      if (controller.current === abort) { controller.current = null; setStatus('idle'); }
    }
  }, []);

  const send = (text: string, website: string) => {
    if (!text.trim() || text.length > MAX_MESSAGE_LENGTH || controller.current) return;
    // An unanswered message is replaced when a new question follows an error.
    const history = error && messages.at(-1)?.role === 'user' ? messages.slice(0, -1) : messages;
    void run([...history.slice(-19), { id: ++sequence.current, role: 'user', content: text.trim() }], website);
  };
  const retry = (website: string) => { if (retryMessages.current) void run(retryMessages.current, website); };
  return { messages, status, error, announcement, send, retry, stop };
}
