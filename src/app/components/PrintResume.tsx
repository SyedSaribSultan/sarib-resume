import type { CSSProperties, ReactNode } from 'react';
import {
  profile,
  contacts,
  experience,
  skills,
  volunteering,
  education,
  type ResumeEntry,
} from './resume-data';

/**
 * Print-only resume layout — a decoupled, US-Letter document rendered ONLY at
 * the `?print` route (see main.tsx) and captured into public/resume.pdf via
 * Chrome's print-to-pdf. The live site (App.tsx) is untouched; both read the
 * same resume-data.ts, so content stays in one place.
 *
 * Layout follows a three-column grid (section label | role block | detail),
 * always light palette, selectable text. Achievement numbers render bold via
 * the same **sentinel** convention used on the live site.
 */

// ---- tokens (light palette, mirrors the site's light theme) ----------------
const INK = '#1c1c1a'; // text.primary
const MUTED = '#6f6f68'; // text.secondary
const FAINT = '#9a9a91'; // periods / faint detail
const LINK = '#3a5ccc'; // restrained ink-blue, print-only (matches reference)
const PAGE = '#fbfbfa';

const SANS = '"Google Sans Flex", -apple-system, BlinkMacSystemFont, sans-serif';

// Bold the **sentinel** runs in body copy, inline. Plain inline version of the
// site's renderMetrics — no MUI dependency so the print doc stays standalone.
const METRIC = /\*\*(.+?)\*\*/g;
function emphasize(text: string): ReactNode {
  if (!text.includes('**')) return text;
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(METRIC)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    out.push(
      <strong key={i++} style={{ fontWeight: 600, color: INK }}>
        {m[1]}
      </strong>,
    );
    last = start + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// ---- shared style fragments -------------------------------------------------
// Vertical rhythm. Generous gaps keep entries from crowding and reduce the
// chance a page break lands awkwardly mid-section.
const ENTRY_GAP = 26; // between top-level entries within a section
const SECTION_GAP = 34; // between sections (Experience -> Leadership -> ...)

const sectionLabel: CSSProperties = {
  gridColumn: 1,
  fontSize: 9.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: MUTED,
  fontWeight: 400,
  paddingTop: 2,
};
const company: CSSProperties = { fontSize: 12, fontWeight: 600, color: INK, lineHeight: 1.35 };
const roleLine: CSSProperties = { fontSize: 12, color: INK, lineHeight: 1.35 };
const periodLine: CSSProperties = { fontSize: 11, color: FAINT, lineHeight: 1.35, marginTop: 1 };
const detail: CSSProperties = { fontSize: 11, color: MUTED, lineHeight: 1.5 };

// One row of the 3-col grid. Section label only on the first row of a section.
function Row({
  label,
  mid,
  detail: detailNode,
  indent = false,
  gap = 18,
}: {
  label?: string;
  mid: ReactNode;
  detail?: ReactNode;
  indent?: boolean;
  gap?: number;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '108px 168px 1fr',
        columnGap: 20,
        paddingBottom: gap,
        breakInside: 'avoid',
      }}
    >
      <div style={sectionLabel}>{label ?? ''}</div>
      <div style={{ gridColumn: 2, paddingLeft: indent ? 14 : 0 }}>{mid}</div>
      <div style={{ gridColumn: 3 }}>{detailNode}</div>
    </div>
  );
}

