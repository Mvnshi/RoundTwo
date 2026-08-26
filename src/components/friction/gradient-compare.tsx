import { gradient } from "@/lib/friction/content";
import { cn } from "@/lib/utils";

/**
 * Two behaviours drawn at the same scale. No commentary needed — the lengths
 * do the arguing. This is a Friction Gradient: the difference in resistance
 * between competing behaviours, which is what actually decides which one wins.
 */
function Track({
  label,
  steps,
  tone,
}: {
  label: string;
  steps: readonly string[];
  tone: "easy" | "hard";
}) {
  const hard = tone === "hard";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-2">
        <p className="fr-sub">{label}</p>
        <p className="fr-num shrink-0 text-sm text-dim">
          {steps.length} step{steps.length === 1 ? "" : "s"}
        </p>
      </div>

      <ol className="mt-4 flex flex-wrap items-stretch gap-1.5">
        {steps.map((step, i) => (
          <li
            key={step}
            className={cn(
              "flex min-h-14 min-w-0 flex-1 basis-24 flex-col justify-between border px-2 py-2",
              hard
                ? "border-hazard-ink/40 bg-hazard/10"
                : "border-ink bg-ink text-paper",
            )}
          >
            <span
              className={cn(
                "fr-num text-[0.625rem]",
                hard ? "text-hazard-ink" : "text-void-dim",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[0.75rem] leading-tight font-medium hyphens-auto">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function GradientCompare() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
      <Track {...gradient.a} />
      <Track {...gradient.b} />
    </div>
  );
}
