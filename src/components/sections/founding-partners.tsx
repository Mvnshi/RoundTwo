import { Check } from "lucide-react";

import { Container } from "@/components/layout/container";
import { AuditCta } from "@/components/lead/audit-cta";
import { GridPattern } from "@/components/ui/grid-pattern";
import { foundingPartner } from "@/lib/content";
import { cta } from "@/lib/site";

export function FoundingPartners() {
  return (
    <section id="founding-partners" className="py-14 sm:py-16 lg:py-[4.5rem]">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground text-background sm:rounded-[3rem]">
          <GridPattern
            width={56}
            height={56}
            className="absolute inset-0 h-full w-full fill-none stroke-background/[0.07] [mask-image:radial-gradient(620px_circle_at_82%_0%,white,transparent)]"
          />

          <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-14 lg:p-14">
            <div>
              <p className="label-mono flex items-center gap-2 text-background/60">
                <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                Founding partners
              </p>

              <h2 className="mt-5 max-w-2xl text-h2 font-medium">
                We&apos;re looking for a few contractors with a lead graveyard.
              </h2>

              <p className="mt-6 max-w-xl text-lead text-background/70">
                If your business has missed calls, unsold estimates or old CRM leads, we&apos;ll
                look at how opportunities currently fall through and tell you whether a revenue
                recovery system makes sense for your workflow. If it doesn&apos;t, we&apos;ll say
                so.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <ul className="flex flex-col gap-3.5">
                {foundingPartner.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-[0.9375rem] leading-snug">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden />
                    <span className="text-background/85">{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 border-t border-background/15 pt-7">
                <AuditCta
                  source="founding-partners"
                  label={cta.primaryLong}
                  event="secondary_cta_clicked"
                  variant="brand"
                  badge="invert"
                  className="w-full sm:w-auto sm:self-start"
                />
                <p className="text-[0.8125rem] text-background/60">
                  Free, no obligation. We&apos;re taking on a limited number of founding partners
                  so each system gets built properly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
