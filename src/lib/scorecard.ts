/**
 * The Lead Leak Scorecard.
 *
 * Nine questions that double as a qualification form. Five of them are scored
 * (0-20 each) and drive both the score out of 100 and a modelled leak rate per
 * failure mode; the other four capture the numbers needed to turn that rate
 * into money, and tell us who we're talking to.
 *
 * The leak percentages are deliberately conservative and are stated as
 * modelling assumptions, not measurements. See `benchmarks` for the published
 * research they are anchored against.
 */

export type LeakKey = "missedCalls" | "slowResponse" | "ghostedEstimates" | "deadCrm";

export type ScoredOption = {
  value: string;
  label: string;
  /** 0 = worst practice, 20 = tight operation. */
  points: number;
  /** Share of monthly opportunities this answer implies is lost here. */
  leakRate: number;
};

export type ScorecardQuestion = {
  id: string;
  /** Scored questions map to a leak; profile questions don't. */
  leak?: LeakKey;
  kind: "scored" | "profile";
  question: string;
  helper?: string;
  options: ScoredOption[];
};

const profile = (
  id: string,
  question: string,
  labels: readonly string[],
  helper?: string,
): ScorecardQuestion => ({
  id,
  kind: "profile",
  question,
  helper,
  options: labels.map((label) => ({ value: label, label, points: 0, leakRate: 0 })),
});

export const scorecardQuestions: ScorecardQuestion[] = [
  profile("trade", "What kind of work do you do?", [
    "Roofing",
    "Remodeling",
    "Electrical",
    "HVAC",
    "Plumbing",
    "Other home services",
  ]),

  profile(
    "leadVolume",
    "Roughly how many leads come in a month?",
    ["Under 25", "25-50", "51-100", "101-250", "251-500", "500+"],
    "Calls, forms, referrals — everything that could become a job.",
  ),

  profile(
    "jobValue",
    "What's an average job worth when you win it?",
    ["Under $2,000", "$2,000-$5,000", "$5,000-$15,000", "$15,000-$40,000", "$40,000+"],
    "Ballpark revenue, not profit.",
  ),

  {
    id: "missedCalls",
    kind: "scored",
    leak: "missedCalls",
    question: "Someone calls while every crew is on a roof. What happens?",
    options: [
      {
        value: "voicemail",
        label: "It goes to voicemail and we get to it when we get to it",
        points: 2,
        leakRate: 0.28,
      },
      {
        value: "same-day",
        label: "Someone calls back the same day, usually",
        points: 8,
        leakRate: 0.16,
      },
      {
        value: "within-hour",
        label: "Someone calls back within the hour",
        points: 14,
        leakRate: 0.07,
      },
      {
        value: "answered",
        label: "It gets answered — we have an answering service or a dedicated person",
        points: 20,
        leakRate: 0.02,
      },
    ],
  },

  {
    id: "slowResponse",
    kind: "scored",
    leak: "slowResponse",
    question: "A form comes in at 7pm on a Tuesday. When does it get a reply?",
    options: [
      { value: "next-day", label: "Next morning, or whenever we see it", points: 3, leakRate: 0.24 },
      { value: "few-hours", label: "Within a few hours", points: 9, leakRate: 0.14 },
      { value: "under-hour", label: "Within an hour", points: 15, leakRate: 0.06 },
      { value: "minutes", label: "Within minutes — it's automated or someone's on it", points: 20, leakRate: 0.02 },
    ],
  },

  {
    id: "ghostedEstimates",
    kind: "scored",
    leak: "ghostedEstimates",
    question: "You send an estimate and they go quiet. What happens next?",
    helper: "Be honest — this is where most of the money is.",
    options: [
      { value: "nothing", label: "Nothing. If they want it, they'll call", points: 2, leakRate: 0.32 },
      { value: "one-nudge", label: "One follow-up, then we move on", points: 8, leakRate: 0.21 },
      { value: "few-nudges", label: "Two or three follow-ups over a couple of weeks", points: 14, leakRate: 0.1 },
      {
        value: "systematic",
        label: "A real sequence that keeps going until we get a yes or a no",
        points: 20,
        leakRate: 0.035,
      },
    ],
  },

  {
    id: "deadCrm",
    kind: "scored",
    leak: "deadCrm",
    question: "How many unsold estimates from the last 12 months are still sitting there?",
    options: [
      { value: "hundreds", label: "Hundreds. Nobody's touched them", points: 2, leakRate: 0.26 },
      { value: "lots", label: "A lot, and I couldn't tell you the number", points: 6, leakRate: 0.17 },
      { value: "some", label: "Some, and we dig through them when work is slow", points: 13, leakRate: 0.075 },
      { value: "worked", label: "They get worked systematically", points: 20, leakRate: 0.02 },
    ],
  },

  {
    id: "notNow",
    kind: "scored",
    leak: "deadCrm",
    question: "Someone says “not right now — maybe in the spring.” Then what?",
    options: [
      { value: "forgotten", label: "Realistically, they're forgotten", points: 2, leakRate: 0.27 },
      { value: "note", label: "A note goes in somewhere, but nobody chases it", points: 7, leakRate: 0.18 },
      { value: "reminder", label: "We set a reminder and it mostly happens", points: 14, leakRate: 0.075 },
      { value: "scheduled", label: "It's scheduled and it always happens", points: 20, leakRate: 0.025 },
    ],
  },

  profile(
    "crm",
    "Where does all of this live?",
    [
      "ServiceTitan",
      "JobNimbus",
      "AccuLynx",
      "Jobber",
      "Housecall Pro",
      "HubSpot or Salesforce",
      "Spreadsheets or paper",
      "Something else",
    ],
    "No wrong answer. “Spreadsheets” is extremely common.",
  ),
];

