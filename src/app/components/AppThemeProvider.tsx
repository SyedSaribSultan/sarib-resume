import { createElement, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, type Theme } from '@mui/material';

interface AppThemeProviderProps {
  theme: Theme;
  children: ReactNode;
}

/**
 * Wraps MUI's ThemeProvider in a plain function component and renders it via
 * `createElement` instead of JSX. MUI's ThemeProvider strictly validates its
 * props and warns about unknown ones; the preview inspector injects `data-fg-*`
 * attributes onto every JSX element. Routing through this wrapper lets those
 * injected props land on a permissive function component instead of reaching
 * MUI's ThemeProvider.
 */
export function AppThemeProvider({ theme, children }: AppThemeProviderProps) {
  return createElement(MuiThemeProvider, { theme }, children);
}
