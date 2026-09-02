import type { Metadata } from "next";

import { GoodFriction } from "@/components/f3/good-friction";
import { SiteHeader } from "@/components/f3/header";
import { InquiryForm } from "@/components/f3/inquiry-form";
import { NoiseTexture } from "@/components/f3/mui/noise-texture";
import { PathCard } from "@/components/f3/path-card";
import {
  Container,
  Eyebrow,
  Panel,
  Section,
  SectionHeading,
} from "@/components/f3/primitives";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { GridPattern } from "@/components/ui/grid-pattern";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  auditDomains,
  company,
  gradient,
  laws,
  lexicon,
  moments,
  notEffort,
} from "@/lib/friction/content";
import { VERDICTS } from "@/lib/friction/score";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

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
      "@id": `${siteUrl}/frictionv3#org`,
      name: company.name,
      url: `${siteUrl}/frictionv3`,
      email: company.email,
      slogan: company.promise,
      description:
        "Friction Engineering: the deliberate design of resistance between intention and action.",
    },
    {
      "@type": "DefinedTermSet",
      "@id": `${siteUrl}/frictionv3#lexicon`,
      name: "The Friction Lexicon",
      hasDefinedTerm: lexicon.map((entry) => ({
        "@type": "DefinedTerm",
        name: entry.term,
        description: entry.def,
      })),
    },
  ],
};

const VERDICT_ORDER = ["delete", "automate", "redesign", "add"] as const;

const PROOF = [
  "Delete before automate",
  "No system replaced",
  "Findings in two weeks",
];

