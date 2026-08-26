"use client";
// beui.dev/components/motion/scroll-animation

import { motion, useInView } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { type ReactNode, type RefObject, useRef } from "react";

import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ScrollRevealProps {
  children: ReactNode;
  /** Slide distance in px before reveal. */
  y?: number;
  /** Enter blur in px (kept ≤ 10 per motion conventions). */
  blur?: number;
  /** Reveal duration in seconds. */
  duration?: number;
  delay?: number;
  /** Reveal only once (default) or every time it enters view. */
  once?: boolean;
  /** Portion of the element that must be visible to trigger. */
  amount?: "some" | "all" | number;
  /** Scroll root for contained scroll areas. Defaults to the viewport. */
  root?: RefObject<Element | null>;
  className?: string;
}

export function ScrollReveal({
  children,
  y = 16,
  blur = 8,
  duration = 0.6,
  delay = 0,
  once = true,
  amount = 0.3,
  root,
  className,
}: ScrollRevealProps) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { root, once, amount });

  /*
    Both states must name the same keys. Dropping `y` and `filter` from the
    reduced-motion branch reads as "animate opacity only", but motion treats a
    key that disappears from the target as a value it no longer controls: it
    re-asserts whatever is on screen and never touches it again. Since the
    preference only resolves after hydration, the element has already mounted
    at y=20/blur(6px) by then, and those two would stick there for good —
    permanently blurred headings for exactly the people who asked for calm.
    So the shape stays fixed and only the values change.
  */
  const hidden = {
    opacity: 0,
    y: reduce ? 0 : y,
    filter: reduce ? "blur(0px)" : `blur(${blur}px)`,
  };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={inView ? shown : hidden}
      transition={
        reduce ? { duration: 0 } : { duration, ease: EASE_OUT, delay }
      }
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
