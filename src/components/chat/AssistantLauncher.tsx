import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { MessageCircle, X } from 'lucide-react';

const ChatPanel = lazy(() => import('./ChatPanel'));
class ChatBoundary extends Component<{ children: ReactNode; onClose: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(_error: Error, _info: ErrorInfo) { /* No conversation or error payload is logged. */ }
  render() { return this.state.failed ? <div className="assistant-load-error" role="alert">The assistant couldn’t load. Your portfolio is still available.<button className="text-button" onClick={this.props.onClose}>Dismiss</button><button className="text-button" onClick={() => window.location.reload()}>Reload to retry</button></div> : this.props.children; }
}
export function AssistantLauncher({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  if (import.meta.env.VITE_ASSISTANT_ENABLED === 'false') return null;
  return <>
    <button className="assistant-launcher" onClick={() => onOpenChange(!open)} aria-haspopup="dialog" aria-expanded={open} aria-label={open ? 'Cancel opening assistant' : 'Ask me anything about Yassin'}>{open ? <X size={19}/> : <MessageCircle size={19}/>}<span>{open ? 'Close assistant' : 'Ask about my work'}</span></button>
    {open && <ChatBoundary onClose={() => onOpenChange(false)}><Suspense fallback={<span className="assistant-loading" role="status">Opening assistant…</span>}><ChatPanel onClose={() => onOpenChange(false)}/></Suspense></ChatBoundary>}
  </>;
}
