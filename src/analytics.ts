import posthog from 'posthog-js';
import { configFor, readConsent } from './consent';

/*
 * PostHog for every syedsarib.com site. Config is the shared one from
 * ../analytics/snippet/posthog-init.js (spec: ../analytics/TRACKING.md); only
 * `site` changes per site. Events go through our proxy e.syedsarib.com, which
 * the CSP in vercel.json allows. Not called on the `?print` route, so the PDF
 * render at build time sends nothing.
 * Consent (consent.ts): cookieless, no profiles and no replay until the visitor accepts in the consent bar;
 * then the full shared setup. plus.js holds back IP lookups and ?via naming until then too.
 */
export function initAnalytics() {
  const w = window as unknown as { __saribConsentMode?: boolean; __saribConsentGranted?: boolean };
  w.__saribConsentMode = true;
  w.__saribConsentGranted = readConsent() === 'accepted';
  try {
    posthog.init('phc_sui4roRPYQyGvFR8m3zYSxaX4DLDfjs8YeTuyJKZydkP', {
      api_host: 'https://e.syedsarib.com', // our managed proxy: ad blockers don't drop events
      ui_host: 'https://eu.posthog.com',
      defaults: '2026-08-30',
      cross_subdomain_cookie: true, // once accepted, one visitor = one person across every *.syedsarib.com site
      enable_heatmaps: true,
      capture_performance: { web_vitals: true },
      session_recording: { maskAllInputs: true }, // typed text is never recorded
      ...configFor(readConsent()),
      loaded: (ph) => {
        ph.register({ site: 'resume' });
        // Add-on (../analytics/TRACKING.md): personal links (?via=), machine, network, human and time-on-page
        // signals, from one shared file. It names each browser that opens a ?via link on its own.
        try {
          (window as unknown as { posthog: unknown }).posthog = ph;
          const s = document.createElement('script');
          s.src = 'https://analytics.syedsarib.com/t/plus.v1.js';
          s.integrity = 'sha384-1s2AAFu4eJGpYiqxssEydytEhNuvWm4Oo+tOZ/7tmk2OBvmgxSH1z/qLGEwSPe0g'; // frozen copy; see ../analytics/TRACKING.md
          s.crossOrigin = 'anonymous';
          s.async = true;
          document.head.appendChild(s);
        } catch {
          /* never let analytics break the page */
        }
      },
    });
  } catch {
    return;
  }

  // Downloads: the PDF link (any <a> to /resume.pdf). The browser's print dialog is its own event,
  // resume_print_opened: beforeprint also fires for a preview that is then cancelled, so it is not a download.
  // Outbound: contact and company links, labelled by kind, never the full URL.
  document.addEventListener(
    'click',
    (event) => {
      const href = (event.target instanceof Element && event.target.closest('a')?.getAttribute('href')) || '';
      if (/\/resume\.pdf$/.test(href)) {
        posthog.capture('resume_downloaded', { method: 'pdf' });
        return;
      }
      const target = outboundTarget(href);
      if (target) posthog.capture('outbound_clicked', { target });
    },
    { capture: true },
  );
  window.addEventListener('beforeprint', () => posthog.capture('resume_print_opened'));

  // section_viewed once per section, when it crosses the middle of the viewport.
  const seen = new Set<string>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const section = (entry.target as HTMLElement).dataset.section;
        if (!entry.isIntersecting || !section || seen.has(section)) continue;
        seen.add(section);
        posthog.capture('section_viewed', { section });
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el));
}

function outboundTarget(href: string): string | null {
  if (href.startsWith('mailto:')) return 'email';
  let host: string;
  try {
    host = new URL(href, location.href).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
  if (host === location.hostname) return null;
  if (host.endsWith('linkedin.com')) return 'linkedin';
  if (host.endsWith('github.com')) return 'github';
  if (host === 'syedsarib.com') return 'portfolio';
  return host;
}
