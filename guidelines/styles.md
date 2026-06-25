# Style system — spacing, layout, responsive (@mui/material v9.1.2)

Material UI styles components with **Emotion** (CSS-in-JS). There is no Tailwind/utility-class
layer and no SCSS to import. You style in three ways, in order of preference:

1. **The `sx` prop** — per-instance overrides on any MUI component. Accepts theme-aware
   shorthands and full CSS.
2. **Layout components** — `Stack`, `Grid`, `Box`, `Container`.
3. **`styled()`** — for reusable custom styled components.

---

## Spacing scale

The spacing unit is **8px**. `theme.spacing(n)` returns `8 × n` px. Numeric values in the
`sx` spacing props are multiplied by this base:

| sx value | Result |
|---|---|
| `0.5` | 4px |
| `1` | 8px |
| `2` | 16px |
| `3` | 24px |
| `4` | 32px |
| `6` | 48px |
| `8` | 64px |

Spacing shorthands in `sx`: `m`, `mt`, `mr`, `mb`, `ml`, `mx`, `my`, `p`, `pt`, `pr`, `pb`,
`pl`, `px`, `py`, and `gap`.

```tsx
<Box sx={{ p: 2, mb: 3 }}>16px padding, 24px bottom margin</Box>
```

The same scale feeds `Stack`/`Grid` `spacing` props: `<Stack spacing={2}>` → 16px gaps.

---

## Layout primitives

### Stack — 1-D flex (preferred for spacing siblings)
```tsx
<Stack spacing={2}>                          {/* vertical, 16px gaps */}
<Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
```
- `direction`, `spacing`, `divider`, plus any flex props via `sx`.
- Responsive: `direction={{ xs: 'column', md: 'row' }}`.
- Use for: form fields, button rows, vertical sections, toolbars.

### Grid — 2-D responsive grid (v9 `size` API)
```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>…</Grid>
</Grid>
```
- 12 columns by default; `size` is the span (number, `'auto'`, `'grow'`, or responsive object).
- Use for: card grids, multi-column page layouts.

### Box — styled `div`
The generic building block when no semantic component fits. All `sx` shorthands apply.

### Container — page width constraint
Centers content with a responsive `maxWidth` (default `lg`). Wrap top-level page content.

```tsx
<Container maxWidth="md"><Stack spacing={4}>…</Stack></Container>
```

**Choosing:** `Container` for page width → `Grid` for column layout → `Stack` for spacing a
group of siblings → `Box` for everything else.

---

## Spacing conventions

| Context | Suggested value |
|---|---|
| Gap between form fields | `spacing={2}` (16px) |
| Gap between page sections | `spacing={4}`–`spacing={6}` (32–48px) |
| Padding inside a Card/Paper | `p: 2`–`p: 3` (16–24px) |
| Button row gap | `spacing={1}`–`spacing={2}` (8–16px) |
| Icon-to-text gap | `gap: 1` (8px) |

---

## Responsive patterns

### Breakpoints
| Key | min-width |
|---|---|
| `xs` | 0px |
| `sm` | 600px |
| `md` | 900px |
| `lg` | 1200px |
| `xl` | 1536px |

### Responsive values in `sx` and layout props
Any `sx` value or layout prop accepts a breakpoint object (mobile-first — each key applies
from that breakpoint up):

```tsx
<Box sx={{ p: { xs: 1, md: 3 }, display: { xs: 'block', md: 'flex' } }} />
<Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} />
<Grid size={{ xs: 12, md: 6 }} />
```

### useMediaQuery / theme breakpoint helpers
For JS-driven responsiveness:

```tsx
import { useMediaQuery, useTheme } from '@mui/material';
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
```

`theme.breakpoints.up(key)`, `.down(key)`, `.between(a, b)`, `.only(key)` generate media queries.

---

## CSS methodology

- **Emotion CSS-in-JS** — styles are scoped automatically; no global class collisions.
- Prefer `sx` for one-offs; promote to `styled()` when reused.

```tsx
import { styled } from '@mui/material/styles';

const Hero = styled('section')(({ theme }) => ({
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));
```

---

## Combining MUI with custom styles

- Read tokens from `theme` inside `sx`/`styled` callbacks so custom elements match the system
  (`theme.spacing`, `theme.palette`, `theme.typography`, `theme.shape.borderRadius`).
- For a plain element, wrap it in `Box` and use `sx` rather than a className + external CSS.
- Use the `component` prop to keep semantics while gaining MUI styling
  (`<Typography component="h1" variant="h4">`).

```tsx
<Box component="section" sx={(t) => ({ p: 3, bgcolor: 'background.paper',
  border: `1px solid ${t.palette.divider}`, borderRadius: 2 })}>…</Box>
```

---

## DO / DON'T

- DO use `Stack`/`Grid` `spacing` and `sx` spacing shorthands (multiples of 8px).
- DO express responsiveness with breakpoint objects (`{ xs, md }`).
- DO read `theme.*` values inside `sx`/`styled` callbacks for custom elements.
- DON'T add Tailwind classes or external CSS files — this system uses Emotion + `sx`.
- DON'T hardcode pixel margins/paddings; use the spacing scale.
- DON'T use the v8 Grid `item`/`xs={...}` props — use `container` + `size`.
