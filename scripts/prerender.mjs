// Prerenders the resume into dist/index.html after `vite build`, so the page
// content is in the initial HTML (crawlers, ATS parsers, no-JS visitors).
// The client bundle (src/main.tsx) hydrates this markup.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

const OUT = 'node_modules/.prerender';
const INDEX = 'dist/index.html';

await build({
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: OUT,
    emptyOutDir: true,
    // Assets (the avatar) are already in dist/ with the same content hash.
    copyPublicDir: false,
  },
  // Bundle everything so Node never has to resolve MUI/Emotion's CJS/ESM mix.
  ssr: { noExternal: true },
});

const { render } = await import(pathToFileURL(`${OUT}/entry-server.js`).href);
const { html, styles } = render();
rmSync(OUT, { recursive: true, force: true });

const page = readFileSync(INDEX, 'utf8');
if (!page.includes('<div id="root"></div>')) throw new Error(`${INDEX}: empty #root not found`);
writeFileSync(
  INDEX,
  page
    .replace('</head>', `${styles}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`),
);
console.log(`prerendered ${INDEX}: ${(html.length / 1024).toFixed(1)} KB markup`);
