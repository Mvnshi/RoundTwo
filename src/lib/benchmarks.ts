/**
 * Published research we're willing to stand behind, with its provenance
 * attached. `confidence` is deliberately part of the data model: a lot of the
 * numbers circulating in this industry are vendor blog posts citing each other,
 * and we'd rather show our working than add to the pile.
 */

export type Provenance = "primary" | "publisher" | "vendor-published" | "unverifiable";

export type Benchmark = {
  id: string;
  stat: string;
  claim: string;
  source: string;
  sourceUrl: string;
  year: string;
  provenance: Provenance;
  note?: string;
};

export const provenanceLabel: Record<Provenance, string> = {
  primary: "Primary study",
  publisher: "Published by a research publisher",
  "vendor-published": "Vendor-published",
  unverifiable: "Widely repeated, not verifiable",
};

export const benchmarks: Benchmark[] = [
  {
    id: "mit-5-minute",
    stat: "21×",
    claim:
      "The odds of qualifying a lead drop by about 21× when the first call goes out at 30 minutes instead of 5. The odds of making contact at all drop by about 100×.",
    source: "Dr James Oldroyd, MIT Sloan / InsideSales.com — Lead Response Management Study",
    sourceUrl: "https://www.leadresponsemanagement.org/lrm_study",
    year: "2007",
    provenance: "primary",
    note:
      "This is the study behind the “5-minute rule.” It is routinely attributed to Harvard. It is not a Harvard study.",
  },
  {
    id: "hbr-42-hours",
    stat: "42 hours",
    claim:
      "In an audit of 2,241 US companies, the average first response to a web lead took around 42 hours, and roughly 23% of companies never responded at all.",
    source: "Harvard Business Review — “The Short Life of Online Sales Leads”",
    sourceUrl: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
    year: "2011",
    provenance: "publisher",
    note:
      "The full article is paywalled, so these figures come from HBR's own summary and consistent secondary reporting rather than our reading of the raw data.",
  },
  {
    id: "servicetitan-booking",
    stat: "~42%",
    claim:
      "A typical home-services shop books slightly more than four in ten of the calls it takes. The rest of those conversations end without a job on the calendar.",
    source: "ServiceTitan — published industry statistics",
    sourceUrl: "https://www.servicetitan.com/blog/home-services-industry-statistics",
    year: "2025",
    provenance: "vendor-published",
    note:
      "ServiceTitan sells software to contractors, so read it accordingly — but this figure is at least published openly, which is more than most.",
  },
  {
    id: "missed-call-range",
    stat: "14–62%",
    claim:
      "Published estimates of how many inbound calls home-services businesses miss range from about 14% to about 62%, depending on who is doing the publishing.",
    source: "Range across vendor-published benchmarks",
    sourceUrl: "https://www.servicetitan.com/blog/home-services-industry-statistics",
    year: "2024–2026",
    provenance: "unverifiable",
    note:
      "A spread that wide is not a benchmark. It means nobody has measured this across the industry, and any single number quoted at you is a guess wearing a suit.",
  },
];

/** The claims our own tools are anchored against, in one place. */
export const modellingNotes = [
  "Leak rates in the scorecard are modelling assumptions derived from the answers you give, not measurements of your business.",
  "We model a 10% recovery rate on lost opportunities. Published response-time research implies higher ceilings; we would rather under-promise.",
  "Job values and lead volumes use the midpoint of the range you pick, so the output is an order of magnitude, not a forecast.",
] as const;
