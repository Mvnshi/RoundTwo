import { Check } from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import { steps } from "@/lib/content";

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="border-t border-border">
      <SectionHeading
        eyebrow="How it works"
        title="A recovery layer on top of the sales process you already have."
        lead="Nothing gets replaced. We work the opportunities already sitting in your business and put the results back where your team is already looking."
      />

      <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:mt-16 lg:grid-cols-3">
        {steps.map((step) => (
          <li key={step.number} className="flex flex-col gap-5 bg-card p-6 sm:p-7 lg:p-8">
            <div className="flex items-center gap-3">
              <span className="label-mono text-foreground">{step.number}</span>
              <span aria-hidden className="h-px flex-1 bg-border" />
            </div>

            <h3 className="text-h3 font-medium">{step.title}</h3>

            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{step.body}</p>

            <ul className="mt-auto flex flex-col gap-2.5 border-t border-border pt-5">
              {step.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-[0.875rem]">
                  <Check
                    className="mt-0.5 size-3.5 shrink-0 text-recovered"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <p className="mt-6 max-w-3xl text-[0.8125rem] leading-relaxed text-muted-foreground">
        This is the system we build and run with founding partners today, configured around each
        contractor&apos;s own sales process — not a self-serve product you switch on alone.
      </p>
    </Section>
  );
}
