import type { Step } from "@/lib/friction/score";

export const company = {
  name: "Friction Company",
  line: "Everything between intention and action.",
  promise: "Make the right things easier. Make the wrong things harder.",
  email: "hello@frictioncompany.com",
} as const;

export interface FrictionPath {
  id: string;
  /** The thing the person actually wanted. */
  intention: string;
  /** Short form for the tab strip, which has to survive a 320px screen. */
  tab: string;
  /** Where the path is walked. */
  context: string;
  steps: Step[];
  /** One line on what the engineered version does differently. */
  after: string;
}

/*
  Three paths, drawn from the kinds of process everyone has walked. They are
  illustrations of the method, not audits of any particular company — no real
  organisation is named or scored here.
*/

export const paths: FrictionPath[] = [
  {
    id: "checkout",
    tab: "Buy something",
    intention: "Buy the thing I already decided to buy",
    context: "An online store",
    after:
      "Guest checkout, address autofilled, one saved payment method, shipping chosen by default.",
    steps: [
      {
        id: "c1",
        label: "Create an account",
        kind: "auth",
        verdict: "delete",
        because: "You wanted an object, not a relationship.",
      },
      {
        id: "c2",
        label: "Verify your email",
        kind: "switch",
        verdict: "delete",
        because: "Leaves the purchase to go to a different application.",
      },
      {
        id: "c3",
        label: "Find your password",
        kind: "recall",
        verdict: "delete",
        because: "Falls away entirely once the account does.",
      },
      {
        id: "c4",
        label: "Enter your address",
        kind: "input",
        verdict: "automate",
        because: "The browser and the card both already hold it.",
      },
      {
        id: "c5",
        label: "Find your card",
        kind: "search",
        verdict: "automate",
        because: "A saved method removes the trip to another room.",
      },
      {
        id: "c6",
        label: "Decode the shipping options",
        kind: "decision",
        verdict: "redesign",
        because: "Default to the sensible one. Let the rare case opt out.",
      },
      {
        id: "c7",
        label: "Answer a marketing question",
        kind: "input",
        verdict: "delete",
        because: "Serves the seller, costs the buyer. Dark friction.",
      },
      {
        id: "c8",
        label: "Wait for a confirmation",
        kind: "wait",
        verdict: "redesign",
        because: "Confirm instantly on screen; email can follow.",
      },
      {
        id: "c9",
        label: "Pay",
        kind: "action",
        verdict: "keep",
        because: "This is the transaction. It stays.",
      },
    ],
  },
  {
    id: "followup",
    tab: "Reply to a customer",
    intention: "Reply to one customer",
    context: "A company with a CRM",
    after:
      "The record, the history and the last conversation arrive together, in one place, before the reply is written.",
    steps: [
      {
        id: "f1",
        label: "Find the record",
        kind: "search",
        verdict: "automate",
        because: "The message already identifies the customer.",
      },
      {
        id: "f2",
        label: "Read the notes",
        kind: "search",
        verdict: "redesign",
        because: "Bring the notes to the reply, not the reply to the notes.",
      },
      {
        id: "f3",
        label: "Open another system",
        kind: "switch",
        verdict: "delete",
        because: "Two systems that will not talk is a friction tax.",
      },
      {
        id: "f4",
        label: "Search old emails",
        kind: "search",
        verdict: "automate",
        because: "History is data. Data can be assembled.",
      },
      {
        id: "f5",
        label: "Remember what happened",
        kind: "recall",
        verdict: "automate",
        because: "Never make a person reconstruct what a system recorded.",
      },
      {
        id: "f6",
        label: "Decide what to say",
        kind: "decision",
        verdict: "keep",
        because: "Judgement. This is the part worth a human.",
      },
      {
        id: "f7",
        label: "Write it",
        kind: "action",
        verdict: "keep",
        because: "The actual work. Three minutes.",
      },
      {
        id: "f8",
        label: "Update the CRM",
        kind: "input",
        verdict: "automate",
        because: "The system watched this happen. It can write it down.",
      },
      {
        id: "f9",
        label: "Set a reminder",
        kind: "input",
        verdict: "automate",
        because: "A follow-up rule beats a person's memory every time.",
      },
    ],
  },
  {
    id: "run",
    tab: "Go for a run",
    intention: "Go for a run",
    context: "A Tuesday morning",
    after:
      "Clothes laid out the night before, one fixed route, headphones on the charger, phone left in the kitchen.",
    steps: [
      {
        id: "r1",
        label: "Wake up",
        kind: "action",
        verdict: "keep",
      },
      {
        id: "r2",
        label: "Find your clothes",
        kind: "search",
        verdict: "delete",
        because: "Laid out last night. The decision was already made.",
      },
      {
        id: "r3",
        label: "Decide which workout",
        kind: "decision",
        verdict: "delete",
        because: "One default route. Choosing is tomorrow's problem.",
      },
      {
        id: "r4",
        label: "Find your headphones",
        kind: "search",
        verdict: "delete",
        because: "One place they live. Environment, not discipline.",
      },
      {
        id: "r5",
        label: "Charge them",
        kind: "wait",
        verdict: "delete",
        because: "Charging happens at night, not between you and the door.",
      },
      {
        id: "r6",
        label: "Find your shoes",
        kind: "search",
        verdict: "delete",
        because: "By the door. Always.",
      },
      {
        id: "r7",
        label: "Work out where to go",
        kind: "decision",
        verdict: "delete",
        because: "A default route removes the whole calculation.",
      },
      {
        id: "r8",
        label: "Resist opening your phone",
        kind: "decision",
        verdict: "add",
        because: "Leave the phone in another room. Make the wrong thing harder.",
      },
      {
        id: "r9",
        label: "Convince yourself to leave",
        kind: "decision",
        verdict: "redesign",
        because: "Nine obstacles removed is most of the convincing.",
      },
      {
        id: "r10",
        label: "Run",
        kind: "action",
        verdict: "keep",
        because: "Thirty minutes. The part that was never the problem.",
      },
    ],
  },
];

