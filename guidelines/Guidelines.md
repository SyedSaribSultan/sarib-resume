# Design system: @mui/material (v9.1.2)

This project uses **Material UI** (`@mui/material`), a React component library styled with
Emotion (CSS-in-JS). Tokens live in the theme object and are consumed via the `sx` prop,
`styled()`, and `useTheme()` — there is no Tailwind/utility-class layer for design-system
styling. Use MUI components for all UI elements; only build custom components when no MUI
component fits, and style them with `theme` tokens for consistency.

## Reading order

Always read first:
- `Guidelines.md` — this file; the main hub and entry point
- `setup.md` — required project configuration, providers, and CSS imports
- `tokens.md` — foundational design tokens (color, typography, spacing)

Read on-demand:
- `components.md` — read BEFORE using any design-system component
- `icon-discovery.md` — read BEFORE using any icons
- `styles.md` — read when building page layouts or applying custom spacing

## Companion guideline files

These files live alongside `Guidelines.md` in the `/guidelines/` directory. Consult each for
its focus area when building UIs with this design system.

| File | Focus |
|---|---|
| `components.md` | Component imports, props/API surfaces, variants, composition patterns, and usage examples |
| `icon-discovery.md` | Icon naming convention, import path, available sizes, and how to search for icons |
| `tokens.md` | Design tokens, color/typography/shadow/border tokens, theming, and CSS custom properties |
| `styles.md` | Spacing scales, layout primitives, responsive patterns, and CSS methodology |
| `setup.md` | Project setup instructions, provider configuration, required CSS imports, and peer dependency requirements |

### Before using an icon
1. Check `icon-discovery.md` for available icons
2. Do NOT guess icon names — verify the icon exists first
3. If an icon doesn't exist, pick a different one and verify

## Verifying icons

IMPORTANT: Consult `icon-discovery.md` for how to search for icons and verify they exist. Do NOT guess icon names.

---

**Add your own guidelines here**
<!--