import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  Link,
  Stack,
  Typography,
  createTheme,
} from '@mui/material';
import { ArrowUpRight } from 'lucide-react';
import { Section } from './components/Section';
import { EntryRow } from './components/EntryRow';
import { ThemeToggle } from './components/ThemeToggle';
import { DownloadButton } from './components/DownloadButton';
import { CustomCursor } from './components/CustomCursor';
import { useUiSounds } from './components/useUiSounds';
import { AppThemeProvider } from './components/AppThemeProvider';
import { profile, contacts, experience, skills, volunteering, education } from './components/resume-data';
import profilePhoto from '../imports/Syed_Sarib_Sultan.jpg';

const palettes = {
  light: {
    mode: 'light' as const,
    background: { default: '#fbfbfa', paper: '#ffffff' },
    // disabled darkened from #b7b7af -> #6e6e66 so left-column labels/periods
    // (rendered with text.disabled) clear WCAG AA 4.5:1 on the page background.
    text: { primary: '#1c1c1a', secondary: '#6f6f68', disabled: '#6e6e66' },
    divider: 'rgba(0,0,0,0.08)',
  },
  dark: {
    mode: 'dark' as const,
    background: { default: '#121211', paper: '#1a1a18' },
    // disabled lightened from #5b5b54 -> #8c8c83 to clear AA on dark background.
    text: { primary: '#ededea', secondary: '#9a9a91', disabled: '#8c8c83' },
    divider: 'rgba(255,255,255,0.1)',
  },
};

const THEME_KEY = 'theme-mode';

function getStoredMode(): 'light' | 'dark' | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(THEME_KEY);
  return v === 'light' || v === 'dark' ? v : null;
}

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const stored = getStoredMode();
    if (stored) return stored;
    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });
  // Stored choice overrides system; once set it persists across reloads.
  const [userOverride, setUserOverride] = useState(() => getStoredMode() !== null);

  // Subtle clicky hover/click sounds (synthesised, reduced-motion aware).
  useUiSounds();

  useEffect(() => {
    if (userOverride) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setMode(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [userOverride]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: palettes[mode],
        typography: { fontFamily: '"Google Sans Flex", sans-serif' },
        shape: { borderRadius: 8 },
      }),
    [mode],
  );

  return (
    <AppThemeProvider theme={theme}>
      <CssBaseline />
      <CustomCursor />
      <DownloadButton />
      <ThemeToggle
        mode={mode}
        onToggle={() => {
          setUserOverride(true);
          setMode((m) => {
            const next = m === 'light' ? 'dark' : 'light';
            window.localStorage.setItem(THEME_KEY, next);
            return next;
          });
        }}
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
          <Typography sx={{ mt: { xs: 6, sm: 8 }, fontSize: '1rem', color: 'text.disabled' }}>
            © {new Date().getFullYear()} {profile.name}
          </Typography>
        </Container>
      </Box>
    </AppThemeProvider>
  );
}
