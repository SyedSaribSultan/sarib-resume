/**
 * Everything that repeats resume facts outside the page itself is generated
 * from src/app/components/resume-data.ts here, so a fact is edited once:
 *
 *   index.html  meta descriptions + JSON-LD Person   (transformIndexHtml)
 *   /resume.json  the data, for SaribLM on syedsarib.com and anything else
 *   /llms.txt     plain-text profile for LLM crawlers
 *
 * resume.pdf is rendered after the build by scripts/render-pdf.mjs.
 */
import type { Plugin } from 'vite';
import {
  contacts,
  education,
  experience,
  profile,
  skills,
  topics,
  volunteering,
  type ResumeEntry,
} from '../src/app/components/resume-data';

export const SITE_URL = 'https://resume.syedsarib.com';

const plain = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '$1');
const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The role whose period runs to "Present". */
const current = (): ResumeEntry | undefined => experience.find((e) => /present$/i.test(e.period));

export function summaries() {
  const now = current();
  const role = now ? `${now.title} at ${now.subtitle}.` : '';
  return {
    // <meta name="description">
    long: `${profile.name}, ${profile.title} in ${profile.location}. ${role}`.trim(),
    // og:description / twitter:description
    short: `${profile.title} in ${profile.location}. ${role}`.trim(),
  };
}

export function resumeJson() {
  return {
    $comment: 'Generated from resume-data.ts in github.com/SyedSaribSultan/sarib-resume. Do not edit by hand.',
    url: SITE_URL,
    profile,
    contacts,
    experience,
    skills,
    volunteering,
    education,
  };
}

function jsonLd() {
  const now = current();
  const nust = education[0];
  const linkedin = contacts.find((c) => c.id === 'linkedin')?.href;
  const email = contacts.find((c) => c.id === 'email')?.href;
  const [locality, country] = profile.location.split(',').map((s) => s.trim());
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: 'Sarib',
    url: SITE_URL,
    image: `${SITE_URL}/og.png`,
    jobTitle: profile.title,
    description: summaries().short,
    ...(now && {
      worksFor: { '@type': 'Organization', name: now.subtitle, ...(now.href && { url: now.href }) },
    }),
    address: { '@type': 'PostalAddress', addressLocality: locality, addressCountry: country },
    ...(nust && { alumniOf: { '@type': 'CollegeOrUniversity', name: nust.subtitle } }),
    knowsAbout: topics,
    ...(email && { email }),
    sameAs: [profile.siteHref, linkedin].filter(Boolean),
  };
}

function entryLine(e: ResumeEntry): string {
  const head = [e.title, e.subtitle].filter(Boolean).join(', ');
  const when = [e.period, e.meta].filter(Boolean).join(', ');
  const body = [e.description, ...(e.sections ?? []).map((s) => `${s.label}: ${s.text}`), ...(e.bullets ?? [])]
    .filter(Boolean)
    .map((s) => plain(s!))
    .join(' ');
  const link = e.href ? ` (${e.href})` : '';
  const roles = (e.roles ?? [])
    .map((r) => `\n  - ${r.label} (${r.text})${r.description ? `: ${plain(r.description)}` : ''}${r.href ? ` (${r.href})` : ''}`)
    .join('');
  return `- ${head} (${when})${body ? `: ${body}` : ''}${link}${roles}`;
}

export function llmsTxt(): string {
  const s = summaries();
  return [
    `# ${profile.name}`,
    '',
    `> ${s.short} ${plain(profile.about)}`,
    '',
    '## Contact',
    ...contacts.map((c) => `- ${c.label}: ${c.href?.replace(/^mailto:|^tel:/, '') ?? c.value}`),
    `- Portfolio: ${profile.siteHref}`,
    `- Resume: ${SITE_URL}`,
    '',
    '## Experience',
    ...experience.map(entryLine),
    '',
    '## Skills',
    ...skills.map((g) => `- ${g.label}: ${g.value}`),
    '',
    '## Education',
    ...education.map(entryLine),
    '',
    '## Volunteering',
    ...volunteering.map(entryLine),
    '',
  ].join('\n');
}

export function resumeArtifacts(): Plugin {
  return {
    name: 'resume-artifacts',
    transformIndexHtml(html) {
      const s = summaries();
      return html
        .replaceAll('%RESUME_DESCRIPTION%', escapeAttr(s.long))
        .replaceAll('%RESUME_SHORT_DESCRIPTION%', escapeAttr(s.short))
        .replace('%RESUME_JSONLD%', JSON.stringify(jsonLd(), null, 2).replace(/</g, '\\u003c'));
    },
    configureServer(server) {
      // Same files in `npm run dev`.
      server.middlewares.use((req, res, next) => {
        if (req.url === '/resume.json') {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          return res.end(JSON.stringify(resumeJson(), null, 2));
        }
        if (req.url === '/llms.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          return res.end(llmsTxt());
        }
        next();
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'resume.json', source: JSON.stringify(resumeJson(), null, 2) + '\n' });
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt() });
    },
  };
}
