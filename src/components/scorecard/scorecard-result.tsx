"use client";

import { useState } from "react";
import { Check, Link2, RotateCcw } from "lucide-react";

import { ScorecardLeadForm } from "@/components/scorecard/scorecard-lead-form";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/motion/number-ticker";
import { track } from "@/lib/analytics";
import { benchmarks, modellingNotes } from "@/lib/benchmarks";
import { leakMeta, type Answers, type ScorecardResult } from "@/lib/scorecard";
import { cn } from "@/lib/utils";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ScorecardResultView({
  answers,
  result,
  bookingUrl,
  onRestart,
}: {
  answers: Answers;
  result: ScorecardResult;
  bookingUrl?: string;
  onRestart: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const worst = result.leaks[0];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      track("scorecard_shared");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — the URL is still in the address bar */
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[56rem] flex-col gap-4">
      {/* ---------------------------------------------------------- score */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div className="flex flex-col justify-between rounded-[2rem] bg-foreground p-7 text-background sm:p-9">
          <p className="label-mono text-background/60">Your leak score</p>
          <div className="mt-6 flex items-end gap-2">
            <NumberTicker
              value={result.score}
              blur
              className="text-[4.5rem] leading-none font-medium tracking-[-0.05em] text-brand"
            />
            <span className="pb-2 text-[1.25rem] text-background/50">/ 100</span>
          </div>
          <p className="mt-5 text-[1.0625rem] font-medium text-brand">{result.band.label}</p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-background/70">
            {result.band.summary}
          </p>
        </div>

        <div className="flex flex-col rounded-[2rem] bg-card p-7 sm:p-9">
          <p className="label-mono text-muted-foreground">
            Illustrative recoverable revenue
          </p>
          <p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-[2.75rem] leading-none font-medium tracking-[-0.045em] tabular sm:text-[3.5rem]">
              {money.format(result.recoverablePerYear)}
            </span>
            <span className="text-[0.9375rem] text-muted-foreground">/ year</span>
          </p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
            Based on roughly{" "}
            <strong className="font-medium text-foreground">
              {result.lostPerMonth} opportunities a month
            </strong>{" "}
            falling through at your volume, and a deliberately conservative 10% of
            those being recoverable at a{" "}
            <strong className="font-medium text-foreground">
              {money.format(result.jobValue)}
            </strong>{" "}
            average job.
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
            <Button variant="outline" size="lg" onClick={copyLink}>
              {copied ? <Check aria-hidden /> : <Link2 aria-hidden />}
              {copied ? "Link copied" : "Copy your result link"}
            </Button>
            <Button variant="ghost" size="lg" onClick={onRestart} className="text-muted-foreground">
              <RotateCcw aria-hidden />
              Start over
            </Button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- leaks */}
      <div className="rounded-[2rem] bg-card p-7 sm:p-9">
        <h2 className="text-h3 font-medium">Where it&apos;s going</h2>
        <p className="mt-2 text-[0.9375rem] text-muted-foreground">
          Ordered worst first. The bar is how much of your monthly flow we model as
          lost at that stage, based on your answers.
        </p>

        <ul className="mt-7 flex flex-col gap-5">
          {result.leaks.map((leak) => {
            const pct = Math.round(leak.severity * 100);
            return (
              <li key={leak.key} className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-[0.9375rem] font-medium">{leak.label}</p>
                  <p className="tabular text-[0.8125rem] text-muted-foreground">
                    {pct}% · about {leak.lostPerMonth} a month
                  </p>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      leak.key === worst?.key ? "bg-lost-soft" : "bg-brand-strong",
                    )}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
                <p className="text-[0.8125rem] text-muted-foreground">{leak.blurb}</p>
              </li>
            );
          })}
        </ul>

        {worst ? (
          <div className="mt-8 rounded-[1.5rem] bg-background p-6">
            <p className="label-mono text-muted-foreground">Where we&apos;d start</p>
            <p className="mt-3 text-[1.0625rem] leading-snug font-medium">
              {leakMeta[worst.key].label}
            </p>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {FIRST_MOVE[worst.key]}
            </p>
          </div>
        ) : null}
      </div>

      {/* ----------------------------------------------------- lead capture */}
      <ScorecardLeadForm answers={answers} result={result} bookingUrl={bookingUrl} />

      {/* -------------------------------------------------------- receipts */}
      <div className="rounded-[2rem] bg-card p-7 sm:p-9">
        <h2 className="text-h3 font-medium">What this is anchored against</h2>
        <p className="mt-2 max-w-2xl text-[0.9375rem] text-muted-foreground">
          Most tools like this quote you a statistic without telling you where it came
          from. Here is ours, with the provenance attached.
        </p>

        <ul className="mt-7 flex flex-col divide-y divide-hairline">
          {benchmarks.map((b) => (
            <li key={b.id} className="flex flex-col gap-2 py-5 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[1.25rem] font-medium tabular">{b.stat}</span>
                <span className="label-mono text-muted-foreground">
                  {b.source} · {b.year}
                </span>
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{b.claim}</p>
              {b.note ? (
                <p className="text-[0.8125rem] leading-relaxed text-muted-foreground/90 italic">
                  {b.note}
                </p>
              ) : null}
              <a
                href={b.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-[0.8125rem] font-medium underline underline-offset-4"
              >
                Source
              </a>
            </li>
          ))}
        </ul>

        <ul className="mt-8 flex flex-col gap-2 border-t border-hairline pt-6 text-[0.8125rem] leading-relaxed text-muted-foreground">
          {modellingNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const FIRST_MOVE: Record<string, string> = {
  missedCalls:
    "Every missed call is a homeowner who is, right now, dialling the next number on the list. Before any software gets involved: an automatic text back within sixty seconds of a missed call recovers a meaningful share of them, and costs almost nothing to set up.",
  slowResponse:
    "The published research is consistent that the first response is what wins, not the best one. An acknowledgement in minutes — even one that just says a human will call shortly — beats a considered reply the next morning.",
  ghostedEstimates:
    "This is usually the biggest pot of money in a contracting business, because every quote already cost you a site visit. The fix isn't more reminders, it's follow-up that references the specific objection from the last conversation.",
  deadCrm:
    "Old opportunities are the cheapest leads you will ever work: you already paid to acquire them. Start with the unsold estimates from the last twelve months, worked in order of value, not date.",
};
