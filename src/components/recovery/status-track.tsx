import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const stages = [
  { label: "Lost", tone: "lost" },
  { label: "Reopened", tone: "neutral" },
  { label: "Replied", tone: "neutral" },
  { label: "Booked", tone: "neutral" },
  { label: "Won", tone: "won" },
] as const;

const toneStyles = {
  lost: "border-lost/30 bg-card text-lost",
  neutral: "border-border bg-card text-muted-foreground",
  won: "border-brand-strong bg-brand text-brand-foreground",
} as const;

/**
 * The company in five words. Used once, at the close of the page — the hero
 * timeline shows the detail, this shows the shape.
 */
export function StatusTrack({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="label-mono text-muted-foreground">The life of one recovered lead</p>
      <ol className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2">
        {stages.map((stage, index) => (
          <li key={stage.label} className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium",
                toneStyles[stage.tone],
              )}
            >
              {stage.label}
            </span>
            {index < stages.length - 1 ? (
              <ChevronRight
                aria-hidden
                className="size-3.5 shrink-0 text-muted-foreground/60"
                strokeWidth={2.5}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