/* --------------------------------------------------------------- gradient */

export interface GradientPath {
  label: string;
  steps: string[];
  tone: "easy" | "hard";
}

/** Two behaviours, one environment. The difference is not willpower. */
export const gradient: { a: GradientPath; b: GradientPath } = {
  a: {
    label: "Open the feed",
    tone: "easy",
    steps: ["Reach", "Tap"],
  },
  b: {
    label: "Read the book",
    tone: "hard",
    steps: [
      "Notice you meant to",
      "Remember where it is",
      "Get up",
      "Cross the room",
      "Find your place",
      "Find the light",
      "Put the phone down",
      "Keep it down",
    ],
  },
};

/* --------------------------------------------------------------- taxonomy */

/** Friction is not one thing. It is all of this, and it adds up. */
export const taxonomy = [
  "extra step",
  "unnecessary decision",
  "forgotten password",
  "missing context",
  "confusing interface",
  "approval",
  "delay",
  "form",
  "handoff",
  "notification",
  "login",
  "search",
  "repeated question",
  "manual process",
  "moment of uncertainty",
  "change of application",
  "unnecessary choice",
  "interruption",
  "physical obstacle",
  "social barrier",
  "emotional barrier",
] as const;

/* ------------------------------------------------------------ good friction */

export const goodFriction = [
  {
    action: "Deleting the database",
    intervention: "Type the name of the thing you are destroying.",
  },
  {
    action: "Wiring your life savings",
    intervention: "A second step, a second person, a second look.",
  },
  {
    action: "Reaching for your phone at 1am",
    intervention: "It charges in the kitchen.",
  },
  {
    action: "Publishing a dangerous change",
    intervention: "Review before it ships, not after it breaks.",
  },
  {
    action: "Spending on impulse",
    intervention: "Remove the saved card. Reintroduce the walk to your wallet.",
  },
  {
    action: "An irreversible operation",
    intervention: "Make it harder than creating a draft. Make undo exist.",
  },
] as const;

/* ------------------------------------------------------------------- laws */

export const laws = [
  { n: "001", text: "Every decision is an exit opportunity." },
  {
    n: "002",
    text: "Never ask a human for information the system already knows.",
  },
  { n: "003", text: "Friction compounds across sequential steps." },
  { n: "004", text: "Defaults outperform intention." },
  {
    n: "005",
    text: "People tolerate friction better when they understand why it exists.",
  },
  { n: "006", text: "Invisible waiting feels longer than visible progress." },
  {
    n: "007",
    text: "A recurring five-second problem eventually becomes a large problem.",
  },
  {
    n: "008",
    text: "People blame themselves for failures caused by environment design.",
  },
  { n: "009", text: "Removing a task is better than accelerating it." },
  {
    n: "010",
    text: "The easiest available behaviour captures disproportionate human action.",
  },
  {
    n: "011",
    text: "Context retrieval is often more expensive than the action itself.",
  },
  {
    n: "012",
    text: "Bad friction survives because its cost is distributed.",
  },
] as const;

