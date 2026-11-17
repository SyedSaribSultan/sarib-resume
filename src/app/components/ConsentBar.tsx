import { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { OPEN_CONSENT_EVENT, readConsent, saveConsent, type ConsentChoice } from '../../consent';

/**
 * The consent bar: one quiet line at the bottom of the first visit, same copy and behaviour as syedsarib.com.
 * It never returns once a choice is saved, unless the footer's "Cookie choices" link asks for it. Client-only
 * (renders nothing in the prerender). print-hide keeps it out of the PDF.
 */
export function ConsentBar() {
  const [isMounted, setIsMounted] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const focusOnShowRef = useRef(false);

  useEffect(() => {
    const show = (focus: boolean) => {
      focusOnShowRef.current = focus;
      setIsMounted(true);
      // Next frame, so the rise-in transition has a start state to leave.
      requestAnimationFrame(() => requestAnimationFrame(() => setIsShown(true)));
    };
    if (readConsent() === null) show(false);
    const onOpen = () => show(true);
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (isShown && focusOnShowRef.current) {
      focusOnShowRef.current = false;
      acceptRef.current?.focus();
    }
  }, [isShown]);

  const choose = async (choice: ConsentChoice) => {
    setIsShown(false);
    // No transition runs under reduced motion, so nothing would end it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setIsMounted(false);
    // Same singleton the analytics chunk initialised; a separate chunk so PostHog stays off the main bundle.
    const { default: posthog } = await import('posthog-js');
    saveConsent(posthog, choice, 'resume');
  };

  if (!isMounted) return null;

  return (
    <Box
      role="region"
      aria-label="Cookie choices"
      inert={!isShown}
      className="print-hide"
      onTransitionEnd={(event) => {
        if (!isShown && event.target === event.currentTarget) setIsMounted(false);
      }}
      sx={{
        position: 'fixed',
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 'tooltip',
        mx: 'auto',
        maxWidth: 560,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { sm: 'center' },
        gap: { xs: 1.5, sm: 2 },
        p: 2,
        pr: { sm: 1.5 },
        py: { sm: 1.5 },
        borderRadius: 2.5,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        transition: 'opacity 200ms ease, translate 200ms ease',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        opacity: isShown ? 1 : 0,
        translate: isShown ? '0 0' : '0 8px',
        pointerEvents: isShown ? 'auto' : 'none',
      }}
    >
      <Typography sx={{ flex: 1, fontSize: '0.9375rem', lineHeight: 1.5, color: 'text.secondary' }}>
        Can I use cookies and session replays to learn how people use this site?
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: { xs: 'flex-end', sm: 'auto' } }}>
        <Button
          color="inherit"
          size="small"
          onClick={() => void choose('declined')}
          sx={{ color: 'text.secondary', textTransform: 'none' }}
        >
          No thanks
        </Button>
        <Button
          ref={acceptRef}
          variant="contained"
          disableElevation
          size="small"
          onClick={() => void choose('accepted')}
          sx={{
            textTransform: 'none',
            bgcolor: 'text.primary',
            color: 'background.default',
            '&:hover': { bgcolor: 'text.secondary' },
          }}
        >
          Accept
        </Button>
      </Box>
    </Box>
  );
}

/** Footer link that reopens the bar. */
export function CookieChoicesLink() {
  return (
    <Typography
      component="button"
      type="button"
      className="print-hide"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      sx={{
        font: 'inherit',
        fontSize: '1rem',
        p: 0,
        border: 0,
        bgcolor: 'transparent',
        color: 'text.disabled',
        cursor: 'pointer',
        textDecoration: 'underline',
        textUnderlineOffset: 3,
        '&:hover': { color: 'text.primary' },
      }}
    >
      Cookie choices
    </Typography>
  );
}