// Render one experience/volunteering entry as a single group: the parent row
// plus its indented sub-roles, wrapped so a page break never splits an entry
// from its children. Sub-roles use the "sub-roles as entries" treatment.
function EntryGroup({ e, label }: { e: ResumeEntry; label?: string }) {
  const hasChildren = !!(e.roles && e.roles.length) || !!(e.sections && e.sections.length);

  // Fold thematic sections (Leadership/Engineering/Growth & Data/...) into the
  // top entry's detail so their metrics survive without extra nesting depth.
  const sectionDetail = e.sections ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {e.description && <div style={detail}>{emphasize(e.description)}</div>}
      {e.sections.map((s) => (
        <div key={s.label} style={detail}>
          <span style={{ fontWeight: 600, color: INK }}>{s.label}. </span>
          {emphasize(s.text)}
        </div>
      ))}
    </div>
  ) : e.description ? (
    <div style={detail}>{emphasize(e.description)}</div>
  ) : null;

  return (
    // The whole entry (parent + sub-roles) stays on one page.
    <div style={{ breakInside: 'avoid', paddingBottom: ENTRY_GAP }}>
      <Row
        label={label}
        gap={hasChildren ? 10 : 0}
        mid={
          <>
            <div style={company}>{e.subtitle ?? e.title}</div>
            {e.subtitle && <div style={roleLine}>{e.title}</div>}
            <div style={periodLine}>{e.period}</div>
            {e.meta && <div style={periodLine}>{e.meta}</div>}
          </>
        }
        detail={sectionDetail}
      />
      {e.roles?.map((r, idx) => (
        <Row
          key={`${e.id}-${r.label}`}
          gap={idx === e.roles!.length - 1 ? 0 : 8}
          indent
          mid={
            <>
              <div style={{ ...company, fontSize: 11 }}>{r.label}</div>
              <div style={periodLine}>{r.text}</div>
            </>
          }
          detail={r.description ? <div style={detail}>{emphasize(r.description)}</div> : null}
        />
      ))}
    </div>
  );
}

export function PrintResume() {
  return (
    <div
      style={{
        background: PAGE,
        color: INK,
        fontFamily: SANS,
        width: '8.5in',
        minHeight: '11in',
        margin: '0 auto',
        padding: '0.6in 0.7in',
        boxSizing: 'border-box',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'start',
          marginBottom: 34,
        }}
      >
        <div>
          <div style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: INK }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED, marginTop: 4 }}>
            {profile.title} · {profile.location}
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, lineHeight: 1.6 }}>
          <div>
            <a href={profile.siteHref} style={{ color: LINK, textDecoration: 'none' }}>{profile.site}</a>
          </div>
          {contacts.map((c) => (
            <div key={c.id}>
              <a href={c.href} style={{ color: LINK, textDecoration: 'none' }}>{c.value}</a>
            </div>
          ))}
        </div>
      </header>

      {/* Experience */}
      <section style={{ paddingBottom: SECTION_GAP }}>
        {experience.map((e, i) => (
          <EntryGroup key={e.id} e={e} label={i === 0 ? 'Experience' : undefined} />
        ))}
      </section>

      {/* Leadership (volunteering) — no nested roles. */}
      <section style={{ paddingBottom: SECTION_GAP }}>
        {volunteering.map((e, i) => (
          <div key={e.id} style={{ breakInside: 'avoid', paddingBottom: ENTRY_GAP }}>
            <Row
              label={i === 0 ? 'Leadership' : undefined}
              gap={0}
              mid={
                <>
                  <div style={company}>{e.title}</div>
                  {e.subtitle && <div style={roleLine}>{e.subtitle}</div>}
                  <div style={periodLine}>{e.period}</div>
                </>
              }
              detail={e.description ? <div style={detail}>{emphasize(e.description)}</div> : null}
            />
          </div>
        ))}
      </section>

      {/* Education */}
      <section style={{ paddingBottom: SECTION_GAP }}>
        {education.map((e, i) => (
          <div key={e.id} style={{ breakInside: 'avoid', paddingBottom: ENTRY_GAP }}>
            <Row
              label={i === 0 ? 'Education' : undefined}
              gap={0}
              mid={
                <>
                  <div style={company}>{e.subtitle ?? e.title}</div>
                  {e.subtitle && <div style={roleLine}>{e.title}</div>}
                  <div style={periodLine}>{e.period}</div>
                  {e.meta && <div style={periodLine}>{e.meta}</div>}
                </>
              }
              detail={null}
            />
          </div>
        ))}
      </section>

      {/* Skills */}
      <section style={{ breakInside: 'avoid' }}>
        {skills.map((s, i) => (
          <Row
            key={s.id}
            label={i === 0 ? 'Skills' : undefined}
            gap={12}
            mid={<div style={{ ...company, fontSize: 11 }}>{s.label}</div>}
            detail={<div style={detail}>{s.value}</div>}
          />
        ))}
      </section>
    </div>
  );
}
