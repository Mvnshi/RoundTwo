import { Container } from "@/components/layout/container";
import { AuditCta } from "@/components/lead/audit-cta";
import { StatusTrack } from "@/components/recovery/status-track";
import { SecondaryCta } from "@/components/sections/secondary-cta";
import { cta } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="border-t border-border py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="flex max-w-3xl flex-col items-start">
          <p className="label-mono flex items-center gap-2 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand-strong" aria-hidden />
            Before you buy another lead
          </p>

          <h2 className="mt-5 text-h2 font-medium">
            Work the ones you already have.
          </h2>

          <p className="mt-6 max-w-xl text-lead text-muted-foreground">
            Tell us how leads move through your business. We&apos;ll come back with where
            opportunities are leaking, what they&apos;re worth, and whether recovering them is
            worth doing. No pitch deck.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <AuditCta source="final" label={cta.primaryLong} event="secondary_cta_clicked" />
            <SecondaryCta href="#how-it-works" label="See how it works" source="final" />
          </div>

          <p className="mt-6 text-[0.8125rem] text-muted-foreground">
            Free · No CRM migration · Limited founding partner spots
          </p>
        </div>

        <StatusTrack className="mt-14 border-t border-border pt-8 sm:mt-16" />
      </Container>
    </section>
  );
}
