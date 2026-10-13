// Renders dist/resume.pdf from the built site's `?print` layout (PrintResume.tsx).
// Runs after `vite build`, so the PDF always matches resume-data.ts.
//
// Browser: on Vercel / Linux CI, @sparticuz/chromium (a headless Chromium that
// runs on Amazon Linux). Locally, your installed Chrome, or set CHROME_PATH.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { preview } from 'vite';
import puppeteer from 'puppeteer-core';

const OUT = 'dist/resume.pdf';

const LOCAL_CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

async function launch() {
  const local = LOCAL_CHROME.find((p) => existsSync(p));
  if (local && !process.env.VERCEL) {
    return puppeteer.launch({ executablePath: local, headless: true });
  }
  const { default: chromium } = await import('@sparticuz/chromium');
  return puppeteer.launch({
    executablePath: await chromium.executablePath(),
    args: chromium.args,
    headless: true,
  });
}

const server = await preview({ preview: { port: 4317, strictPort: false, open: false }, logLevel: 'warn' });
const url = server.resolvedUrls?.local[0];
if (!url) throw new Error('vite preview did not report a URL');

const browser = await launch();
try {
  const page = await browser.newPage();
  await page.goto(`${url}?print`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
  writeFileSync(OUT, pdf);
} finally {
  await browser.close();
  await server.close();
}

const pages = (readFileSync(OUT, 'latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
console.log(`resume.pdf: ${pages} page${pages === 1 ? '' : 's'}`);
if (pages !== 1) {
  // Not fatal: a two-page PDF still ships, but it should be trimmed back to one.
  console.warn('WARNING: resume.pdf is not one page. Tighten PrintResume.tsx or trim content.');
}
