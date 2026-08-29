"use client";

import { useMemo, useState } from "react";
import { Check, Minus } from "lucide-react";

import { NumberTicker } from "@/components/motion/number-ticker";
import { paths } from "@/lib/friction/content";
import { STEP_KINDS, VERDICTS, band, scorePath } from "@/lib/friction/score";
import { cn } from "@/lib/utils";

/**
 * The single large artefact this system puts on the colour field. It draws one
 * path between an intention and an outcome, scores it, and lets you cut steps
 * and watch the number move. Cut steps stay on the card, ruled through,
 * because seeing what was removed is the entire point of the drawing.
 */
const path = paths[0];

const AUDIT_CUTS = new Set(
  path.steps
    .filter((s) => s.verdict === "delete" || s.verdict === "automate")
    .map((s) => s.id),
);

export function PathCard() {
  const [cut, setCut] = useState<ReadonlySet<string>>(new Set());

  const remaining = useMemo(
    () => path.steps.filter((s) => !cut.has(s.id)),
    [cut],
  );
  const result = useMemo(() => scorePath(remaining), [remaining]);
  const original = useMemo(() => scorePath(path.steps), []);
  const audited = cut.size === AUDIT_CUTS.size;

  const toggle = (id: string) =>
    setCut((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="overflow-hidden rounded-lg bg-card ring-1 ring-hairline">
      <div className="flex items-center justify-between gap-4 border-b border-hairline px-6 py-5 sm:px-7">
        <div className="min-w-0">
          <p className="label-mono text-muted-foreground">Example path</p>
          <p className="mt-1.5 truncate text-h3">{path.intention}</p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 label-mono transition-colors",
            audited
              ? "bg-brand text-foreground"
              : "bg-secondary text-foreground",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "size-1.5 rounded-full",
              audited ? "bg-background" : "bg-resist",
            )}
          />
          {audited ? "Engineered" : "As built"}
        </span>
      </div>

      <ol className="divide-y divide-hairline">
        {path.steps.map((step, i) => {
          const isCut = cut.has(step.id);
          const isAction = step.kind === "action";
          const kind = STEP_KINDS[step.kind];

          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => toggle(step.id)}
                aria-pressed={isCut}
                className="grid w-full grid-cols-[1.75rem_1fr_auto] items-start gap-x-4 px-6 py-3.5 text-left transition-colors hover:bg-background/60 sm:px-7"
              >
                <span className="mt-0.5 font-mono text-[0.6875rem] tabular text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-[0.9375rem] font-medium",
                      isCut && "struck text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                  <span
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-200",
                      isCut && step.because
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <span className="overflow-hidden">
                      <span className="mt-1 block text-[0.8125rem] text-muted-foreground">
                        <span className="font-medium text-resist">
                          {VERDICTS[step.verdict].label}
                        </span>
                        {step.because ? ` — ${step.because}` : null}
                      </span>
                    </span>
                  </span>
                </span>

                <span
                  className={cn(
                    "mt-0.5 shrink-0 font-mono text-[0.6875rem] tabular",
                    isCut
                      ? "text-muted-foreground line-through"
                      : isAction
                        ? "text-muted-foreground"
                        : "text-resist",
                  )}
                  title={kind.note}
                >
                  {isAction ? (
                    <Minus className="size-3.5" aria-hidden />
                  ) : (
                    `−${Math.round(kind.abandon * 100)}%`
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-5 border-t border-hairline bg-background/50 px-6 py-5 sm:grid-cols-[1fr_auto] sm:items-end sm:px-7">
        <div>
          <p className="label-mono text-muted-foreground">Friction score</p>
          <p className="mt-1.5 flex items-baseline gap-2">
            <NumberTicker
              value={result.score}
              className="text-[2.75rem] leading-none font-medium tracking-[-0.04em]"
            />
            <span className="text-[0.9375rem] text-muted-foreground">
              / 100 · {band(result.score)}
            </span>
          </p>
          <p className="mt-2 text-[0.8125rem] text-muted-foreground">
            {cut.size > 0
              ? `Down from ${original.score}. ${remaining.length} of ${path.steps.length} steps left, ${result.completion}% completion.`
              : "Tap a step you think should not exist."}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCut(new Set(AUDIT_CUTS))}
            disabled={audited}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-[0.8125rem] font-medium text-background transition-colors hover:bg-brand hover:text-foreground disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground"
          >
            {audited ? <Check className="size-4" aria-hidden /> : null}
            Run the audit
          </button>
          <button
            type="button"
            onClick={() => setCut(new Set())}
            disabled={cut.size === 0}
            className="rounded-full px-4 py-2.5 text-[0.8125rem] font-medium ring-1 ring-hairline transition-colors hover:bg-secondary/60 disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
