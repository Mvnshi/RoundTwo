import type { Metadata } from "next";

import { FrictionLab } from "@/components/friction/friction-lab";
import { GradientCompare } from "@/components/friction/gradient-compare";
import { InquiryForm } from "@/components/friction/inquiry-form";
import { Masthead } from "@/components/friction/masthead";
import { Frame, Lede, Section, Statement } from "@/components/friction/section";
import {
  auditDomains,
  auditFindings,
  company,
  flywheel,
  goodFriction,
  laws,
  lexicon,
  notEffort,
  questions,
  taxonomy,
} from "@/lib/friction/content";
import { VERDICTS } from "@/lib/friction/score";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Friction Company — everything between intention and action",
  description:
    "Friction is the distance between intention and action. Friction Company finds it, measures it, and decides what should disappear and what should be harder.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/friction#org`,
      name: company.name,
      description:
        "Friction Engineering: the deliberate design of resistance between intention and action.",
      url: `${siteUrl}/friction`,
      email: company.email,
      slogan: company.promise,
    },
    {
      "@type": "DefinedTermSet",
      "@id": `${siteUrl}/friction#lexicon`,
      name: "The Friction Lexicon",
      hasDefinedTerm: lexicon.map((entry) => ({
        "@type": "DefinedTerm",
        name: entry.term,
        description: entry.def,
      })),
    },
  ],
};

/** The four verdicts an audit can reach, in the order they should be tried. */
const VERDICT_ORDER = ["delete", "automate", "redesign", "add"] as const;

