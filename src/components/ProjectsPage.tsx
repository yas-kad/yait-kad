import { ArrowLeft } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { ProjectCard } from './ProjectCard';

export function ProjectsPage() {
  return <article className="case-page shell">
    <a href="/" className="text-button case-back"><ArrowLeft size={16}/>Back to the portfolio</a>
    <header className="case-intro">
      <span className="eyebrow">ALL PROJECTS</span>
      <h1>Projects.</h1>
      <p className="case-overview">Products I contribute to professionally, and ideas I build on my own: shipped platforms, a demo prototype, and two personal projects still running locally ahead of launch.</p>
    </header>
    <div className="folio-projects-page">
      <div className="folio-projects">{PROJECTS.map(project => <ProjectCard project={project} key={project.id}/>)}</div>
    </div>
  </article>;
}
