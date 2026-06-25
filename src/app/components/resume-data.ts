export interface LabeledBullet {
  label: string;
  text: string;
}

export interface Role {
  label: string;
  text: string;
  description?: string;
}

export interface ResumeEntry {
  id: string;
  period: string;
  title: string;
  subtitle?: string;
  meta?: string;
  description?: string;
  bullets?: string[];
  sections?: LabeledBullet[];
  roles?: Role[];
  href?: string;
  tag?: string;
}

export interface LabeledLink {
  id: string;
  label: string;
  value: string;
  href?: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  value: string;
}

export const profile = {
  name: 'Syed Sarib Sultan',
  title: 'Product Designer',
  location: 'Islamabad, PK',
  site: 'syedsaribsultan.vercel.app',
  siteHref: 'https://syedsaribsultan.vercel.app',
  about:
    'Product designer focused on experience and interface design, building intuitive solutions grounded in a real understanding of user needs and behaviors. I cover the whole craft, from research and UX to interface, interaction and design systems, and on consumer AI products at ImagineArt and Chatly that runs into onboarding, pricing and growth too. With a Computer Science background, I prototype in code to hand engineers a spec they can build from.',
};

export const contacts: LabeledLink[] = [
  { id: 'email', label: 'Email', value: 'sadakhan2002@gmail.com', href: 'mailto:sadakhan2002@gmail.com' },
  { id: 'linkedin', label: 'LinkedIn', value: 'in/syedsaribsultanyac270', href: 'https://linkedin.com/in/syedsaribsultanyac270' },
  { id: 'phone', label: 'Phone', value: '+92 333 5788859', href: 'tel:+923335788859' },
];

export const experience: ResumeEntry[] = [
  {
    id: 'vyro',
    period: '2025 — Present',
    title: 'Product Design & Growth',
    subtitle: 'Vyro',
    href: 'https://imagine.art',
    meta: 'On-site, Islamabad, PK',
    description: 'At Vyro, I design across ImagineArt and Chatly — scaling the core design system and leading end-to-end design for key AI-powered features including Upscale, AI Edit, Film Studio, AI Audio, Assist Mode, and Inpaint/Outpaint.',
    sections: [
      { label: 'Leadership', text: 'Brainstorm and ideate on innovations in the genAI space, taking end-to-end ownership of features from concept to launch.' },
      { label: 'Engineering', text: 'Construct design docs for devs and leverage Figma MCP and Claude Code to accelerate design-to-development handoff and test different approaches 10x faster.' },
      { label: 'Design Team', text: 'Build custom Figma plugins to streamline workflows and document a comprehensive web-based design system reference for on-brand AI-assisted (vibe coded) design at speed.' },
      { label: 'Growth & Data', text: 'Partner on Mixpanel-informed decisions, custom dashboards, and onboarding funnels to improve ROAS.' },
      { label: 'Socials Team', text: 'Collaborate on launch campaigns for the features I help design.' },
    ],
    roles: [
      {
        label: 'ImagineArt + Chatly',
        text: 'Present',
        description: 'TODO: describe the combined ImagineArt + Chatly project work.',
      },
      {
        label: 'Chatly',
        text: 'Feb 2026 — Present',
        description: 'TODO: describe your Chatly team work.',
      },
      {
        label: 'ImagineArt',
        text: '2025 — Feb 2026',
        description: 'TODO: describe your ImagineArt team work.',
      },
    ],
  },
  {
    id: 'sxtudios',
    period: '2025 — Present',
    title: 'Founder',
    subtitle: 'sxtudios',
    href: 'https://linktr.ee/sxtudios',
    meta: 'Islamabad, PK',
    description: 'Run an independent studio doing product design and brand work for early-stage clients, often prototyping in code to ship faster.',
  },
  {
    id: 'parhlai',
    period: '2025 — Present',
    title: 'Product Design, Marketing & Growth',
    subtitle: 'Parhlai',
    href: 'https://parhlai.com',
    meta: 'Islamabad, PK',
    roles: [
      {
        label: 'Growth Consultant',
        text: 'Jan 2026 — Present',
      },
      {
        label: 'Head of Marketing',
        text: 'Oct 2025 — Jan 2026 · On-site',
      },
      {
        label: 'Digital Marketing Consultant',
        text: 'Jun 2025 — Oct 2025 · Hybrid',
      },
    ],
  },
  {
    id: 'norenztech',
    period: '2024-2025',
    title: 'Lead UI/UX Engineer',
    subtitle: 'NorenzTech',
    href: 'https://www.norenztech.com/',
    meta: 'Rawalpindi, PK',
    description: "Owned both the interface design and the front-end build for the company's products, designed in Figma and shipped in code.",
  },
  {
    id: 'easytect',
    period: '2024',
    title: 'UX Designer',
    subtitle: 'easytect UG',
    href: 'https://easytect.de/',
    meta: 'Westerburg, DE · Remote',
    description: 'Designed product interfaces for a German software team, focused on making the core flows easier to use.',
  },
  {
    id: 'earlier',
    period: '2022 — 2025',
    title: 'Marketing & Creative',
    subtitle: 'Earlier roles',
    href: 'https://linkedin.com/in/syedsaribsultanyac270',
    description: 'Graphic Designer at ACM Pakistan (2022 to 2024), plus marketing and creative-lead roles at Career Konnect and Shadiyana (2025).',
  },
];

export const skills: SkillGroup[] = [
  {
    id: 'design',
    label: 'Design',
    value: 'Product & UX design, interaction design, design systems, prototyping, responsive layouts across breakpoints',
  },
  {
    id: 'build',
    label: 'Build',
    value: 'Front-end and HTML prototypes, AI product building, prompt engineering, agentic dev tools',
  },
  {
    id: 'growth',
    label: 'Growth',
    value: 'Paywall and upgrade flows, pricing and credit packs, referral systems, onboarding, conversion copywriting, A/B testing',
  },
  {
    id: 'data',
    label: 'Data',
    value: 'Mixpanel funnels and retention analysis, GrowthBook, defining the metric a design should move',
  },
  {
    id: 'tools',
    label: 'Tools',
    value: 'Figma, Mixpanel, GrowthBook, Notion, AI image and video models (Kling, Seedance, Veo, Nano Banana, fal API)',
  },
];

export const volunteering: ResumeEntry[] = [
  {
    id: 'project-elevate',
    period: '2023 — Present',
    title: 'Project Elevate',
    subtitle: 'Head · NUST Community Service Club',
    href: 'https://linkedin.com/in/syedsaribsultanyac270',
    description: 'Ran donation drives and awareness campaigns for the Pehli Kiran School System, raising funds for supplies and school renovation.',
  },
  {
    id: 'blood-drive',
    period: '2023 — Present',
    title: 'Blood Donation Drives',
    subtitle: 'Volunteer · NUST Community Service Club',
    href: 'https://linkedin.com/in/syedsaribsultanyac270',
    description: 'Volunteered across several blood donation drives for local institutes.',
  },
  {
    id: 'orphans-know-more',
    period: '2022 — Present',
    title: 'Project Orphans Know More',
    subtitle: 'Volunteer · NUST Community Service Club',
    href: 'https://linkedin.com/in/syedsaribsultanyac270',
    description: 'Volunteered in orphanage visits with the Christian Life Foundation.',
  },
];

export const education: ResumeEntry[] = [
  {
    id: 'nust',
    period: '2022 — 2026',
    title: 'BS, Computer Science',
    subtitle: 'National University of Sciences and Technology (NUST)',
    href: 'https://linkedin.com/in/syedsaribsultanyac270',
    meta: 'Islamabad, PK',
  },
];
