/**
 * Captures paid-traffic attribution once per browser session and keeps it
 * available for the lead form. Never throws: storage can be unavailable
 * (private mode, embedded webviews) and attribution is best-effort.
 */

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export const CLICK_ID_KEYS = ["gclid", "fbclid", "msclkid", "ttclid", "li_fat_id"] as const;

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  ttclid?: string;
  li_fat_id?: string;
  landingUrl?: string;
  landingPath?: string;
  referrer?: string;
  firstSeenAt?: string;
};

const STORAGE_KEY = "rt.attribution";
const MAX_VALUE_LENGTH = 512;

function safeSession(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

function clean(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().slice(0, MAX_VALUE_LENGTH);
  return trimmed.length > 0 ? trimmed : undefined;
}

function readFromUrl(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const next: Attribution = {};

  for (const key of UTM_KEYS) {
    const value = clean(params.get(key));
    if (value) next[key] = value;
  }
  for (const key of CLICK_ID_KEYS) {
    const value = clean(params.get(key));
    if (value) next[key] = value;
  }

  next.landingUrl = clean(window.location.href);
  next.landingPath = clean(window.location.pathname + window.location.search);
  next.referrer = clean(document.referrer);
  next.firstSeenAt = new Date().toISOString();

  return next;
}

function hasCampaignSignal(attribution: Attribution): boolean {
  return [...UTM_KEYS, ...CLICK_ID_KEYS].some((key) => Boolean(attribution[key]));
}

/**
 * Run once on mount. Keeps the first touch of the session unless a newer
 * visit arrives carrying campaign parameters, which then wins.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  const incoming = readFromUrl();
  const storage = safeSession();
  const existing = getAttribution();

  const shouldReplace =
    Object.keys(existing).length === 0 ||
    (hasCampaignSignal(incoming) && !sameCampaign(existing, incoming));

  const resolved = shouldReplace ? incoming : existing;

  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(resolved));
  } catch {
    /* storage unavailable — attribution stays in-memory for this render */
  }

  return resolved;
}

function sameCampaign(a: Attribution, b: Attribution): boolean {
  return [...UTM_KEYS, ...CLICK_ID_KEYS].every((key) => a[key] === b[key]);
}

export function getAttribution(): Attribution {
  const storage = safeSession();
  if (!storage) return {};
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Attribution) : {};
  } catch {
    return {};
  }
}
