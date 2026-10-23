import posthog from 'posthog-js';

/*
 * PostHog for every syedsarib.com site. Config is the shared one from
 * ../analytics/snippet/posthog-init.js (spec: ../analytics/TRACKING.md); only
 * `site` changes per site. Events go through our proxy e.syedsarib.com, which
 * the CSP in vercel.json allows. Not called on the `?print` route, so the PDF
 * render at build time sends nothing.
 */
export function initAnalytics() {
  try {
    posthog.init('phc_sui4roRPYQyGvFR8m3zYSxaX4DLDfjs8YeTuyJKZydkP', {
      api_host: 'https://e.syedsarib.com', // our managed proxy: ad blockers don't drop events
      ui_host: 'https://eu.posthog.com',
      defaults: '2026-08-30',
      person_profiles: 'always', // a profile for every visitor, not only signed-in ones
      cross_subdomain_cookie: true, // one visitor = one person across every *.syedsarib.com site
      enable_heatmaps: true,
      capture_performance: { web_vitals: true },
      session_recording: { maskAllInputs: true }, // typed text is never recorded
      loaded: (ph) => {
        ph.register({ site: 'resume' });
        // Personal links: ?via=<name> names this visitor (unless they're already signed in), then leaves the URL clean.
        try {
          const u = new URL(location.href);
          const via = (u.searchParams.get('via') || '').trim().toLowerCase().slice(0, 60);
          if (via) {
            if (ph.get_property('$user_state') !== 'identified') ph.identify('via:' + via, { name: via, via });
            else ph.setPersonProperties({ via });
            ph.capture('via_link_opened', { via });
            u.searchParams.delete('via');
            history.replaceState(history.state, '', u.pathname + (u.search || '') + u.hash);
          }
        } catch {
          /* never let analytics break the page */
        }
      },
    });
  } catch {
    return;
  }

  // Downloads: the PDF link (any <a> to /resume.pdf) and the browser's own print.
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
  window.addEventListener('beforeprint', () => posthog.capture('resume_downloaded', { method: 'print' }));

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
  if (href.startsWith('tel:')) return 'phone';
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
