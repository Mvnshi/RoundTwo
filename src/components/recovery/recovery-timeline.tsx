import { ArrowUpRight } from "lucide-react";

import { GridPattern } from "@/components/ui/grid-pattern";
import { exampleOpportunity, recoverySteps, type RecoveryStatus } from "@/lib/content";
import { cn } from "@/lib/utils";

const dotStyles: Record<RecoveryStatus, string> = {
  neutral: "border-border-strong bg-card text-muted-foreground",
  lost: "border-dashed border-lost/45 bg-card text-lost",
  working: "border-foreground bg-foreground text-background",
  recovered: "border-brand-strong bg-brand text-brand-foreground",
};

const metaStyles: Record<RecoveryStatus, string> = {
  neutral: "text-muted-foreground",
  lost: "text-lost",
  working: "text-muted-foreground",
  recovered: "text-foreground",
};

/**
 * The signature visual: one opportunity going cold and being brought back.
 * Server-rendered — the staggered entrance is pure CSS, so it paints with the
 * first frame and costs no client JavaScript.
 */
export function RecoveryTimeline({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(23,24,22,0.04),0_12px_32px_-12px_rgba(23,24,22,0.12)]",
        className,
      )}
    >
      <GridPattern
        width={28}
        height={28}
        className="absolute inset-0 h-full w-full fill-none stroke-foreground/[0.045] [mask-image:radial-gradient(320px_circle_at_top_right,white,transparent)]"
      />

      <div className="relative flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <figcaption className="label-mono text-muted-foreground">
          Example recovery
        </figcaption>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 label-mono text-brand-foreground">
          <span className="size-1.5 rounded-full bg-brand-foreground" aria-hidden />
          Won back
        </span>
      </div>

      <div className="relative flex items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <p className="text-[0.9375rem] font-medium text-foreground">
            {exampleOpportunity.name}
          </p>
          <p className="mt-0.5 truncate text-[0.8125rem] text-muted-foreground">
            {exampleOpportunity.job} · {exampleOpportunity.source}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="tabular text-[0.9375rem] font-medium tracking-[-0.01em]">
            ${exampleOpportunity.value.toLocaleString("en-US")}
          </p>
          <p className="label-mono mt-0.5 text-muted-foreground">Estimate</p>
        </div>
      </div>

      <ol className="relative px-4 py-4 sm:px-5">
        {recoverySteps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === recoverySteps.length - 1;

          return (
            <li
              key={step.id}
              style={{ animationDelay: `${140 + index * 110}ms` }}
              className="relative flex animate-in gap-3 fill-mode-both pb-4 duration-500 fade-in slide-in-from-bottom-1 last:pb-0"
            >
              {!isLast ? (
                <span
                  aria-hidden
                  className="absolute top-7 bottom-0 left-[13px] w-px bg-border"
                />
              ) : null}

              <span
                aria-hidden
                className={cn(
                  "relative z-10 grid size-7 shrink-0 place-items-center rounded-full border",
                  dotStyles[step.status],
                )}
              >
                <Icon className="size-3.5" strokeWidth={2} />
              </span>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-baseline justify-between gap-3">
                  <p
                    className={cn(
                      "text-[0.8125rem] font-medium",
                      step.status === "lost" ? "text-lost" : "text-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                  <span
                    className={cn(
                      "label-mono shrink-0 whitespace-nowrap",
                      metaStyles[step.status],
                    )}
                  >
                    {step.meta}
                  </span>
                </div>
                {step.detail ? (
                  <p className="mt-1 text-[0.8125rem] leading-snug text-muted-foreground">
                    {step.detail}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="relative flex items-center gap-2 border-t border-border bg-muted/40 px-4 py-3 text-[0.75rem] text-muted-foreground sm:px-5">
        <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
        <p>
          Illustrative example of the workflow we build with partners. Not customer data.
        </p>
      </div>
    </figure>
  );
}
