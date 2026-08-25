import { ChevronDown } from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import { stackLayers } from "@/lib/content";
import { brand } from "@/lib/site";
import { cn } from "@/lib/utils";

export function NotACrm() {
  return (
    <Section id="not-a-crm" className="border-t border-border">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Where it sits"
            title={
              <>
                Keep your CRM.
                <br />
                <span className="text-foreground/55">
                  Make the opportunities inside it worth more.
                </span>
              </>
            }
            lead="Replacing the system your team already lives in is the fastest way to lose a year and a lot of goodwill. RoundTwo is designed as a layer, not a platform migration."
          />

          <ul className="mt-8 border-t border-border text-[0.9375rem] leading-relaxed text-muted-foreground">
            <li className="border-b border-border py-3.5">
              No data migration, no retraining, no parallel system to keep updated.
            </li>
            <li className="border-b border-border py-3.5">
              Replies and booked appointments land in the CRM and calendar your team already opens
              every morning.
            </li>
            <li className="border-b border-border py-3.5">
              If you decide it isn&apos;t working, you turn the layer off and your sales process is
              exactly where it was.
            </li>
          </ul>
        </div>

        <div aria-label={`Where ${brand.name} sits in your stack`} className="flex flex-col">
          {stackLayers.map((layer, index) => {
            const isOurs = layer.role === "ours";

            return (
              <div key={layer.label} className="flex flex-col">
                <div
                  className={cn(
                    "rounded-xl border px-5 py-4",
                    isOurs
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card",
                  )}
                >
                  <p
                    className={cn(
                      "flex items-center gap-2 text-[0.9375rem] font-medium",
                      isOurs ? "text-background" : "text-foreground",
                    )}
                  >
                    {isOurs ? (
                      <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                    ) : null}
                    {layer.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-[0.8125rem] leading-snug",
                      isOurs ? "text-background/70" : "text-muted-foreground",
                    )}
                  >
                    {layer.detail}
                  </p>
                </div>

                {index < stackLayers.length - 1 ? (
                  <span
                    aria-hidden
                    className="mx-auto flex h-7 items-center justify-center text-muted-foreground/70"
                  >
                    <ChevronDown className="size-4" strokeWidth={2} />
                  </span>
                ) : null}
              </div>
            );
          })}

          <p className="mt-5 text-[0.75rem] leading-relaxed text-muted-foreground">
            We&apos;ll confirm exactly how we connect to your systems during the audit. We only
            list integrations once they actually exist.
          </p>
        </div>
      </div>
    </Section>
  );
}
