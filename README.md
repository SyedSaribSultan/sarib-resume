# Sarib's CV

Personal resume site for **Syed Sarib Sultan** — a single-page, static, dark/light
themed CV. Live at **https://sarib-resume.vercel.app**.

---

## Stack

| Layer    | Choice                                                            |
| -------- | ---------------------------------------------------------------- |
| Build    | [Vite](https://vitejs.dev) 5                                      |
| UI       | React 18 + TypeScript                                             |
| Styling  | [MUI](https://mui.com) (`@mui/material` v6) + Emotion (CSS-in-JS) |
| Motion   | [`motion`](https://motion.dev) — custom cursor + theme toggle    |
| Icons    | [`lucide-react`](https://lucide.dev)                             |
| Font     | Self-hosted Google Sans Flex (woff2)                              |
| Hosting  | Vercel (Git-connected, auto-deploy on push to `main`)            |

There is no router and no backend — it's a static SPA. All content is data-driven
from a single TypeScript file.

---

## Project layout

```
.
├── index.html                # Head: meta, OG/Twitter, JSON-LD, favicon, FOUC script
├── public/                   # Served at site root, copied verbatim into dist/
│   ├── favicon.png
│   ├── apple-touch-icon.png
│   ├── og.png                # 1200×630 social share card
│   ├── robots.txt            # Allows search + AI crawlers; points to sitemap
│   ├── sitemap.xml
│   └── llms.txt              # Plain-text profile for LLM crawlers (AI readability)
├── src/
│   ├── main.tsx              # React entry; mounts <App>, imports fonts.css
│   ├── app/
│   │   ├── App.tsx           # Layout, theme/palette, header, all <Section>s
│   │   └── components/
│   │       ├── resume-data.ts      # ⭐ ALL content + types (generated — see below)
│   │       ├── Section.tsx         # Section heading + spacing wrapper
│   │       ├── EntryRow.tsx        # One experience/education/volunteer entry
│   │       ├── ThemeToggle.tsx     # Top-right light/dark toggle
│   │       ├── CustomCursor.tsx    # Dot + lagging ring (fine pointers only)
│   │       └── AppThemeProvider.tsx# MUI ThemeProvider wrapper
│   ├── styles/
│   │   ├── fonts.css               # @font-face for Google Sans Flex
│   │   └── *.woff2                 # The font files
│   └── imports/
│       └── Syed_Sarib_Sultan.jpg   # Profile photo (EXIF-stripped, 384px)
├── vercel.json               # Framework, build, cache + security headers
├── vite.config.ts            # Plugins + manual vendor chunk splitting
└── tsconfig.json
```

---

## Editing content

**All resume content lives in
[`src/app/components/resume-data.ts`](src/app/components/resume-data.ts)** —
profile, contacts, experience, skills, volunteering, education. The React app
imports and renders it; the components are generic and never hardcode copy.

Edit `resume-data.ts` directly. The types (`ResumeEntry`, `Role`, `SkillGroup`,
etc.) are defined at the top of the file and enforce the structure of each entry —
TypeScript will flag a malformed entry at build time (`npm run build`).

Each experience/volunteering/education entry supports optional `bullets` (string
list), `sections` (labeled paragraphs), `roles` (sub-positions with their own
timeline), and `href` (makes the title a link).

---

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # tsc -b && vite build  ->  dist/
npm run preview    # serve the production build locally
```

Requires **Node 20+** (pinned via `engines` in `package.json`).

---

## Theming

- Light/dark palettes are defined in [`App.tsx`](src/app/components/../App.tsx)
  (`palettes`). Text colors meet **WCAG AA 4.5:1** contrast on their backgrounds.
- The user's choice is stored in `localStorage` (`theme-mode`) and otherwise
  follows the OS `prefers-color-scheme`.
- An inline script in `index.html` paints the correct background **before React
  mounts**, so dark-mode users never see a light flash (FOUC).

---

## Assets & images

- The profile photo is **EXIF-stripped** (GPS/device metadata removed) and resized
  to 384px before commit — it displays at 96px. Keep it small; Vite hashes and
  emits it into `dist/assets/`.
- Favicon, apple-touch-icon, and the OG image live in `public/` (NOT `dist/` —
  `dist/` is wiped and rebuilt on every Vercel deploy).

---

## Deploy (Vercel)

Connected to this GitHub repo. **Every push to `main` triggers a production build.**
All config is in [`vercel.json`](vercel.json):

- Framework `vite`, build `npm run build`, output `dist`
- SPA rewrite that excludes `/assets/`
- `Cache-Control: immutable` (1 year) on hashed `/assets/*`
- Security headers: CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`

> **Domain note:** absolute URLs (OG image, canonical, JSON-LD, sitemap, robots,
> llms.txt) are hardcoded to `https://sarib-resume.vercel.app`. If the domain
> changes, update those references across `index.html` and `public/`.

---

## SEO & AI readability

- **Meta**: title, description, Open Graph + Twitter cards, canonical, theme-color.
- **JSON-LD `Person` schema** in `index.html` — gives search engines and AI
  crawlers structured facts (name, role, employer, education, skills, socials).
- **`robots.txt`** explicitly allows search and AI crawlers (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended) and points to the sitemap.
- **`llms.txt`** — a plain-text profile summary for LLM crawlers, so AI answers
  about "Syed Sarib Sultan" stay accurate.

To preview share cards: [opengraph.xyz](https://www.opengraph.xyz) or
[metatags.io](https://metatags.io). Platforms cache OG data hard — use their
debuggers (LinkedIn Post Inspector, Facebook Sharing Debugger) to force a re-scrape.
