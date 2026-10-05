import type { ExperienceItem, Project } from '../types';

// Résumé, September 2026; project status confirmed by the owner.
export const PERSONAL_INFO = {
  name: 'Yassin Ait Kaddour', role: 'Software Engineer', location: 'Casablanca, Morocco',
  email: 'yait.kad@gmail.com', linkedinUrl: 'https://www.linkedin.com/in/yassin-ait-kaddour-77b096193',
  resumeUrl: '/resume/Yassin-Ait-Kaddour.pdf',
};
export const PROJECTS: Project[] = [
  {
    id: 'agenz', title: 'Agenz', category: 'Professional work',
    subtitle: 'From property search to the tools behind it.',
    description: 'Real estate marketplace features and internal tools for professionals.',
    website: 'https://agenz.ma', image: '/images/agenz.png',
    imageAlt: 'The live Agenz homepage with its property search and real estate services',
    imageCaption: 'Current public website. My contributions span November 2022–July 2026; the site has continued to evolve.',
    role: 'Frontend Engineer · November 2022–July 2026',
    overview: 'At Agenz, I worked across the public marketplace, ProSpace back office, communication tools, and a document generation service.',
    contributions: [
      { title: 'Marketplace & publishing', body: 'Developed property search, filtering, and agent-client interactions. Led the migration of landing pages from Next.js to Astro to reduce JavaScript payload and improve SEO, and integrated Sanity for the blog.' },
      { title: 'ProSpace', body: 'Built back-office tools for real estate professionals to manage property listings, inventory, and client operations, integrating property and agent data through REST APIs.' },
      { title: 'Communication & access', body: 'Customized Chatwoot to bring WhatsApp, Facebook, and web conversations together. Contributed to the website’s AI chatbot interface and implemented SSO across chat tools.' },
      { title: 'Document generation', body: 'Built a Node.js endpoint with Puppeteer to generate property documents and contact reports for agents.' },
    ],
    technologies: ['Astro', 'Next.js', 'TypeScript', 'Sanity', 'Node.js'],
  },
  {
    id: 'andaplay', title: 'AndaPlay', category: 'Project contribution',
    subtitle: 'Connecting players, courts, and clubs.',
    description: 'Sports booking, player connections, and tools for clubs.',
    website: 'https://andaplay.io', image: '/images/andaplay.png',
    imageAlt: 'The real AndaPlay website showing its mobile booking application',
    imageCaption: 'Current AndaPlay public website and its application previews.',
    role: 'Project contributor',
    overview: 'I contributed to AndaPlay, a product that helps players find courts and playing partners, with management tools for sports clubs.',
    contributions: [],
    productNotes: ['Court availability and reservations', 'Player connections and public matches', 'Tools for clubs to manage bookings'],
    technologies: [],
  },
  {
    id: 'stayroom', title: 'StayRoom', category: 'Demo prototype',
    subtitle: 'Exploring a simpler way to find a room.',
    description: 'A room-rental demo exploring discovery, filters, and a reservation journey.',
    website: 'https://stayroom.vercel.app', image: '/images/stayroom.png',
    imageAlt: 'The actual StayRoom demo with location, budget, move-in date, and room filters',
    imageCaption: 'Current StayRoom demo. Listings, people, and business data are fictional.',
    role: 'Demo project',
    overview: 'StayRoom is a demo prototype for furnished rooms in shared apartments. It explores a rental product experience with sample content, rather than representing an operating rental business.',
    contributions: [],
    productNotes: ['Room discovery with location, budget, and amenity filters', 'Property and room detail pages', 'A reservation journey without online payment'],
    technologies: [],
  },
];
export const EXPERIENCES: ExperienceItem[] = [
  {
    company: 'Marjane Mall', role: 'Senior Frontend Engineer', period: 'Aug 2026 — Present', location: 'Casablanca', current: true,
    description: 'Building and maintaining e-commerce features with engineering, product, and design teams.',
    achievements: ['Contribute to code reviews, frontend performance, and reusable component architecture.', 'Deliver maintainable interfaces for a nationwide customer base.'],
    technologies: ['React', 'React Query', 'Vite', 'TypeScript', 'Tailwind CSS'],
  },
  {
    company: 'Agenz', role: 'Frontend Engineer', period: 'Nov 2022 — Jul 2026', location: 'Casablanca',
    description: 'Worked across the property marketplace, ProSpace, and internal communication tools.',
    achievements: ['Led the Next.js-to-Astro landing-page migration and integrated Sanity CMS.', 'Built back-office features, customized Chatwoot, and implemented SSO.', 'Developed a Node.js/Puppeteer service for property documents and agent reports.'],
    technologies: ['Astro', 'Next.js', 'NestJS', 'Node.js', 'TypeScript', 'Sanity', 'Socket.IO'],
  },
  {
    company: '1337 Labs', role: 'Software Developer', period: 'Nov 2021 — Nov 2022', location: 'Khouribga',
    description: 'Worked on a real estate crowdfunding platform focused on farmland investment in Morocco.',
    achievements: ['Built property pages, funding progress, and personalized investor dashboards.', 'Implemented authentication, KYC onboarding, document uploads, and income tracking.'],
    technologies: ['Next.js', 'Redux', 'Tailwind CSS', 'TypeScript', 'REST APIs'],
  },
  {
    company: 'Noun Web Services', role: 'Frontend Developer', period: 'Dec 2020 — Oct 2021', location: 'Remote',
    description: 'Built an administrative dashboard for furniture inventory and product lifecycle management.',
    achievements: ['Implemented admin authentication with 2FA and protected routes.', 'Developed sortable tables, exports, inventory status, and order tracking workflows.'],
    technologies: ['React', 'React Hook Form', 'React Query', 'TypeScript', 'REST APIs'],
  },
];
export const SKILLS = [
  { label: 'Interfaces', items: ['React', 'Next.js', 'Astro', 'React Native', 'TypeScript', 'Tailwind CSS'] },
  { label: 'State & data', items: ['React Query', 'Redux', 'React Hook Form', 'REST APIs', 'Socket.IO'] },
  { label: 'Beyond the browser', items: ['Node.js', 'NestJS', 'Puppeteer', 'Sanity CMS', 'Vite', 'SEO'] },
];
export const EDUCATION = [
  { title: 'Professional License · Web & Mobile Software Engineering', school: 'National School of Applied Sciences, Khouribga', period: '2024–2025' },
  { title: 'Computer Software Engineering', school: '1337 · 42 Network, Khouribga', period: '2019–2024' },
  { title: 'DTS · IT Development', school: 'Specialized Institute of Management and Computer Science, Marrakech', period: '2017–2019' },
];
