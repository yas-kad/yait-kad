import { ArrowLeft, ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { PERSONAL_INFO, PROJECTS } from "../data/portfolioData";
import type { Project } from "../types";

export function ProjectPage({ project }: { project: Project }) {
  const next =
    PROJECTS[
      (PROJECTS.findIndex((item) => item.id === project.id) + 1) %
        PROJECTS.length
    ];
  const details = project.contributions;
  return (
    <article className="case-page shell">
      <a href="/#work" className="text-button case-back">
        <ArrowLeft size={16} />
        All selected work
      </a>
      <header className="case-intro">
        <span className="eyebrow">{project.category}</span>
        <h1>{project.title}</h1>
        <p className="case-subtitle">{project.subtitle}</p>
        <p className="case-overview">{project.overview}</p>
        <div className="case-facts">
          <div>
            <span>ROLE</span>
            <strong>{project.role}</strong>
          </div>
          <div>
            <span>FOCUS</span>
            <strong>{project.focus}</strong>
          </div>
        </div>
        {project.website ? (
          <a
            className="button button-primary"
            href={project.website}
            target="_blank"
            rel="noreferrer"
          >
            {project.cta || "Visit the product"}
            <ArrowUpRight size={16} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          project.statusNote && (
            <p className="case-status-note">{project.statusNote}</p>
          )
        )}
      </header>
      <figure className="case-screenshot">
        <img
          src={project.image}
          alt={project.imageAlt}
          width="1280"
          height="720"
          fetchPriority="high"
        />
        <figcaption>{project.imageCaption}</figcaption>
      </figure>
      {project.gallery?.map((shot) => (
        <figure className="case-screenshot" key={shot.image}>
          <img src={shot.image} alt={shot.alt} width="1280" height="720" />
          <figcaption>{shot.caption}</figcaption>
        </figure>
      ))}
      <section className="case-details" aria-labelledby="case-details-title">
        <div>
          <span className="eyebrow">{project.detailsEyebrow || "THE WORK"}</span>
          <h2 id="case-details-title">{project.detailsHeading || "What I built"}</h2>
          <p>{project.detailsIntro}</p>
        </div>
        <div className="case-detail-list">
          {details.map((detail, index) => (
            <section key={detail.title}>
              <span className="case-number">0{index + 1}</span>
              <div>
                <h3>{detail.title}</h3>
                <p>{detail.body}</p>
              </div>
            </section>
          ))}
        </div>
      </section>
      {project.technologies.length > 0 && (
        <section className="case-notes">
          <div>
            <span className="eyebrow">TECHNICAL CONTEXT</span>
            <h2>Tools behind the work</h2>
          </div>
          <div className="tags">
            {project.technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </section>
      )}
      <section className="case-contact">
        <h2>Want to talk through the work?</h2>
        <a className="text-button" href={`mailto:${PERSONAL_INFO.email}`}>
          <Mail size={16} />
          Contact Yassin <ArrowUpRight size={15} />
        </a>
      </section>
      <nav className="case-next" aria-label="More projects">
        <a className="text-button" href="/#work">
          <ArrowLeft size={16} />
          Back to selected work
        </a>
        <a href={`/work/${next.id}/`}>
          <span>NEXT PROJECT</span>
          <strong>
            {next.title}
            <ArrowRight size={22} />
          </strong>
        </a>
      </nav>
    </article>
  );
}
