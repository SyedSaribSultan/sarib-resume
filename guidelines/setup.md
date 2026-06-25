```json
{
  "dependencies": {
    "@mui/material": "9.1.2"
  }
}
```

## Peer dependencies (styling engine)

`@mui/material` is styled with Emotion and requires these peers, which are already present in
this project's `package.json`:

- `@emotion/react` (11.14.0)
- `@emotion/styled` (11.14.1)

No additional CSS file from `@mui/material` needs to be imported — styles are injected at
runtime by Emotion. There is no global stylesheet to add.

## Font (Roboto)

The default theme uses **Roboto**, which is not bundled. Add the font import to the top of
`src/styles/fonts.css` (the only file where font imports belong):

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
```

Alternatively, override `typography.fontFamily` in `createTheme` to use a different font.

## Provider configuration (optional but recommended)

A default theme applies even with no provider. To customize tokens or enable dark mode, wrap
the app once at the root and include `CssBaseline` to apply background/text tokens and
normalize browser styles:

```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  colorSchemes: { light: true, dark: true }, // optional dark mode
  // palette, typography, shape overrides here
});

export default function Root({ children }) {
  return (
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

See `tokens.md` for the full token/theming reference.

## Icons

`@mui/icons-material` is **not** installed. Use the already-installed `lucide-react` for
icons. See `icon-discovery.md`.