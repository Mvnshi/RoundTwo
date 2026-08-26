import { ArrowUpRight } from "lucide-react";

import { RecoveryStatusBadge } from "@/components/recovery/recovery-status-badge";

import { exampleOpportunity, recoverySteps, type RecoveryStatus } from "@/lib/content";
import { cn } from "@/lib/utils";

const dotStyles: Record<RecoveryStatus, string> = {
  neutral: "border-hairline bg-card text-muted-foreground",
  lost: "border-dashed border-lost/50 bg-card text-lost",
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
      className={cn("relative overflow-hidden rounded-[2.5rem] bg-card", className)}
    >
      <div className="relative flex items-center justify-between gap-3 border-b border-hairline px-6 py-4 sm:px-7">
        <figcaption className="label-mono text-muted-foreground">
          Example recovery
        </figcaption>
        <RecoveryStatusBadge />
      </div>

      <div className="relative flex items-start justify-between gap-4 border-b border-hairline px-6 py-5 sm:px-7">
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

      <ol className="relative px-6 py-5 sm:px-7">
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
                  className="absolute top-7 bottom-0 left-[13px] w-px bg-hairline"
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
                <div className="flex flex-col gap-0.5 min-[420px]:flex-row min-[420px]:items-baseline min-[420px]:justify-between min-[420px]:gap-3">
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

      <div className="relative flex items-center gap-2 border-t border-hairline px-6 py-4 text-[0.75rem] text-muted-foreground sm:px-7">
        <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
        <p>
          Illustrative example of the workflow we build with partners. Not customer data.
        </p>
      </div>
    </figure>
  );
}
