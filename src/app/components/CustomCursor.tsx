import { useEffect, useState } from 'react';
import { GlobalStyles, useTheme } from '@mui/material';
import { motion, useMotionValue, useSpring } from 'motion/react';

// Soft, sleek (non-bouncy) physics for the lagging ring.
const RING_SPRING = { stiffness: 220, damping: 28, mass: 0.6 } as const;
// Reduced-motion: effectively instant (no perceptible lag).
const SNAP_SPRING = { stiffness: 1000, damping: 60, mass: 0.2 } as const;

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], .MuiChip-root';

function useMediaQuery(query: string, initial = false): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && 'matchMedia' in window
      ? window.matchMedia(query).matches
      : initial,
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function CustomCursor() {
  const theme = useTheme();
  const color = theme.palette.text.primary;

  const finePointer = useMediaQuery('(pointer: fine)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [hovering, setHovering] = useState(false);

  // Raw pointer position — start offscreen to avoid a flash at (0,0).
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ring lags behind via spring (or snap when reduced motion).
  const ringSpring = reducedMotion ? SNAP_SPRING : RING_SPRING;
  const ringX = useSpring(mouseX, ringSpring);
  const ringY = useSpring(mouseY, ringSpring);

  // Track raw pointer position (1:1 for the inner dot).
  useEffect(() => {
    if (!finePointer) return;
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [finePointer, mouseX, mouseY]);

  // Hover detection via event delegation (catches MUI Link/Chip/IconButton).
  useEffect(() => {
    if (!finePointer) return;
    const matchTarget = (e: MouseEvent) =>
      (e.target as Element | null)?.closest?.(INTERACTIVE_SELECTOR) ?? null;
    const onOver = (e: MouseEvent) => {
      if (matchTarget(e)) setHovering(true);
    };
    const onOut = (e: MouseEvent) => {
      if (matchTarget(e)) setHovering(false);
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [finePointer]);

  // No custom cursor on touch / coarse pointers — native cursor stays intact.
  // Also treat reduced-motion as an opt-out: keep the native cursor and all its
  // affordances (text, pointer, etc.) for users who ask for less motion.
  if (!finePointer || reducedMotion) return null;

  const RING_SIZE = 15;
  const DOT_SIZE = 6;

  return (
    <>
      {/* Hide the native cursor only while the custom one is active. */}
      <GlobalStyles
        styles={{
          'html, body, *': { cursor: 'none !important' },
          'input, textarea, select, [contenteditable="true"]': {
            cursor: 'auto !important',
          },
        }}
      />

      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2147483647,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Outer ring — lags softly; the "smooth" sensation.
            SVG + non-scaling-stroke keeps the stroke a constant thinness
            at any scale (normal + expanded). */}
        <motion.svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'visible',
            x: ringX,
            y: ringY,
            translateX: '-50%',
            translateY: '-50%',
            willChange: 'transform',
          }}
          initial={false}
          animate={{
            scale: hovering ? 1.8 : 1,
            opacity: hovering ? 0.7 : 0.55,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_SIZE / 2 - 0.5}
            fill="none"
            stroke={color}
            strokeWidth={0.75}
            vectorEffect="non-scaling-stroke"
          />
        </motion.svg>

        {/* Inner dot — tracks 1:1, instant. Precise & responsive. */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderRadius: '50%',
            backgroundColor: color,
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
            willChange: 'transform',
          }}
          initial={false}
          animate={{
            scale: hovering ? 0.5 : 1,
            opacity: hovering ? 0.5 : 0.9,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        />
      </div>
    </>
  );
}
