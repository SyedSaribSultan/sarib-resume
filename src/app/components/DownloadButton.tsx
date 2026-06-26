import { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import { motion } from 'motion/react';
import { Check, Download, Loader2 } from 'lucide-react';

// Where the static, pre-exported resume lives (public/ is served at the root).
const RESUME_URL = '/resume.pdf';
const LOADING_MS = 750; // brief spinner so the morph-to-tick reads
const DONE_MS = 5000; // how long the tick + disabled state holds

type Phase = 'idle' | 'loading' | 'done';

/**
 * Outlined "Download" button pinned top-right, just left of the theme toggle.
 * Click → triggers the resume.pdf download, shows a spinner, then morphs the
 * spinner smoothly into a tick and disables for 5s. Reverting to idle is
 * instant (the download icon snaps back — no empty gap, no pop).
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

  const handleDownload = () => {
    if (phase !== 'idle') return;

    const a = document.createElement('a');
    a.href = RESUME_URL;
    a.download = 'Syed-Sarib-Sultan-CV.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();

    setPhase('loading');
    loadTimer.current = setTimeout(() => {
      setPhase('done');
      doneTimer.current = setTimeout(() => setPhase('idle'), DONE_MS);
    }, LOADING_MS);
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={phase !== 'idle'}
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
        color: 'text.secondary',
        borderColor: 'divider',
        opacity: 0.55,
        transition: 'opacity 200ms ease, color 200ms ease, border-color 200ms ease',
        '&:hover': {
          opacity: 1,
          color: 'text.primary',
          borderColor: 'text.disabled',
          bgcolor: 'transparent',
        },
        // Keep the loading/done states legible instead of MUI's greyed-out look.
        '&.Mui-disabled': {
          opacity: 1,
          color: 'text.primary',
          borderColor: 'divider',
        },
      }}
    >
      {phase === 'loading' ? 'Downloading' : phase === 'done' ? 'Downloaded' : 'Download'}
    </Button>
  );
}

/**
 * One persistent icon slot, swapped per phase:
 * - idle: Download (instant)
 * - loading: Loader2 spinning continuously (appears instantly on click — no gap)
 * - done: Check that scales/draws IN from the spinner's spot (smooth morph)
 * Reverting loading/done -> idle is instant (no exit animation).
 */
function PhaseIcon({ phase }: { phase: Phase }) {
  if (phase === 'loading') {
    return (
      <motion.span
        style={{ display: 'inline-flex' }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 0.8 }}
      >
        <Loader2 size={16} />
      </motion.span>
    );
  }
  if (phase === 'done') {
    return (
      <motion.span
        style={{ display: 'inline-flex' }}
        initial={{ scale: 0.3, opacity: 0, rotate: -30 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 18 }}
      >
        <Check size={16} />
      </motion.span>
    );
  }
  return (
    <span style={{ display: 'inline-flex' }}>
      <Download size={16} />
    </span>
  );
}
