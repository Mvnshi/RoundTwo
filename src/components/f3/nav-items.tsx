"use client";

import { SharedLayoutBg } from "@/components/motion/shared-layout-bg";

/**
 * One pill glides between items instead of four independent hover
 * backgrounds. The list items are passed as direct children because
 * SharedLayoutBg clones them to attach the pill — wrapping them in a component
 * would hand it one opaque child and the pill would never mount.
 */
export function navItems(items: ReadonlyArray<{ href: string; label: string }>) {
  return (
    <SharedLayoutBg
      as="ul"
      inset={0}
      // The component defaults to a vertical sidebar list; these override its
      // flex-direction and full-width for a horizontal nav.
      className="w-auto flex-row items-center gap-1"
      pillClassName="rounded-full bg-secondary"
    >
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            className="block rounded-full px-3.5 py-2 text-[0.9375rem] text-foreground/75 transition-colors hover:text-foreground"
          >
            {item.label}
          </a>
        </li>
      ))}
    </SharedLayoutBg>
  );
}
