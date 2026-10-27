import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Copy, Download, Linkedin, Mail, MapPin, MessageCircle } from 'lucide-react';
import { EDUCATION, EXPERIENCES, FEATURED_PROJECT_IDS, PERSONAL_INFO, PROJECTS, SKILLS } from '../data/portfolioData';
import { ProjectCard } from './ProjectCard';

const skillDescriptions: Record<string, string> = {
  Interfaces: 'Building web experiences, from public-facing pages to the tools teams use every day.',
  'State & data': 'Connecting interfaces to APIs, managing application state, and keeping data in sync.',
  'Beyond the browser': 'Working with services, content systems, and automation behind the interface.',
};

export function PortfolioSections() {
  const [copyStatus, setCopyStatus] = useState('');
  const featuredProjects = PROJECTS.filter(project => FEATURED_PROJECT_IDS.includes(project.id));
  async function copyEmail() {
    try { await navigator.clipboard.writeText(PERSONAL_INFO.email); setCopyStatus('Email copied'); }
    catch { setCopyStatus('Could not copy. Use the email link or select the address.'); }
  }
  return <div className="portfolio-sections">
    <section className="shell folio-shell selected-work" id="work" data-nav-section="work" aria-labelledby="work-title">
      <header className="folio-section-heading"><h2 id="work-title">Selected work</h2><p>Products I contribute to. Ideas I explore.</p></header>
      <div className="folio-projects">{featuredProjects.map(project => <ProjectCard project={project} key={project.id}/>)}</div>
      <a className="folio-link folio-view-all" href="/projects">View all projects <ArrowRight size={16}/></a>
    </section>

    <div className="shell folio-shell folio-biography" id="about" data-nav-section="about">
      <aside className="folio-profile" aria-label="Profile and résumé">
        <img className="folio-portrait" src="/images/yassin-portrait.jpeg" alt="Yassin Ait Kaddour" width="160" height="160" loading="lazy"/>
        <span className="folio-location"><MapPin size={14}/>{PERSONAL_INFO.location}</span>
        <div className="folio-languages"><p>Arabic & Tamazight<span>Native</span></p><p>English & French<span>Professional proficiency</span></p></div>
        <a className="folio-resume" href={PERSONAL_INFO.resumeUrl} download><Download size={15}/>Full résumé</a>
      </aside>
      <div className="folio-biography-content">
        <section className="folio-about-copy" aria-labelledby="about-title">
          <span className="folio-category">A LITTLE ABOUT ME</span><h2 id="about-title">Yassin Ait Kaddour</h2><p className="folio-role-label">Software Engineer</p>
          <div className="folio-socials"><a href={PERSONAL_INFO.linkedinUrl} target="_blank" rel="noreferrer"><Linkedin size={14}/>LinkedIn<span className="sr-only"> (opens in a new tab)</span></a><a href={PERSONAL_INFO.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={14}/>WhatsApp<span className="sr-only"> (opens in a new tab)</span></a><a href={`mailto:${PERSONAL_INFO.email}`}><Mail size={14}/>Email</a></div>
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

    <section className="shell folio-shell folio-contact" id="contact" data-nav-section="contact" aria-labelledby="contact-title"><div className="folio-contact-inner"><span className="folio-category">HAVE SOMETHING IN MIND?</span><h2 id="contact-title">Let’s build something<br/>worth using.</h2><p>A product, an opportunity, or a good engineering problem.<br className="folio-desktop-break"/> I’d be happy to hear about it.</p><div className="folio-email-row"><a href={`mailto:${PERSONAL_INFO.email}`}>{PERSONAL_INFO.email}<ArrowUpRight size={21}/></a><button className="icon-button" onClick={copyEmail} aria-label="Copy email address">{copyStatus === 'Email copied' ? <Check size={17}/> : <Copy size={17}/>}</button></div><span className="folio-copy-status" role="status">{copyStatus}</span><div className="folio-contact-links"><a className="folio-secondary-link" href={PERSONAL_INFO.whatsappUrl} target="_blank" rel="noreferrer">Message on WhatsApp <ArrowUpRight size={14}/><span className="sr-only"> (opens in a new tab)</span></a><a className="folio-secondary-link" href={PERSONAL_INFO.linkedinUrl} target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={14}/><span className="sr-only"> (opens in a new tab)</span></a></div></div></section>
  </div>;
}
