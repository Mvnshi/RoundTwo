import { Container } from "@/components/layout/container";
import { AuditCta } from "@/components/lead/audit-cta";
import { RecoveryTimeline } from "@/components/recovery/recovery-timeline";
import { SecondaryCta } from "@/components/sections/secondary-cta";
import { GridPattern } from "@/components/ui/grid-pattern";
import { hero } from "@/lib/content";
import { cta } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-18 lg:pb-24">
      <GridPattern
        width={72}
        height={72}
        className="absolute inset-0 -z-10 h-full w-full fill-none stroke-foreground/[0.035] [mask-image:linear-gradient(to_bottom,white,transparent_70%)]"
      />

      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,25.5rem)] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,27rem)]">
          <div className="flex min-w-0 flex-col items-start">
            <p className="label-mono flex items-center gap-2 text-muted-foreground">
              <span className="size-1.5 rounded-full bg-brand-strong" aria-hidden />
              {hero.eyebrow}
            </p>

            <h1 className="mt-5 text-display font-medium">
              <span className="block text-foreground/55">{hero.headlineTop}</span>
              <span className="block">
                {hero.headlineBottomBefore}
                <mark className="marker-rule">{hero.headlineBottomMark}</mark>
                {hero.headlineBottomAfter}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-lead text-muted-foreground sm:mt-6">{hero.body}</p>

            <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:items-center">
              <AuditCta source="hero" label={cta.primary} event="hero_cta_clicked" />
              <SecondaryCta href="#why-it-works" label={cta.secondary} source="hero" />
            </div>

            <ul className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[0.8125rem] text-muted-foreground sm:mt-8 sm:gap-x-3">
              {hero.proofPoints.map((point, index) => (
                <li key={point} className="flex items-center gap-2.5">
                  {point}
                  {index < hero.proofPoints.length - 1 ? (
                    <span aria-hidden className="size-1 rounded-full bg-border-strong" />
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:pl-2">
            <RecoveryTimeline />
          </div>
        </div>
      </Container>
    </section>
  );
}
