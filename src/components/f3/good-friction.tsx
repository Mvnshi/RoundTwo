"use client";

import { useState } from "react";

import { HoldActionButton } from "@/components/friction/ui/hold-action-button";
import { SlideActionButton } from "@/components/friction/ui/slide-action-button";
import { cn } from "@/lib/utils";

/**
 * The argument for good friction, made by putting three dangerous actions in
 * front of you with different amounts of resistance on each. The point lands
 * in the difference: the frictionless one is over before you decide anything.
 *
 * The two gesture controls are the same vendored components the other Friction
 * page uses; only their classes change. tailwind-merge resolves the overrides
 * against their defaults, so nothing had to be forked to restyle them.
 */
type Done = "instant" | "hold" | "slide";

function Card({
  n,
  tag,
  action,
  done,
  aftermath,
  accent,
  children,
}: {
  n: string;
  tag: string;
  action: string;
  done: boolean;
  aftermath: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-8 rounded-lg bg-card p-6 ring-1 ring-hairline sm:p-7">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[0.6875rem] tabular text-muted-foreground">
            {n}
          </span>
          <span
            className={cn(
              "label-mono rounded-full px-2.5 py-1",
              accent
                ? "bg-resist-soft/20 text-resist"
                : "bg-secondary text-foreground",
            )}
          >
            {tag}
          </span>
        </div>
        <p className="mt-4 text-h3">{action}</p>
      </div>

      <div>
        {children}
        {/* Reserved height, so committing an action never shifts the layout. */}
        <p
          aria-live="polite"
          className={cn(
            "mt-4 min-h-16 text-[0.875rem] text-muted-foreground transition-opacity duration-300",
            done ? "opacity-100" : "opacity-0",
          )}
        >
          {done ? aftermath : " "}
        </p>
      </div>
    </div>
  );
}

export function GoodFriction() {
  const [done, setDone] = useState<ReadonlySet<Done>>(new Set());
  const mark = (k: Done) => setDone((prev) => new Set(prev).add(k));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card
        n="01"
        tag="No friction"
        accent
        action="Buy something you have not thought about."
        done={done.has("instant")}
        aftermath="Done, in the time it took to move your finger. You did not decide anything — the decision was made for you by how easy it was."
      >
        <button
          type="button"
          onClick={() => mark("instant")}
          className="h-14 w-full rounded-full bg-brand px-6 text-[0.9375rem] font-medium text-foreground transition-colors hover:bg-brand-strong"
        >
          {done.has("instant") ? "Bought" : "Buy it now"}
        </button>
      </Card>

      <Card
        n="02"
        tag="Good friction"
        action="Delete the production database."
        done={done.has("hold")}
        aftermath="A second and a half of resistance, deliberately placed. Long enough to notice what you were about to do, short enough not to be a wall."
      >
        <HoldActionButton
          holdDuration={1600}
          holdingLabel="Keep holding"
          completeLabel="Deleted"
          onHoldComplete={() => mark("hold")}
          className="h-14 w-full rounded-full border-transparent bg-foreground text-background"
          fillClassName="bg-resist"
        >
          Hold to delete
        </HoldActionButton>
      </Card>

      <Card
        n="03"
        tag="Good friction"
        action="Wire your savings to a new account."
        done={done.has("slide")}
        aftermath="Not harder to understand — harder to do by accident. That is the whole distinction between friction that protects and friction that obstructs."
      >
        <SlideActionButton
          completeLabel="Sent"
          onComplete={() => mark("slide")}
          className="h-14 w-full max-w-none rounded-full border-transparent bg-secondary"
          thumbClassName="rounded-full bg-foreground text-background"
          fillClassName="bg-resist"
        >
          Slide to send
        </SlideActionButton>
      </Card>
    </div>
  );
}
