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
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", url: "https://github.com/muhammadsyaddad" },
  { label: "LinkedIn", url: "https://linkedin.com/in/muhammadsyaddad" },
  { label: "Instagram", url: "https://instagram.com/muhammadsyaddad" },
];

export const PROJETCT_PROUDMOST: SocialLink[] = [
  { label: "Eval", url: "https://github.com/muhammadsyaddad/eval" },
  { label: "Mathend", url: "https://mathend.com" },
  { label: "Buzzer", url: "https://probowo.vercel.app/" },
];

export const PERSONAL_DETAILS: PersonalDetail[] = [
  { label: "What I do?", value: "Software, ML, Materials (undergraduate)" },
  // { label: "STACK", value: "TYPESCRIPT, NEXT.JS, TAILWIND, RUST" },
  {
    label: "Contact",
    value: "muhamsyaddad@gmail.com",
    link: "mailto:muhamsyaddad@gmail.com",
  },
];

export const SAINS_DATA: PortfolioItem[] = [
  //this is for command cuz its really cover all i need for the layout
  // {
  //   label: "2025",
  //   date: "2025-01-12",
  //   value: "Dynamic",
  //   slug: "dynamic",
  //   category: "sains",
  // },
  {
    label: "2026",
    date: "2026-07-21",
    value: "Hamiltonian Derivation No Explanation",
    slug: "hamiltonian-derivation-no-explanation",
    category: "sains",
  },
  {
    label: "2026",
    date: "2026-07-22",
    value: "Analysis Dimension",
    slug: "analysis-dimension",
    category: "sains",
  },
];

export const NOTES_DATA: PortfolioItem[] = [
  {
    label: "2026",
    date: "2026-03-18",
    value: "The Big Picture",
    slug: "the-big-picture",
    category: "notes",
  },
  {
    label: "2026",
    date: "2026-08-09",
    value: "Learning Plan",
    slug: "learning-plan",
    category: "notes",
  },
  {
    label: "2026",
    date: "2026-08-10",
    value: "Bersyukur",
    slug: "bersyukur",
    category: "notes",
  },
  {
    label: "2026",
    date: "2026-09-20",
    value: "Penlitian Log",
    slug: "penelitian-log",
    category: "notes",
  },
  {
    label: "2026",
    date: "2026-10-01",
    value: "Kenapa Mate?",
    slug: "kenapa-mate",
    category: "notes",
  },
];

export const CANVAS_DATA: PortfolioItem[] = [
  {
    label: "2025",
    date: "2025-01-12",
    value: "Lagrangian Animation",
    slug: "lagrangian",
    category: "canvas",
  },
  // {
  //   label: "2025",
  //   date: "2025-02-12",
  //   value: "Lagrangian Animation",
  //   slug: "GenerativeArtExperiments",
  //   category: "canvas",
  // },
];

export const PROJECT_DATA = [...SAINS_DATA, ...NOTES_DATA, ...CANVAS_DATA];
