import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS } from '../../data/portfolioData';
import { ASSISTANT_ENABLED } from '../../config';

type SearchDialogProps = { onClose: () => void; onAssistant: () => void };
const pages = [
  { title: 'About Yassin', detail: 'Background, education, and languages', href: '/#about' },
  { title: 'Selected projects', detail: 'AndaPlay and StayRoom', href: '/#work' },
  { title: 'Work experience', detail: 'Marjane Mall, Agenz, 1337 Labs, Noun', href: '/#experience' },
  { title: 'Skills', detail: 'React, Next.js, Astro, TypeScript, Node.js', href: '/#skills' },
  { title: 'Agenz', detail: 'Frontend engineering experience · marketplace and internal tools', href: '/#experience-agenz' },
  ...PROJECTS.map(project => ({ title: project.title, detail: project.description, href: `/work/${project.id}/` })),
  { title: 'Résumé', detail: 'Download the full résumé', href: PERSONAL_INFO.resumeUrl },
  { title: 'Contact', detail: PERSONAL_INFO.email, href: '/#contact' },
];

export default function SearchDialog({ onClose, onAssistant }: SearchDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const term = query.trim().toLowerCase();
  const matches = pages.filter(item => `${item.title} ${item.detail}`.toLowerCase().includes(term)).sort((a, b) => {
    const rank = (title: string) => title.toLowerCase() === term ? 0 : title.toLowerCase().includes(term) ? 1 : 2;
    return rank(a.title) - rank(b.title);
  });
  const showAssistant = ASSISTANT_ENABLED && /assistant|ai|chat|^$/.test(query.trim().toLowerCase());
  useEffect(() => {
    const previous = document.activeElement;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element?.showModal(); field.current?.focus(); document.body.style.overflow = 'hidden';
    return () => {
      element?.close(); document.body.style.overflow = overflow;
      const target = previous instanceof HTMLElement && previous !== document.body ? previous : document.querySelector<HTMLButtonElement>('.nav-search');
      if (target?.isConnected) target.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialog} className="search-dialog" aria-labelledby="search-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }} onKeyDown={event => {
    if (event.key === 'Tab') {
      const items = [...event.currentTarget.querySelectorAll<HTMLElement>('button, a[href], input')];
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0]?.focus(); }
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const items = [field.current, ...event.currentTarget.querySelectorAll<HTMLElement>('.search-result')].filter((item): item is HTMLElement => item !== null);
      const index = items.indexOf(document.activeElement as HTMLElement);
      items[(index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
    }
    if (event.key === 'Enter' && document.activeElement === field.current) {
      event.preventDefault(); event.currentTarget.querySelector<HTMLElement>('.search-result')?.click();
    }
  }}>
    <div className="search-field"><Search size={20}/><label id="search-title" htmlFor="portfolio-search" className="sr-only">Search this portfolio</label><input id="portfolio-search" ref={field} value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a project, skill, or experience…" autoComplete="off"/><button className="icon-button" aria-label="Close search" onClick={onClose}><X size={18}/></button></div>
    <div className="search-results"><p className="search-caption">{query ? 'SEARCH RESULTS' : 'QUICK NAVIGATION'}</p><span className="sr-only" role="status">{matches.length + Number(showAssistant)} results</span>{matches.map(item => <a key={item.href} className="search-result" href={item.href} download={item.href === PERSONAL_INFO.resumeUrl || undefined} onClick={onClose}><span><strong>{item.title}</strong><small>{item.detail}</small></span><ArrowUpRight size={16}/></a>)}{showAssistant && <button className="search-result" onClick={() => { onClose(); onAssistant(); }}><span><strong>AI Assistant</strong><small>Ask about Yassin’s experience and projects</small></span><ArrowUpRight size={16}/></button>}{matches.length === 0 && !showAssistant && <p className="search-empty">No matches. Try a project name, “React,” or “experience.”</p>}</div>
    <footer className="search-footer"><span>↑ ↓ Navigate · Enter Open</span><span>Esc Close</span></footer>
  </dialog>;
}
