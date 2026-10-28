import { EDUCATION, EXPERIENCES, PERSONAL_INFO, PROJECTS, SKILLS } from './data/portfolioData';

export const SITE_URL = 'https://yait-kad.me';
const OG_IMAGES: Record<string, string> = { andaplay: '/og/andaplay.jpg', stayroom: '/og/stayroom.jpg', balconyplanner: '/og/balconyplanner.jpg' };

export interface PageMeta { title: string; description: string; path: string; image: string; jsonLd: object[] }

const person = {
  '@type': 'Person', '@id': `${SITE_URL}/#person`,
  name: PERSONAL_INFO.name, url: `${SITE_URL}/`, image: `${SITE_URL}/og/yassin.jpg`, email: `mailto:${PERSONAL_INFO.email}`,
  jobTitle: EXPERIENCES[0].role,
  worksFor: { '@type': 'Organization', name: EXPERIENCES[0].company },
  address: { '@type': 'PostalAddress', addressLocality: 'Casablanca', addressCountry: 'MA' },
  alumniOf: EDUCATION.map(item => ({ '@type': 'EducationalOrganization', name: item.school })),
  knowsAbout: [...new Set(SKILLS.flatMap(group => group.items))],
  knowsLanguage: ['ar', 'zgh', 'en', 'fr'],
  sameAs: [PERSONAL_INFO.linkedinUrl],
};

// Titles and descriptions target the searches a recruiter or client would run: role, stack, and city.
export function pageMeta(pathname: string): PageMeta | undefined {
  const path = pathname.replace(/\/$/, '') || '/';
  if (path === '/') return {
    title: `${PERSONAL_INFO.name} — Senior Frontend Engineer in Casablanca, Morocco`,
    description: 'Senior Frontend Engineer in Casablanca, Morocco, building React, Next.js, and TypeScript web apps for e-commerce (Marjane Mall), proptech (Agenz), and sports clubs (AndaPlay).',
    path: '/', image: '/og/yassin.jpg',
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'ProfilePage', url: `${SITE_URL}/`, mainEntity: person },
      { '@context': 'https://schema.org', '@type': 'WebSite', url: `${SITE_URL}/`, name: PERSONAL_INFO.name, author: { '@id': `${SITE_URL}/#person` } },
    ],
  };
  if (path === '/projects') return {
    title: `Projects — React & Next.js Work by ${PERSONAL_INFO.name}`,
    description: 'Web platforms, AI agents, and product demos built with React, Next.js, TypeScript, and Node.js: AndaPlay, StayRoom, Yak, and Balcony Garden Planner.',
    path: '/projects/', image: '/og/yassin.jpg',
    jsonLd: [breadcrumbs([['Projects', '/projects/']])],
  };
  const project = PROJECTS.find(item => path === `/work/${item.id}`);
  if (!project) return;
  const url = `/work/${project.id}/`;
  return {
    title: `${project.seoTitle || project.title} | ${PERSONAL_INFO.name}`,
    description: project.description,
    path: url, image: OG_IMAGES[project.id] || '/og/yassin.jpg',
    jsonLd: [
      breadcrumbs([['Projects', '/projects/'], [project.title, url]]),
      {
        '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, headline: project.seoTitle || project.title,
        description: project.overview, url: `${SITE_URL}${url}`, image: `${SITE_URL}${project.image}`,
        keywords: project.technologies.join(', ') || undefined, ...(project.website && { sameAs: project.website }),
        creator: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: PERSONAL_INFO.name, url: `${SITE_URL}/` },
      },
    ],
  };
}

function breadcrumbs(items: [string, string][]) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [['Home', '/'] as [string, string], ...items].map(([name, path], index) => ({ '@type': 'ListItem', position: index + 1, name, item: `${SITE_URL}${path}` })),
  };
}
