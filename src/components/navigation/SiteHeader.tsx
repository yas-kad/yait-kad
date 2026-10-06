import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowUpRight, FileText, Menu, Search, X } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { ASSISTANT_ENABLED } from '../../config';

const SearchDialog = lazy(() => import('./SearchDialog'));
const links = [{ label: 'About', id: 'about' }, { label: 'Experience', id: 'experience' }, { label: 'Projects', id: 'work' }, { label: 'Skills', id: 'skills' }, { label: 'Contact', id: 'contact' }];
export function SiteHeader({ onAssistant, assistantOpen }: { onAssistant: () => void; assistantOpen: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [active, setActive] = useState(window.location.pathname.startsWith('/work/') ? 'work' : 'intro');
  const enabled = ASSISTANT_ENABLED;
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !assistantOpen) { event.preventDefault(); setMenuOpen(false); setSearchOpen(open => !open); }
    }
    window.addEventListener('keydown', onKey);
    const sections = [...document.querySelectorAll<HTMLElement>('main [data-nav-section]')];
    function onScroll() {
      if (!sections.length) return;
      const selected = sections.filter(section => section.getBoundingClientRect().top <= window.innerHeight * .35).at(-1);
      const section = selected?.dataset.navSection || 'intro';
      setActive(section);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', onScroll); onScroll();
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll); window.removeEventListener('hashchange', onScroll); };
  }, [assistantOpen]);
  function openAssistant() { setMenuOpen(false); setSearchOpen(false); onAssistant(); }
  return <>
    <header className="site-header"><div className="shell nav-inner">
      <a href="/" className="brand" aria-label="Yassin Ait Kaddour, home"><img className="brand-initial" src="/images/yassin-avatar.png" alt="" width="27" height="27"/><span className="brand-username">yait-kad<span className="brand-suffix">.dev</span></span></a>
      <nav aria-label="Main navigation" className="desktop-nav">{links.map((link, index) => <span className="nav-slot" key={link.id}>{index === 3 && enabled && <button onClick={openAssistant} aria-haspopup="dialog">AI Assistant</button>}<a href={`/#${link.id}`} aria-current={active === link.id || link.id === 'about' && active === 'intro' ? 'location' : undefined}>{link.label}</a></span>)}</nav>
      <div className="nav-actions"><button className="nav-search" onClick={() => setSearchOpen(true)} aria-label="Search portfolio" aria-haspopup="dialog"><Search size={16}/><span>Search</span><kbd>⌘ K</kbd></button><a className="resume-nav" href={PERSONAL_INFO.resumeUrl} download><FileText size={16}/><span>Résumé</span></a><button className="icon-button menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button></div>
    </div>{menuOpen && <nav className="mobile-nav shell" id="mobile-nav" aria-label="Mobile navigation" onKeyDown={event => { if (event.key === 'Escape') { setMenuOpen(false); document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus(); } }}>{links.map(link => <a key={link.id} href={`/#${link.id}`} onClick={() => setMenuOpen(false)}>{link.label}<ArrowUpRight size={16}/></a>)}{enabled && <button onClick={openAssistant}>AI Assistant<ArrowUpRight size={16}/></button>}<a href={PERSONAL_INFO.resumeUrl} download onClick={() => setMenuOpen(false)}>Download résumé<FileText size={16}/></a></nav>}</header>
    {searchOpen && <Suspense fallback={<div className="search-loading" role="status">Opening search…<button onClick={() => setSearchOpen(false)}>Cancel</button></div>}><SearchDialog onClose={() => setSearchOpen(false)} onAssistant={onAssistant}/></Suspense>}
  </>;
}
