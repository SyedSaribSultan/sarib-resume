export interface LabeledBullet {
  label: string;
  text: string;
}

export interface Role {
  label: string;
  text: string;
  description?: string;
  href?: string;
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
  site: 'syedsarib.com',
  siteHref: 'https://syedsarib.com',
  about:
    'Product design engineer who designs, builds, and measures consumer AI products end to end. I cover product design, front-end engineering, and growth in one role, so a flow goes from an unclear problem to something live and measured without stalling between handoffs. Now at HeyOz, and before that at ImagineArt and ImagineComputer (formerly Chatly), on products with over a million signups. With a Computer Science background, I ship in code, use Figma MCP and Claude Code to prototype roughly 10x faster, and run nine live products of my own.',
};

// Search-engine topics for the JSON-LD `knowsAbout` field (not shown on the page).
export const topics = [
  'Product Design',
  'UX Design',
  'Design Systems',
  'Growth Design',
  'AI Product Design',
  'Conversion Optimization',
  'Design Engineering',
  'Front-End Development',
];

export const contacts: LabeledLink[] = [
  { id: 'email', label: 'Email', value: 'syedsaribsultan@gmail.com', href: 'mailto:syedsaribsultan@gmail.com' },
  { id: 'linkedin', label: 'LinkedIn', value: 'in/syedsaribsultanyac270', href: 'https://linkedin.com/in/syedsaribsultanyac270' },
  { id: 'github', label: 'GitHub', value: 'SyedSaribSultan', href: 'https://github.com/SyedSaribSultan' },
];

