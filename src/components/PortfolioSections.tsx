import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Copy, Download, Linkedin, Mail, MapPin } from 'lucide-react';
import { EDUCATION, EXPERIENCES, PERSONAL_INFO, PROJECTS, SKILLS } from '../data/portfolioData';

const skillDescriptions: Record<string, string> = {
  Interfaces: 'Building web experiences, from public-facing pages to the tools teams use every day.',
  'State & data': 'Connecting interfaces to APIs, managing application state, and keeping data in sync.',
  'Beyond the browser': 'Working with services, content systems, and automation behind the interface.',
};

export function PortfolioSections() {
  const [copyStatus, setCopyStatus] = useState('');
  async function copyEmail() {
    try { await navigator.clipboard.writeText(PERSONAL_INFO.email); setCopyStatus('Email copied'); }
    catch { setCopyStatus('Could not copy. Use the email link or select the address.'); }
  }
  return <div className="portfolio-sections">
    <section className="folio-shell selected-work" id="work" data-nav-section="work" aria-labelledby="work-title">
      <header className="folio-section-heading"><h2 id="work-title">Selected work</h2><p>Products I contribute to. Ideas I explore.</p></header>
      <div className="folio-projects">{PROJECTS.map(project => <article className="folio-project" key={project.id}>
        <a className="folio-project-cover" href={`/work/${project.id}/`} aria-label={`View ${project.title} project details`}><img src={project.image} alt={project.imageAlt} width="1280" height="720" loading="lazy"/></a>
        <div className="folio-project-caption"><div className="folio-project-title"><span className="folio-category">{project.category}</span><h3><a href={`/work/${project.id}/`}>{project.title}<ArrowUpRight size={22}/></a></h3><p>{project.subtitle}</p></div><div className="folio-project-story"><p>{project.id === 'andaplay' ? 'I built the web front end of AndaPlay: the public website and the back office sports clubs use to manage bookings, members, coaches, and payments.' : 'A room-rental demo exploring discovery, filters, and a reservation journey. It uses fictional listings and does not process real bookings or payments.'}</p><div className="folio-project-links"><a className="folio-link" href={`/work/${project.id}/`}>Read project story <ArrowRight size={16}/><span className="sr-only">: {project.title}</span></a><a className="folio-secondary-link" href={project.website} target="_blank" rel="noreferrer">{project.id === 'stayroom' ? 'Live demo' : 'Visit website'}<ArrowUpRight size={14}/><span className="sr-only"> (opens in a new tab)</span></a></div></div></div>
      </article>)}</div>
    </section>

    <div className="folio-shell folio-biography" id="about" data-nav-section="about">
      <aside className="folio-profile" aria-label="Profile and résumé">
        <img className="folio-portrait" src="/images/yassin-portrait.jpeg" alt="Yassin Ait Kaddour" width="160" height="160" loading="lazy"/>
        <span className="folio-location"><MapPin size={14}/>{PERSONAL_INFO.location}</span>
        <div className="folio-languages"><p>Arabic & Tamazight<span>Native</span></p><p>English & French<span>Professional proficiency</span></p></div>
        <a className="folio-resume" href={PERSONAL_INFO.resumeUrl} download><Download size={15}/>Full résumé</a>
      </aside>
      <div className="folio-biography-content">
        <section className="folio-about-copy" aria-labelledby="about-title">
          <span className="folio-category">A LITTLE ABOUT ME</span><h2 id="about-title">Yassin Ait Kaddour</h2><p className="folio-role-label">Software Engineer</p>
          <div className="folio-socials"><a href={PERSONAL_INFO.linkedinUrl} target="_blank" rel="noreferrer"><Linkedin size={14}/>LinkedIn<span className="sr-only"> (opens in a new tab)</span></a><a href={`mailto:${PERSONAL_INFO.email}`}><Mail size={14}/>Email</a></div>
          <p>I’m a software engineer with a strong frontend background. My work connects interfaces, APIs, content, and the tools teams use every day.</p><p>I enjoy solving engineering problems, building maintainable applications, and exploring where AI can make software more useful.</p>
        </section>

        <section className="folio-reading-section" id="experience" data-nav-section="experience" aria-labelledby="experience-title">
          <header className="folio-content-heading"><h2 id="experience-title">Work experience</h2></header>
          <div className="folio-experience">{EXPERIENCES.map(experience => <article className="folio-role" key={experience.company} id={experience.company === 'Agenz' ? 'experience-agenz' : undefined}>
            <div className="folio-role-heading"><div><h3>{experience.company}</h3><p>{experience.role}</p></div><span>{experience.period}</span></div>
            <p className="folio-role-description">{experience.description}</p>{experience.achievements.length > 0 && <ul>{experience.achievements.map(achievement => <li key={achievement}>{achievement}</li>)}</ul>}{experience.groups?.map(group => <div className="folio-role-group" key={group.title}><h4>{group.title}</h4><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}<p className="folio-technologies">{experience.technologies.join(' · ')}</p>
          </article>)}</div>
        </section>

        <section className="folio-reading-section folio-education" aria-labelledby="education-title">
          <header className="folio-content-heading"><h2 id="education-title">Education</h2></header>
          <div>{EDUCATION.map(item => <article className="folio-study" key={item.title}><div><h3>{item.school}</h3><p>{item.title}</p></div><span>{item.period}</span></article>)}</div>
        </section>

        <section className="folio-reading-section folio-skills" id="skills" data-nav-section="skills" aria-labelledby="skills-title">
          <header className="folio-content-heading"><h2 id="skills-title">Tools & capabilities</h2></header>
          <div className="folio-skill-list">{SKILLS.map(group => <article key={group.label}><h3>{group.label}</h3><p>{skillDescriptions[group.label]}</p><div className="folio-skill-names">{group.items.map(item => <span key={item}>{item}</span>)}</div></article>)}</div>
        </section>
      </div>
    </div>

    <section className="folio-shell folio-contact" id="contact" data-nav-section="contact" aria-labelledby="contact-title"><div className="folio-contact-inner"><span className="folio-category">HAVE SOMETHING IN MIND?</span><h2 id="contact-title">Let’s build something<br/>worth using.</h2><p>A product, an opportunity, or a good engineering problem.<br className="folio-desktop-break"/> I’d be happy to hear about it.</p><div className="folio-email-row"><a href={`mailto:${PERSONAL_INFO.email}`}>{PERSONAL_INFO.email}<ArrowUpRight size={21}/></a><button className="icon-button" onClick={copyEmail} aria-label="Copy email address">{copyStatus === 'Email copied' ? <Check size={17}/> : <Copy size={17}/>}</button></div><span className="folio-copy-status" role="status">{copyStatus}</span><a className="folio-secondary-link" href={PERSONAL_INFO.linkedinUrl} target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={14}/></a></div></section>
  </div>;
}
