import { IconButton, Tooltip } from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  mode: 'light' | 'dark';
  onToggle: () => void;
}

export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  const isDark = mode === 'dark';

  return (
    <Tooltip title={isDark ? 'Light mode' : 'Dark mode'} placement="left">
      <IconButton
        onClick={onToggle}
        aria-label="Toggle color mode"
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
      </IconButton>
    </Tooltip>
  );
}
