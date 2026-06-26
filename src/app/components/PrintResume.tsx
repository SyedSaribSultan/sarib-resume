import type { CSSProperties, ReactNode } from 'react';
import {
  profile,
  contacts,
  experience,
  skills,
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
const PAGE = '#ffffff';

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
// Tight vertical rhythm — keeps the doc compact (aim ~1 page) while leaving
// enough air that page breaks don't crowd.
const ENTRY_GAP = 9; // between top-level entries within a section
const SECTION_GAP = 12; // between sections (Experience -> Leadership -> ...)

const sectionLabel: CSSProperties = {
  gridColumn: 1,
  fontSize: 9,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: MUTED,
  fontWeight: 400,
  paddingTop: 1,
};
const company: CSSProperties = { fontSize: 11, fontWeight: 600, color: INK, lineHeight: 1.3 };
const roleLine: CSSProperties = { fontSize: 11, color: INK, lineHeight: 1.3 };
const periodLine: CSSProperties = { fontSize: 10, color: FAINT, lineHeight: 1.3, marginTop: 1 };
const detail: CSSProperties = { fontSize: 10.5, color: MUTED, lineHeight: 1.34 };

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
        gridTemplateColumns: '100px 184px 1fr',
        columnGap: 18,
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
  // For the PDF, keep only thematic sections that carry a metric (** sentinel),
  // dropping filler lines (e.g. Leadership/Socials) to stay concise. The live
  // site still shows all sections from the shared data.
  const printSections = e.sections?.filter((s) => s.text.includes('**'));
  // Likewise drop tall, metric-less descriptive sub-roles from the PDF; keep
  // position-only sub-roles (no description — cheap history) and any whose
  // description carries a metric.
  const printRoles = e.roles?.filter((r) => !r.description || r.description.includes('**'));
  const hasChildren = !!(printRoles && printRoles.length) || !!(printSections && printSections.length);

  const sectionDetail = printSections && printSections.length ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {e.description && <div style={detail}>{emphasize(e.description)}</div>}
      {printSections.map((s) => (
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
      {printRoles?.map((r, idx) => (
        <Row
          key={`${e.id}-${r.label}`}
          gap={idx === printRoles.length - 1 ? 0 : 8}
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
        width: '100%',
        margin: 0,
        // Horizontal gutters only — vertical breathing room comes from the
        // @page top/bottom margins so it applies on every page-break edge too.
        padding: '0 0.7in',
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
          marginBottom: 16,
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

      {/* Volunteering is intentionally omitted from the PDF to keep it to one
          page — it remains on the live site (App.tsx). */}

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

      {/* Skills — compact: label inline with its value on one flowing line per
          group, packed into the detail column to save vertical space. */}
      <section style={{ breakInside: 'avoid' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr',
            columnGap: 18,
          }}
        >
          <div style={sectionLabel}>Skills</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {skills.map((s) => (
              <div key={s.id} style={detail}>
                <span style={{ fontWeight: 600, color: INK }}>{s.label}.</span> {s.value}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
