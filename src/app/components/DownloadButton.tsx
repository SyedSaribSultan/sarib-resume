import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Button } from '@mui/material';
import { m } from 'motion/react';
import { CircleAlert, Check, Download, Loader2 } from 'lucide-react';

// Where the static, pre-exported resume lives (public/ is served at the root).
const RESUME_URL = '/resume.pdf';
const FILE_NAME = 'Syed-Sarib-Sultan-CV.pdf';
const LOADING_MS = 750; // shortest spinner, so the morph-to-tick reads
const DONE_MS = 5000; // how long the tick (or the failure) holds

type Phase = 'idle' | 'loading' | 'done' | 'failed';

/**
 * Outlined "Download" button pinned top-right, just left of the theme toggle.
 * Click → fetches resume.pdf and saves it, with a spinner meanwhile. Only a
 * real saved file morphs the spinner into a tick (disabled for 5s); a failed
 * fetch shows "Download failed" and the button stays clickable to try again.
 * Reverting to idle is instant (the download icon snaps back, no gap, no pop).
 *
 * Carries .print-hide so it never appears in the generated PDF / print output.
 */
export function DownloadButton() {
  const [phase, setPhase] = useState<Phase>('idle');
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (loadTimer.current) clearTimeout(loadTimer.current);
      if (doneTimer.current) clearTimeout(doneTimer.current);
    },
    [],
  );

  const handleDownload = async (event: MouseEvent<HTMLAnchorElement>) => {
    // Still a real <a href download>, so crawlers and no-JS visitors get the
    // PDF. With JS the file is fetched here, so success and failure are real.
    event.preventDefault();
    if (phase === 'loading' || phase === 'done') return;
    if (doneTimer.current) clearTimeout(doneTimer.current);
    setPhase('loading');
    const started = Date.now();
    let saved = false;
    try {
      const res = await fetch(RESUME_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const href = URL.createObjectURL(await res.blob());
      const a = Object.assign(document.createElement('a'), { href, download: FILE_NAME });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 10_000);
      saved = true;
    } catch {
      /* shown as the failed phase */
    }
    loadTimer.current = setTimeout(() => {
      setPhase(saved ? 'done' : 'failed');
      doneTimer.current = setTimeout(() => setPhase('idle'), DONE_MS);
    }, Math.max(0, LOADING_MS - (Date.now() - started)));
  };

  return (
    <Button
      component="a"
      href={RESUME_URL}
      download={FILE_NAME}
      onClick={handleDownload}
      disabled={phase === 'loading' || phase === 'done'}
      disableRipple
      className="print-hide"
      aria-label="Download resume as PDF"
      variant="outlined"
      startIcon={<PhaseIcon phase={phase} />}
      sx={{
        position: 'fixed',
        top: { xs: 16, sm: 24 },
        right: { xs: 62, sm: 74 },
        zIndex: 'tooltip',
        height: 38,
        px: 1.5,
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1,
        borderRadius: 999,
        // Muted via a colour token (not opacity) so the label keeps >= 4.5:1.
        color: 'text.disabled',
        borderColor: 'divider',
        transition: 'color 200ms ease, border-color 200ms ease',
        '&:hover': {
          color: 'text.primary',
          borderColor: 'text.disabled',
          bgcolor: 'transparent',
        },
        // Keep the loading/done states legible instead of MUI's greyed-out look.
        '&.Mui-disabled': {
          color: 'text.primary',
          borderColor: 'divider',
        },
      }}
    >
      {phase === 'loading' ? 'Downloading' : phase === 'done' ? 'Downloaded' : phase === 'failed' ? 'Download failed' : 'Download'}
    </Button>
  );
}

/**
 * One persistent icon slot, swapped per phase:
 * - idle: Download (instant)
 * - loading: Loader2 spinning continuously (appears instantly on click — no gap)
 * - done: Check that scales/draws IN from the spinner's spot (smooth morph)
 * - failed: CircleAlert (instant)
 * Reverting loading/done -> idle is instant (no exit animation).
 */
function PhaseIcon({ phase }: { phase: Phase }) {
  if (phase === 'loading') {
    return (
      <m.span
        style={{ display: 'inline-flex' }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 0.8 }}
      >
        <Loader2 size={16} />
      </m.span>
    );
  }
  if (phase === 'done') {
    return (
      <m.span
        style={{ display: 'inline-flex' }}
        initial={{ scale: 0.3, opacity: 0, rotate: -30 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 18 }}
      >
        <Check size={16} />
      </m.span>
    );
  }
  if (phase === 'failed') {
    return (
      <span style={{ display: 'inline-flex' }}>
        <CircleAlert size={16} />
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex' }}>
      <Download size={16} />
    </span>
  );
}
