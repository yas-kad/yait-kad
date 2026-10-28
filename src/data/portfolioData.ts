import type { ExperienceItem, Project } from '../types';

// Résumé, September 2026; project status confirmed by the owner.
export const PERSONAL_INFO = {
  name: 'Yassin Ait Kaddour', role: 'Software Engineer', location: 'Casablanca, Morocco',
  email: 'yait.kad@gmail.com', linkedinUrl: 'https://www.linkedin.com/in/yassin-ait-kaddour-77b096193',
  whatsappUrl: 'https://wa.me/212696191850',
  resumeUrl: '/resume/Yassin-Ait-Kaddour.pdf',
};
export const PROJECTS: Project[] = [
  {
    id: 'andaplay', title: 'AndaPlay', category: 'Web frontend',
    seoTitle: 'AndaPlay — Next.js Sports Club Booking Platform',
    subtitle: 'Connecting players, courts, and clubs.',
    description: 'The public website and the back office sports clubs use to run bookings, members, and payments.',
    website: 'https://andaplay.io', cta: 'Visit website', image: '/images/andaplay.webp',
    imageAlt: 'The AndaPlay website showing its mobile booking application',
    imageCaption: 'AndaPlay public website and application previews.',
    role: 'Frontend Engineer · Web platform',
    focus: 'Club back office & public website',
    story: 'I built the web front end of AndaPlay: the public website and the back office sports clubs use to manage bookings, members, coaches, and payments.',
    overview: 'AndaPlay helps players book courts and find partners, and gives sports clubs the tools to run their day-to-day operations. I built the front end of the web platform: the public website and the back office clubs use every day, from the booking calendar to memberships, coaches, and payments.',
    detailsEyebrow: 'THE WORK', detailsHeading: 'What I built',
    detailsIntro: 'From the first landing page to the tools clubs rely on every day, across the whole web front end.',
    contributions: [
      { title: 'Booking calendar', body: 'Built the club calendar at the heart of the back office: quick and block bookings, duplicate bookings, no-show handling, freed-slot management, player limits, and padel court types, alongside booking KPIs.' },
      { title: 'Clients & memberships', body: 'Developed client profiles with family members and booking history, membership plans with discounts, assignment and pause flows, and payment search with pagination.' },
      { title: 'Academy, coaches & events', body: 'Delivered the academy module (sessions, enrollments, family members), a coach invitation wizard with availability, and event and news management with a rich Markdown editor.' },
      { title: 'Wallet & reports', body: 'Built the club wallet with transaction filtering, and reporting dashboards with charts to follow revenue and club operations.' },
      { title: 'Public website & SEO', body: 'Rebuilt the landing pages and the club-management page in French, English, and Arabic, with sitemaps, metadata, and a localized Prismic blog with previews and revalidation.' },
      { title: 'Foundations', body: 'Moved authentication to cookies with server-side guards and store hydration, removed circular dependencies in the Redux store, upgraded Next.js, and introduced design tokens aligned with the mobile app rebrand.' },
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Redux Toolkit', 'React Query', 'Tailwind CSS', 'i18next', 'Prismic', 'Recharts'],
    gallery: [
      { image: '/images/andaplay-club.webp', alt: 'The AndaPlay club-management page, showing the back-office booking calendar', caption: 'The club back office: the booking calendar at the center of the work, shown from the public club-management page.' },
    ],
  },
  {
    id: 'stayroom', title: 'StayRoom', category: 'Demo prototype',
    seoTitle: 'StayRoom — Room Rental Web App Demo',
    subtitle: 'Exploring a simpler way to find a room.',
    description: 'A room-rental demo exploring discovery, filters, and a reservation journey.',
    website: 'https://stayroom.vercel.app', cta: 'Live demo', image: '/images/stayroom.webp',
    imageAlt: 'The actual StayRoom demo with location, budget, move-in date, and room filters',
    imageCaption: 'Current StayRoom demo. Listings, people, and business data are fictional.',
    role: 'Demo project',
    focus: 'Room discovery & reservation demo',
    story: 'A room-rental demo exploring discovery, filters, and a reservation journey. It uses fictional listings and does not process real bookings or payments.',
    overview: 'StayRoom is a demo prototype for furnished rooms in shared apartments. It explores a rental product experience with sample content, rather than representing an operating rental business.',
    detailsEyebrow: 'THE EXPERIENCE', detailsHeading: 'A closer look at the demo',
    detailsIntro: 'A product exploration using sample content. Listings, people, and business data are fictional.',
    contributions: [
      { title: 'Discover a room', body: 'The demo explores furnished rooms in shared apartments, with location, budget, and amenity filters to narrow the search.' },
      { title: 'Explore the details', body: 'Property and room detail pages provide the next step between browsing listings and starting a reservation.' },
      { title: 'Try the reservation journey', body: 'A sample reservation flow completes the prototype. There is no online payment, and it does not create a real rental booking.' },
    ],
    technologies: [],
  },
  {
    id: 'yak', title: 'Yak', category: 'AI agent',
    seoTitle: 'Yak — AI Agent for Slack and the Terminal',
    subtitle: 'An AI coworker that lives in Slack and the terminal.',
    description: 'A Slack bot and CLI agent that can read, search, and write files in one project folder, backed by OpenAI, Claude, or Gemini.',
    statusNote: 'Not deployed yet — runs locally and in a private Slack workspace.',
    image: '/images/yak-terminal.svg',
    imageAlt: "Yak's terminal chat interface, showing its startup banner and a file-read tool call",
    imageCaption: 'Yak answering a question from the terminal, reading a file from the project it is scoped to.',
    role: 'Personal project · AI agent',
    focus: 'Slack bot & terminal AI agent',
    story: 'An AI coworker built from simple layers instead of an agent framework: a Slack bot and a terminal chat share one model-agnostic core, with file tools scoped to a single project folder.',
    overview: 'Yak is an AI coworker you can talk to from Slack or a terminal, built with simple layers instead of an agent framework: one chat entry point, a swappable model provider (OpenAI, Claude, or Gemini), and a small set of filesystem tools scoped to a single project folder.',
    detailsEyebrow: 'THE WORK', detailsHeading: 'What I built',
    detailsIntro: 'A small, dependency-light agent: one chat core shared by two interfaces, and file tools it can use on request.',
    contributions: [
      { title: 'Slack & terminal interfaces', body: 'Built a Slack Bolt app that replies to @mentions in a thread, and a terminal chat (npm run chat) that keeps a conversation history for one-off or ongoing sessions.' },
      { title: 'Provider-agnostic chat core', body: 'One chat() entry point that both interfaces call, with the model backend (OpenAI, Claude, or Gemini) picked from config so switching providers needs no code changes.' },
      { title: 'Scoped filesystem tools', body: 'list_files, read_file, and write_file tools confined to a single project directory, with every write confirmed in the terminal before it touches disk.' },
      { title: 'Typed, fail-fast config', body: 'A central config module validates required environment variables per provider at startup, so missing keys fail immediately instead of mid-conversation.' },
    ],
    technologies: ['Node.js', 'TypeScript', 'Express', 'Slack Bolt', 'OpenAI API', 'Anthropic API', 'Gemini API'],
  },
  {
    id: 'balconyplanner', title: 'Balcony Garden Planner', category: 'Web app',
    seoTitle: 'Balcony Garden Planner — AI Planting Plan App',
    subtitle: 'A planting plan sized to the light you actually have.',
    description: 'An AI-assisted planner that turns a few questions about a balcony, terrace, or garden into a short planting plan with a picture of the space and a photo of each plant.',
    statusNote: 'Not deployed yet — running locally ahead of launch.',
    image: '/images/balconyplanner.webp',
    imageAlt: 'The Balcony Garden Planner landing page',
    imageCaption: 'The Balcony Garden Planner landing page, running locally ahead of launch.',
    role: 'Personal project · Full-stack',
    focus: 'AI planning flow, accounts & payments',
    story: 'A few questions about a balcony, its light, and its climate become a short AI-generated planting plan, with accounts, saved plans, and a paid upgrade path.',
    overview: 'Balcony Garden Planner asks a few quick questions about a space, its sunlight, climate, and style, then puts together a short planting plan: one picture of the planting and a photo of each recommended plant. I am building it end to end with Next.js, an AI chat and plan pipeline, and Supabase for accounts and saved plans.',
    detailsEyebrow: 'THE WORK', detailsHeading: 'What I built',
    detailsIntro: 'From the question flow to accounts and payments, across the whole product.',
    contributions: [
      { title: 'Planning flow', body: 'Built the question flow and streaming chat that turns balcony, sunlight, climate, and style answers into a plant plan, backed by a swappable OpenAI or Gemini provider.' },
      { title: 'Plan & image generation', body: 'Generates a picture of the planting and a photo of each recommended plant alongside the written plan.' },
      { title: 'Accounts & saved plans', body: 'Magic-link authentication and session handling through Supabase, with plans saved per account and shareable plan pages.' },
      { title: 'Content & monetization', body: 'An MDX-powered blog for plant guides, a rate-limited chat API, and a Stripe-backed upgrade flow for paid plans.' },
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Stripe', 'OpenAI API', 'Gemini API', 'MDX'],
  },
];
export const FEATURED_PROJECT_IDS = ['andaplay', 'yak'];
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
