import { ArrowLeft, ArrowRight, ArrowUpRight, Mail } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS } from '../data/portfolioData';
import type { Project } from '../types';

const productDetails: Record<string, { title: string; body: string }[]> = {
  andaplay: [
    { title: 'Court reservations', body: 'AndaPlay brings court availability and reservations into a sports booking experience for players.' },
    { title: 'Players & matches', body: 'Player connections and public matches are part of the product, alongside the reservation flow.' },
    { title: 'Club operations', body: 'The product also includes tools for sports clubs to manage bookings.' },
  ],
  stayroom: [
    { title: 'Discover a room', body: 'The demo explores furnished rooms in shared apartments, with location, budget, and amenity filters to narrow the search.' },
    { title: 'Explore the details', body: 'Property and room detail pages provide the next step between browsing listings and starting a reservation.' },
    { title: 'Try the reservation journey', body: 'A sample reservation flow completes the prototype. There is no online payment, and it does not create a real rental booking.' },
  ],
};

export function ProjectPage({ project }: { project: Project }) {
  const selectedProjects = PROJECTS.filter(item => item.id !== 'agenz');
  const next = selectedProjects[(selectedProjects.findIndex(item => item.id === project.id) + 1) % selectedProjects.length];
  const professional = project.id === 'agenz';
  const details = professional ? project.contributions : productDetails[project.id] || [];
  return <article className="case-page shell">
    <a href="/#work" className="text-button case-back"><ArrowLeft size={16}/>All selected work</a>
    <header className="case-intro"><span className="eyebrow">{project.category}</span><h1>{project.title}</h1><p className="case-subtitle">{project.subtitle}</p><p className="case-overview">{project.overview}</p>
      <div className="case-facts"><div><span>ROLE</span><strong>{project.role}</strong></div><div><span>FOCUS</span><strong>{professional ? 'Marketplace & internal tools' : project.id === 'andaplay' ? 'Sports booking & club management' : 'Room discovery & reservation demo'}</strong></div></div>
      <a className="button button-primary" href={project.website} target="_blank" rel="noreferrer">{project.id === 'stayroom' ? 'Explore the live demo' : 'Visit the product'}<ArrowUpRight size={16}/><span className="sr-only"> (opens in a new tab)</span></a>
    </header>
    <figure className="case-screenshot"><img src={project.image} alt={project.imageAlt} width="1280" height="720" fetchPriority="high"/><figcaption>{project.imageCaption}</figcaption></figure>
    <section className="case-details" aria-labelledby="case-details-title"><div><span className="eyebrow">{professional ? 'THE WORK' : 'THE EXPERIENCE'}</span><h2 id="case-details-title">{professional ? 'My contributions' : project.id === 'andaplay' ? 'Inside the product' : 'A closer look at the demo'}</h2><p>{professional ? 'Work across the customer-facing marketplace and the tools behind it.' : project.id === 'andaplay' ? 'I contribute to AndaPlay. The following describes the product’s capabilities, rather than individual ownership of each feature.' : 'A product exploration using sample content. Listings, people, and business data are fictional.'}</p></div><div className="case-detail-list">{details.map((detail, index) => <section key={detail.title}><span className="case-number">0{index + 1}</span><div><h3>{detail.title}</h3><p>{detail.body}</p></div></section>)}</div></section>
    {professional && <section className="case-notes"><div><span className="eyebrow">TECHNICAL CONTEXT</span><h2>Tools behind the work</h2><div className="tags">{project.technologies.map(technology => <span key={technology}>{technology}</span>)}</div></div><div><h3>A migration with a clear purpose</h3><p>The landing-page migration from Next.js to Astro aimed to reduce JavaScript payload and improve SEO. These are the project goals; no measured performance figures are published here.</p></div></section>}
    <section className="case-contact"><h2>Want to talk through the work?</h2><a className="text-button" href={`mailto:${PERSONAL_INFO.email}`}><Mail size={16}/>Contact Yassin <ArrowUpRight size={15}/></a></section>
    <nav className="case-next" aria-label="More projects"><a className="text-button" href="/#work"><ArrowLeft size={16}/>Back to selected work</a><a href={`/work/${next.id}`}><span>NEXT PROJECT</span><strong>{next.title}<ArrowRight size={22}/></strong></a></nav>
  </article>;
}
