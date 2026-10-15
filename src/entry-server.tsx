/**
 * Build-time prerender entry (see scripts/prerender.mjs). Renders the resume
 * to static HTML plus the Emotion styles it needs, so the content is in the
 * initial HTML for crawlers, ATS parsers and no-JS visitors. main.tsx then
 * hydrates the same markup.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';
import App from './app/App';

export function render(): { html: string; styles: string } {
  // Same key as Emotion's default client cache, so hydration reuses these tags.
  const cache = createCache({ key: 'css' });
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);
  const html = renderToString(
    <StrictMode>
      <CacheProvider value={cache}>
        <App />
      </CacheProvider>
    </StrictMode>,
  );
  return { html, styles: constructStyleTagsFromChunks(extractCriticalToChunks(html)) };
}
