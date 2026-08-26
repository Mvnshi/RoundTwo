"use client";

import { useMemo, useState } from "react";

import type { FrictionPath } from "@/lib/friction/content";
import {
  STEP_KINDS,
  VERDICTS,
  band,
  scorePath,
  type Step,
} from "@/lib/friction/score";

/**
 * The core instrument. A path is drawn as a numbered list of steps between an
 * intention and an outcome; cut steps stay on the page, ruled through, because
 * seeing what was removed is the entire point of the drawing.
 *
 * Everything here is CSS state and one Set of ids. A page arguing that
 * unnecessary weight is a cost should not ship an animation library to strike
 * out a line of text.
 */

const AUDIT_CUTS = (steps: Step[]) =>
  new Set(
    steps
      .filter((s) => s.verdict === "delete" || s.verdict === "automate")
      .map((s) => s.id),
  );

export function FrictionPathDiagram({ path }: { path: FrictionPath }) {
  const [cut, setCut] = useState<ReadonlySet<string>>(new Set());

  const remaining = useMemo(
    () => path.steps.filter((s) => !cut.has(s.id)),
    [path.steps, cut],
  );
  const result = useMemo(() => scorePath(remaining), [remaining]);
  const original = useMemo(() => scorePath(path.steps), [path.steps]);

  const audited = AUDIT_CUTS(path.steps);
  const isAudited =
    cut.size === audited.size && [...audited].every((id) => cut.has(id));

  const toggle = (id: string) =>
    setCut((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="border border-ink bg-panel">
      {/* ---- head ------------------------------------------------------ */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="fr-label text-hazard-ink">Intention</p>
          <p className="fr-sub mt-1.5">{path.intention}</p>
        </div>
        <p className="fr-meta text-dim">{path.context}</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_17rem]">
        {/* ---- the path ------------------------------------------------ */}
        <div className="min-w-0">
          <div className="grid grid-cols-[2.25rem_1fr_3.5rem] gap-x-3 border-b border-rule px-4 py-2 sm:grid-cols-[2.75rem_5.5rem_1fr_4.5rem] sm:gap-x-4 sm:px-6">
            <span className="fr-label text-faint">#</span>
            <span className="fr-label hidden text-faint sm:block">Kind</span>
            <span className="fr-label text-faint">Step</span>
            <span className="fr-label text-right text-faint">Cost</span>
          </div>

          <ol className="min-w-0 divide-y divide-rule">
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
                  className="group grid w-full grid-cols-[2.25rem_1fr_3.5rem] items-start gap-x-3 px-4 py-3 text-left transition-colors hover:bg-paper sm:grid-cols-[2.75rem_5.5rem_1fr_4.5rem] sm:gap-x-4 sm:px-6"
                >
                  <span
                    className={`fr-num pt-0.5 text-xs ${
                      isCut ? "text-faint" : "text-dim"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`fr-label hidden shrink-0 self-start border px-1.5 py-1 sm:inline-block ${
                      isCut
                        ? "border-rule text-faint"
                        : isAction
                          ? "border-ink bg-ink text-paper"
                          : "border-hazard-ink text-hazard-ink"
                    }`}
                  >
                    {kind.label}
                  </span>

                  <span className="min-w-0">
                    <span
                      className={`block text-[0.9375rem] leading-snug font-medium sm:text-base ${
                        isCut ? "fr-struck" : ""
                      }`}
                    >
                      {step.label}
                    </span>

                    {/* The verdict only appears once the step is cut: the
                        reasoning is the reward for making the call. */}
                    <span
                      className={`grid transition-[grid-template-rows,opacity] duration-200 ${
                        isCut && step.because
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="fr-meta mt-1.5 block text-dim">
                          <span className="text-hazard-ink">
                            {VERDICTS[step.verdict].label.toUpperCase()}
                          </span>
                          {step.because ? ` — ${step.because}` : null}
                        </span>
                      </span>
                    </span>

                    {/* The chip is a column on wide screens; on narrow ones it
                        drops under the label. It is never hover-gated — a touch
                        device has no hover and would simply never see it. */}
                    <span className="fr-label mt-1.5 block text-faint sm:hidden">
                      {kind.label}
                    </span>
                  </span>

                  {/* What this one step costs. Shown per row so the
                      compounding is visible rather than asserted. */}
                  <span
                    className={`fr-num self-center text-right text-xs ${
                      isCut
                        ? "text-faint line-through"
                        : isAction
                          ? "text-faint"
                          : "text-hazard-ink"
                    }`}
                    title={kind.note}
                  >
                    {isAction ? "—" : `\u2212${Math.round(kind.abandon * 100)}%`}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        </div>

        {/* ---- readout -------------------------------------------------- */}
        <aside className="border-t border-ink lg:border-t-0 lg:border-l">
          <div className="border-b border-rule px-4 py-4 sm:px-6 lg:px-5">
            <p className="fr-label text-dim">Friction Score</p>
            <p className="fr-num mt-2 flex items-baseline gap-2">
              <span className="text-[3.5rem] leading-none font-semibold tracking-tighter">
                {result.score}
              </span>
              <span className="fr-meta text-dim">/ 100</span>
            </p>
            <p className="fr-label mt-2 text-hazard-ink">{band(result.score)}</p>

            <div
              className="mt-3 h-2 w-full border border-ink"
              role="img"
              aria-label={`Friction score ${result.score} out of 100`}
            >
              <div
                className="h-full bg-hazard transition-[width] duration-300"
                style={{ width: `${result.score}%` }}
              />
            </div>

            {cut.size > 0 ? (
              <p className="fr-meta mt-3 text-dim">
                Down from {original.score}. {cut.size} step
                {cut.size === 1 ? "" : "s"} removed.
              </p>
            ) : (
              <p className="fr-meta mt-3 text-dim">
                Cut a step to change the number.
              </p>
            )}
          </div>

          <dl className="fr-meta divide-y divide-rule">
            <div className="flex items-baseline justify-between px-4 py-2.5 sm:px-6 lg:px-5">
              <dt className="text-dim">Steps</dt>
              <dd className="fr-num">
                {remaining.length}
                {cut.size > 0 ? (
                  <span className="text-faint"> / {path.steps.length}</span>
                ) : null}
              </dd>
            </div>
            <div className="flex items-baseline justify-between px-4 py-2.5 sm:px-6 lg:px-5">
              <dt className="text-dim">Obstacles</dt>
              <dd className="fr-num">{result.obstacles}</dd>
            </div>
            <div className="flex items-baseline justify-between px-4 py-2.5 sm:px-6 lg:px-5">
              <dt className="text-dim">Completion</dt>
              <dd className="fr-num">{result.completion}%</dd>
            </div>
          </dl>

          <div className="border-t border-rule p-4 sm:px-6 lg:px-5">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => setCut(AUDIT_CUTS(path.steps))}
                disabled={isAudited}
                className="fr-label border border-ink bg-ink px-3 py-2.5 text-paper transition-colors hover:bg-hazard-ink hover:border-hazard-ink disabled:cursor-not-allowed disabled:border-rule disabled:bg-transparent disabled:text-faint"
              >
                Run the audit
              </button>
              <button
                type="button"
                onClick={() => setCut(new Set())}
                disabled={cut.size === 0}
                className="fr-label border border-ink px-3 py-2.5 transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:border-rule disabled:text-faint disabled:hover:bg-transparent disabled:hover:text-faint"
              >
                Reset
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ---- outcome --------------------------------------------------- */}
      <div className="border-t border-ink bg-void px-4 py-4 text-paper sm:px-6">
        <p className="fr-label text-void-dim">
          {cut.size > 0 ? "Engineered" : "As built"}
        </p>
        <p className="fr-lead mt-1.5 max-w-3xl">
          {cut.size > 0
            ? path.after
            : `${original.obstacles} obstacles stand between wanting this and doing it.`}
        </p>
      </div>
    </div>
  );
}
