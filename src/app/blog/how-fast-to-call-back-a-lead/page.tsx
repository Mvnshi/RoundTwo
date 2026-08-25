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

const post = getPost("how-fast-to-call-back-a-lead")!;

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
        Every marketing company selling to contractors has a number for this. Five
        minutes. Sixty seconds. Ninety seconds. The numbers keep getting smaller, which
        should tell you something about where they come from.
      </Lede>

      <AnswerBox>{post.answer}</AnswerBox>

      <H2 id="what-the-research-supports">What the research actually supports</H2>

      <P>
        The credible evidence points one direction — faster is better — but it is thinner
        and older than the confident numbers suggest. The foundational work is the 2007{" "}
        <A href="https://www.leadresponsemanagement.org/lrm_study">
          Lead Response Management Study
        </A>{" "}
        from MIT Sloan and InsideSales, which found the odds of qualifying a lead dropped
        roughly 21× between a 5-minute and a 30-minute callback. Harvard Business Review&apos;s
        separate{" "}
        <A href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads">2011 audit</A>{" "}
        of 2,241 companies found an average first response of about 42 hours.
      </P>

      <P>
        We wrote up where each of these came from in{" "}
        <A href="/blog/contractor-lead-response-statistics">
          a full audit of the statistics
        </A>
        , because several of them are misattributed. The short version: the direction of
        travel is well supported, the precise multipliers are from B2B inside sales in
        2007, and nobody has run the equivalent study on roofing companies.
      </P>

      <H2 id="the-real-mechanism">The real mechanism is not urgency. It is queue position.</H2>

      <P>
        Response time does not work because homeowners are impatient. It works because of
        what they did immediately before contacting you: they opened three tabs and filled
        in three forms in the same sitting.
      </P>

      <P>
        You are not racing the clock. You are racing two other contractors. That reframing
        changes what “fast enough” means — it is not an absolute number, it is{" "}
        <Strong>first</Strong>. In a market where the median response is measured in
        hours, replying in fifteen minutes wins nearly as often as replying in two.
      </P>

      <Callout title="The practical implication">
        <p>
          You do not need a call centre. You need to not be third. An automated
          acknowledgement inside five minutes that buys you an hour is worth more than an
          expensive setup that answers in ninety seconds, because it moves you from third
          to first at a fraction of the cost.
        </p>
      </Callout>

      <H2 id="a-realistic-standard">A standard a real contracting business can hold</H2>

      <DataTable
        head={["Channel", "Target", "Why"]}
        rows={[
          [
            "Missed call",
            "Automatic text back within 60 seconds",
            "The caller is still holding the phone. This is the single highest-yield automation in the trade.",
          ],
          [
            "Web form, business hours",
            "Acknowledgement in 5 minutes, human call in 60",
            "The acknowledgement holds queue position; the call does the selling.",
          ],
          [
            "Web form, after hours",
            "Acknowledgement immediately, call first thing",
            "An immediate reply at 9pm beats a call at 9am from the competitor who did nothing.",
          ],
          [
            "Referral or repeat customer",
            "Same day, from a human, always",
            "Speed matters less here. Automation matters less too — they contacted you specifically.",
          ],
        ]}
        caption="A standard you can actually staff beats an aspirational one you miss most days."
      />

      <H2 id="what-gets-measured">What to measure instead of a benchmark</H2>

      <UL>
        <LI>
          <Strong>Your median first response, by channel.</Strong> Not your average — one
          lead answered three days late will hide fifty good ones.
        </LI>
        <LI>
          <Strong>Your never-responded rate.</Strong> HBR found roughly a quarter of
          companies never replied at all. Most owners assume this is zero for them. It
          rarely is.
        </LI>
        <LI>
          <Strong>Missed calls that got no callback the same day.</Strong> Your phone
          system knows this number and will export it.
        </LI>
      </UL>

      <P>
        Those three numbers describe your business. Every benchmark in every vendor blog
        describes somebody else&apos;s. If you want a structured read on where the time is
        going, <A href="/scorecard">the scorecard</A> covers it in about ninety seconds.
      </P>

      <SourceList
        sources={[
          {
            label: "Lead Response Management Study — Oldroyd, MIT Sloan / InsideSales (2007)",
            href: "https://www.leadresponsemanagement.org/lrm_study",
          },
          {
            label: "The Short Life of Online Sales Leads — Harvard Business Review (2011)",
            href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
          },
          {
            label: "Home services industry statistics — ServiceTitan",
            href: "https://www.servicetitan.com/blog/home-services-industry-statistics",
          },
        ]}
      />
    </ArticleLayout>
  );
}
