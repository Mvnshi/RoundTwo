/**
 * Post registry. Each post is a real route under /blog/<slug>; this is the
 * metadata used by the index, the sitemap, the JSON-LD and the related links,
 * so it stays in one place.
 */

export type Post = {
  slug: string;
  title: string;
  /** The one-sentence answer, written so an answer engine can lift it whole. */
  answer: string;
  description: string;
  published: string;
  updated?: string;
  readingMinutes: number;
  tag: string;
};

export const posts: Post[] = [
  {
    slug: "contractor-lead-response-statistics",
    title: "Every contractor lead-response statistic, traced back to its source",
    answer:
      "The famous “respond in 5 minutes” statistic comes from a 2007 MIT–InsideSales study, not from Harvard. Harvard Business Review ran a separate 2011 audit with different numbers, and the widely quoted missed-call rates for home services range from 14% to 62% depending entirely on who published them.",
    description:
      "The 5-minute rule, the 21x multiplier, the 62% missed-call figure. We traced the statistics contractors get quoted back to their original studies. Several of them are misattributed, and one of the most cited reports isn't public at all.",
    published: "2026-08-25",
    readingMinutes: 9,
    tag: "Research",
  },
  {
    slug: "dead-leads-in-your-crm",
    title: "What to actually do with 500 dead leads in your CRM",
    answer:
      "Work them in order of value, not date. Start with unsold estimates from the last twelve months, open with the specific reason the job stalled rather than a generic check-in, and give every contact a clean way to say no so the list gets smaller and better each pass.",
    description:
      "A practical order of operations for reviving old contractor leads: which ones to touch first, what to say, what to never say, and how to tell the difference between a dead list and a badly worked one.",
    published: "2026-08-25",
    readingMinutes: 8,
    tag: "Playbook",
  },
  {
    slug: "how-fast-to-call-back-a-lead",
    title: "How fast do you actually have to call back a contractor lead?",
    answer:
      "Fast enough to be first. The research supports minutes rather than hours, but the real target is beating the other two or three contractors the homeowner contacted in the same sitting — which usually means an acknowledgement inside five minutes and a human call inside the hour.",
    description:
      "What the response-time research actually supports, where the 5-minute rule comes from, and what a realistic callback standard looks like for a contracting business that can't staff a call centre.",
    published: "2026-08-25",
    readingMinutes: 7,
    tag: "Research",
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export const postDateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});
