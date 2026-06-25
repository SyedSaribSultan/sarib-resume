# Component usage — @mui/material (v9.1.2)

Material UI is a React component library styled with Emotion. Every component accepts the
`sx` prop for one-off style overrides (see `styles.md`) and most accept a `component` prop
to change the rendered root element. Colors referenced by props (`primary`, `secondary`,
`error`, `warning`, `info`, `success`) resolve to palette tokens documented in `tokens.md`.

## Import pattern

Always use named imports from the package root. Each component also has a deep path, but the
root barrel is the canonical form:

```tsx
import { Button, TextField, Stack, Typography } from '@mui/material';
```

For icons, see `icon-discovery.md` — do **not** import named icons from `@mui/material`.

---

## Layout

### Box
General-purpose `div` wrapper with the `sx` prop. Use for ad-hoc layout/styling.

```tsx
import { Box } from '@mui/material';
<Box sx={{ p: 2, display: 'flex', gap: 1, bgcolor: 'background.paper' }}>…</Box>
```

### Container
Centers content horizontally with a responsive max-width.

| Prop | Type | Notes |
|---|---|---|
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false` | breakpoint cap; default `'lg'` |
| `fixed` | `boolean` | width pinned to the current breakpoint min |
| `disableGutters` | `boolean` | removes horizontal padding |

### Stack
One-dimensional flex layout. Preferred primitive for spacing children. See `styles.md`.

| Prop | Type | Notes |
|---|---|---|
| `direction` | `'row' \| 'row-reverse' \| 'column' \| 'column-reverse'` (responsive) | default `'column'` |
| `spacing` | number \| string (responsive) | gap = `spacing × 8px` |
| `divider` | ReactNode | element rendered between children |

```tsx
<Stack direction="row" spacing={2} alignItems="center">…</Stack>
```

### Grid
Two-dimensional responsive grid (v9 API — `size`, not `xs`/`md` props).

| Prop | Type | Notes |
|---|---|---|
| `container` | boolean | marks a grid container |
| `size` | number \| `'auto'` \| `'grow'` \| `{ xs, sm, md, lg, xl }` | column span out of 12 (responsive) |
| `spacing` | number (responsive) | gap between items |
| `columns` | number (responsive) | total columns; default `12` |
| `offset` | number \| responsive object | leading empty columns |

```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6 }}>Left</Grid>
  <Grid size={{ xs: 12, md: 6 }}>Right</Grid>
</Grid>
```

> DON'T use the old `<Grid item xs={6}>` API — this is v9, which uses `size`.

### Paper
Elevated surface. Foundation for cards/menus.

| Prop | Type | Notes |
|---|---|---|
| `elevation` | number `0–24` | shadow depth; default `1` |
| `variant` | `'elevation' \| 'outlined'` | outlined uses a border instead of shadow |
| `square` | boolean | removes border radius |

### Divider
Thin rule. `orientation="vertical"`, `flexItem`, `textAlign`, and `children` (label) supported.

---

## Navigation

### AppBar + Toolbar
Top app bar. Compose `AppBar` > `Toolbar` > content.

- `AppBar`: `position` = `'fixed' \| 'absolute' \| 'sticky' \| 'static' \| 'relative'`; `color` = `'default' \| 'inherit' \| 'primary' \| 'secondary' \| 'transparent'`.

```tsx
<AppBar position="static">
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>Title</Typography>
    <Button color="inherit">Login</Button>
  </Toolbar>
</AppBar>
```

### Tabs + Tab
Controlled by `value`/`onChange` on `Tabs`; each `Tab` has a `value` + `label`.

| `Tabs` prop | Type |
|---|---|
| `value` | any (controlled) |
| `onChange` | `(e, value) => void` |
| `variant` | `'standard' \| 'scrollable' \| 'fullWidth'` |
| `orientation` | `'horizontal' \| 'vertical'` |
| `centered` | boolean |

```tsx
const [tab, setTab] = React.useState(0);
<Tabs value={tab} onChange={(_, v) => setTab(v)}>
  <Tab label="One" /><Tab label="Two" />
