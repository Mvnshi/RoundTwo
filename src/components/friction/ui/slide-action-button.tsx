"use client";
// beui.dev/components/motion/expanding-arrow-button

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { EASE_OUT, SPRING_LAYOUT, SPRING_PRESS } from "@/lib/ease";
import { TOUCH_GESTURE_CLASS, TOUCH_GESTURE_CONTENT_CLASS } from "@/lib/touch";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

export interface SlideActionButtonProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children: ReactNode;
  completeLabel?: ReactNode;
  threshold?: number;
  resetDelay?: number;
  onComplete?: () => void;
  thumbClassName?: string;
  fillClassName?: string;
}

export function SlideActionButton({
  children,
  completeLabel = "Complete",
  threshold = 0.82,
  resetDelay = 1200,
  onComplete,
  thumbClassName,
  fillClassName,
  className,
  ...rest
}: SlideActionButtonProps) {
// Local adaptation: motion's `useReducedMotion` resolves only on the client,
// and this component branches its *first paint* on it — the fill's initial
// style and whether the wave is mounted at all. The server therefore emitted
// the non-reduced markup and the client rendered the reduced markup, which is
// a hydration mismatch. This hook reads false through hydration and takes the
// real value on the next commit, so both sides agree.
  const reduce = useReducedMotionSafe();
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLButtonElement>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedRef = useRef(false);
  const x = useMotionValue(0);
  const [maxDistance, setMaxDistance] = useState(0);
  const [completed, setCompleted] = useState(false);
  const safeDistance = Math.max(maxDistance, 1);
  const dragProgress = useTransform(x, [0, safeDistance], [0, 1]);
  const fillProgress = useTransform(x, [0, safeDistance], [0, 1]);
  const labelOpacity = useTransform(
    x,
    [0, safeDistance * 0.35, safeDistance * 0.65],
    [1, 0.75, 0],
  );
  const iconPath = useTransform(
    dragProgress,
    [0, 0.5, 1],
    [
      "M 8 5 L 15 12 L 8 19",
      "M 7 8 L 12 14 L 17 10",
      "M 5 12 L 10 17 L 19 7",
    ],
  );

  useLayoutEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const measure = () => {
      setMaxDistance(Math.max(track.clientWidth - thumb.clientWidth - 8, 0));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(thumb);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [],
  );

  const moveTo = (target: number) => {
    if (reduce) {
      x.set(target);
      return;
    }
    animate(x, target, SPRING_LAYOUT);
  };

  const reset = () => {
    completedRef.current = false;
    setCompleted(false);
    moveTo(0);
  };

  const complete = () => {
    if (completedRef.current || maxDistance === 0) return;
    completedRef.current = true;
    setCompleted(true);
    moveTo(maxDistance);
    onComplete?.();

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(reset, resetDelay);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    complete();
  };

  return (
    <div
      ref={trackRef}
      className={cn(
        // Local adaptation: square, and on this site's tokens.
        "relative h-16 w-full max-w-80 overflow-hidden border border-ink bg-panel p-1",
        "",
        // The track only carries the label — the slide starts on the thumb,
        // which suppresses selection for the whole gesture on its own.
        TOUCH_GESTURE_CONTENT_CLASS,
        className,
      )}
      {...rest}
    >
      <motion.span
        aria-hidden="true"
        style={{ scaleX: fillProgress }}
        className={cn(
          "absolute inset-0 origin-left bg-hazard will-change-transform",
          fillClassName,
        )}
      />

      <motion.span
        aria-hidden="true"
        style={{ opacity: labelOpacity }}
        className="fr-label pointer-events-none absolute inset-0 grid place-items-center pl-10 text-ink"
      >
        {children}
      </motion.span>

      <motion.span
        aria-live="polite"
        animate={{ opacity: completed ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.15, ease: EASE_OUT }}
        className="fr-label pointer-events-none absolute inset-0 grid place-items-center text-paper"
      >
        {completed ? completeLabel : null}
      </motion.span>

      <motion.button
        ref={thumbRef}
        type="button"
        aria-label={typeof children === "string" ? children : "Slide action"}
        drag={completed ? false : "x"}
        dragConstraints={{ left: 0, right: maxDistance }}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={() => {
          if (x.get() >= maxDistance * threshold) complete();
          else moveTo(0);
        }}
        onKeyDown={handleKeyDown}
        /* Same adaptation as the hold button: the prop's presence decides
            whether motion emits `tabIndex`, so it must not depend on a value
            that only resolves after hydration. */
        whileTap={completed ? undefined : { scale: reduce ? 1 : 0.94 }}
        transition={SPRING_PRESS}
        className={cn(
          "relative z-10 grid size-14 touch-none cursor-grab place-items-center bg-ink text-paper",
          TOUCH_GESTURE_CLASS,
          "outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-hazard-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
          completed && "cursor-default bg-paper text-ink",
          thumbClassName,
        )}
      >
        <motion.svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
          <motion.path
            d={iconPath}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </motion.svg>
      </motion.button>
    </div>
  );
}
