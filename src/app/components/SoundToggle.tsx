import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { AnimatePresence, m } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

// Remembered across visits. Absent = sound on (the page's original behaviour).
const SOUND_KEY = 'ui-sound-muted';

/** Muted state for the UI sounds, read after mount so the prerendered HTML stays identical for everyone. */
export function useSoundPreference() {
  const [muted, setMuted] = useState(false);
  // The sounds are silent anyway for reduced motion or without Web Audio, so the toggle hides there.
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    try {
      setMuted(window.localStorage.getItem(SOUND_KEY) === '1');
    } catch {
      /* storage blocked: keep the default */
    }
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const hasAudio = 'AudioContext' in window || 'webkitAudioContext' in window;
    setAvailable(!reduced && hasAudio);
  }, []);

  const toggle = () => {
    setMuted((prev) => {
      const next = !prev;
      try {
        if (next) window.localStorage.setItem(SOUND_KEY, '1');
        else window.localStorage.removeItem(SOUND_KEY);
      } catch {
        /* storage blocked: the choice lasts for this visit only */
      }
      return next;
    });
  };

  return { muted, available, toggle };
}

interface SoundToggleProps {
  muted: boolean;
  onToggle: () => void;
}

/** Small icon button under the theme toggle, styled the same way. */
export function SoundToggle({ muted, onToggle }: SoundToggleProps) {
  return (
    <IconButton
      onClick={onToggle}
      aria-label={muted ? 'Turn sounds on' : 'Mute sounds'}
      title={muted ? 'Turn sounds on' : 'Mute sounds'}
      className="print-hide"
      disableRipple
      sx={{
        position: 'fixed',
        top: { xs: 58, sm: 66 },
        right: { xs: 16, sm: 24 },
        zIndex: 'tooltip',
        width: 38,
        height: 38,
        // Muted via a colour token (not opacity) so the icon keeps >= 4.5:1.
        color: 'text.disabled',
        transition: 'color 200ms ease, transform 200ms ease',
        '&:hover': { color: 'text.primary', bgcolor: 'transparent', transform: 'scale(1.08)' },
        '&:active': { transform: 'scale(0.92)' },
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={muted ? 'off' : 'on'}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          style={{ display: 'inline-flex' }}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </m.span>
      </AnimatePresence>
    </IconButton>
  );
}
