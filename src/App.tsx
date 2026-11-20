import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS } from './data/portfolioData';
import { ProjectPage } from './components/ProjectPage';
import { ProjectsPage } from './components/ProjectsPage';
import { PortfolioSections } from './components/PortfolioSections';
import { SiteHeader } from './components/navigation/SiteHeader';
import { AssistantLauncher } from './components/chat/AssistantLauncher';
import { pageMeta } from './seo';

export default function App({ initialPath = window.location.pathname }: { initialPath?: string }) {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const pathname = initialPath.replace(/\/$/, '') || '/';
  const project = PROJECTS.find(item => pathname === `/work/${item.id}`);
  const isHome = pathname === '/';
  const isProjects = pathname === '/projects';
  useEffect(() => {
    document.title = pageMeta(pathname)?.title || 'Page not found — Yassin Ait Kaddour';
  }, [pathname]);
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
    <SiteHeader pathname={pathname} onAssistant={() => setAssistantOpen(true)} assistantOpen={assistantOpen}/>
    <main id="main">
      {project ? <ProjectPage project={project}/> : isProjects ? <ProjectsPage/> : !isHome ? <section className="shell not-found"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>This page isn’t here.</h1><a className="button button-primary" href="/">Back to the portfolio <ArrowRight size={16}/></a></section> : <>
      <PortfolioSections/>
      </>}
    </main><footer className="shell site-footer"><span>© {new Date().getFullYear()} {PERSONAL_INFO.name}</span><span>Made with React, TypeScript & a little curiosity.</span><a href="#">Back to top ↑</a></footer>
    <AssistantLauncher open={assistantOpen} onOpenChange={setAssistantOpen}/>
  </>;
}
