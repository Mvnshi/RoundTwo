import { useSyncExternalStore } from "react";

/**
 * Hydration-safe media query.
 *
 * A `matchMedia` result only exists on the client, so reading it during render
 * makes the server and client disagree about the markup. `useSyncExternalStore`
 * takes a server snapshot too: both sides render the `false` branch, and the
 * real value arrives on the commit straight after hydration.
 *
 * Because the server always sees `false`, write queries so that `false` is the
 * safe, smaller-footprint answer — "is this a large screen", not "is this
 * small".
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return () => {};
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
