"use client";

import { useState } from "react";

import { HoldActionButton } from "@/components/friction/ui/hold-action-button";
import { SlideActionButton } from "@/components/friction/ui/slide-action-button";

/**
 * The argument for good friction, made by putting three dangerous actions in
 * front of you and giving each one a different amount of resistance.
 *
 * The point lands in the difference: the frictionless one is over before you
 * decide anything, and the other two make you commit. Nobody has to be told
 * which felt right.
 */

type Done = "instant" | "hold" | "slide";

function Panel({
  n,
  label,
  action,
  children,
  done,
  aftermath,
}: {
  n: string;
  label: string;
  action: string;
  children: React.ReactNode;
  done: boolean;
  aftermath: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-6 bg-paper p-6">
      <div>
        <div className="flex items-baseline gap-3">
          <span className="fr-num text-xs text-faint">{n}</span>
          <span className="fr-label text-hazard-ink">{label}</span>
        </div>
        <p className="fr-sub mt-3 text-balance">{action}</p>
      </div>

      <div>
        {children}
        <p
          // Reserved height, so committing the action never shifts the layout.
          className={`fr-meta mt-3 min-h-10 text-dim transition-opacity duration-300 ${
            done ? "opacity-100" : "opacity-0"
          }`}
          aria-live="polite"
        >
          {done ? aftermath : " "}
        </p>
      </div>
    </div>
  );
}

export function GoodFrictionDemo() {
  const [done, setDone] = useState<ReadonlySet<Done>>(new Set());
  const mark = (k: Done) => setDone((prev) => new Set(prev).add(k));

  return (
    <div className="grid gap-px border border-ink bg-rule lg:grid-cols-3">
      <Panel
        n="01"
        label="No friction"
        action="Buy something you have not thought about."
        done={done.has("instant")}
        aftermath="Done, in the time it took to move your finger. You did not decide anything — the decision was made for you by how easy it was."
      >
        <button
          type="button"
          onClick={() => mark("instant")}
          className="fr-label h-16 w-full border border-ink bg-hazard px-8 text-ink transition-colors hover:bg-hazard-ink hover:text-paper"
        >
          {done.has("instant") ? "Bought" : "Buy it now"}
        </button>
      </Panel>

      <Panel
        n="02"
        label="Good friction"
        action="Delete the production database."
        done={done.has("hold")}
        aftermath="A second and a half of resistance, deliberately placed. Long enough to notice what you were about to do, short enough not to be a wall."
      >
        <HoldActionButton
          holdDuration={1600}
          holdingLabel="Keep holding"
          completeLabel="Deleted"
          onHoldComplete={() => mark("hold")}
          labelClassName="fr-label"
          fillClassName="bg-hazard-ink"
        >
          Hold to delete
        </HoldActionButton>
      </Panel>

      <Panel
        n="03"
        label="Good friction"
        action="Wire your savings to a new account."
        done={done.has("slide")}
        aftermath="Not harder to understand — harder to do by accident. That is the entire distinction between friction that protects and friction that obstructs."
      >
        <SlideActionButton
          completeLabel="Sent"
          onComplete={() => mark("slide")}
          fillClassName="bg-hazard-ink"
        >
          Slide to send
        </SlideActionButton>
      </Panel>
    </div>
  );
}
