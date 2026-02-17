export interface PortfolioItem {
  label: string;
  date?: string;
  value: string;
  slug: string;
  category: "sains" | "notes" | "canvas";
}

export interface PersonalDetail {
  label: string;
  value: string;
  link?: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

// Social media links - update these with your actual URLs
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "GITHUB", url: "https://github.com/muhammadsyaddad" },
  { label: "LINKEDIN", url: "https://linkedin.com/in/muhammadsyaddad" },
  { label: "INSTAGRAM", url: "https://instagram.com/muhammadsyaddad" },
];

export const PROJETCT_PROUDMOST: SocialLink[] = [
  { label: "EVAL", url: "https://github.com/muhammadsyaddad/eval" },
];

export const PERSONAL_DETAILS: PersonalDetail[] = [
  { label: "FOCUS", value: "IDK I LIKE PROGRAMMING IN GENERAL" },
  { label: "STACK", value: "TYPESCRIPT, NEXT.JS, TAILWIND, RUST" },
  {
    label: "CONTACT",
    value: "muhamsyaddad@gmail.com",
    link: "mailto:muhamsyaddad@gmail.com",
  },
];

// Portfolio items with slugs for blog navigation
export const SAINS_DATA: PortfolioItem[] = [
  {
    label: "2025",
    date: "2025-01-12",
    value: "Dynamic",
    slug: "creative-suite-dashboard",
    category: "sains",
  },
];

export const NOTES_DATA: PortfolioItem[] = [
  // {
  //   label: "2024",
  //   date: "2024-08-03",
  //   value: "exampleee",
  //   slug: "building-with-",
  //   category: "notes",
  // },
];

export const CANVAS_DATA: PortfolioItem[] = [
  // this is example code for canvas
  // {
  //   label: "2024",
  //   date: "2024-02-11",
  //   value: "JUST AN EXAMPLE",
  //   slug: "generative-art-experiments",
  //   category: "canvas",
  // },
];

// Combined PROJECT_DATA for backward compatibility
export const PROJECT_DATA = [...SAINS_DATA, ...NOTES_DATA, ...CANVAS_DATA];
