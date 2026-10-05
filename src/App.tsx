import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Download, Mail } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS } from './data/portfolioData';
import { ProjectPage } from './components/ProjectPage';
import { PortfolioSections } from './components/PortfolioSections';
import { SiteHeader } from './components/navigation/SiteHeader';
import { AssistantLauncher } from './components/chat/AssistantLauncher';

export default function App() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  const project = PROJECTS.find(item => pathname === `/work/${item.id}`);
  const isHome = pathname === '/';
  useEffect(() => {
    document.title = project ? `${project.title} — Yassin Ait Kaddour` : isHome ? 'Yassin Ait Kaddour — Software Engineer' : 'Page not found — Yassin Ait Kaddour';
  }, [project, isHome]);
  useEffect(() => {
    // The initial hash can resolve before the client-rendered sections exist.
    const frame = requestAnimationFrame(() => {
      const id = window.location.hash.slice(1);
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader onAssistant={() => setAssistantOpen(true)} assistantOpen={assistantOpen}/>
    <main id="main">
      {project ? <ProjectPage project={project}/> : !isHome ? <section className="shell not-found"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>This page isn’t here.</h1><a className="button button-primary" href="/">Back to the portfolio <ArrowRight size={16}/></a></section> : <>
      <section className="hero shell" aria-labelledby="hero-title" data-nav-section="intro">
        <div className="hero-badge"><span className="status-dot"/>Software Engineer<span className="badge-divider"/>Casablanca, Morocco</div>
        <h1 id="hero-title">Hi, I’m Yassin<span className="hero-period">.</span><br/><span>I build useful software.</span></h1>
        <div className="hero-introduction"><p>A software engineer with a strong frontend background.<br className="desktop-break"/> I connect thoughtful interfaces with the systems behind them.</p><p className="hero-note">From web products to internal tools,<br/>I care about how it works.<br/><span>And how it feels to use.</span></p></div>
        <div className="hero-buttons"><a href="#work" className="button button-primary">View projects <ArrowDown size={17}/></a><a href={PERSONAL_INFO.resumeUrl} download className="button button-quiet"><Download size={17}/>Download résumé</a><a href="#contact" className="hero-contact"><Mail size={17}/>Let’s talk</a></div>
        <div className="hero-bottom"><span className="hero-bottom-label">SOME OF THE TOOLS I WORK WITH</span><div className="hero-stack"><span>React</span><span>Next.js</span><span>Astro</span><span>TypeScript</span><span>Node.js</span></div><a href="#work" className="hero-scroll" aria-label="Scroll to selected projects"><ArrowDown size={17}/></a></div>
      </section>
      <PortfolioSections/>
      </>}
    </main><footer className="shell site-footer"><span>© {new Date().getFullYear()} {PERSONAL_INFO.name}</span><span>Made with React, TypeScript & a little curiosity.</span><a href="#">Back to top ↑</a></footer>
    <AssistantLauncher open={assistantOpen} onOpenChange={setAssistantOpen}/>
  </>;
}
