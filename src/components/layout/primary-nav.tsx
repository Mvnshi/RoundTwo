"use client";

import dynamic from "next/dynamic";

import { navItems } from "@/components/layout/nav-links";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * The nav ships as plain anchors and only upgrades to the gliding pill once we
 * know we are on a screen wide enough to show it.
 *
 * SiteHeader lives in the root layout, so anything it imports statically lands
 * in the first-load bundle of *every* route — measured at +147kB for the pill's
 * motion dependency on /blog, /privacy and /terms, where the nav is
 * `hidden lg:block` and a touch device could never trigger the hover anyway.
 * Loading it behind the same breakpoint that displays it keeps that weight off
 * the routes and devices that cannot use it, and off the critical path on the
 * ones that can.
 */
const GlidingNav = dynamic(
  () => import("@/components/layout/gliding-nav").then((m) => m.GlidingNav),
  { ssr: false, loading: () => <PlainNav /> },
);

function PlainNav() {
  return (
    <ul className="flex w-auto flex-row items-center gap-1">
      {navItems({ hoverBackground: true })}
    </ul>
  );
}

export function PrimaryNav() {
  // False on the server and through hydration, so the plain nav is what ships
  // in the HTML and what narrow screens keep.
  const isWideScreen = useMediaQuery("(min-width: 64rem)");

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      {isWideScreen ? <GlidingNav /> : <PlainNav />}
    </nav>
  );
}