</Tabs>
```

### Drawer
Side panel. `anchor` = `'left' \| 'right' \| 'top' \| 'bottom'`; `variant` = `'temporary' \| 'persistent' \| 'permanent'`. Controlled with `open`/`onClose`. `SwipeableDrawer` adds touch swipe (needs `onOpen` too).

### Breadcrumbs
Wraps `Link`/`Typography` children; `separator` prop customizes the divider.

### Menu / MenuItem / MenuList
`Menu` is an anchored popover. Controlled with `open`, `anchorEl`, `onClose`.

```tsx
<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={close}>
  <MenuItem onClick={close}>Profile</MenuItem>
</Menu>
```

### Pagination
`count`, `page`, `onChange`, `color`, `variant` (`'text' \| 'outlined'`), `shape` (`'circular' \| 'rounded'`).

### BottomNavigation + BottomNavigationAction
Mobile bottom bar. `BottomNavigation` is controlled via `value`/`onChange`; actions take `label` and `icon`.

### Link
Styled anchor. `underline` = `'none' \| 'hover' \| 'always'`; `color`; accepts `component` for router links.

---

## Data Entry

### Button
| Prop | Type | Default |
|---|---|---|
| `variant` | `'text' \| 'outlined' \| 'contained'` | `'text'` |
| `color` | `'inherit' \| 'primary' \| 'secondary' \| 'success' \| 'error' \| 'info' \| 'warning'` | `'primary'` |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `disabled` | boolean | `false` |
| `disableElevation` | boolean | `false` |
| `fullWidth` | boolean | `false` |
| `startIcon` / `endIcon` | ReactNode | — |
| `loading` | boolean | `null` |
| `loadingPosition` | `'start' \| 'end' \| 'center'` | `'center'` |
| `href` | string | renders an `<a>` |

`variant="contained"` → filled brand button (primary action). `outlined` → bordered/transparent (secondary). `text` → no border (tertiary).

```tsx
<Button variant="contained" startIcon={<SaveIcon />}>Save</Button>
<Button variant="outlined" color="error">Delete</Button>
```

> DON'T put a raw `<button>` with Tailwind classes — use `Button`.

### IconButton
Icon-only button. Props: `color`, `size` (`'small' \| 'medium' \| 'large'`), `edge` (`'start' \| 'end' \| false`), `disabled`. Children = an icon element.

### Fab
Floating action button. `variant` = `'circular' \| 'extended'`; `color`; `size`.

### ButtonGroup
Groups buttons. `variant`, `color`, `size`, `orientation`, `disableElevation`, `fullWidth`.

### TextField
The all-in-one input (wraps label, input, helper text). Controlled (`value`/`onChange`) or uncontrolled (`defaultValue`).

| Prop | Type | Default |
|---|---|---|
| `variant` | `'outlined' \| 'filled' \| 'standard'` | `'outlined'` |
| `label` | ReactNode | — |
| `size` | `'small' \| 'medium'` | `'medium'` |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'info' \| 'success' \| 'warning'` | `'primary'` |
| `type` | HTML input type | `'text'` |
| `error` | boolean | `false` |
| `helperText` | ReactNode | — |
| `required` / `disabled` / `fullWidth` / `multiline` | boolean | `false` |
| `select` | boolean | renders a Select; combine with `<MenuItem>` children |
| `rows` / `minRows` / `maxRows` | number | for `multiline` |

```tsx
<TextField label="Email" type="email" value={v} onChange={e => setV(e.target.value)}
           error={!!err} helperText={err} fullWidth />
```

### Select / NativeSelect
Use `TextField select` for the common case. For standalone, compose `FormControl` > `InputLabel` > `Select` > `MenuItem`. `Select` is controlled via `value`/`onChange`; `multiple` supported.