/* ----------------------------------------------------------------- lexicon */

export const lexicon = [
  {
    term: "Friction Score",
    def: "How much resistance sits between intention and completion.",
  },
  {
    term: "Friction Map",
    def: "A drawing of every obstacle along a path, in order.",
  },
  {
    term: "Friction Debt",
    def: "Resistance accumulated through years of individually reasonable decisions.",
  },
  {
    term: "Friction Budget",
    def: "How much effort, thought and uncertainty a person will absorb before abandoning the action.",
  },
  {
    term: "Friction Shift",
    def: "Moving resistance from one behaviour to another instead of removing it.",
  },
  {
    term: "Friction Tax",
    def: "The recurring cost an inefficient system charges everyone who touches it.",
  },
  {
    term: "Friction Point",
    def: "A single moment where resistance rises.",
  },
  {
    term: "Friction Loop",
    def: "A process where one obstacle manufactures the next.",
  },
  {
    term: "Friction Stack",
    def: "Independent sources of resistance piling up inside one experience.",
  },
  {
    term: "Friction Gradient",
    def: "The difference in effort between two competing behaviours. If one costs a tap and the other costs twenty steps, the environment has already chosen.",
  },
  {
    term: "Dark Friction",
    def: "Resistance that benefits the system's owner at the user's expense.",
  },
  {
    term: "Good Friction",
    def: "Deliberate resistance that buys safety, thought, trust or a better outcome.",
  },
  {
    term: "Bad Friction",
    def: "Resistance without sufficient benefit to anyone.",
  },
  {
    term: "Zero-Step Design",
    def: "Removing the requirement for human action entirely.",
  },
  {
    term: "Default Engineering",
    def: "Changing the path of least resistance, and therefore the behaviour.",
  },
  {
    term: "Friction Engineering",
    def: "The deliberate design of resistance. The discipline containing all of the above.",
  },
] as const;

/* ------------------------------------------------------------------ audit */

export const auditDomains = [
  "Checkout",
  "Onboarding",
  "Sales",
  "Customer service",
  "Internal workflows",
  "Hiring",
  "Approvals",
  "Reporting",
  "Documentation",
  "Fulfilment",
  "Cancellation",
  "Accessibility",
  "Software estates",
  "Physical environments",
  "Public services",
] as const;

export const auditFindings = [
  "unnecessary steps",
  "repeated decisions",
  "redundant data entry",
  "context switching",
  "waiting",
  "unclear ownership",
  "missing information",
  "duplicate work",
  "bad defaults",
  "abandoned workflows",
  "avoidable cognitive load",
  "unnecessary software",
  "over-automation",
  "broken handoffs",
  "invisible progress",
  "missing recovery paths",
  "accessibility barriers",
] as const;

/** The questions asked in every audit, of every step. */
export const questions = [
  "Why is this here?",
  "Who added it?",
  "Who benefits from it?",
  "Does anyone remember why it exists?",
  "What happens if we remove it?",
  "Could the computer do this?",
  "Could nobody do this?",
  "Why does this require a decision?",
  "Why isn't this the default?",
  "Why does the user need to remember this?",
  "Why are we asking twice?",
  "Why are we waiting?",
  "Why does this require permission?",
  "Why can't I undo this?",
  "What mistake are we protecting against?",
  "Should this actually be harder?",
  "What would the zero-step version look like?",
] as const;

/** Effort we are not trying to remove, paired with the friction around it. */
export const notEffort = [
  { hard: "Lifting a heavy weight", easy: "Finding your membership barcode" },
  { hard: "Writing a good book", easy: "Finding your notes" },
  { hard: "Building a company", easy: "Copying a customer between five systems" },
  { hard: "Having a difficult conversation", easy: "Scheduling it" },
  { hard: "Learning something", easy: "Remembering which site the lesson is on" },
] as const;

export const flywheel = [
  { step: "Observe", note: "Find the resistance." },
  { step: "Document", note: "Make it visible." },
  { step: "Measure", note: "Score it." },
  { step: "Explain", note: "Show the mechanism." },
  { step: "Redesign", note: "Draw the better path." },
  { step: "Name", note: "Extract the principle." },
  { step: "Publish", note: "Spread the lens." },
  { step: "Collect", note: "Receive the next example." },
] as const;
