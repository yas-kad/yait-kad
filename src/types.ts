export interface Project {
  id: string; title: string; category: string; subtitle: string; description: string;
  website?: string; cta?: string; statusNote?: string; image: string; imageAlt: string; imageCaption: string;
  role: string; overview: string; contributions: { title: string; body: string }[];
  technologies: string[]; focus: string; story: string;
  detailsEyebrow?: string; detailsHeading?: string; detailsIntro: string;
  gallery?: { image: string; alt: string; caption: string }[];
}
export interface ExperienceItem {
  company: string; role: string; period: string; location: string; current?: boolean;
  description: string; achievements: string[]; groups?: { title: string; items: string[] }[];
  technologies: string[];
}
