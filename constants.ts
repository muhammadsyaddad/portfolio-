export interface PortfolioItem {
  label: string;
  value: string;
  slug: string;
  category: "portfolio" | "notes" | "canvas";
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

export const PERSONAL_DETAILS: PersonalDetail[] = [
  { label: "FOCUS", value: "IDK I LIKE PROGRAMMING IN GENERAL" },
  { label: "LIFE", value: "IND." },
  { label: "STACK", value: "TYPESCRIPT, NEXT.JS, TAILWIND, RUST" },
  {
    label: "CONTACT",
    value: "muhamsyaddad@gmail.com",
    link: "mailto:muhamsyaddad@gmail.com",
  },
  // { label: "ROLE", value: "CREATIVE DEVELOPER" },
];

// Portfolio items with slugs for blog navigation
export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    label: "2025",
    value: "ERR YEAH",
    slug: "creative-suite-dashboard",
    category: "portfolio",
  },
  // {
  //   label: "2024",
  //   value: "IMMERSIVE WEBGL LANDING PAGE",
  //   slug: "immersive-webgl-landing-page",
  //   category: "portfolio",
  // },
  // {
  //   label: "2023",
  //   value: "FINTECH MOBILE APP (REACT NATIVE)",
  //   slug: "fintech-mobile-app",
  //   category: "portfolio",
  // },
  // {
  //   label: "2023",
  //   value: "LUXURY FASHION E-COMMERCE",
  //   slug: "luxury-fashion-ecommerce",
  //   category: "portfolio",
  // },
];

export const NOTES_DATA: PortfolioItem[] = [
  {
    label: "2024",
    value: "exampleee",
    slug: "building-with-",
    category: "notes",
  },
  // {
  //   label: "2024",
  //   value: "TYPESCRIPT BEST PRACTICES",
  //   slug: "typescript-best-practices",
  //   category: "notes",
  // },
  // {
  //   label: "2023",
  //   value: "REACT PERFORMANCE OPTIMIZATION",
  //   slug: "react-performance-optimization",
  //   category: "notes",
  // },
  // {
  //   label: "2023",
  //   value: "CSS GRID VS FLEXBOX DEEP DIVE",
  //   slug: "css-grid-vs-flexbox",
  //   category: "notes",
  // },
  // {
  //   label: "2022",
  //   value: "WEB ACCESSIBILITY GUIDE",
  //   slug: "web-accessibility-guide",
  //   category: "notes",
  // },
  // {
  //   label: "2022",
  //   value: "STATE MANAGEMENT PATTERNS",
  //   slug: "state-management-patterns",
  //   category: "notes",
  // },
  // {
  //   label: "2021",
  //   value: "DESIGN TOKENS EXPLAINED",
  //   slug: "design-tokens-explained",
  //   category: "notes",
  // },
  // {
  //   label: "2021",
  //   value: "MICRO-FRONTEND ARCHITECTURE",
  //   slug: "micro-frontend-architecture",
  //   category: "notes",
  // },
  // {
  //   label: "2020",
  //   value: "JAMSTACK DEPLOYMENT STRATEGIES",
  //   slug: "jamstack-deployment",
  //   category: "notes",
  // },
  // {
  //   label: "2020",
  //   value: "WEBGL FUNDAMENTALS",
  //   slug: "webgl-fundamentals",
  //   category: "notes",
  // },
];

export const CANVAS_DATA: PortfolioItem[] = [
  {
    label: "2024",
    value: "JUST AN EXAMPLE",
    slug: "generative-art-experiments",
    category: "canvas",
  },
  // {
  //   label: "2024",
  //   value: "3D TYPOGRAPHY STUDIES",
  //   slug: "3d-typography-studies",
  //   category: "canvas",
  // },
  // {
  //   label: "2023",
  //   value: "SHADER PLAYGROUND",
  //   slug: "shader-playground",
  //   category: "canvas",
  // },
  // {
  //   label: "2023",
  //   value: "MOTION DESIGN EXPLORATIONS",
  //   slug: "motion-design-explorations",
  //   category: "canvas",
  // },
  // {
  //   label: "2022",
  //   value: "ABSTRACT DATA VISUALIZATIONS",
  //   slug: "abstract-data-viz",
  //   category: "canvas",
  // },
  // {
  //   label: "2022",
  //   value: "INTERACTIVE INSTALLATIONS",
  //   slug: "interactive-installations",
  //   category: "canvas",
  // },
  // {
  //   label: "2021",
  //   value: "AUDIO REACTIVE VISUALS",
  //   slug: "audio-reactive-visuals",
  //   category: "canvas",
  // },
  // {
  //   label: "2021",
  //   value: "PARTICLE SYSTEMS STUDY",
  //   slug: "particle-systems-study",
  //   category: "canvas",
  // },
  // {
  //   label: "2020",
  //   value: "CREATIVE CODING SKETCHES",
  //   slug: "creative-coding-sketches",
  //   category: "canvas",
  // },
  // {
  //   label: "2020",
  //   value: "PROCEDURAL TEXTURES",
  //   slug: "procedural-textures",
  //   category: "canvas",
  // },
];

// Combined PROJECT_DATA for backward compatibility
export const PROJECT_DATA = [...PORTFOLIO_DATA, ...NOTES_DATA, ...CANVAS_DATA];
