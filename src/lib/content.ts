import type { LucideIcon } from "lucide-react";
import {
  Archive,
  CalendarCheck,
  FileText,
  Hourglass,
  MessageSquareReply,
  PhoneMissed,
  Search,
  Send,
} from "lucide-react";

/* ------------------------------------------------------------------ hero */

export const hero = {
  eyebrow: "Revenue recovery for contractors",
  headlineTop: "You already paid for the lead.",
  headlineBottomBefore: "Get ",
  headlineBottomMark: "another shot",
  headlineBottomAfter: " at the job.",
  body: "RoundTwo helps contractors recover missed calls, ghosted estimates and forgotten leads with follow-up that remembers what happened before.",
  proofPoints: [
    "No CRM migration",
    "Built around your existing workflow",
    "Founding partners now",
  ],
} as const;

/* ------------------------------------------- hero visual: recovery timeline */

export type RecoveryStatus = "neutral" | "lost" | "working" | "recovered";

export type RecoveryStep = {
  id: string;
  label: string;
  detail?: string;
  meta: string;
  icon: LucideIcon;
  status: RecoveryStatus;
};

export const exampleOpportunity = {
  name: "Sarah M.",
  job: "Roof replacement",
  value: 14800,
  source: "Google Local Services",
  stage: "Estimate sent",
} as const;

export const recoverySteps: RecoveryStep[] = [
  {
    id: "estimate",
    label: "Estimate sent",
    meta: "Mar 3",
    icon: FileText,
    status: "neutral",
  },
  {
    id: "silence",
    label: "No response",
    detail: "Six days of silence. CRM stage never moved.",
    meta: "Mar 9",
    icon: Hourglass,
    status: "lost",
  },
  {
    id: "context",
    label: "RoundTwo finds the last objection",
    detail: "Call notes, Feb 28 — “waiting on the insurance adjuster.”",
    meta: "Recovery queue",
    icon: Search,
    status: "working",
  },
  {
    id: "outreach",
    label: "Follow-up sent",
    detail: "“Hi Sarah — did the adjuster make it out yet?”",
    meta: "2:14 PM",
    icon: Send,
    status: "working",
  },
  {
    id: "reply",
    label: "Sarah replied",
    detail: "“He came Tuesday. Approved for full replacement.”",
    meta: "2:31 PM",
    icon: MessageSquareReply,
    status: "recovered",
  },
  {
    id: "booked",
    label: "Estimate call booked",
    detail: "Thursday, 9:00 AM — assigned to Dave",
    meta: "Booked",
    icon: CalendarCheck,
    status: "recovered",
  },
];

/* ------------------------------------------------------------------ leak */

export const leaks = [
  {
    index: "01",
    icon: PhoneMissed,
    title: "The missed call",
    body: "A homeowner calls while every crew lead is on a roof. Nobody calls back for four hours. By then they have three other quotes.",
    cost: "Answered in minutes, or lost",
  },
  {
    index: "02",
    icon: Hourglass,
    title: "The slow first response",
    body: "A form fills in at 7pm. The first reply goes out the next morning. The job was booked with whoever replied first.",
    cost: "Paid for, never worked",
  },
  {
    index: "03",
    icon: FileText,
    title: "The ghosted estimate",
    body: "Two hours of measuring, pricing and writing. The customer goes quiet. Nobody knows why, so nobody follows up again.",
    cost: "Highest-value leak",
  },
  {
    index: "04",
    icon: Archive,
    title: "The lead graveyard",
    body: "Eighteen months of opportunities sitting in the CRM at every stage but Won. No one has time to read back through them.",
    cost: "Already paid for",
  },
] as const;

/* ---------------------------------------------------------- how it works */

export const steps = [
  {
    number: "01",
    title: "Find the leaks",
    body: "We pull together the opportunities already moving through your business — calls, forms, quotes, CRM leads and the conversations attached to them.",
    bullets: ["Missed and abandoned calls", "Unsold estimates", "Dormant CRM opportunities"],
  },
  {
    number: "02",
    title: "Use the context",
    body: "Every follow-up starts from what actually happened last time: the objection, the number quoted, the stage they stalled at. Not a blank template.",
    bullets: ["Prior conversations", "Quote and stage history", "Why the deal stalled"],
  },
  {
    number: "03",
    title: "Recover the opportunity",
    body: "Follow-up continues on the channels you're authorised to use, and stops the moment it should — a reply, a booking, a no, an opt-out, or a rep taking over.",
    bullets: ["Reply routed to your team", "Appointment on your calendar", "Clean stop and opt-out rules"],
  },
] as const;

