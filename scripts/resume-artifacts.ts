/**
 * Everything that repeats resume facts outside the page itself is generated
 * from src/app/components/resume-data.ts here, so a fact is edited once:
 *
 *   index.html  meta descriptions + JSON-LD Person   (transformIndexHtml)
 *   /resume.json  the data, for SaribLM on syedsarib.com and anything else
 *   /llms.txt     plain-text profile for LLM crawlers
 *
 * resume.pdf is rendered after the build by scripts/render-pdf.mjs.
 *
 * At build time it also preloads the main (latin) font and fails the build if
 * an inline <script> in index.html is not allowed by a sha256 hash in
 * vercel.json's Content-Security-Policy (which has no 'unsafe-inline').
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
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

function transformHtml(html: string): string {
  const s = summaries();
  return html
    .replaceAll('%RESUME_DESCRIPTION%', escapeAttr(s.long))
    .replaceAll('%RESUME_SHORT_DESCRIPTION%', escapeAttr(s.short))
    .replace('%RESUME_JSONLD%', JSON.stringify(jsonLd(), null, 2).replace(/</g, '\u003c'));
}

/** Every inline classic <script> must have its sha256 in vercel.json's CSP. */
function assertInlineScriptsAllowedByCsp(html: string) {
  const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  const csp: string =
    vercel.headers
      .flatMap((h: { headers: { key: string; value: string }[] }) => h.headers)
      .find((h: { key: string }) => h.key === 'Content-Security-Policy')?.value ?? '';
  // Skips <script src=...> and non-JS types such as application/ld+json.
  for (const m of html.matchAll(/<script(?![^>]*\b(?:src|type)=)[^>]*>([\s\S]*?)<\/script>/g)) {
    const hash = `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`;
    if (!csp.includes(hash)) {
      throw new Error(`Inline script not allowed by vercel.json CSP. Add ${hash} to script-src.`);
    }
  }
}

export function resumeArtifacts(): Plugin {
  return {
    name: 'resume-artifacts',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (ctx.bundle) {
          assertInlineScriptsAllowedByCsp(html);
          // Preload the main latin face so text doesn't wait on the CSS -> font chain.
          const font = Object.keys(ctx.bundle).find((f) => /google-sans-flex-latin-(?!ext-)[^/]*\.woff2$/.test(f));
          if (font) {
            html = html.replace(
              '</title>',
              `</title>\n    <link rel="preload" href="/${font}" as="font" type="font/woff2" crossorigin />`,
            );
          }
        }
        return transformHtml(html);
      },
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