export default function FrictionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Serialised from a literal above; no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Masthead />

      <main id="top" className="flex-1">
        {/* ------------------------------------------------------- hero -- */}
        <div className="border-b border-ink">
          <Frame>
            <div className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
              <div>
                <p className="fr-label text-hazard-ink">
                  {company.line}
                </p>
                <h1 className="fr-mega mt-6 max-w-[15ch] text-balance">
                  <span className="text-dim">
                    Most things are not impossible.
                  </span>{" "}
                  They are surrounded by resistance.
                </h1>
              </div>

              <div className="flex flex-col justify-start lg:pt-3">
                <div className="border-t border-ink pt-5">
                  <p className="fr-lead max-w-md">
                    Friction is the distance between intention and action. It is
                    everything that makes an outcome less likely to happen.
                  </p>
                  <p className="fr-lead mt-4 max-w-md text-dim">
                    People overestimate motivation and underestimate
                    environment. The better question is usually not{" "}
                    <em className="not-italic text-ink">
                      why wasn&rsquo;t I disciplined enough
                    </em>
                    , but{" "}
                    <em className="not-italic text-ink">
                      why was the thing I wanted harder than the thing I
                      didn&rsquo;t
                    </em>
                    .
                  </p>
                </div>
              </div>
            </div>
          </Frame>

          {/* The measure: intention on the left, action on the right, and
              everything in between drawn as resistance. */}
          <Frame>
            <div className="border-t border-rule py-6">
              <div className="flex items-center gap-3 sm:gap-5">
                <span className="fr-label shrink-0">Intention</span>
                <span
                  aria-hidden
                  className="fr-tape h-3 flex-1 border-y border-ink"
                />
                <span className="fr-label shrink-0 text-hazard-ink">Action</span>
              </div>
              <p className="fr-meta mt-3 text-dim">
                Everything in the middle is our subject.
              </p>
            </div>
          </Frame>
        </div>

        {/* -------------------------------------------- 01 demonstration -- */}
        <Section n="01" label="The demonstration" id="demonstration">
          <Statement>You didn&rsquo;t lose to the task. You lost to everything around the task.</Statement>
          <Lede>
            Below are three ordinary paths. Cut any step you think should not
            exist and the score moves. Or run the audit and see the whole
            verdict at once.
          </Lede>

          <div className="mt-10">
            <FrictionLab />
          </div>

          <p className="fr-meta mt-4 max-w-3xl text-dim">
            The score is a model, not a measurement: every step carries a
            likelihood that the intention dies there, and those likelihoods
            compound. The exact number matters far less than what compounding
            does to it.
          </p>
        </Section>

        {/* ------------------------------------------------ 02 taxonomy -- */}
        <Section n="02" label="What counts">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <Statement>Friction is not one thing.</Statement>
              <Lede>
                It is all of this, and it is almost never any single one of them
                that stops you. Each is small. That is exactly why they survive.
              </Lede>
            </div>

            <ul className="flex flex-wrap gap-1.5 self-start">
              {taxonomy.map((item, i) => (
                <li
                  key={item}
                  className="flex items-baseline gap-2 border border-rule bg-panel px-2.5 py-1.5"
                >
                  <span className="fr-num text-[0.625rem] text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.8125rem] font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* ------------------------------------------------ 03 gradient -- */}
        <Section n="03" label="The friction gradient">
          <Statement>
            One behaviour was engineered to be effortless. The other was not.
          </Statement>
          <Lede>
            This is a friction gradient: the difference in resistance between
            two competing behaviours. When one costs a reach and a tap and the
            other costs eight steps, the environment has already chosen for you.
          </Lede>

          <div className="mt-12">
            <GradientCompare />
          </div>

          <p className="fr-lead mt-10 max-w-2xl border-t border-ink pt-5">
            Nobody in this picture lacks discipline. One path is simply shorter
            than the other, and behaviour follows paths.
          </p>
        </Section>

        {/* ----------------------------------------------- 04 principle -- */}
        <Section n="04" label="The principle" id="principle">
          <Statement>
            Make desirable actions easier. Make undesirable actions harder.
          </Statement>
          <Lede>
            A frictionless world would be horrifying. Instant gambling. Instant
            spending. Instant irreversible decisions. Removing resistance
            everywhere is not the goal — putting it in the right place is.
          </Lede>

          <div className="mt-12 grid gap-px border border-ink bg-rule sm:grid-cols-3">
            {[
              {
                verb: "Remove",
                what: "Bad friction",
                note: "Resistance that buys nobody anything.",
              },
              {
                verb: "Add",
                what: "Good friction",
                note: "Resistance that buys safety, thought or trust.",
              },
              {
                verb: "Move",
                what: "Friction shift",
                note: "Put the cost where it protects instead of where it blocks.",
              },
            ].map((item, i) => (
              <div key={item.verb} className="bg-paper p-6">
                <span className="fr-num text-xs text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="fr-sub mt-3">{item.verb}</p>
                <p className="fr-label mt-2 text-hazard-ink">{item.what}</p>
                <p className="fr-meta mt-3 text-dim">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <p className="fr-label text-dim">Good friction, in practice</p>
            <dl className="mt-4 border-t border-ink">
              {goodFriction.map((item) => (
                <div
                  key={item.action}
                  className="grid gap-1 border-b border-rule py-3.5 sm:grid-cols-[1fr_1.3fr] sm:gap-6"
                >
                  <dt className="text-[0.9375rem] font-semibold">
                    {item.action}
                  </dt>
                  <dd className="fr-meta text-dim">{item.intervention}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-14 border border-ink bg-panel p-6 sm:p-8">
            <p className="fr-sub max-w-2xl">
              We are anti-friction, not anti-effort.
            </p>
            <p className="fr-lead mt-3 max-w-2xl text-dim">
              Difficulty and friction are different things. We like difficult
              things. We want the effort to land on the part that is actually
              worth it.
            </p>

            <dl className="mt-8 border-t border-ink">
              {notEffort.map((row) => (
                <div
                  key={row.hard}
                  className="grid gap-1 border-b border-rule py-3.5 sm:grid-cols-2 sm:gap-6"
                >
                  <dt className="text-[0.9375rem] font-semibold">
                    {row.hard}
                    <span className="fr-label ml-2 align-middle text-dim">
                      keep
                    </span>
                  </dt>
                  <dd className="fr-struck text-[0.9375rem]">{row.easy}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>

        {/* --------------------------------------------- 05 engineering -- */}
        <Section n="05" label="Friction engineering">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <Statement>
                We do not optimise people. We optimise the conditions around
                people.
              </Statement>
              <Lede>
                A badly designed environment makes a capable person look
                incompetent. A well-designed one makes sophisticated behaviour
                feel like nothing at all.
              </Lede>
              <Lede className="text-dim">
                The best workflow is not always the one with fewer steps.
                Sometimes it is the one with no step: don&rsquo;t remind someone
                to update the spreadsheet — update it. Don&rsquo;t make a
                salesperson reconstruct a relationship — hand them the context.
                Before improving a process, ask whether it should exist.
              </Lede>
            </div>

            <div className="self-start border border-ink bg-panel">
              <p className="fr-label border-b border-ink px-5 py-3 text-dim">
                What we ask of every step
              </p>
              <ul className="divide-y divide-rule">
                {questions.map((q, i) => (
                  <li key={q} className="flex items-baseline gap-3 px-5 py-2.5">
                    <span className="fr-num shrink-0 text-[0.625rem] text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9375rem]">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* --------------------------------------------------- 06 laws -- */}
        <Section n="06" label="The laws of friction" id="laws" tone="void">
          <Statement>Observed, not invented.</Statement>
          <p className="fr-lead mt-5 max-w-2xl text-void-dim">
            A working set. Some of these will be refined and some will be
            disproven — that is the point of writing them down as an
            institution rather than a doctrine.
          </p>

          <ol className="mt-12 border-t border-void-rule">
            {laws.map((law) => (
              <li
                key={law.n}
                className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-b border-void-rule py-4 sm:grid-cols-[5rem_1fr] sm:gap-8"
              >
                <span className="fr-num text-xs text-hazard">{law.n}</span>
                <span className="fr-sub font-semibold text-balance">
                  {law.text}
                </span>
              </li>
            ))}
          </ol>
        </Section>

        {/* ------------------------------------------------ 07 lexicon -- */}
        <Section n="07" label="The lexicon" id="lexicon">
          <Statement>Language creates categories.</Statement>
          <Lede>
            Not marketing vocabulary. Words that let a team point at something
            they could not previously name — and therefore could not previously
            argue about.
          </Lede>

          <dl className="mt-12 grid border-t border-ink sm:grid-cols-2 sm:gap-x-12">
            {lexicon.map((entry) => (
              <div key={entry.term} className="border-b border-rule py-5">
                <dt className="fr-sub">{entry.term}</dt>
                <dd className="fr-meta mt-2 max-w-md text-dim">{entry.def}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* -------------------------------------------------- 08 audit -- */}
        <Section n="08" label="The friction audit" id="audit">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <Statement>
                We map the path between the outcome you intended and the outcome
                you get.
              </Statement>
              <Lede>
                Then we tell you which resistance is doing useful work and which
                is just there. Every friction point gets one of four verdicts,
                tried in this order.
              </Lede>

              <ol className="mt-10 grid gap-px border border-ink bg-rule">
                {VERDICT_ORDER.map((key, i) => (
                  <li
                    key={key}
                    className="grid grid-cols-[3rem_1fr] items-baseline gap-3 bg-paper p-5"
                  >
                    <span className="fr-num text-xs text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="fr-sub block">
                        {VERDICTS[key].label}
                      </span>
                      <span className="fr-meta mt-1.5 block text-dim">
                        {VERDICTS[key].note}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <p className="fr-lead mt-8 max-w-lg text-dim">
                The answer is not always more technology. Sometimes the best
                software improvement is deleting software. Sometimes it is one
                changed default, or one rewritten sentence. We are
                implementation-agnostic and care only about the outcome.
              </p>
            </div>

            <div>
              <InquiryForm />

              <div className="mt-10">
                <p className="fr-label text-dim">Where we look</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {auditDomains.map((d) => (
                    <li
                      key={d}
                      className="border border-rule bg-panel px-2.5 py-1.5 text-[0.8125rem]"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <p className="fr-label text-dim">What we find</p>
                <p className="fr-meta mt-3 text-dim">
                  {auditFindings.join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ----------------------------------------------- 09 flywheel -- */}
        <Section n="09" label="How the work compounds">
          <Statement>Observe. Document. Measure. Publish. Repeat.</Statement>
          <Lede>
            Research creates authority. Authority surfaces the expensive
            problems. Repeated problems reveal what is worth building. What gets
            built produces evidence, and the evidence sharpens the research.
          </Lede>

          <ol className="mt-12 grid gap-px border border-ink bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {flywheel.map((item, i) => (
              <li key={item.step} className="bg-paper p-5">
                <span className="fr-num text-[0.625rem] text-hazard-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="fr-sub mt-2">{item.step}</p>
                <p className="fr-meta mt-1.5 text-dim">{item.note}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* -------------------------------------------------- the close -- */}
        <section className="border-t border-ink bg-void text-paper">
          <Frame>
            <div className="py-20 sm:py-28">
              <p className="fr-label text-hazard">The promise</p>
              <p className="fr-title mt-6 max-w-4xl text-balance">
                We do not promise an effortless life. We promise a better
                allocation of effort.
              </p>
              <p className="fr-lead mt-6 max-w-2xl text-void-dim">
                Difficult things should stay difficult for the reasons that make
                them worth doing. Everything else — question it, measure it,
                move it, automate it, redesign it, or delete it.
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-3">
                <a
                  href="#audit"
                  className="fr-label border border-paper bg-paper px-5 py-3.5 text-ink transition-colors hover:border-hazard hover:bg-hazard hover:text-paper"
                >
                  Request an audit
                </a>
                <a
                  href={`mailto:${company.email}`}
                  className="fr-label border border-void-rule px-5 py-3.5 text-paper transition-colors hover:border-paper"
                >
                  {company.email}
                </a>
              </div>
            </div>
          </Frame>
        </section>

        {/* ----------------------------------------------------- footer -- */}
        <footer className="border-t border-void-rule bg-void text-paper">
          <Frame>
            <div className="flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <span aria-hidden className="h-3.5 w-3.5 bg-hazard" />
                  <span className="fr-label tracking-[0.18em]">
                    {company.name}
                  </span>
                </div>
                <p className="fr-meta mt-3 max-w-sm text-void-dim">
                  {company.promise} Engineer the space between intention and
                  action.
                </p>
              </div>
              <p className="fr-meta text-void-dim">
                &copy; {new Date().getFullYear()} {company.name}
              </p>
            </div>
          </Frame>
        </footer>
      </main>
    </>
  );
}
