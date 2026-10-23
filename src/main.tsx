import { StrictMode, Suspense, lazy } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './app/App';
import './styles/fonts.css';

// `?print` renders the decoupled print-only layout used to generate
// dist/resume.pdf — kept out of the normal user-facing flow and its bundle.
const isPrint = new URLSearchParams(window.location.search).has('print');
const root = document.getElementById('root')!;
// PostHog loads in its own chunk so it never delays the resume's first paint.
const initAnalytics = () => void import('./analytics').then((m) => m.initAnalytics());

if (isPrint) {
  // Drop the prerendered page and its styles; the print layout is standalone.
  document.querySelectorAll('style[data-emotion]').forEach((el) => el.remove());
  root.textContent = '';
  const PrintResume = lazy(() =>
    import('./app/components/PrintResume').then((m) => ({ default: m.PrintResume })),
  );
  createRoot(root).render(
    <StrictMode>
      <Suspense fallback={null}>
        <PrintResume />
      </Suspense>
    </StrictMode>,
  );
} else if (root.hasChildNodes()) {
  initAnalytics();
  // Production: index.html already holds the prerendered resume.
  hydrateRoot(
    root,
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  // `npm run dev` serves the bare index.html.
  initAnalytics();
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
