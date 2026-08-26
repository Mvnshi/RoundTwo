import { useSyncExternalStore } from "react";

/** Never changes, so React never needs to re-subscribe. */
const subscribe = () => () => {};

/**
 * False on the server and through the hydration render, true immediately
 * after. Uses `useSyncExternalStore` rather than a state-setting effect, which
 * the React Compiler rightly rejects and which would cost an extra render.
 *
 * Use it to hold back anything that would misbehave before the page is
 * interactive — a submit button whose click would otherwise fall through to a
 * native form post.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
