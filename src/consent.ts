import type { PostHog, PostHogConfig } from 'posthog-js';

/*
 * Analytics consent, same behaviour as syedsarib.com (src/lib/consent.ts there; spec in
 * ../analytics/TRACKING.md). Until a visitor accepts, PostHog runs cookieless: memory persistence (a fresh
 * anonymous id each page load), no person profiles, no session replay. Accepting turns on the shared setup.
 * The choice lives in this site's localStorage, never in a cookie. Kept free of runtime posthog imports so
 * the consent bar does not pull PostHog into the main bundle.
 */

export type ConsentChoice = 'accepted' | 'declined';

const STORAGE_KEY = 'analytics-consent';
/** Fired by the footer's "Cookie choices" link to reopen the bar. */
export const OPEN_CONSENT_EVENT = 'consent:open';

export const COOKIELESS_CONFIG = {
  persistence: 'memory',
  person_profiles: 'never',
  disable_session_recording: true,
} satisfies Partial<PostHogConfig>;

export const FULL_CONFIG = {
  persistence: 'localStorage+cookie',
  person_profiles: 'always', // a profile for every visitor who said yes
  disable_session_recording: false,
} satisfies Partial<PostHogConfig>;

export function readConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'accepted' || value === 'declined' ? value : null;
  } catch {
    return null;
  }
}

export function configFor(choice: ConsentChoice | null): Partial<PostHogConfig> {
  return choice === 'accepted' ? FULL_CONFIG : COOKIELESS_CONFIG;
}

/* Saves the choice and switches the running PostHog over without a reload. Withdrawing a yes also drops the
   stored id, so the next events can't be tied back to the old cookie. */
export function saveConsent(ph: PostHog, choice: ConsentChoice, site: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* private mode: the choice just lasts for this page */
  }
  try {
    const wasAccepted = ph.config.persistence !== 'memory';
    if (choice === 'declined' && wasAccepted) {
      ph.stopSessionRecording();
      ph.reset();
    }
    ph.set_config(configFor(choice));
    ph.register({ site });
  } catch {
    /* PostHog not started yet: init reads the saved choice */
  }
  // Tells the shared add-on (plus.js): on a yes it names a pending ?via link and sends the full profile.
  (window as unknown as { __saribConsentGranted?: boolean }).__saribConsentGranted = choice === 'accepted';
  window.dispatchEvent(new Event('saribconsent'));
}
