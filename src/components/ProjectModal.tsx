import { useEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import type { Project } from '../types';

export function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const element = dialog.current;
    element?.showModal(); closeButton.current?.focus(); document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; element?.close(); previous?.focus(); };
  }, []);
  return <dialog className="project-dialog" ref={dialog} aria-labelledby="project-title" onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}><div className="dialog-content"><header className="dialog-header"><span>{project.category}</span><button className="icon-button" ref={closeButton} onClick={onClose} aria-label="Close project details"><X size={22}/></button></header><div className="dialog-body"><span className="eyebrow">{project.role}</span><h2 id="project-title">{project.title}</h2><p className="dialog-subtitle">{project.subtitle}</p><p>{project.overview}</p><a className="button button-quiet" href={project.website} target="_blank" rel="noreferrer">{project.id === 'stayroom' ? 'Explore the demo' : 'Visit website'}<ArrowUpRight size={16}/></a><figure><img src={project.image} alt={project.imageAlt} width="1280" height="720"/><figcaption>{project.imageCaption}</figcaption></figure>{project.contributions.length > 0 && <div className="contributions"><h3>My contributions</h3>{project.contributions.map((c, i) => <section key={c.title}><span className="contribution-number">0{i + 1}</span><div><h4>{c.title}</h4><p>{c.body}</p></div></section>)}</div>}{project.productNotes && <div className="product-notes"><h3>{project.id === 'stayroom' ? 'What the demo explores' : 'About the product'}</h3><ul>{project.productNotes.map(note => <li key={note}>{note}</li>)}</ul></div>}{project.technologies.length > 0 && <div className="tags">{project.technologies.map(t => <span key={t}>{t}</span>)}</div>}</div></div></dialog>;
}
