"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Check, Hourglass, Search } from "lucide-react";

import { AnimatedBadge, type AnimatedBadgeStatus } from "@/components/motion/animated-badge";

/**
 * The one live element in the hero. The timeline rows around it are
 * server-rendered and animate in CSS, so the card paints on the first frame;
 * this small island plays the opportunity's status through the same beats —
 * open, lost, being worked, won back — which is the whole product in four words.
 *
 * Timings are tuned to land just behind the rows they describe.
 */
const STAGES: Array<{
  at: number;
  label: string;
  status: AnimatedBadgeStatus;
  icon?: React.ReactNode;
}> = [
  { at: 0, label: "Estimate sent", status: "neutral" },
  { at: 900, label: "Gone quiet", status: "danger", icon: <Hourglass className="size-3.5" /> },
  { at: 1600, label: "Working it", status: "info", icon: <Search className="size-3.5" /> },
  { at: 2400, label: "Won back", status: "success", icon: <Check className="size-3.5" /> },
];

const FINAL = STAGES[STAGES.length - 1];

export function RecoveryStatusBadge() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  // The first render must be identical on server and client, so reduced motion
  // is handled by collapsing the schedule to zero rather than by branching at
  // render time — branching there hydration-mismatches for anyone who has the
  // preference set. AnimatedBadge already suppresses its own transitions, so
  // this lands on the outcome with no animation.
  useEffect(() => {
    const timers = STAGES.slice(1).map((stage, i) =>
      window.setTimeout(() => setIndex(i + 1), reduce ? 0 : stage.at),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reduce]);

  const stage = STAGES[index] ?? FINAL;

  return (
    <AnimatedBadge
      status={stage.status}
      size="sm"
      icon={stage.icon}
      contentKey={stage.label}
      className="label-mono"
    >
      {stage.label}
    </AnimatedBadge>
  );
}
