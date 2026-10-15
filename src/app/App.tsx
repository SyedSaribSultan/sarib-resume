import { Suspense, lazy, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  Link,
  Stack,
  Typography,
  createTheme,
  useColorScheme,
} from '@mui/material';
import { ArrowUpRight } from 'lucide-react';
import { MotionConfig } from 'motion/react';
import { Section } from './components/Section';
import { EntryRow } from './components/EntryRow';
import { ThemeToggle } from './components/ThemeToggle';
import { DownloadButton } from './components/DownloadButton';
import { useUiSounds } from './components/useUiSounds';
import { AppThemeProvider } from './components/AppThemeProvider';
import { profile, contacts, experience, skills, volunteering, education } from './components/resume-data';
import profilePhoto from '../imports/Syed_Sarib_Sultan.jpg';

const palettes = {
  light: {
    background: { default: '#fbfbfa', paper: '#ffffff' },
    // disabled darkened from #b7b7af -> #6e6e66 so left-column labels/periods
    // (rendered with text.disabled) clear WCAG AA 4.5:1 on the page background.
    text: { primary: '#1c1c1a', secondary: '#6f6f68', disabled: '#6e6e66' },
    divider: 'rgba(0,0,0,0.08)',
  },
  dark: {
    background: { default: '#121211', paper: '#1a1a18' },
    // disabled lightened from #5b5b54 -> #8c8c83 to clear AA on dark background.
    text: { primary: '#ededea', secondary: '#9a9a91', disabled: '#8c8c83' },
    divider: 'rgba(255,255,255,0.1)',
  },
};

// Must match the pre-paint script in index.html (storage key + attribute).
export const THEME_KEY = 'theme-mode';

// CSS-variable theme: both palettes ship as CSS custom properties and the
// active one is picked by `data-theme` on <html>. The markup is identical in
// light and dark, so the build-time prerender (src/entry-server.tsx) hydrates
// cleanly whatever the visitor's theme is.
const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data-theme' },
  colorSchemes: { light: { palette: palettes.light }, dark: { palette: palettes.dark } },
  typography: { fontFamily: '"Google Sans Flex", sans-serif' },
  shape: { borderRadius: 8 },
});

// The custom cursor is desktop-only, so its code (and motion's spring/drag
// features) is fetched only when a fine pointer is present.
const CustomCursor = lazy(() =>
  import('./components/CustomCursor').then((m) => ({ default: m.CustomCursor })),
);

export default function App() {
  return (
    <AppThemeProvider theme={theme} modeStorageKey={THEME_KEY} defaultMode="system">
      <CssBaseline />
      {/* Honour prefers-reduced-motion for every motion animation. */}
      <MotionConfig reducedMotion="user">
        <Resume />
      </MotionConfig>
    </AppThemeProvider>
  );
}

function Resume() {
  // `mode` is undefined on the server and during hydration, then resolves.
  const { mode, systemMode, setMode } = useColorScheme();
  const resolved = mode === 'system' ? systemMode : mode;

  // Subtle clicky hover/click sounds (synthesised, reduced-motion aware).
  useUiSounds();

  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setFinePointer(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFinePointer(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      {finePointer && (
        <Suspense fallback={null}>
          <CustomCursor />
        </Suspense>
      )}
      <DownloadButton />
      <ThemeToggle
        mode={resolved}
        onToggle={() => setMode(resolved === 'dark' ? 'light' : 'dark')}
      />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          py: { xs: 6, sm: 10 },
          transition: 'background-color 350ms ease',
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 768, px: { xs: 3, sm: 2 } }}>
          {/* Header */}
          <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}>
            <Avatar
              alt={profile.name}
              src={profilePhoto}
              slotProps={{
                img: { width: 96, height: 96, loading: 'eager', decoding: 'async' },
              }}
              sx={{
                width: 96,
                height: 96,
                '& img': { dynamicRangeLimit: 'standard' },
              }}
            />
            <Box>
              <Typography
                component="h1"
                sx={{ fontSize: '1.375rem', lineHeight: 1.15, fontWeight: 500 }}
              >
                {profile.name}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '1rem', mt: 0.5 }}>
                {profile.title} in {profile.location}
              </Typography>
              <Link
                href={profile.siteHref}
                target="_blank"
                rel="noopener"
                underline="none"
                color="text.secondary"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '1rem',
                  mt: 1,
                  px: 1.25,
                  py: 0.25,
                  borderRadius: 999,
                  bgcolor: 'action.hover',
                  transition: 'background-color 150ms ease, color 150ms ease',
                  '&:hover': { bgcolor: 'action.selected', color: 'text.primary' },
                }}
              >
                {profile.site}
              </Link>
            </Box>
          </Stack>

          {/* About */}
          <Section title="About">
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
              {profile.about}
            </Typography>
          </Section>

          {/* Contact */}
          <Section title="Contact">
            <Stack spacing={2}>
              {contacts.map((c) => (
                <Box
                  key={c.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '140px 1fr' },
                    columnGap: 4,
                    alignItems: 'baseline',
                  }}
                >
                  <Typography sx={{ fontSize: '1rem', color: 'text.disabled' }}>{c.label}</Typography>
                  <Link
                    href={c.href}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    color="text.primary"
                    sx={{ fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: 0.5, justifySelf: 'start' }}
                  >
                    {c.value}
                    <ArrowUpRight size={15} style={{ opacity: 0.5 }} />
                  </Link>
                </Box>
              ))}
            </Stack>
          </Section>

          {/* Work Experience */}
          <Section title="Work Experience">
            {experience.map((e) => (
              <EntryRow key={e.id} entry={e} />
            ))}
          </Section>

          {/* Skills & Tools */}
          <Section title="Skills & Tools">
            <Stack spacing={1.75}>
              {skills.map((s) => (
                <Box
                  key={s.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '140px 1fr' },
                    columnGap: 4,
                    rowGap: 0.25,
                  }}
                >
                  <Typography sx={{ fontSize: '1rem', color: 'text.disabled' }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: '1rem', color: 'text.primary', lineHeight: 1.6 }}>
                    {s.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Section>

          {/* Volunteering */}
          <Section title="Volunteering">
            {volunteering.map((e) => (
              <EntryRow key={e.id} entry={e} />
            ))}
          </Section>

          {/* Education */}
          <Section title="Education">
            {education.map((e) => (
              <EntryRow key={e.id} entry={e} />
            ))}
          </Section>

          {/* Footer */}
          {/* The year is prerendered at build time; tolerate a stale one. */}
          <Typography
            suppressHydrationWarning
            sx={{ mt: { xs: 6, sm: 8 }, fontSize: '1rem', color: 'text.disabled' }}
          >
            © {new Date().getFullYear()} {profile.name}
          </Typography>
        </Container>
      </Box>
    </>
  );
}
