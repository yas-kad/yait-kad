export interface Project {
  id: string; title: string; category: string; subtitle: string; description: string;
  website: string; image: string; imageAlt: string; imageCaption: string;
  role: string; overview: string; contributions: { title: string; body: string }[];
  productNotes?: string[]; technologies: string[];
}
export interface ExperienceItem {
  company: string; role: string; period: string; location: string; current?: boolean;
  description: string; achievements: string[]; technologies: string[];
}
