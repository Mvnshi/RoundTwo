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
  OL,
  P,
  Step,
  Strong,
  UL,
} from "@/components/blog/prose";
import { getPost } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

const post = getPost("dead-leads-in-your-crm")!;

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
        Every contracting business over a couple of years old is sitting on a list like
        this. Hundreds of names. Estimates that went quiet. People who said “not right
        now” in a season that has since come and gone twice.
      </Lede>

      <AnswerBox>{post.answer}</AnswerBox>

      <P>
        The instinct is to blast the whole list with a “just checking in” message and see
        what comes back. That is the one approach guaranteed to burn it. Here is a better
        order of operations.
      </P>

      <H2 id="sort-by-value">Sort by value, not by date</H2>

      <P>
        Almost everyone works these lists newest-first, because that is the default sort
        in every CRM. It is the wrong order. A $28,000 roof that stalled fourteen months
        ago is worth more attention than a $900 repair from last week, and the older job
        is often <Strong>more</Strong> reachable, not less — because the reason it stalled
        has usually resolved itself.
      </P>

      <DataTable
        head={["Segment", "Why it is worth touching", "Realistic expectation"]}
        rows={[
          [
            "Unsold estimates, last 12 months",
            "You already paid for the site visit and did the pricing. The whole cost is sunk.",
            "The highest-yield segment by a distance. Work it first, every time.",
          ],
          [
            "“Not right now” with a named season",
            "They told you when to come back. Almost nobody does.",
            "High. You are keeping a promise rather than making a pitch.",
          ],
          [
            "Insurance and financing stalls",
            "The blocker was external and it has almost certainly resolved.",
            "High, and the opener writes itself.",
          ],
          [
            "Past customers, 18 months+",
            "They already trusted you with money once.",
            "Moderate, but the best margin — no acquisition cost at all.",
          ],
          [
            "Cold form fills that never replied",
            "Cheap to touch, but they never engaged in the first place.",
            "Low. Work it last, or not at all.",
          ],
        ]}
      />

      <H2 id="the-opener">The opener is the whole job</H2>

      <P>
        A revival message has one job: prove you remember. Not that you have their record
        — that you remember the conversation. The difference is the entire difference.
      </P>

      <Callout tone="warning" title="What not to send">
        <p>
          “Hi Sarah, just following up on the estimate we sent — let us know if you have
          any questions!” This tells her nothing she does not already know, asks her to do
          all the work, and reads as automated because it is.
        </p>
      </Callout>

      <Callout title="What to send instead">
        <p>
          “Hi Sarah — you mentioned you were waiting on the insurance adjuster before
          deciding on the roof. Did they get out to you? If so I can get the next step
          scheduled.” Same length. Answerable in four words. It references the specific
          thing that stopped the job.
        </p>
      </Callout>

      <P>
        This is why the sort order matters so much. You can only write the second message
        if somebody wrote down why the job stalled. If your CRM has no such field, adding
        one is the highest-leverage thing you will do this quarter.
      </P>

      <H2 id="the-sequence">A sequence that does not burn the list</H2>

      <OL>
        <Step title="Start narrow">
          Take the top fifty by value, not the whole list. You are testing your opener
          before you spend the whole asset.
        </Step>
        <Step title="Lead with the blocker">
          One message, referencing the specific reason it stalled, ending in a question a
          person can answer with one line.
        </Step>
        <Step title="Give a real out">
          Include a clean way to say no. Counter-intuitively this raises reply rates, and
          it shrinks the list to the people worth working.
        </Step>
        <Step title="Wait a week, then change the angle">
          If there is no reply, the second touch should say something new — a price
          change, a season, a lead time — not repeat the first.
        </Step>
        <Step title="Stop at three, and mark why">
          Three unanswered touches means the record needs a status, not a fourth message.
          A list you have honestly closed out is more valuable than one you keep pretending
          is warm.
        </Step>
      </OL>

      <H2 id="rules">Rules worth keeping</H2>

      <UL>
        <LI>
          <Strong>Only contact people you are authorised to contact.</Strong> Consent and
          opt-out handling are not optional, and the rules for texting are stricter than
          most contractors assume. Check before you send, not after.
        </LI>
        <LI>
          <Strong>One channel at a time.</Strong> A text and an email and a call on the
          same morning reads as desperation.
        </LI>
        <LI>
          <Strong>Send from a person.</Strong> Replies go to a human who can actually book
          the job, or the whole exercise generates work you cannot service.
        </LI>
        <LI>
          <Strong>Measure recovered, not sent.</Strong> The only number that matters is
          jobs booked from the list. Open rates are a vanity metric on a list this warm.
        </LI>
      </UL>

      <H2 id="is-the-list-dead">Is the list dead, or just badly worked?</H2>

      <P>
        Nearly always the second. A lead is only genuinely dead when someone has said no,
        or the work has been done by somebody else, or you cannot lawfully contact them.
        Everything else is a list that nobody had time to work properly — which is a
        capacity problem, not a lead-quality problem, and the two have very different
        fixes.
      </P>

      <P>
        If you want a structured view of which of these segments is costing you most,{" "}
        <A href="/scorecard">the scorecard</A> takes about ninety seconds and gives you a
        conservative figure for the whole thing.
      </P>
    </ArticleLayout>
  );
}