export const scoredQuestionIds = scorecardQuestions
  .filter((q) => q.kind === "scored")
  .map((q) => q.id);

/* ------------------------------------------------------------------ maths */

const VOLUME_MIDPOINT: Record<string, number> = {
  "Under 25": 15,
  "25-50": 38,
  "51-100": 75,
  "101-250": 175,
  "251-500": 375,
  "500+": 650,
};

const VALUE_MIDPOINT: Record<string, number> = {
  "Under $2,000": 1200,
  "$2,000-$5,000": 3500,
  "$5,000-$15,000": 9000,
  "$15,000-$40,000": 25000,
  "$40,000+": 60000,
};

/**
 * Share of a lost opportunity we model as realistically recoverable. Kept low
 * on purpose: the point of the tool is to be believed, not to be impressive.
 */
export const ASSUMED_RECOVERY_RATE = 0.1;

export const leakMeta: Record<LeakKey, { label: string; blurb: string }> = {
  missedCalls: {
    label: "Missed calls",
    blurb: "Calls that never got picked up or returned fast enough to matter.",
  },
  slowResponse: {
    label: "Slow first response",
    blurb: "Enquiries where somebody else replied first.",
  },
  ghostedEstimates: {
    label: "Ghosted estimates",
    blurb: "Quotes you spent real time on that went quiet and stayed quiet.",
  },
  deadCrm: {
    label: "The lead graveyard",
    blurb: "Old opportunities and “not right now” conversations nobody reopened.",
  },
};

export type Answers = Record<string, string>;

export type ScorecardResult = {
  score: number;
  band: { key: "leaking" | "patchy" | "solid" | "tight"; label: string; summary: string };
  leaks: Array<{ key: LeakKey; label: string; blurb: string; severity: number; lostPerMonth: number }>;
  leadsPerMonth: number;
  jobValue: number;
  lostPerMonth: number;
  recoverablePerMonth: number;
  recoverablePerYear: number;
  recoverableJobsPerMonth: number;
  complete: boolean;
};