export default function FrictionV3Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // Serialised from a literal above; no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div id="top" className="relative bg-brand-field">
        {/* Grain over the colour field. Flat tangerine reads as a print error;
            a little tooth reads as paper. */}
        <NoiseTexture
          aria-hidden
          frequency={0.72}
          octaves={4}
          slope={0.2}
          noiseOpacity={0.5}
          className="opacity-[0.28] mix-blend-multiply"
        />
        <SiteHeader />

        {/* ------------------------------------------------------- hero -- */}
        <section className="relative z-10">
          <Container className="pt-10 pb-28 sm:pt-14 sm:pb-36 lg:pb-40">
            <div className="flex flex-col items-center text-center">
              <p className="label-mono flex items-center gap-2 rounded-full bg-card px-4 py-2 text-foreground">
                <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                Friction engineering
              </p>

              <h1 className="mt-7 max-w-[17ch] text-display sm:mt-8">
                <span className="block">Most things are not impossible.</span>
                <span className="block">
                  They are surrounded by{" "}
                  <em className="not-italic marker-rule [--marker-color:#fff]">
                    resistance
                  </em>
                  .
                </span>
              </h1>

              <p className="mt-7 max-w-[52ch] text-lead text-foreground/85 sm:mt-8">
                Friction is the distance between intention and action — every
                step, decision, wait and login that makes an outcome less likely
                to happen. We find it, measure it, and decide what should
                disappear and what should be harder.
              </p>

              <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                <a
                  href="#audit"
                  className="inline-flex h-13 items-center justify-center gap-3 rounded-full bg-foreground py-3.5 pr-2 pl-7 text-[0.9375rem] font-medium text-background transition-colors hover:bg-brand hover:text-foreground"
                >
                  Request a friction audit
                  <span
                    aria-hidden
                    className="grid size-9 place-items-center rounded-full bg-background text-foreground"
                  >
                    <svg viewBox="0 0 16 16" className="size-4" fill="none">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
                <a
                  href="#method"
                  className="inline-flex h-13 items-center justify-center rounded-full bg-card px-7 py-3.5 text-[0.9375rem] font-medium ring-1 ring-foreground/10 transition-colors hover:bg-card/70"
                >
                  See the method
                </a>
              </div>

              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-[0.8125rem] text-foreground/75">
                {PROOF.map((point, i) => (
                  <li key={point} className="flex items-center gap-2.5">
                    {point}
                    {i < PROOF.length - 1 ? (
                      <span
                        aria-hidden
                        className="size-1 rounded-full bg-foreground/35"
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      </div>

      {/* The artefact straddles the seam: its top sits on the colour field,
          the rest on paper. The negative margin creates the overlap. */}
      <div className="relative z-10 -mt-14 sm:-mt-20 lg:-mt-24">
        <Container>
          <div className="mx-auto w-full max-w-[44rem]">
            <PathCard />
          </div>
          <p className="mx-auto mt-4 max-w-[44rem] text-[0.8125rem] text-muted-foreground">
            An illustration of the method, not an audit of any company. The
            score is a model: each step carries a likelihood that the intention
            dies there, and those compound.
          </p>
        </Container>
      </div>

      <main>
        {/* ------------------------------------------------- 01 moments -- */}
        <Section id="method" className="pt-16 sm:pt-20">
          <SectionHeading
            eyebrow="Where intention dies"
            title="Nobody loses to the task. They lose to everything around it."
            lead="Four moments account for most of the distance between deciding to do something and it being done."
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {moments.map((m, i) => (
              <ScrollReveal key={m.n} y={20} blur={5} delay={i * 0.05}>
                <Panel className="h-full p-7 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[0.6875rem] tabular text-muted-foreground">
                      {m.n}
                    </span>
                    <span className="label-mono rounded-full bg-secondary px-2.5 py-1">
                      {m.tag}
                    </span>
                  </div>
                  <p className="mt-5 text-h3">{m.title}</p>
                  <p className="mt-3 text-[0.9375rem] text-muted-foreground">
                    {m.body}
                  </p>
                </Panel>
              </ScrollReveal>
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------ 02 gradient -- */}
        <Section className="pt-0">
          <Panel className="overflow-hidden">
            <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-14">
              <div>
                <Eyebrow>The friction gradient</Eyebrow>
                <h2 className="mt-4 text-h2">
                  One of these was engineered to be effortless.
                </h2>
                <p className="mt-5 max-w-md text-lead text-muted-foreground">
                  When one behaviour costs a reach and a tap and the other costs
                  eight steps, the environment has already chosen. Nobody in
                  this picture lacks discipline.
                </p>
              </div>

              <div className="grid gap-6 self-center">
                {[gradient.a, gradient.b].map((track) => (
                  <div key={track.label}>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-[0.9375rem] font-medium">
                        {track.label}
                      </p>
                      <p className="font-mono text-[0.75rem] tabular text-muted-foreground">
                        {track.steps.length} step
                        {track.steps.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {track.steps.map((step) => (
                        <span
                          key={step}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-[0.75rem]",
                            track.tone === "easy"
                              ? "bg-foreground text-background"
                              : "bg-resist-soft/20 text-resist",
                          )}
                        >
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </Section>

        {/* ------------------------------------------- 03 good friction -- */}
        <Section id="good-friction" className="pt-0">
          <SectionHeading
            eyebrow="Good friction"
            title="A frictionless world would be horrifying."
            lead="Instant gambling. Instant spending. Instant irreversible decisions. The goal was never to remove resistance everywhere — it was to put it where it protects something. Notice which of these you do without deciding."
          />
          <div className="mt-14">
            <GoodFriction />
          </div>
        </Section>

        {/* ---------------------------------------------- 04 not effort -- */}
        <Section className="pt-0">
          <Panel className="bg-secondary/50 p-8 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
              <div>
                <Eyebrow>The distinction</Eyebrow>
                <h2 className="mt-4 text-h2">
                  We are anti-friction, not anti-effort.
                </h2>
                <p className="mt-5 max-w-md text-lead text-muted-foreground">
                  Difficulty and friction are different things. We like
                  difficult things. We want the effort to land on the part that
                  is actually worth it.
                </p>
              </div>

              <dl className="self-center">
                {notEffort.map((row) => (
                  <div
                    key={row.hard}
                    className="grid gap-1 border-b border-hairline py-4 last:border-0 sm:grid-cols-2 sm:gap-6"
                  >
                    <dt className="text-[0.9375rem] font-medium">{row.hard}</dt>
                    <dd className="struck text-[0.9375rem] text-muted-foreground">
                      {row.easy}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Panel>
        </Section>

        {/* ---------------------------------------------------- 05 laws -- */}
        <Section id="laws" className="pt-0">
          <div className="relative overflow-hidden rounded-lg bg-foreground px-7 py-14 text-background sm:px-12 sm:py-18">
            <GridPattern
              aria-hidden
              width={44}
              height={44}
              strokeDasharray="3 5"
              className="absolute inset-0 h-full w-full stroke-background/10 [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]"
            />
            <div className="relative">
            <ScrollReveal y={18} blur={5}>
              <Eyebrow className="text-background/55">The laws of friction</Eyebrow>
              <h2 className="mt-4 max-w-2xl text-h2">Observed, not invented.</h2>
              <p className="mt-5 max-w-xl text-lead text-background/70">
                A working set. Some will be refined and some disproven — that is
                the point of writing them down as an institution rather than a
                doctrine.
              </p>
            </ScrollReveal>

            <ol className="mt-12 grid gap-x-12 gap-y-0 sm:grid-cols-2">
              {laws.map((law) => (
                <li
                  key={law.n}
                  className="grid grid-cols-[2.75rem_1fr] items-baseline gap-4 border-t border-background/15 py-4"
                >
                  <span className="font-mono text-[0.6875rem] tabular text-brand">
                    {law.n}
                  </span>
                  <span className="text-[1.0625rem] leading-snug">
                    {law.text}
                  </span>
                </li>
              ))}
            </ol>
            </div>
          </div>
        </Section>

        {/* ------------------------------------------------- 06 lexicon -- */}
        <Section id="lexicon" className="pt-0">
          <SectionHeading
            eyebrow="The lexicon"
            title="Language creates categories."
            lead="Not marketing vocabulary. Words that let a team point at something they could not previously name — and therefore could not previously argue about."
          />

          <div className="mx-auto mt-12 max-w-3xl">
            <Accordion className="w-full">
              {lexicon.map((entry) => (
                <AccordionItem
                  key={entry.term}
                  value={entry.term}
                  className="border-b border-hairline"
                >
                  <AccordionTrigger className="py-5 text-left text-h3">
                    {entry.term}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[0.9375rem] text-muted-foreground">
                    {entry.def}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Section>

        {/* --------------------------------------------------- 07 audit -- */}
        <Section id="audit" className="pt-0">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <Eyebrow>The friction audit</Eyebrow>
              <h2 className="mt-4 text-h2">
                We map the path between the outcome you intended and the one you
                get.
              </h2>
              <p className="mt-5 max-w-md text-lead text-muted-foreground">
                Then we say which resistance is doing useful work and which is
                just there. Every friction point gets one of four verdicts,
                tried in this order.
              </p>

              <ol className="mt-10 grid gap-3">
                {VERDICT_ORDER.map((key, i) => (
                  <li
                    key={key}
                    className="flex items-start gap-4 rounded-2xl bg-card p-5 ring-1 ring-hairline"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary font-mono text-[0.6875rem] tabular">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-[1.0625rem] font-medium">
                        {VERDICTS[key].label}
                      </span>
                      <span className="mt-1 block text-[0.875rem] text-muted-foreground">
                        {VERDICTS[key].note}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-8">
                <Eyebrow>Where we look</Eyebrow>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {auditDomains.map((d) => (
                    <li
                      key={d}
                      className="rounded-full bg-secondary/70 px-3 py-1.5 text-[0.8125rem]"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <InquiryForm />
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------- the close */}
        <section className="pb-20 sm:pb-28">
          <Container>
            <div className="rounded-lg bg-brand-field px-7 py-16 text-center sm:px-12 sm:py-20">
              <h2 className="mx-auto max-w-[20ch] text-h2">
                Make the right things easier. Make the wrong things harder.
              </h2>
              <p className="mx-auto mt-5 max-w-[46ch] text-lead text-foreground/80">
                We do not promise an effortless life. We promise a better
                allocation of effort.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#audit"
                  className="inline-flex h-13 items-center rounded-full bg-foreground px-7 text-[0.9375rem] font-medium text-background transition-colors hover:bg-brand hover:text-foreground"
                >
                  Request a friction audit
                </a>
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex h-13 items-center rounded-full bg-card px-7 text-[0.9375rem] font-medium ring-1 ring-foreground/10 transition-colors hover:bg-card/70"
                >
                  {company.email}
                </a>
              </div>
            </div>
          </Container>
        </section>

        <footer className="border-t border-hairline py-10">
          <Container>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="size-5 rounded-[0.4rem] bg-foreground"
                />
                <span className="text-[0.9375rem] font-semibold tracking-[-0.01em]">
                  {company.name}
                </span>
              </div>
              <p className="text-[0.8125rem] text-muted-foreground">
                {company.line} &copy; {new Date().getFullYear()}
              </p>
            </div>
          </Container>
        </footer>
      </main>
    </>
  );
}
