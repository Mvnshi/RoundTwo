import { Container } from "@/components/layout/container";
import { AuditCta } from "@/components/lead/audit-cta";
import { StatusTrack } from "@/components/recovery/status-track";
import { SecondaryCta } from "@/components/sections/secondary-cta";
import { cta } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="py-14 sm:py-16 lg:py-[4.5rem]">
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="label-mono flex items-center gap-2 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand-strong" aria-hidden />
            Before you buy another lead
          </p>

          <h2 className="mt-6 text-h2 font-medium">
            Work the ones you already have.
          </h2>

          <p className="mt-6 max-w-2xl text-lead text-muted-foreground">
            Tell us how leads move through your business. We&apos;ll come back with where
            opportunities are leaking, what they&apos;re worth, and whether recovering them is
            worth doing. No pitch deck.
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <AuditCta source="final" label={cta.primaryLong} event="secondary_cta_clicked" />
            <SecondaryCta href="/scorecard" label={cta.scorecard} source="final" />
          </div>

          <p className="mt-6 text-[0.8125rem] text-muted-foreground">
            Free · No CRM migration · Limited founding partner spots
          </p>
        </div>

        <StatusTrack className="mx-auto mt-14 w-full max-w-3xl items-center rounded-[2rem] bg-card p-7 text-center sm:mt-16 sm:p-8" />
      </Container>
    </section>
  );
}