### Checkbox / Radio / Switch
Controlled via `checked`/`onChange` (or `defaultChecked`). Props: `color`, `size`, `disabled`. Wrap with `FormControlLabel` to add a label.

```tsx
<FormControlLabel control={<Checkbox checked={c} onChange={e => setC(e.target.checked)} />} label="Agree" />
```

`RadioGroup` (controlled via `value`/`onChange`) wraps multiple `Radio` `FormControlLabel`s. `FormGroup` groups checkboxes.

### Form scaffolding
- `FormControl` — context wrapper (`error`, `disabled`, `required`, `fullWidth`, `size`, `variant`).
- `FormLabel`, `InputLabel`, `FormHelperText`, `FormControlLabel`, `FormGroup`.
- Raw inputs: `Input`, `OutlinedInput`, `FilledInput`, `InputBase`, `InputAdornment`, `TextareaAutosize`.

### Autocomplete
Combobox. Key props: `options`, `value`/`onChange`, `inputValue`/`onInputChange`, `multiple`, `freeSolo`, `getOptionLabel`, `renderInput` (required — render a `TextField`).

```tsx
<Autocomplete options={opts} renderInput={(p) => <TextField {...p} label="Pick" />} />
```

### Slider
`value`/`onChange` (or `defaultValue`), `min`, `max`, `step`, `marks`, `valueLabelDisplay`, `orientation`.

### Rating
`value`/`onChange`, `max` (default 5), `precision`, `readOnly`, `size`.

### ToggleButton / ToggleButtonGroup
`ToggleButtonGroup` is controlled via `value`/`onChange`; `exclusive` for single-select. Each `ToggleButton` has a `value`.

---

## Data Display

### Typography
Render text with semantic variants. See `tokens.md` for the scale.

| Prop | Type |
|---|---|
| `variant` | `'h1'…'h6' \| 'subtitle1' \| 'subtitle2' \| 'body1' \| 'body2' \| 'button' \| 'caption' \| 'overline' \| 'inherit'` |
| `align` | `'inherit' \| 'left' \| 'center' \| 'right' \| 'justify'` |
| `color` | palette token or `'text.primary'`, `'text.secondary'`, etc. |
| `gutterBottom` | boolean |
| `noWrap` | boolean |
| `component` | override rendered element |

```tsx
<Typography variant="h4" gutterBottom>Heading</Typography>
<Typography variant="body2" color="text.secondary">Caption text</Typography>
```

### Card family
Compose `Card` > `CardHeader` / `CardMedia` / `CardContent` / `CardActions`. `CardActionArea` makes a region clickable.

```tsx
<Card>
  <CardMedia component="img" image={img} alt="" height={160} />
  <CardContent><Typography variant="h6">Title</Typography></CardContent>
  <CardActions><Button size="small">Action</Button></CardActions>
</Card>
```

### List family
`List` > `ListItem` / `ListItemButton` > `ListItemIcon` / `ListItemAvatar` / `ListItemText` / `ListItemSecondaryAction`. `ListSubheader` for section headers. `ListItemText` takes `primary` and `secondary`.

### Table family
`TableContainer` (often `component={Paper}`) > `Table` > `TableHead` / `TableBody` / `TableFooter` with `TableRow` > `TableCell`. `TableCell` `align` and `padding` props. `TablePagination`, `TableSortLabel` for sorting headers.

### Avatar / AvatarGroup / Badge / Chip
- `Avatar`: `src`, `alt`, `variant` (`'circular' \| 'rounded' \| 'square'`); children = initials/icon.
- `Badge`: `badgeContent`, `color`, `variant` (`'standard' \| 'dot'`), `overlap`, `anchorOrigin`.
- `Chip`: `label`, `variant` (`'filled' \| 'outlined'`), `color`, `size`, `onDelete`, `icon`, `avatar`, `clickable`.

### Accordion
`Accordion` > `AccordionSummary` (`expandIcon`) > `AccordionDetails`. Controlled via `expanded`/`onChange`.

