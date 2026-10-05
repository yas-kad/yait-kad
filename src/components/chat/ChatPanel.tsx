import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, MessageCircle, RotateCcw, X } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { MAX_MESSAGE_LENGTH } from '../../../shared/chat';
import { PERSONAL_INFO } from '../../data/portfolioData';
import './chat.css';

const questions = ["What's his strongest technical area?", 'Has he worked with Next.js at scale?', 'Is he a fit for a senior React role?'];
export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const nearBottom = useRef(true);
  const [draft, setDraft] = useState('');
  const [website, setWebsite] = useState('');
  const { messages, status, error, announcement, send, retry, stop } = useChat();
  const busy = status !== 'idle';

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const element = dialog.current;
    element?.showModal(); closeButton.current?.focus(); document.body.style.overflow = 'hidden';
    return () => { stop(); element?.close(); document.body.style.overflow = previousOverflow; previous?.focus({ preventScroll: true }); };
  }, [stop]);
  useEffect(() => {
    if (nearBottom.current && transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight;
  }, [messages, status, error]);

  function ask(question: string) {
    if (!question.trim() || busy) return;
    nearBottom.current = true; send(question, website); setDraft(''); input.current?.focus();
  }
  function close() { stop(); onClose(); }
  return <dialog ref={dialog} className="chat-panel" aria-labelledby="chat-title" aria-describedby="chat-description"
    onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], textarea, input:not([tabindex="-1"]), [tabindex="0"]')];
      const first = focusable[0]; const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}
    onCancel={event => { event.preventDefault(); close(); }}
    onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
    <div className="chat-layout">
      <header className="chat-header"><div className="chat-avatar" aria-hidden="true"><MessageCircle size={20}/></div><div><h2 id="chat-title">Ask me anything</h2><p id="chat-description">About Yassin’s work & experience</p></div><button className="icon-button" ref={closeButton} onClick={close} aria-label="Close assistant"><X size={20}/></button></header>
      <div className="chat-transcript" ref={transcript} role="region" aria-label="Conversation" tabIndex={0} onScroll={event => { const el = event.currentTarget; nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 70; }}>
        {messages.length === 0 && <div className="chat-welcome"><span className="eyebrow">A QUICK INTRODUCTION</span><h3>Get to know the<br/>engineer behind the work.</h3><p>Ask about his experience, skills, or projects. Answers draw from his résumé and portfolio.</p><div className="chat-suggestions">{questions.map(question => <button key={question} onClick={() => ask(question)} disabled={busy}>{question}<ArrowUpRight size={15}/></button>)}</div><p className="chat-empty-note">A useful starting point. You can always reach out directly.</p></div>}
        {messages.map(message => <article className={`chat-message chat-message-${message.role}`} key={message.id}><span>{message.role === 'user' ? 'YOU' : 'PORTFOLIO ASSISTANT'}</span><p>{message.content}</p></article>)}
        {busy && <div className="chat-typing" aria-hidden="true"><i/><i/><i/><span>{status === 'loading' ? 'Preparing an answer' : 'Writing'}</span></div>}
        {error && <div className="chat-error"><p>{error.message}</p><button className="text-button" disabled={busy} onClick={() => { nearBottom.current = true; retry(website); }}><RotateCcw size={14}/>Retry answer</button></div>}
      </div>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      <footer className="chat-footer"><div className="chat-direct-links"><a href={PERSONAL_INFO.resumeUrl} download>Read résumé <ArrowUpRight size={12}/></a><a href={`mailto:${PERSONAL_INFO.email}`}>Contact Yassin <ArrowUpRight size={12}/></a></div>
        <form onSubmit={event => { event.preventDefault(); ask(draft); }}>
          <div className="chat-honeypot" aria-hidden="true"><label htmlFor="chat-website">Leave this field empty</label><input id="chat-website" name="website" value={website} onChange={event => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off"/></div>
          <label className="sr-only" htmlFor="chat-question">Your question about Yassin</label>
          <div className="chat-composer"><textarea ref={input} id="chat-question" rows={2} maxLength={MAX_MESSAGE_LENGTH} value={draft} placeholder="Ask about his work…" onChange={event => setDraft(event.target.value)} aria-describedby="chat-input-help" onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); ask(draft); } }}/><button type="submit" aria-label="Send question" disabled={busy || !draft.trim()}><ArrowUp size={19}/></button></div>
          <div className="chat-input-help" id="chat-input-help"><span>Enter to send · Shift + Enter for a new line</span><span>{draft.length}/{MAX_MESSAGE_LENGTH}</span></div>
        </form><p className="chat-disclaimer">AI-generated answers based on my portfolio content. May contain errors.</p><p className="chat-privacy">Questions are sent to Google Gemini. Please avoid sensitive information.</p>
      </footer>
    </div>
  </dialog>;
}
