# Tokens & theming — @mui/material (v9.1.2)

Material UI's design tokens live in the **theme object**, not in CSS files. Tokens are
consumed three ways:

1. **`sx` prop string shortcuts** — `color="primary"`, `bgcolor="background.paper"`,
   `sx={{ color: 'text.secondary' }}`.
2. **Theme callback in `sx`/`styled`** — `sx={(theme) => ({ color: theme.palette.error.main })}`.
3. **`useTheme()` hook** — `const theme = useTheme(); theme.palette.primary.main`.

A default theme is always present even without a `ThemeProvider`. To customize tokens,
wrap the app in `ThemeProvider` with a theme from `createTheme(...)` (see `setup.md`).

> DO reference semantic tokens (`primary.main`, `text.secondary`). DON'T paste raw hex/rgb
> values into components — they bypass theming and dark mode.

---

## Color tokens — `theme.palette`

### Intent colors
Each intent has `main`, `light`, `dark`, and `contrastText` (text color to use on top of it).

| Token | Meaning | sx shortcut |
|---|---|---|
| `palette.primary.{main,light,dark,contrastText}` | brand / primary actions | `color="primary"` |
| `palette.secondary.*` | secondary accent | `color="secondary"` |
| `palette.error.*` | errors, destructive | `color="error"` |
| `palette.warning.*` | warnings | `color="warning"` |
| `palette.info.*` | informational | `color="info"` |
| `palette.success.*` | success / confirmation | `color="success"` |

These are the values accepted by the `color` prop on `Button`, `Chip`, `Alert` (via
`severity`), `TextField`, etc.

### Text colors — `palette.text`
| Token | Use |
|---|---|
| `text.primary` | default body text |
| `text.secondary` | de-emphasized / captions |
| `text.disabled` | disabled text |

```tsx
<Typography color="text.secondary">Subtle label</Typography>
```

### Background — `palette.background`
| Token | Use |
|---|---|
| `background.default` | page background |
| `background.paper` | raised surfaces (cards, menus, dialogs) |

### Action states — `palette.action`
State-layer colors applied to interactive surfaces (usually automatic, occasionally referenced directly):
`action.active`, `action.hover`, `action.selected`, `action.disabled`, `action.focus`.

### Neutrals & dividers
- `palette.grey` — full grey ramp: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, A100, A200, A400, A700`.
- `palette.divider` — divider/border line color.

### Channel tokens
Each palette color also exposes `mainChannel`, `lightChannel`, `darkChannel`,
`contrastTextChannel` (space-separated RGB) for composing translucent colors:
`rgba(var(--mui-palette-primary-mainChannel) / 0.5)` style usage with CSS variables enabled.

---

## Typography tokens — `theme.typography`

### Global settings
| Token | Default |
|---|---|
| `typography.fontFamily` | `"Roboto", "Helvetica", "Arial", sans-serif` |
| `typography.fontSize` | `14` (base, px) |
| `typography.htmlFontSize` | `16` |
| `typography.fontWeightLight` | `300` |
| `typography.fontWeightRegular` | `400` |
| `typography.fontWeightMedium` | `500` |
| `typography.fontWeightBold` | `700` |

> Roboto is the default font but is **not** bundled. Import it (see `setup.md`) or override
> `typography.fontFamily` in `createTheme`, or text will fall back to Helvetica/Arial.

### Variant presets
Each is a full type style (size/weight/line-height/letter-spacing). Apply via
`<Typography variant="…">`:

| Variant | Role |
|---|---|
| `h1`–`h6` | headings, largest → smallest |
| `subtitle1`, `subtitle2` | subheadings |
| `body1` | default body (≈1rem) |
| `body2` | smaller body (≈0.875rem) |
| `button` | button label (uppercase by default) |
| `caption` | fine print |
| `overline` | small uppercase label |

---

## Shadow / elevation tokens — `theme.shadows`

`theme.shadows` is an array of **25 levels** (index `0`–`24`). Index `0` is `'none'`; higher
indices are deeper shadows. Consumed via the `Paper`/`Card` `elevation` prop or
`sx={{ boxShadow: 3 }}`.

```tsx
<Paper elevation={4}>…</Paper>
<Box sx={{ boxShadow: 2 }}>…</Box>   {/* number indexes theme.shadows */}
```

---

## Border & radius tokens — `theme.shape`

| Token | Default | Use |
|---|---|---|
| `shape.borderRadius` | `4` (px) | base corner radius for surfaces |

`sx={{ borderRadius: 2 }}` multiplies the base (→ 8px). Border color → `palette.divider`.
Focus rings are rendered automatically by interactive components (`ButtonBase` ripple +
`:focus-visible` outline).

---

## z-index tokens — `theme.zIndex`

Layering scale for overlays: `mobileStepper`, `fab`, `speedDial`, `appBar`, `drawer`,
`modal`, `snackbar`, `tooltip` (ascending). Reference these instead of magic numbers when
stacking custom overlays.

---

## Theming (light / dark)

### v9 — color schemes
`createTheme` supports `colorSchemes` for built-in light/dark with CSS variables:

```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
});

<ThemeProvider theme={theme} defaultMode="system">
  <CssBaseline />
  {children}
</ThemeProvider>
```

- `CssBaseline` applies the palette's `background.default`/`text.primary` to `<body>` and
  normalizes browser styles. Include it once at the root.
- For the simple single-mode case: `createTheme({ palette: { mode: 'dark' } })`.
- With `colorSchemes`, MUI emits CSS custom properties prefixed `--mui-` (e.g.
  `--mui-palette-primary-main`) that you can reference in raw CSS if needed.

### Customizing tokens

```tsx
const theme = createTheme({
  palette: {
    primary: { main: '#6750A4' },
    background: { default: '#faf9fd' },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: '"Inter", sans-serif' },
});
```

---

## DO / DON'T

- DO use `color="primary"`, `bgcolor="background.paper"`, `color="text.secondary"` shortcuts.
- DO read tokens via `theme.palette.*` / `theme.typography.*` in `sx` callbacks and `styled`.
- DO render `<CssBaseline />` once so background/text tokens reach the page.
- DON'T hardcode hex colors, px font sizes, or box-shadow strings — use tokens.
- DON'T assume Roboto renders without importing the font (`setup.md`).
