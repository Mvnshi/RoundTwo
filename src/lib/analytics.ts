/**
 * One analytics entry point for the whole site.
 *
 * Every destination is optional: with no IDs configured `track` is a no-op and
 * nothing extra is loaded. Components never talk to gtag/fbq/posthog directly.
 */

import { getAttribution } from "@/lib/attribution";

export const analyticsEvents = [
  "hero_cta_clicked",
  "secondary_cta_clicked",
  "recovery_calculator_started",
  "recovery_calculator_completed",
  "audit_form_opened",
  "audit_form_started",
  "audit_form_submitted",
  "booking_clicked",
  "faq_opened",
] as const;

export type AnalyticsEvent = (typeof analyticsEvents)[number];

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

type Gtag = (command: "event" | "config" | "js", ...args: unknown[]) => void;
type Fbq = ((command: "track" | "trackCustom" | "init", ...args: unknown[]) => void) & {
  loaded?: boolean;
};
type PostHog = { capture: (event: string, props?: AnalyticsProps) => void };

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
    posthog?: PostHog;
    dataLayer?: unknown[];
  }
}

export const analyticsConfig = {
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
} as const;

/**
 * Meta's standard events are the ones its optimiser understands; everything
 * else is sent as a custom event so nothing is silently dropped.
 */
const META_STANDARD_EVENT: Partial<Record<AnalyticsEvent, string>> = {
  audit_form_submitted: "Lead",
  audit_form_opened: "InitiateCheckout",
  booking_clicked: "Schedule",
};

function compact(props?: AnalyticsProps): AnalyticsProps {
  if (!props) return {};
  return Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined && value !== ""),
  );
}

export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (typeof window === "undefined") return;

  const payload = compact(props);

  try {
    window.gtag?.("event", event, payload);
  } catch {
    /* never let a broken tag break the page */
  }

  try {
    const standard = META_STANDARD_EVENT[event];
    if (standard) window.fbq?.("track", standard, payload);
    else window.fbq?.("trackCustom", event, payload);
  } catch {
    /* ignore */
  }

  try {
    window.posthog?.capture(event, { ...payload, ...getAttribution() });
  } catch {
    /* ignore */
  }

  if (process.env.NODE_ENV === "development") {
    // Makes the event taxonomy verifiable locally without any vendor set up.
    console.debug(`[analytics] ${event}`, payload);
  }
}
