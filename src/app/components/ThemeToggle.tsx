import { Box, IconButton } from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  /** Resolved mode; undefined while prerendered / hydrating. */
  mode: 'light' | 'dark' | undefined;
  onToggle: () => void;
}

export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  const isDark = mode === 'dark';

  return (
    <IconButton
      onClick={onToggle}
      aria-label={
        mode === undefined ? 'Toggle color theme' : isDark ? 'Switch to light mode' : 'Switch to dark mode'
      }
      className="print-hide"
      disableRipple
      sx={{
        position: 'fixed',
        top: { xs: 16, sm: 24 },
        right: { xs: 16, sm: 24 },
        zIndex: 'tooltip',
        width: 38,
        height: 38,
        color: 'text.secondary',
        opacity: 0.55,
        transition: 'opacity 200ms ease, color 200ms ease, transform 200ms ease',
        '&:hover': { opacity: 1, color: 'text.primary', bgcolor: 'transparent', transform: 'scale(1.08)' },
        '&:active': { transform: 'scale(0.92)' },
      }}
    >
      {mode === undefined ? (
        // Prerendered HTML can't know the visitor's theme, so ship both icons
        // and let the `data-theme` attribute (set before paint) pick one.
        <>
          <Box component="span" sx={{ display: 'inline-flex', '[data-theme="dark"] &': { display: 'none' } }}>
            <Sun size={18} />
          </Box>
          <Box component="span" sx={{ display: 'none', '[data-theme="dark"] &': { display: 'inline-flex' } }}>
            <Moon size={18} />
          </Box>
        </>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={mode}
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            style={{ display: 'inline-flex' }}
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </motion.span>
        </AnimatePresence>
      )}
    </IconButton>
  );
}
