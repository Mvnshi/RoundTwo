/**
 * The Friction Score model.
 *
 * One honest idea, stated plainly: every step between intention and outcome is
 * a chance for the intention to die. Those chances compound. So the score is
 *
 *     100 x (1 - product of survival across every step)
 *
 * which reads as "the share of intent that does not survive this path".
 *
 * The per-step rates below are a *model*, not a measurement. They are ordered
 * by how much evidence and common sense say each kind of obstacle costs — an
 * app switch costs more than a keystroke, waiting costs more than deciding —
 * and the absolute numbers matter far less than what the compounding shows.
 * Anywhere this is surfaced to a reader it is labelled as a model.
 */

export type StepKind =
  | "action"
  | "input"
  | "decision"
  | "search"
  | "recall"
  | "auth"
  | "wait"
  | "switch";

export interface KindSpec {
  /** Shown in the legend and on each step chip. */
  label: string;
  /** Probability the intention dies here. */
  abandon: number;
  /** One line explaining why this kind of step costs what it costs. */
  note: string;
}

export const STEP_KINDS: Record<StepKind, KindSpec> = {
  action: {
    label: "Action",
    abandon: 0,
    note: "The thing you actually wanted to do. Never the problem.",
  },
  input: {
    label: "Input",
    abandon: 0.04,
    note: "Typing something the system could often already know.",
  },
  decision: {
    label: "Decision",
    abandon: 0.06,
    note: "A choice that stops the brain to calculate. Every one is an exit.",
  },
  search: {
    label: "Search",
    abandon: 0.08,
    note: "Hunting for information that should have been brought to you.",
  },
  recall: {
    label: "Recall",
    abandon: 0.09,
    note: "Depending on memory. Memory is not infrastructure.",
  },
  wait: {
    label: "Wait",
    abandon: 0.11,
    note: "Dead time. Invisible waiting feels longer than visible progress.",
  },
  auth: {
    label: "Auth",
    abandon: 0.12,
    note: "Proving who you are, again, to a system that just asked.",
  },
  switch: {
    label: "Switch",
    abandon: 0.1,
    note: "Leaving the task to go somewhere else, and coming back cold.",
  },
};

export type Verdict = "delete" | "automate" | "redesign" | "keep" | "add";

export interface VerdictSpec {
  label: string;
  note: string;
}

/** The four possible answers to any friction point, plus the two end states. */
export const VERDICTS: Record<Verdict, VerdictSpec> = {
  delete: { label: "Delete", note: "The step should not exist at all." },
  automate: {
    label: "Automate",
    note: "The computer already has what it needs to do this.",
  },
  redesign: {
    label: "Redesign",
    note: "The step is necessary. Its current shape is not.",
  },
  keep: { label: "Keep", note: "This is the work. Leave it alone." },
  add: {
    label: "Add friction",
    note: "This should be harder than it currently is.",
  },
};

export interface Step {
  id: string;
  label: string;
  kind: StepKind;
  /** What an audit concludes about this step. */
  verdict: Verdict;
  /** Why. Shown on the engineered pass. */
  because?: string;
}

export interface FrictionScore {
  /** 0–100. Share of intent the model expects this path to lose. */
  score: number;
  /** Probability the path is completed, as a percentage. */
  completion: number;
  /** Steps that are not the action itself. */
  obstacles: number;
  total: number;
  /** Count by kind, for the readout. */
  tally: Array<{ kind: StepKind; count: number }>;
}

export function scorePath(steps: Step[]): FrictionScore {
  const survival = steps.reduce(
    (acc, step) => acc * (1 - STEP_KINDS[step.kind].abandon),
    1,
  );

  const counts = new Map<StepKind, number>();
  for (const step of steps) {
    if (step.kind === "action") continue;
    counts.set(step.kind, (counts.get(step.kind) ?? 0) + 1);
  }

  return {
    score: Math.round((1 - survival) * 100),
    completion: Math.round(survival * 100),
    obstacles: steps.filter((s) => s.kind !== "action").length,
    total: steps.length,
    // Ordered by cost so the most expensive obstacle reads first.
    tally: [...counts.entries()]
      .sort(
        (a, b) => STEP_KINDS[b[0]].abandon - STEP_KINDS[a[0]].abandon,
      )
      .map(([kind, count]) => ({ kind, count })),
  };
}

/** The path that survives an audit: everything but delete and automate. */
export function engineered(steps: Step[]): Step[] {
  return steps.filter((s) => s.verdict !== "delete" && s.verdict !== "automate");
}

/**
 * Band label for a score. Deliberately blunt — the Index is not in the
 * business of grading on a curve.
 */
export function band(score: number): string {
  if (score >= 70) return "Hostile";
  if (score >= 50) return "Heavy";
  if (score >= 30) return "Noticeable";
  if (score >= 12) return "Light";
  return "Near-frictionless";
}
