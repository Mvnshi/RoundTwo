import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * Hydration-safe reduced-motion preference.
 *
 * Motion's own `useReducedMotion` resolves only on the client, so any component
 * that branches its *rendered output* on it — an `initial` variant, say — emits
 * different markup on the server than on the client and hydration mismatches
 * for exactly the users who asked for less motion.
 *
 * `useSyncExternalStore` fixes this properly: React uses the server snapshot
 * during hydration too, so the first paint agrees on both sides, and the real
 * value takes over on the very next commit.
 *
 * Motion's hook is still fine where the value only feeds a `transition` or an
 * effect, since neither changes the server-rendered markup.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