const BANDS: ScorecardResult["band"][] = [
  {
    key: "leaking",
    label: "Leaking badly",
    summary:
      "Most of the opportunities you pay for are never worked to a yes or a no. This is the profile where recovery work pays for itself fastest.",
  },
  {
    key: "patchy",
    label: "Patchy",
    summary:
      "The basics happen when someone remembers. The gap between your good weeks and your bad weeks is where the money goes.",
  },
  {
    key: "solid",
    label: "Solid, with gaps",
    summary:
      "You run a tighter operation than most. The remaining leak is concentrated in one or two places rather than spread everywhere.",
  },
  {
    key: "tight",
    label: "Tight",
    summary:
      "Genuinely well run. Recovery is a marginal gain for you rather than a rescue — worth doing only if the numbers below are big enough.",
  },
];

function bandFor(score: number): ScorecardResult["band"] {
  if (score < 35) return BANDS[0];
  if (score < 60) return BANDS[1];
  if (score < 82) return BANDS[2];
  return BANDS[3];
}

export function scoreAnswers(answers: Answers): ScorecardResult {
  const scored = scorecardQuestions.filter((q) => q.kind === "scored");
  const answeredScored = scored.filter((q) => answers[q.id]);

  let points = 0;
  const leakTotals: Record<LeakKey, { rate: number; count: number }> = {
    missedCalls: { rate: 0, count: 0 },
    slowResponse: { rate: 0, count: 0 },
    ghostedEstimates: { rate: 0, count: 0 },
    deadCrm: { rate: 0, count: 0 },
  };

  for (const question of answeredScored) {
    const option = question.options.find((o) => o.value === answers[question.id]);
    if (!option || !question.leak) continue;
    points += option.points;
    leakTotals[question.leak].rate += option.leakRate;
    leakTotals[question.leak].count += 1;
  }

  const maxPoints = answeredScored.length * 20;
  const score = maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;

  const leadsPerMonth = VOLUME_MIDPOINT[answers.leadVolume ?? ""] ?? 0;
  const jobValue = VALUE_MIDPOINT[answers.jobValue ?? ""] ?? 0;

  const leaks = (Object.keys(leakTotals) as LeakKey[]).map((key) => {
    const { rate, count } = leakTotals[key];
    const severity = count > 0 ? rate / count : 0;
    return {
      key,
      label: leakMeta[key].label,
      blurb: leakMeta[key].blurb,
      severity,
      lostPerMonth: Math.round(leadsPerMonth * severity),
    };
  });

  // Opportunities can only be lost once, so the combined leak is the union of
  // the per-stage rates rather than their sum.
  const survivalRate = leaks.reduce((acc, leak) => acc * (1 - leak.severity), 1);
  const lostPerMonth = leadsPerMonth * (1 - survivalRate);
  const recoverableJobsPerMonth = lostPerMonth * ASSUMED_RECOVERY_RATE;
  const recoverablePerMonth = recoverableJobsPerMonth * jobValue;

  return {
    score,
    band: bandFor(score),
    leaks: leaks.sort((a, b) => b.severity - a.severity),
    leadsPerMonth,
    jobValue,
    lostPerMonth: Math.round(lostPerMonth),
    recoverablePerMonth: Math.round(recoverablePerMonth),
    recoverablePerYear: Math.round(recoverablePerMonth * 12),
    recoverableJobsPerMonth,
    complete: answeredScored.length === scored.length,
  };
}

/* ------------------------------------------------- shareable result state */

/** Compact, URL-safe encoding so a result can be shared or revisited. */
export function encodeAnswers(answers: Answers): string {
  const compact = scorecardQuestions
    .map((q) => {
      const value = answers[q.id];
      if (!value) return "";
      const index = q.options.findIndex((o) => o.value === value);
      return index >= 0 ? String(index) : "";
    })
    .join("-");
  return compact;
}

export function decodeAnswers(encoded: string | null): Answers {
  if (!encoded) return {};
  const parts = encoded.split("-");
  const answers: Answers = {};
  scorecardQuestions.forEach((q, i) => {
    const raw = parts[i];
    if (raw === undefined || raw === "") return;
    const index = Number(raw);
    const option = Number.isInteger(index) ? q.options[index] : undefined;
    if (option) answers[q.id] = option.value;
  });
  return answers;
}
