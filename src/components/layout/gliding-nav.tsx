"use client";

import { navItems } from "@/components/layout/nav-links";
import { SharedLayoutBg } from "@/components/motion/shared-layout-bg";

/**
 * Desktop-only nav: one pill glides between items instead of each item drawing
 * its own hover background. Loaded lazily by PrimaryNav — see the note there
 * for why this is never imported statically.
 */
export function GlidingNav() {
  return (
    <SharedLayoutBg
      as="ul"
      inset={0}
      // The component defaults to a vertical sidebar list; these override its
      // flex-direction and full-width for a horizontal nav.
      className="w-auto flex-row items-center gap-1"
      pillClassName="rounded-full bg-secondary"
    >
      {navItems()}
    </SharedLayoutBg>
  );
}