export const experience: ResumeEntry[] = [
  {
    id: 'heyoz',
    period: 'Jun 2026 — Present',
    title: 'Senior Product Design Engineer',
    subtitle: 'HeyOz',
    href: 'https://heyoz.com',
    meta: 'US · Remote',
    description: 'Product design, growth, and engineering at HeyOz, an AI ad-creative platform for DTC brands and agencies. I design the core creation experience and ship parts of it in code.',
    sections: [
      { label: 'Core Product', text: 'Designed the image and video studios, now the two most used surfaces in the product. Weekly visits to them grew more than **40x** in four months.' },
      { label: 'Composer & AI', text: 'Designed the shared prompt composer with brand controls, then designed and built Enhance, a one-click prompt rewrite. Weekly active creators grew from near zero to well over **1,000**.' },
      { label: 'Reliability', text: 'Added a creative-direction stage and a stronger default image model. Failed generations **more than halved**.' },
      { label: 'Growth', text: 'Designed the pricing page, the AI model pages, and the onboarding step that records where users come from. With me on the team, weekly signups grew about **8x** in five months.' },
      { label: 'Design System', text: 'Built the design token foundation the whole app is styled from.' },
      { label: 'Also Shipped', text: 'Designed the UGC and influencer studio, in-product feedback on results, and the announcement system for new features.' },
    ],
  },
  {
    id: 'vyro',
    period: 'Dec 2025 — Jun 2026',
    title: 'Product Design & Growth',
    subtitle: 'Vyro',
    href: 'https://imagine.art',
    meta: 'On-site, Islamabad, PK',
    description: 'Drove design across ImagineArt and ImagineComputer, consumer AI products with over **1M** signups, scaling the shared design system and owning AI features end to end, with every flow built to move conversion and ROAS.',
    sections: [
      { label: 'Leadership', text: 'Owned genAI features end to end, concept to dev-ready handoff.' },
      { label: 'Engineering', text: 'Used Figma MCP and Claude Code to prototype and test roughly **10x** faster, cutting design-to-dev handoff friction.' },
      { label: 'Growth & Data', text: 'Ran Mixpanel funnel analysis across **1.13M** signups, isolated a segment converting at **0.43%** vs a **1.04%** baseline, then shipped the fix.' },
      { label: 'Socials Team', text: 'Partnered on launch campaigns for the features I designed.' },
    ],
    roles: [
      {
        label: 'ImagineComputer + ImagineArt',
        text: 'May 2026 — Jun 2026',
        href: 'https://www.imagine.art/computer/startup',
        description: "Led end-to-end design for Sites, ImagineComputer's AI web app builder, in partnership with ImagineArt — from custom auth and growth loops to landing pages and dashboards, with AI-generated visuals and Figma MCP / Claude Code prototypes that cut dev-handoff friction.",
      },
      {
        label: 'ImagineComputer (formerly Chatly)',
        text: 'Feb 2026 — Jun 2026',
        href: 'https://www.imagine.art/computer/agent',
        description: 'Owned design across the full product, from core surfaces to the activation and revenue flows. Rebuilt the referral system end to end (**50% off** referred, **7,000** credits per upgrade) and rewrote the paywall into **three** A/B-tested variants.',
      },
      {
        label: 'ImagineArt',
        text: 'Dec 2025 — Feb 2026',
        href: 'https://imagine.art',
        description: 'Shipped end-to-end design for four core products — Imagine Apps Suite, Assets, AI Avatar Studio, AI Video Studio — plus the Workflows surface, concept to dev-ready handoff.',
      },
    ],
  },
  {
    id: 'sxtudios',
    period: '2025 — Jun 2026',
    title: 'Founder',
    subtitle: 'sxtudios',
    href: 'https://linktr.ee/sxtudios',
    meta: 'Islamabad, PK',
    description: 'Independent studio delivering product design and brand work for early-stage clients, prototyping in code to compress concept-to-ship timelines.',
  },
  {
    id: 'parhlai',
    period: '2025 — Jun 2026',
    title: 'Product Design, Marketing & Growth',
    subtitle: 'Parhlai',
    href: 'https://parhlai.com',
    meta: 'Islamabad, PK',
    description: 'Drove product design, marketing, and growth for an ed-tech platform, scaling from digital marketing into a growth-consulting remit owning acquisition and retention.',
    roles: [
      {
        label: 'Growth Consultant',
        text: 'Jan 2026 — Jun 2026',
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
    description: "Owned both interface design and the front-end build for the company's products — designing in Figma, shipping in code.",
  },
  {
    id: 'easytect',
    period: '2024',
    title: 'UX Designer',
    subtitle: 'easytect UG',
    href: 'https://easytect.de/',
    meta: 'Westerburg, DE · Remote',
    description: 'Designed product interfaces for a German software team, reworking core flows to make them easier to use.',
  },
  {
    id: 'earlier',
    period: '2022 — 2025',
    title: 'Marketing & Creative',
    subtitle: 'Earlier roles',
    href: 'https://linkedin.com/in/syedsaribsultanyac270',
    description: 'Graphic Designer at ACM Pakistan (2022 to 2024), plus marketing and creative-lead roles at Career Konnect and Shadiyana (2025), owning brand and campaign output across each.',
  },
];

export const projects: ResumeEntry[] = [
  {
    id: 'own-products',
    period: 'Jun 2026 — Present',
    title: 'Nine live products',
    href: 'https://syedsarib.com',
    meta: 'Designed, built, and run solo',
    description: 'An AI whiteboard, a coding agent, a private money tracker, an image compressor, and more, all live on syedsarib.com at zero monthly cost.',
    sections: [
      { label: 'Output', text: '**1,575** commits across **28** repositories alongside a full-time role, including **298** commits on one product in under four weeks.' },
      { label: 'Performance', text: 'Mobile Lighthouse scores of **96 to 99**. Cut load time from up to 2.8 s to about **0.5 s**, database latency from about 290 ms to about **52 ms**, and memory use by **25 to 40%**.' },
      { label: 'AI', text: 'Built an agent that shows its first result in **1.94 s** and a full board in **8.8 s** from a single AI call.' },
      { label: 'Quality & Security', text: 'Audited all nine apps with no critical findings and shipped the fixes the same day. Audited **277** state machines and fixed **218** in one day. About **675** automated tests across three products.' },
      { label: 'Design System', text: 'One design system shared across **six** apps, generated from tokens.' },
      { label: 'Publishing', text: '**1,879** icon pages and **35** sourced guides for design and computer science students.' },
    ],
  },
];

export const skills: SkillGroup[] = [
  {
    id: 'design',
    label: 'Design',
    value: 'Product & UX design, interaction design, design systems and tokens, prototyping, responsive layouts across breakpoints',
  },
  {
    id: 'build',
    label: 'Build',
    value: 'React, Next.js, TypeScript, Tailwind CSS, front-end and HTML prototypes, performance, accessibility, web security',
  },
  {
    id: 'ai',
    label: 'AI',
    value: 'AI product design, prompt engineering, AI agents and evaluation, agentic dev tools, image and video models (Kling, Seedance, Veo, Nano Banana, fal API)',
  },
  {
    id: 'growth',
    label: 'Growth',
    value: 'Paywall and upgrade flows, pricing and credit packs, referral systems, onboarding, conversion copywriting, A/B testing, SEO',
  },
  {
    id: 'data',
    label: 'Data',
    value: 'PostHog and Mixpanel funnels and retention analysis, GrowthBook, defining the metric a design should move',
  },
  {
    id: 'tools',
    label: 'Tools',
    value: 'Figma, Figma MCP, Claude Code, PostHog, Mixpanel, GrowthBook, Notion, Vercel, Cloudflare',
  },
];

export const volunteering: ResumeEntry[] = [
  {
    id: 'project-elevate',
    period: '2023 — Jun 2026',
    title: 'Project Elevate',
    subtitle: 'Head · NUST Community Service Club',
    href: 'https://linkedin.com/in/syedsaribsultanyac270',
    description: 'Ran donation drives and awareness campaigns for the Pehli Kiran School System, raising funds for supplies and school renovation.',
  },
  {
    id: 'blood-drive',
    period: '2023 — Jun 2026',
    title: 'Blood Donation Drives',
    subtitle: 'Volunteer · NUST Community Service Club',
    href: 'https://linkedin.com/in/syedsaribsultanyac270',
    description: 'Volunteered across several blood donation drives for local institutes.',
  },
  {
    id: 'orphans-know-more',
    period: '2022 — Jun 2026',
    title: 'Project Orphans Know More',
    subtitle: 'Volunteer · NUST Community Service Club',
    href: 'https://linkedin.com/in/syedsaribsultanyac270',
    description: 'Volunteered in orphanage visits with the Christian Life Foundation.',
  },
];

export const education: ResumeEntry[] = [
  {
    id: 'nust',
    period: '2022 — Jun 2026',
    title: 'BS, Computer Science',
    subtitle: 'National University of Sciences and Technology (NUST)',
    href: 'https://linkedin.com/in/syedsaribsultanyac270',
    meta: 'Islamabad, PK',
  },
];
