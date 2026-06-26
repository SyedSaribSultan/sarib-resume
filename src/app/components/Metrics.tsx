import { Box } from '@mui/material';
import type { ReactNode } from 'react';

// Matches a run wrapped in **double asterisks**. Capturing group keeps the
// inner text. Emphasis is opt-in per token, so dates, phone numbers, and years
// left unmarked in the data are never touched.
const METRIC = /\*\*(.+?)\*\*/g;

/**
 * Splits resume body copy on **sentinel** markers and renders each marked run
 * as an emphasized metric: bumped weight + promoted to text.primary, so the
 * achievement numbers land first against the muted text.secondary body copy.
 *
 * Keeps resume-data.ts as pure strings — no JSX in the data layer. The span
 * overrides only weight + color, inheriting fontSize and lineHeight from the
 * surrounding <Typography>, so there is no layout shift.
 */
export function renderMetrics(text: string): ReactNode {
  // Fast path: no markers -> return the raw string, zero wrappers.
  if (!text.includes('**')) return text;

  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;

  for (const m of text.matchAll(METRIC)) {
    const start = m.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    nodes.push(
      <Box key={i++} component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
        {m[1]}
      </Box>,
    );
    last = start + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
