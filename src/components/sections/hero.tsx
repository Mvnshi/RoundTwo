import { Container } from "@/components/layout/container";
import { AuditCta } from "@/components/lead/audit-cta";
import { RecoveryTimeline } from "@/components/recovery/recovery-timeline";
import { SecondaryCta } from "@/components/sections/secondary-cta";
import { hero } from "@/lib/content";
import { cta } from "@/lib/site";

/**
 * The hero is a full-bleed field of the brand colour that the navigation pill
 * floats on. The recovery timeline is the object sitting on that field — this
 * system uses a single large artefact on colour rather than a split layout.
 */
export function Hero() {
  return (
    <section className="relative">
      <Container className="pt-10 pb-28 sm:pt-14 sm:pb-36 lg:pb-40">
        <div className="flex flex-col items-center text-center">
          <p className="label-mono flex items-center gap-2 rounded-full bg-card px-4 py-2 text-foreground">
            <span className="size-1.5 rounded-full bg-brand-strong" aria-hidden />
            {hero.eyebrow}
          </p>

          <h1 className="mt-7 max-w-[19ch] text-display text-foreground sm:mt-8">
            <span className="block">{hero.headlineTop}</span>
            <span className="block">
              {hero.headlineBottomBefore}
              <mark className="marker-rule [--marker-color:#fff]">
                {hero.headlineBottomMark}
              </mark>
              {hero.headlineBottomAfter}
            </span>
          </h1>

          <p className="mt-7 max-w-[48ch] text-lead text-foreground/85 sm:mt-8">
            {hero.body}
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <AuditCta source="hero" label={cta.primary} event="hero_cta_clicked" />
            <SecondaryCta href="/scorecard" label={cta.scorecard} source="hero" />
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-[0.8125rem] text-foreground/75">
            {hero.proofPoints.map((point, index) => (
              <li key={point} className="flex items-center gap-2.5">
                {point}
                {index < hero.proofPoints.length - 1 ? (
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
  );
}

/**
 * Rendered just outside the colour field so the card straddles the boundary:
 * its top sits on the brand green, the rest on cream. The negative margin is
 * what creates the overlap, so the card always crosses the seam cleanly.
 */
export function HeroVisual() {
  return (
    <div className="relative z-10 -mt-14 sm:-mt-20 lg:-mt-24">
      <Container>
        <div className="mx-auto w-full max-w-[38rem]">
          <RecoveryTimeline />
        </div>
      </Container>
    </div>
  );
}
