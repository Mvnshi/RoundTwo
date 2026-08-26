import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Leaf module shared by both nav variants. It deliberately imports nothing
 * heavier than `cn`, so the plain nav stays free of the gliding nav's
 * dependencies.
 */
export const NAV_LINK_CLASS =
  "block rounded-full px-3.5 py-2 text-[0.9375rem] text-foreground/75 transition-colors hover:text-foreground";

/**
 * A plain function, not a component, so callers spread real <li> elements into
 * their list. SharedLayoutBg clones its direct children to attach the pill; a
 * component element would absorb the whole list into one opaque child and the
 * pill would never mount.
 */
export function navItems({ hoverBackground = false } = {}) {
  return navLinks.map((link) => (
    <li key={link.href}>
      <a
        href={link.href}
        className={cn(NAV_LINK_CLASS, hoverBackground && "hover:bg-secondary/70")}
      >
        {link.label}
      </a>
    </li>
  ));
}
