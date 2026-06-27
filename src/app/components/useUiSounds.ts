import { useEffect } from 'react';

// Same set CustomCursor treats as "interactive" — keep them in sync.
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], .MuiChip-root';

// How long to suppress a repeat hover blip for the *same* element. Re-entering
// a different element fires immediately; jittering inside one stays quiet.
const HOVER_DEBOUNCE_MS = 120;

/**
 * Subtle, sleek "clicky" UI sounds on hover + click of interactive elements.
 *
 * Synthesised on the fly with the Web Audio API (no asset files, zero bytes
 * shipped, fully tunable here). Mounted once near the app root; it attaches
 * delegated listeners and needs no per-component wiring.
 *
 * Behaviour / guardrails:
 * - Honours `prefers-reduced-motion: reduce` — fully silent for those users.
 * - Hover blips are gated to fine pointers (no hover concept on touch).
 * - The AudioContext is created lazily on the first real user gesture, so we
 *   never trip the browser autoplay policy (which would log a console warning
 *   and leave the context suspended).
 */
export function useUiSounds() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const finePointer = window.matchMedia?.('(pointer: fine)').matches ?? false;

    const AudioCtx =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return; // no Web Audio support → no-op, never throws

    let ctx: AudioContext | null = null;

    // Create (or resume) the context. Called from inside a gesture handler so
    // it starts in the "running" state instead of "suspended".
    const ensureCtx = (): AudioContext | null => {
      if (!ctx) {
        try {
          ctx = new AudioCtx();
        } catch {
          return null;
        }
      }
      if (ctx.state === 'suspended') void ctx.resume();
      return ctx;
    };

    /**
     * One short oscillator ping with an exponential decay envelope — the fast
     * decay is what gives the "tick"/"clicky" feel rather than a sustained beep.
     */
    const ping = (
      freq: number,
      durationMs: number,
      peakGain: number,
      type: OscillatorType = 'sine',
    ) => {
      const audio = ctx;
      if (!audio || audio.state !== 'running') return;

      const now = audio.currentTime;
      const dur = durationMs / 1000;

      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      // Tiny attack avoids a click-pop at onset; long exponential tail = "clicky".
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(gain).connect(audio.destination);
      osc.start(now);
      osc.stop(now + dur + 0.02);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    };

    // Soft, high, very quiet — barely-there presence on hover.
    const playHover = () => ping(2100, 28, 0.025, 'sine');

    // Two-tone snap: a brief high transient over a quick lower body = "tock".
    const playClick = () => {
      ping(1500, 18, 0.05, 'triangle'); // sharp transient
      ping(820, 55, 0.06, 'sine'); // body
    };

    const isInteractive = (e: Event) =>
      (e.target as Element | null)?.closest?.(INTERACTIVE_SELECTOR) ?? null;

    let lastHoverEl: Element | null = null;
    let lastHoverAt = 0;

    const onOver = (e: MouseEvent) => {
      const el = isInteractive(e);
      if (!el) return;
      const audio = ensureCtx();
      if (!audio) return;
      const now = audio.currentTime * 1000;
      // Same element within the debounce window → stay quiet.
      if (el === lastHoverEl && now - lastHoverAt < HOVER_DEBOUNCE_MS) return;
      lastHoverEl = el;
      lastHoverAt = now;
      playHover();
    };

    const onPointerDown = (e: Event) => {
      if (!isInteractive(e)) return;
      ensureCtx();
      playClick();
    };

    // pointerdown (not click) → fires on press, feels tighter; covers keyboard
    // activation via the separate keydown handler below.
    document.addEventListener('pointerdown', onPointerDown);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const el = (document.activeElement as Element | null)?.closest?.(
        INTERACTIVE_SELECTOR,
      );
      if (!el) return;
      ensureCtx();
      playClick();
    };
    document.addEventListener('keydown', onKeyDown);

    if (finePointer) document.addEventListener('mouseover', onOver);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mouseover', onOver);
      void ctx?.close();
    };
  }, []);
}
