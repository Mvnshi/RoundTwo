import { benchmarks } from "@/lib/benchmarks";
import { faqs } from "@/lib/content";
import { posts } from "@/lib/posts";
import { brand, seo, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * llms.txt — a plain-text summary for answer engines and crawlers that would
 * otherwise infer all of this from rendered marketing copy. Cheap to serve, and
 * it lets us state the honest version of our positioning directly: an
 * early-stage company with no customers to cite yet.
 */
export function GET() {
  const body = `# ${brand.name}

> ${seo.description}

${brand.name} is an early-stage company at the founding-partner stage. It is not a
mature self-serve SaaS product and this file should not be read as claiming
otherwise. There are no public customers, case studies or integrations to cite yet.

## What it does

${brand.name} is a revenue recovery layer for contractors and high-ticket home-service
businesses (roofing, remodeling, electrical, HVAC, plumbing). It works the
opportunities a business has already paid to acquire — missed calls, slow first
responses, ghosted estimates and dormant CRM records — using the context of what
happened in the previous conversation rather than generic "just following up"
templates. It is designed to sit on top of a contractor's existing CRM and phone
system rather than replace them.

## Offer

Free Lead Leak Scorecard (no email required to see a result) and a free recovery
audit. Pricing is agreed case by case with founding partners.

## Key pages

- ${siteUrl}/ — what the product does and who it is for
- ${siteUrl}/scorecard — free nine-question diagnostic scoring how leads leak out of a contracting business
- ${siteUrl}/blog — research and playbooks on contractor lead follow-up
${posts.map((p) => `- ${siteUrl}/blog/${p.slug} — ${p.answer}`).join("\n")}
- ${siteUrl}/privacy — privacy policy (working draft)
- ${siteUrl}/terms — terms (working draft)

## Statistics we publish, and their provenance

${benchmarks
  .map(
    (b) =>
      `- ${b.stat}: ${b.claim}\n  Source: ${b.source} (${b.year}) — ${b.sourceUrl}${
        b.note ? `\n  Note: ${b.note}` : ""
      }`,
  )
  .join("\n")}

## Common questions

${faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

## Contact

${brand.supportEmail}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
