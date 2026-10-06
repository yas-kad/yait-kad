import { ArrowLeft, ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { PERSONAL_INFO, PROJECTS } from "../data/portfolioData";
import type { Project } from "../types";

const productDetails: Record<string, { title: string; body: string }[]> = {
  stayroom: [
    {
      title: "Discover a room",
      body: "The demo explores furnished rooms in shared apartments, with location, budget, and amenity filters to narrow the search.",
    },
    {
      title: "Explore the details",
      body: "Property and room detail pages provide the next step between browsing listings and starting a reservation.",
    },
    {
      title: "Try the reservation journey",
      body: "A sample reservation flow completes the prototype. There is no online payment, and it does not create a real rental booking.",
    },
  ],
};

export function ProjectPage({ project }: { project: Project }) {
  const next =
    PROJECTS[
      (PROJECTS.findIndex((item) => item.id === project.id) + 1) %
        PROJECTS.length
    ];
  const isDemo = project.id === "stayroom";
  const details = project.contributions.length
    ? project.contributions
    : productDetails[project.id] || [];
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
            <strong>
              {isDemo
                ? "Room discovery & reservation demo"
                : "Club back office & public website"}
            </strong>
          </div>
        </div>
        <a
          className="button button-primary"
          href={project.website}
          target="_blank"
          rel="noreferrer"
        >
          {isDemo ? "Explore the live demo" : "Visit the product"}
          <ArrowUpRight size={16} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
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
      <section className="case-details" aria-labelledby="case-details-title">
        <div>
          <span className="eyebrow">
            {isDemo ? "THE EXPERIENCE" : "THE WORK"}
          </span>
          <h2 id="case-details-title">
            {isDemo ? "A closer look at the demo" : "What I built"}
          </h2>
          <p>
            {isDemo
              ? "A product exploration using sample content. Listings, people, and business data are fictional."
              : "From the first landing page to the tools clubs rely on every day, across the whole web front end."}
          </p>
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
