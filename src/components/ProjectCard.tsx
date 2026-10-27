import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Project } from '../types';

export function ProjectCard({ project }: { project: Project }) {
  return <article className="folio-project">
    <a className="folio-project-cover" href={`/work/${project.id}/`} aria-label={`View ${project.title} project details`}><img src={project.image} alt={project.imageAlt} width="1280" height="720" loading="lazy"/></a>
    <div className="folio-project-caption">
      <div className="folio-project-title"><span className="folio-category">{project.category}</span><h3><a href={`/work/${project.id}/`}>{project.title}<ArrowUpRight size={22}/></a></h3><p>{project.subtitle}</p></div>
      <div className="folio-project-story">
        <p>{project.story}</p>
        <div className="folio-project-links">
          <a className="folio-link" href={`/work/${project.id}/`}>Read project story <ArrowRight size={16}/><span className="sr-only">: {project.title}</span></a>
          {project.website ? <a className="folio-secondary-link" href={project.website} target="_blank" rel="noreferrer">{project.cta || 'Visit website'}<ArrowUpRight size={14}/><span className="sr-only"> (opens in a new tab)</span></a> : project.statusNote && <span className="folio-secondary-link">{project.statusNote}</span>}
        </div>
      </div>
    </div>
  </article>;
}
