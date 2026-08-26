import type { Metadata } from "next";

import { ArticleLayout } from "@/components/blog/article-layout";
import {
  A,
  AnswerBox,
  Callout,
  DataTable,
  H2,
  LI,
  Lede,
  P,
  SourceList,
  Strong,
  UL,
} from "@/components/blog/prose";
import { getPost } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

const post = getPost("contractor-lead-response-statistics")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    type: "article",
    url: `${siteUrl}/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    publishedTime: post.published,
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description },
};

export default function Page() {
  return (
    <ArticleLayout post={post}>
      <Lede>
        If you sell to contractors, you have read the same four statistics a hundred
        times. Respond in five minutes or lose the lead. Twenty-one times more likely to
        qualify. Sixty-two percent of calls go unanswered. Harvard says so.
      </Lede>

      <AnswerBox>{post.answer}</AnswerBox>

      <P>
        We went looking for the original studies behind the numbers in our own market,
        because we were about to start quoting them ourselves. What we found was a
        citation chain that mostly loops back on itself: vendor blog citing vendor blog
        citing a press release about a study from 2007. Here is what actually holds up.
      </P>

      <H2 id="the-five-minute-rule">The “5-minute rule” is real. It is not from Harvard.</H2>

      <P>
        The single most-quoted statistic in home-services marketing is that contacting a
        lead within five minutes makes you dramatically more likely to qualify it. The
        multipliers usually given are 100× for making contact and 21× for qualifying.
        Those numbers are real, and they come from the{" "}
        <A href="https://www.leadresponsemanagement.org/lrm_study">
          Lead Response Management Study
        </A>{" "}
        run by Dr James Oldroyd, then at MIT Sloan, in partnership with InsideSales.com.
        It was published in 2007 and looked at several million sales calls.
      </P>

      <P>
        It is attributed to Harvard constantly. It is not a Harvard study. Harvard
        Business Review published a{" "}
        <Strong>separate</Strong> piece in 2011 called{" "}
        <A href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads">
          “The Short Life of Online Sales Leads”
        </A>
        , which audited 2,241 US companies and reported an average first response of
        around 42 hours, with roughly 23% never responding at all. Different study,
        different method, different numbers.
      </P>

      <Callout tone="warning" title="Why this matters to you">
        <p>
          Not because attribution is sacred, but because the two studies say different
          things. The MIT numbers are about <Strong>outbound calling speed on
          qualified-lead lists</Strong>. The HBR numbers are about{" "}
          <Strong>whether companies respond at all</Strong>. A vendor blending them into
          one sentence is telling you something neither study established.
        </p>
      </Callout>

      <H2 id="what-holds-up">What holds up, and how confident you should be</H2>

      <DataTable
        head={["Claim", "Where it comes from", "How much to trust it"]}
        rows={[
          [
            "5 minutes vs 30 minutes: ~100× contact, ~21× qualify",
            "Oldroyd, MIT Sloan / InsideSales, 2007",
            "Solid, but it is a B2B inside-sales study from 2007, not a study of contractors.",
          ],
          [
            "~42 hour average first response, ~23% never respond",
            "Harvard Business Review, 2011",
            "Credible publisher. The full article is paywalled, so most of us are citing HBR's summary rather than the data.",
          ],
          [
            "A typical shop books ~42% of the calls it takes",
            "ServiceTitan, published industry statistics",
            "Vendor-published and therefore interested — but openly published, which is more than most.",
          ],
          [
            "62% of calls to service businesses go unanswered",
            "Traceable only to vendor blogs citing each other",
            "Treat as unsourced. Other vendor benchmarks put home services nearer 14%.",
          ],
        ]}
        caption="Provenance as of August 2026. If you find a primary source for the last row, we would genuinely like to see it."
      />

      <H2 id="the-missed-call-problem">The missed-call number nobody can actually source</H2>

      <P>
        Published estimates for how many inbound calls home-services businesses miss run
        from about 14% to about 62%. That is not a disagreement at the margins. That is
        the difference between a rounding error and half your phone traffic.
      </P>

      <P>
        A spread that wide means the industry has not measured this. It means somebody
        counted something, in some sample, at some time of year, and everyone else
        reprinted it. When a vendor quotes you a missed-call rate, the honest reading is
        that they are describing their own customer base at best, and repeating a blog
        post at worst.
      </P>

      <Callout title="The one number that is yours">
        <p>
          Your phone system already knows your real missed-call rate. So does your CRM,
          for unsold estimates. Ten minutes in your own reporting beats every benchmark
          in this article, because it is the only figure that describes your business.
        </p>
      </Callout>

      <H2 id="the-report-you-cannot-read">The benchmark report you are being quoted but cannot read</H2>

      <P>
        Several posts cite “ServiceTitan&apos;s Home Services Benchmark Report” for
        precise conversion figures. That report exists — but it is a{" "}
        <Strong>private, personalised quarterly document</Strong> delivered to eligible
        ServiceTitan customers who have completed at least 100 jobs in the period. It is
        not a public research publication you can go and check.
      </P>

      <P>
        Citing it is not dishonest exactly. It is just unfalsifiable, which for a
        statistic is nearly the same problem.
      </P>

      <H2 id="what-to-do-with-this">What to do with all of this</H2>

      <UL>
        <LI>
          <Strong>Speed matters.</Strong> Every credible study points the same direction,
          even if the multipliers get mangled in transit. Being first is worth more than
          being polished.
        </LI>
        <LI>
          <Strong>Benchmarks are for orientation, not diagnosis.</Strong> Use them to
          decide what to measure, never as a substitute for measuring it.
        </LI>
        <LI>
          <Strong>Ask where a number came from.</Strong> If a vendor cannot name a study
          you can open, the number is marketing, and you should price it accordingly —
          including when the vendor is us.
        </LI>
      </UL>

      <P>
        We build revenue recovery software for contractors, so we have every commercial
        incentive to tell you the scariest version of these numbers. We would rather tell
        you the checkable version and let the real ones do the arguing.
      </P>

      <SourceList
        sources={[
          {
            label: "Lead Response Management Study — Oldroyd, MIT Sloan / InsideSales (2007)",
            href: "https://www.leadresponsemanagement.org/lrm_study",
            note: "The origin of the 5-minute rule and the 100× / 21× multipliers.",
          },
          {
            label: "The Short Life of Online Sales Leads — Harvard Business Review (2011)",
            href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
            note: "Audit of 2,241 US companies. Full text paywalled.",
          },
          {
            label: "Home services industry statistics — ServiceTitan",
            href: "https://www.servicetitan.com/blog/home-services-industry-statistics",
            note: "Source of the ~42% call booking rate.",
          },
          {
            label: "Benchmark Reports — ServiceTitan documentation",
            href: "https://help.servicetitan.com/docs/access-benchmark-reports",
            note: "Confirms the report is a private, per-customer quarterly document.",
          },
        ]}
      />
    </ArticleLayout>
  );
}