### Tooltip
Wraps a single child. `title` (required), `placement`, `arrow`. Child must forward refs.

```tsx
<Tooltip title="Delete"><IconButton><DeleteIcon /></IconButton></Tooltip>
```

### ImageList
`ImageList` (`cols`, `rowHeight`, `gap`, `variant`) > `ImageListItem` > `img` + optional `ImageListItemBar`.

### Stepper
`Stepper` (`activeStep`, `orientation`, `alternativeLabel`) > `Step` > `StepLabel` / `StepContent` / `StepButton`.

---

## Feedback

### Alert / AlertTitle
`severity` = `'error' \| 'warning' \| 'info' \| 'success'`; `variant` = `'standard' \| 'filled' \| 'outlined'`; `onClose`, `action`, `icon`.

```tsx
<Alert severity="success"><AlertTitle>Done</AlertTitle>Saved successfully.</Alert>
```

### Snackbar / SnackbarContent
Transient bottom message. Controlled via `open`/`onClose`; `autoHideDuration`, `anchorOrigin`, `message`, `action`. Often wraps an `Alert`.

### CircularProgress / LinearProgress
`variant` = `'determinate' \| 'indeterminate'`; `value` (0–100 for determinate); `color`; `size`/`thickness` (circular).

### Skeleton
Loading placeholder. `variant` = `'text' \| 'circular' \| 'rectangular' \| 'rounded'`; `width`, `height`, `animation`.

### Backdrop
Dimmed overlay. `open`; children (e.g. a spinner).

---

## Overlay

### Dialog
Modal. Compose `Dialog` > `DialogTitle` > `DialogContent` (+ `DialogContentText`) > `DialogActions`.

| `Dialog` prop | Type |
|---|---|
| `open` | boolean (required) |
| `onClose` | `(e, reason) => void` |
| `fullWidth` | boolean |
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false` |
| `fullScreen` | boolean |
| `scroll` | `'paper' \| 'body'` |

```tsx
<Dialog open={open} onClose={close} fullWidth maxWidth="sm">
  <DialogTitle>Confirm</DialogTitle>
  <DialogContent><DialogContentText>Are you sure?</DialogContentText></DialogContent>
  <DialogActions>
    <Button onClick={close}>Cancel</Button>
    <Button variant="contained" onClick={confirm}>OK</Button>
  </DialogActions>
</Dialog>
```

### Modal / Popover / Popper
- `Modal`: low-level base for custom dialogs (`open`, `onClose`).
- `Popover`: anchored surface (`open`, `anchorEl`, `anchorOrigin`, `transformOrigin`).
- `Popper`: unstyled positioning primitive.

### SpeedDial
`SpeedDial` (`open`, `onOpen`, `onClose`, `icon`, `direction`) > `SpeedDialAction` children.

### Transitions
`Fade`, `Grow`, `Slide`, `Zoom`, `Collapse` — wrap a child and toggle with `in`.

---

## Controlled vs. uncontrolled summary

| Pattern | Components |
|---|---|
| Controlled (`value`/`checked` + `onChange`) | TextField, Select, Checkbox, Radio, Switch, Slider, Rating, Tabs, Autocomplete, ToggleButtonGroup, RadioGroup, Pagination |
| Uncontrolled (`defaultValue`/`defaultChecked`) | TextField, Checkbox, Radio, Switch, Slider, Autocomplete |
| Open-state controlled (`open` + `onClose`) | Dialog, Modal, Drawer, Menu, Popover, Snackbar, SpeedDial, Backdrop, Tooltip |

## DO / DON'T

- DO import from the `@mui/material` root barrel.
- DO use the `sx` prop for one-off overrides instead of inline `style`.
- DO use `Stack`/`Grid` for spacing instead of manual margins.
- DON'T use the v8 Grid `item`/`xs` props — use `size`.
- DON'T hand-roll buttons, inputs, cards, dialogs — a MUI component exists for each.
- DON'T import icon names from `@mui/material` — see `icon-discovery.md`.
