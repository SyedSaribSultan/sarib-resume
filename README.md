# Syed Sarib Sultan — Resume

Personal resume site. Single-page, static, dark/light themed.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **MUI** (`@mui/material`) + **Emotion** for styling
- **motion** for the custom cursor and theme-toggle animation
- Self-hosted **Google Sans Flex** woff2

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # tsc -b && vite build  ->  dist/
npm run preview  # serve the production build locally
```

Requires **Node 20+** (see `engines` in `package.json`).

## Assets

- Resume content lives in [`src/app/components/resume-data.ts`](src/app/components/resume-data.ts).
- Profile photo: `src/imports/Syed_Sarib_Sultan.jpg` (imported, hashed by Vite).
- Static public assets (favicon, OG image): `public/` — served at the site root.

## Deploy

Hosted on **Vercel**, connected to this GitHub repo. Every push to `main`
triggers a production build. Config (framework, build command, output dir,
cache + security headers) is in [`vercel.json`](vercel.json).
