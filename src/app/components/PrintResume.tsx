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

// Render one experience/volunteering entry, flattening nested sub-roles into
// indented sub-rows (the "sub-roles as entries" treatment).
function entryRows(e: ResumeEntry, label?: string): ReactNode[] {
  const rows: ReactNode[] = [];
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

  rows.push(
    <Row
      key={e.id}
      label={label}
      gap={hasChildren ? 10 : 18}
      mid={
        <>
          <div style={company}>{e.subtitle ?? e.title}</div>
          {e.subtitle && <div style={roleLine}>{e.title}</div>}
          <div style={periodLine}>{e.period}</div>
          {e.meta && <div style={periodLine}>{e.meta}</div>}
        </>
      }
      detail={sectionDetail}
    />,
  );

  // Sub-roles become indented mid-column rows under the parent.
  e.roles?.forEach((r, idx) => {
    const isLast = idx === e.roles!.length - 1;
    rows.push(
      <Row
        key={`${e.id}-${r.label}`}
        gap={isLast ? 18 : 8}
        indent
        mid={
          <>
            <div style={{ ...company, fontSize: 11 }}>{r.label}</div>
            <div style={periodLine}>{r.text}</div>
          </>
        }
        detail={r.description ? <div style={detail}>{emphasize(r.description)}</div> : null}
      />,
    );
  });

  return rows;
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
      {experience.map((e, i) => entryRows(e, i === 0 ? 'Experience' : undefined))}

      {/* Leadership (volunteering) */}
      <div style={{ height: 8 }} />
      {volunteering.map((e, i) =>
        // volunteering has no nested roles; one row each.
        <Row
          key={e.id}
          label={i === 0 ? 'Leadership' : undefined}
          mid={
            <>
              <div style={company}>{e.title}</div>
              {e.subtitle && <div style={roleLine}>{e.subtitle}</div>}
              <div style={periodLine}>{e.period}</div>
            </>
          }
          detail={e.description ? <div style={detail}>{emphasize(e.description)}</div> : null}
        />,
      )}

      {/* Education */}
      <div style={{ height: 8 }} />
      {education.map((e, i) => (
        <Row
          key={e.id}
          label={i === 0 ? 'Education' : undefined}
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
      ))}

      {/* Skills */}
      <div style={{ height: 8 }} />
      {skills.map((s, i) => (
        <Row
          key={s.id}
          label={i === 0 ? 'Skills' : undefined}
          gap={10}
          mid={<div style={{ ...company, fontSize: 11 }}>{s.label}</div>}
          detail={<div style={detail}>{s.value}</div>}
        />
      ))}
    </div>
  );
}