/* ------------------------------------------------------ persistent context */

export const contextComparison = {
  generic: {
    label: "Generic automation",
    caption: "What most follow-up tools send on day 7",
    message:
      "Hey Sarah, just following up on the estimate we sent. Let us know if you have any questions!",
    outcome: "Ignored. It tells her nothing she doesn't already know.",
  },
  contextual: {
    label: "Context-aware recovery",
    caption: "What the same message looks like with the history attached",
    context: {
      source: "Call notes · Feb 28",
      quote: "Waiting on the insurance adjuster before deciding on the roof.",
    },
    message:
      "Hey Sarah — you mentioned you were waiting on the insurance adjuster before deciding on the roof. Did they get a chance to come out yet? If so I can get the next step scheduled.",
    outcome: "Answerable. It asks about the one thing blocking the job.",
  },
} as const;

/* ------------------------------------------------------------- not a CRM */

export const stackLayers = [
  {
    label: "Your lead sources",
    detail: "Google, Angi, referrals, door knocks, past customers",
    role: "yours",
  },
  {
    label: "Your CRM and phone system",
    detail: "Where the opportunity, notes and quote already live",
    role: "yours",
  },
  {
    label: "RoundTwo recovery layer",
    detail: "Reads the history, prioritises what's worth another shot, works the follow-up",
    role: "ours",
  },
  {
    label: "Your calendar and sales team",
    detail: "Replies and booked appointments land where your team already works",
    role: "yours",
  },
] as const;

/* ------------------------------------------------------- founding partner */

export const foundingPartner = {
  bullets: [
    "Map where opportunities are actually falling through",
    "Identify the highest-value recovery opportunities you already own",
    "Design the follow-up around your current sales process",
    "Agree how recovered opportunities get measured",
    "Keep your existing CRM, phone system and team",
  ],
} as const;

/* ------------------------------------------------------------------- faq */

export const faqs = [
  {
    question: "What actually happens in the free recovery audit?",
    answer:
      "A short working session. We look at how leads come in, what happens when nobody picks up, how estimates get followed up and what's sitting unworked in your CRM. You leave with a written picture of where opportunities are leaking and what the realistic recovery opportunity looks like — whether or not you work with us.",
  },
  {
    question: "Do I have to switch CRMs?",
    answer:
      "No. Replacing the system your team already lives in is the fastest way to lose a year. RoundTwo is designed to sit on top of what you run today and put replies and booked appointments back into it.",
  },
  {
    question: "Is this just an AI receptionist?",
    answer:
      "No. Answering the phone is one leak. The bigger money is usually in estimates that went quiet and opportunities that have been sitting in the CRM for months. RoundTwo is built around working opportunities you already paid for.",
  },
  {
    question: "How is this different from the follow-up automation I already have?",
    answer:
      "Most automation sends the same message to everyone on a timer. RoundTwo starts from what happened in the last conversation — the objection, the quoted number, the stage the job stalled at — so the follow-up is about their job rather than about your pipeline.",
  },
  {
    question: "Is the product live today?",
    answer:
      "We're in the founding-partner stage. We're onboarding a small number of contractors and building each recovery system around their existing sales workflow, closer to a done-for-you engagement than self-serve software. That's deliberate: we'd rather get a handful of contractors real recovered revenue than ship a generic dashboard.",
  },
  {
    question: "What about texting rules and opt-outs?",
    answer:
      "Follow-up only ever uses channels and contacts your business is authorised to contact, with consent handling and opt-out honoured on every message. We work through this with you during setup — it is part of the design, not an afterthought.",
  },
  {
    question: "What does it cost?",
    answer:
      "The recovery audit is free. Pricing for founding partners is agreed case by case once we can see the volume and the job values involved, and it's built to be a fraction of the revenue being recovered. If the numbers don't work for your business, we'll say so.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "A conversation, a look at how leads currently flow, and read access to the opportunities you want worked. No rollout, no retraining your team, no migration.",
  },
] as const;

/* -------------------------------------------------------------- lead form */

export const businessTypes = [
  "Roofing",
  "Remodeling",
  "Electrical",
  "HVAC",
  "Plumbing",
  "Other home services",
] as const;

export const leadVolumes = [
  "Under 25",
  "25-50",
  "51-100",
  "101-250",
  "251-500",
  "500+",
] as const;

export const crmOptions = [
  "ServiceTitan",
  "Jobber",
  "JobNimbus",
  "AccuLynx",
  "Housecall Pro",
  "HubSpot",
  "Salesforce",
  "Spreadsheets / paper",
  "Other",
] as const;
