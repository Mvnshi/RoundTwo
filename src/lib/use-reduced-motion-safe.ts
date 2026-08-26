import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Hydration-safe reduced-motion preference.
 *
 * Motion's own `useReducedMotion` resolves only on the client, so any component
 * that branches its *rendered output* on it — an `initial` variant, say — emits
 * different markup on the server than on the client and hydration mismatches
 * for exactly the users who asked for less motion.
 *
 * This one is false during SSR and hydration, then takes the real value on the
 * next commit. Two consequences worth knowing before you branch on it:
 *
 * - The element has already mounted in its non-reduced state by the time this
 *   flips, so keep the *shape* of any motion target identical across both
 *   branches. A key that disappears from the target is a value motion stops
 *   controlling, and it stays wherever it happens to be.
 * - Motion's hook is still fine where the value only feeds a `transition` or an
 *   effect, since neither changes the server-rendered markup.
 */
export function useReducedMotionSafe(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
