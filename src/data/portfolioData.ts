import type { ExperienceItem, Project } from '../types';

// Résumé, September 2026; project status confirmed by the owner.
export const PERSONAL_INFO = {
  name: 'Yassin Ait Kaddour', role: 'Software Engineer', location: 'Casablanca, Morocco',
  email: 'yait.kad@gmail.com', linkedinUrl: 'https://www.linkedin.com/in/yassin-ait-kaddour-77b096193',
  resumeUrl: '/resume/Yassin-Ait-Kaddour.pdf',
};
export const PROJECTS: Project[] = [
  {
    id: 'andaplay', title: 'AndaPlay', category: 'Web frontend',
    subtitle: 'Connecting players, courts, and clubs.',
    description: 'The public website and the back office sports clubs use to run bookings, members, and payments.',
    website: 'https://andaplay.io', image: '/images/andaplay.png',
    imageAlt: 'The AndaPlay website showing its mobile booking application',
    imageCaption: 'AndaPlay public website and application previews.',
    role: 'Frontend Engineer · Web platform',
    overview: 'AndaPlay helps players book courts and find partners, and gives sports clubs the tools to run their day-to-day operations. I built the front end of the web platform: the public website and the back office clubs use every day, from the booking calendar to memberships, coaches, and payments.',
    contributions: [
      { title: 'Booking calendar', body: 'Built the club calendar at the heart of the back office: quick and block bookings, duplicate bookings, no-show handling, freed-slot management, player limits, and padel court types, alongside booking KPIs.' },
      { title: 'Clients & memberships', body: 'Developed client profiles with family members and booking history, membership plans with discounts, assignment and pause flows, and payment search with pagination.' },
      { title: 'Academy, coaches & events', body: 'Delivered the academy module (sessions, enrollments, family members), a coach invitation wizard with availability, and event and news management with a rich Markdown editor.' },
      { title: 'Wallet & reports', body: 'Built the club wallet with transaction filtering, and reporting dashboards with charts to follow revenue and club operations.' },
      { title: 'Public website & SEO', body: 'Rebuilt the landing pages and the club-management page in French, English, and Arabic, with sitemaps, metadata, and a localized Prismic blog with previews and revalidation.' },
      { title: 'Foundations', body: 'Moved authentication to cookies with server-side guards and store hydration, removed circular dependencies in the Redux store, upgraded Next.js, and introduced design tokens aligned with the mobile app rebrand.' },
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Redux Toolkit', 'React Query', 'Tailwind CSS', 'i18next', 'Prismic', 'Recharts'],
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
    technologies: [],
  },
];
export const EXPERIENCES: ExperienceItem[] = [
  {
    company: 'Marjane Mall', role: 'Senior Frontend Engineer', period: 'Aug 2026 — Present', location: 'Casablanca', current: true,
    description: 'Contributing to the development and evolution of one of Morocco’s leading e-commerce platforms by building scalable, high-performance web applications.',
    achievements: [
      'Building and maintaining scalable, high-performance features for a large-scale e-commerce platform serving a nationwide customer base.',
      'Working closely with engineering, product, and design teams to deliver maintainable solutions and improve the overall user experience.',
      'Driving technical excellence across frontend initiatives through code reviews, performance optimization, and reusable component architecture.',
    ],
    technologies: ['React', 'React Query', 'Vite', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
  },
  {
    company: 'Agenz', role: 'Frontend Engineer', period: 'Nov 2022 — Jul 2026', location: 'Casablanca',
    description: 'Agenz is Morocco’s leading proptech platform, digitizing the real estate market through its marketplace and AI-driven solutions.',
    achievements: [],
    groups: [
      { title: 'Marketplace', items: [
        'Developed and maintained key marketplace features: property search, filtering, and agent-client interactions.',
        'Led the migration of landing pages from Next.js to Astro to improve SEO and reduce JavaScript payload for faster load times.',
        'Integrated Sanity CMS to build and manage blog pages, boosting the platform’s organic search visibility.',
      ] },
      { title: 'ProSpace (back office)', items: [
        'Built a back-office platform for real estate professionals to manage property listings, track inventory, and streamline client operations.',
        'Integrated REST APIs to display real-time property listings and agent profiles.',
      ] },
      { title: 'Multi-channel communication', items: [
        'Customized and maintained Chatwoot (open source) into a unified hub for WhatsApp, Facebook, and web chat messages.',
        'Contributed to the AI chatbot interface that lets users talk to the platform’s AI agent directly on the website.',
        'Implemented an SSO login flow for secure, unified access across chat tools.',
      ] },
      { title: 'PDF generation service', items: [
        'Developed a Node.js endpoint with Puppeteer to automate official property documents and contact reports for agents.',
      ] },
    ],
    technologies: ['Astro', 'Next.js', 'NestJS', 'Node.js', 'Puppeteer', 'Socket.IO', 'Redux', 'Sanity', 'Tailwind CSS', 'TypeScript'],
  },
  {
    company: '1337 Labs', role: 'Software Developer', period: 'Nov 2021 — Nov 2022', location: 'Khouribga',
    description: 'A real estate crowdfunding platform connecting investors with farmland investment opportunities across Morocco.',
    achievements: [
      'Built responsive property pages with financial analytics: projected ROI, rental yields, and funding progress.',
      'Developed a real-time funding tracker showing live investment progress, investor count, and remaining availability.',
      'Implemented authentication, KYC onboarding, and document upload and verification for regulatory compliance.',
      'Built a personalized investor dashboard with active investments, portfolio value, expected returns, and transaction history.',
      'Implemented dividend and rental income tracking so investors can follow their earnings over time.',
    ],
    technologies: ['Next.js', 'Redux', 'Tailwind CSS', 'TypeScript', 'REST APIs'],
  },
  {
    company: 'Noun Web Services', role: 'Frontend Developer', period: 'Dec 2020 — Oct 2021', location: 'Remote',
    description: 'An IT services and consulting company accelerating digital transformation for enterprise clients.',
    achievements: [
      'Developed a responsive React admin dashboard for furniture inventory and product lifecycle management.',
      'Implemented secure admin authentication with 2FA and protected routes.',
      'Built table components with sorting, pagination, and export for large product datasets.',
      'Built product catalog management with real-time inventory status and an order workflow from pending to delivery.',
    ],
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
