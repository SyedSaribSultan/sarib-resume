# Icon discovery & usage

## Important: @mui/material does not ship a named-icon set

`@mui/material` exports only icon **primitives**, not a library of named icons:

- `SvgIcon` — wraps an SVG so it inherits MUI sizing (`fontSize`) and color tokens.
- `Icon` — renders a ligature/font icon by text (requires a separate icon font; not set up here).

MUI's companion icon package, **`@mui/icons-material`, is NOT installed** in this project.
Do not import named icons such as `import { Delete } from '@mui/icons-material'` — that import
will fail.

## Use `lucide-react` for icons (installed & verified)

`lucide-react` **is installed** (v0.487.0) and is the icon source for this project. It pairs
cleanly with MUI.

```tsx
import { Bell, ChevronDown, Trash2 } from 'lucide-react';

<Bell />
<IconButton><Trash2 /></IconButton>
<Button startIcon={<ChevronDown />}>More</Button>
```

To make a lucide icon adopt MUI's `fontSize`/`color` token system, wrap it in `SvgIcon` via
the `component` prop:

```tsx
import { SvgIcon } from '@mui/material';
import { Bell } from 'lucide-react';

<SvgIcon component={Bell} color="primary" fontSize="small" inheritViewBox />
```
`SvgIcon` props: `fontSize` = `'inherit' | 'small' | 'medium' | 'large'`,
`color` = `'inherit' | 'action' | 'disabled' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'`.
Pass `inheritViewBox` when wrapping a third-party icon so its viewBox is kept.

## Export naming convention (lucide-react)

Named exports are **PascalCase**, derived from the kebab-case file name. Real examples:

| File name | Export name |
|---|---|
| `bell.js` | `Bell` |
| `chevron-down.js` | `ChevronDown` |
| `trash-2.js` | `Trash2` |
| `a-arrow-down.js` | `AArrowDown` |
| `alarm-clock-check.js` | `AlarmClockCheck` |

Rule: split the file name on `-`, capitalize each segment, join. Numbers stay attached
(`trash-2` → `Trash2`).

## File naming convention

`kebab-case.js`, one icon per file (e.g. `chevron-down.js`, `alarm-clock-check.js`).

## Available sizes / modifiers

There are **no size or style suffixes** in lucide file names — a single 24×24 line set.
Control size at usage time via the `size` prop (`<Bell size={20} />`) or, when wrapped in
`SvgIcon`, via `fontSize`. Color via the `color` prop or `currentColor` inheritance.

## Icon directory location

```
node_modules/lucide-react/dist/esm/icons/
```
(The barrel of all export names is `node_modules/lucide-react/dist/esm/icons/index.js`.)

## How to find icons at code-generation time

This directory is large (well over 1000 icon files, plus `.map` files). Search it carefully:

- When searching for icons, locate the icon folder and use targeted Glob patterns with
  keywords (e.g. `*chevron*`, `*bell*`). Before listing or searching any directory, first
  check the number of entries (e.g. `ls <dir> | wc -l`). If there are more than ~50 files,
  narrow your search pattern or use `head` to limit results. Never dump hundreds of filenames
  or Grep results into your context — large tool results persist and bloat every subsequent
  turn.
- Do NOT use Grep to search icon file contents — icon filenames are descriptive, so Glob on
  filenames is sufficient.
- Do NOT list an entire large directory without first checking its size. If you get a result
  with hundreds of lines, you have made a mistake.

Practical recipe:

```
Glob: node_modules/lucide-react/dist/esm/icons/*chevron*.js
```
Take a matching kebab file name, convert to PascalCase, and import it from `lucide-react`.
Verify the file exists before importing — do NOT guess icon names.

## Alternative: installing @mui/icons-material

If MUI-native Material Symbols are explicitly required, install `@mui/icons-material` (it must
match the `@mui/material` major version, `^9`) and re-verify its export names against its own
files before use. Otherwise prefer the already-installed `lucide-react`.
