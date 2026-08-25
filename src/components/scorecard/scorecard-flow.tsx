"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { ScorecardResultView } from "@/components/scorecard/scorecard-result";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import {
  decodeAnswers,
  encodeAnswers,
  scorecardQuestions,
  scoreAnswers,
  type Answers,
} from "@/lib/scorecard";
import { cn } from "@/lib/utils";

const TOTAL = scorecardQuestions.length;
const EMPTY_ANSWERS: Answers = {};

type Session = { answers: Answers; step: number; done: boolean; started: boolean };

export function ScorecardFlow({ bookingUrl }: { bookingUrl?: string }) {
  const params = useSearchParams();

  /**
   * A shared or revisited result arrives in the URL. It's read during render
   * rather than synced into state by an effect, so there is no cascading
   * render and no flash of question one before the result appears.
   */
  const shared = useMemo(() => decodeAnswers(params.get("s")), [params]);
  const hasShared = Object.keys(shared).length > 0;

  /** Null until the visitor interacts; the URL is the source of truth first. */
  const [session, setSession] = useState<Session | null>(null);

  const usingShared = session === null && hasShared;
  const answers = useMemo(
    () => session?.answers ?? (usingShared ? shared : EMPTY_ANSWERS),
    [session, usingShared, shared],
  );
  const showResult = usingShared || session?.done === true;
  const step = session?.step ?? 0;

  const result = useMemo(() => scoreAnswers(answers), [answers]);

  function choose(questionId: string, value: string) {
    const current: Session = session ?? {
      answers: {},
      step: 0,
      done: false,
      started: false,
    };

    if (!current.started) track("scorecard_started");

    const nextAnswers = { ...current.answers, [questionId]: value };
    const isLast = current.step >= TOTAL - 1;

    setSession({
      answers: nextAnswers,
      step: isLast ? current.step : current.step + 1,
      done: isLast,
      started: true,
    });

    if (!isLast) return;

    const scored = scoreAnswers(nextAnswers);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?s=${encodeAnswers(nextAnswers)}`,
    );
    track("scorecard_completed", {
      score: scored.score,
      band: scored.band.key,
      trade: nextAnswers.trade,
      lead_volume: nextAnswers.leadVolume,
      job_value: nextAnswers.jobValue,
      crm: nextAnswers.crm,
    });
  }

  if (showResult) {
    return (
      <ScorecardResultView
        answers={answers}
        result={result}
        bookingUrl={bookingUrl}
        onRestart={() => {
          setSession({ answers: {}, step: 0, done: false, started: false });
          window.history.replaceState(null, "", window.location.pathname);
        }}
      />
    );
  }

  const question = scorecardQuestions[step];
  const progress = Math.round((step / TOTAL) * 100);

  return (
    <div className="mx-auto w-full max-w-[44rem]">
      <div className="rounded-[2rem] bg-card p-6 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="label-mono text-muted-foreground">
            Question {step + 1} of {TOTAL}
          </p>
          {step > 0 ? (
            <Button
              variant="ghost"
              size="lg"
              onClick={() =>
                setSession({
                  answers,
                  step: step - 1,
                  done: false,
                  started: true,
                })
              }
              className="-mr-2 text-muted-foreground"
            >
              <ArrowLeft aria-hidden />
              Back
            </Button>
          ) : null}
        </div>

        <div
          className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Scorecard progress"
        >
          <div
            className="h-full rounded-full bg-brand-strong transition-[width] duration-300"
            style={{ width: `${Math.max(progress, 4)}%` }}
          />
        </div>

        <h2 className="mt-8 text-h3 font-medium sm:text-h2">{question.question}</h2>
        {question.helper ? (
          <p className="mt-3 text-[0.9375rem] text-muted-foreground">{question.helper}</p>
        ) : null}

        <div
          role="group"
          aria-label={question.question}
          className="mt-7 flex flex-col gap-2.5"
        >
          {question.options.map((option) => {
            const selected = answers[question.id] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => choose(question.id, option.value)}
                aria-pressed={selected}
                className={cn(
                  "group flex w-full items-center justify-between gap-4 rounded-full border px-6 py-4 text-left text-[0.9375rem] transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  selected
                    ? "border-transparent bg-brand text-brand-foreground"
                    : "border-hairline bg-background hover:border-foreground/25 hover:bg-secondary/60",
                )}
              >
                <span>{option.label}</span>
                <span
                  aria-hidden
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border transition-colors",
                    selected
                      ? "border-brand-foreground bg-brand-foreground text-brand"
                      : "border-hairline group-hover:border-foreground/30",
                  )}
                >
                  {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-5 text-center text-[0.8125rem] text-muted-foreground">
        No email needed to see your result. Nine questions, about ninety seconds.
      </p>
    </div>
  );
}
