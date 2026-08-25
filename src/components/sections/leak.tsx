import { Section, SectionHeading } from "@/components/layout/section";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { leaks } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Leak() {
  return (
    <Section id="the-leak" className="border-t border-border">
      <SectionHeading
        eyebrow="Where the money goes"
        title={
          <>
            Most contractors don&apos;t need more leads.
            <br />
            <span className="text-foreground/55">They need fewer leads to disappear.</span>
          </>
        }
        lead="Four moments account for most of the revenue that quietly leaves a contracting business. None of them show up as a line item, because nothing was ever bought — it was just never worked."
      />

      <div className="mt-12 grid overflow-hidden rounded-xl border border-border bg-card sm:mt-14 sm:grid-cols-2">
        {leaks.map((leak, index) => {
          const Icon = leak.icon;

          return (
            <div
              key={leak.index}
              className={cn(
                "flex flex-col gap-5 p-6 sm:p-7 lg:p-8",
                index < leaks.length - 1 && "border-b border-border",
                "sm:border-b-0",
                index < 2 && "sm:border-b sm:border-border",
                index % 2 === 0 && "sm:border-r sm:border-border",
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="label-mono text-muted-foreground">{leak.index}</span>
                <span aria-hidden className="h-px flex-1 bg-border" />
                <span className="label-mono text-lost/80">{leak.cost}</span>
              </div>

              <Item variant="default" className="items-start gap-4 p-0">
                <ItemMedia
                  variant="icon"
                  className="mt-0.5 size-9 rounded-lg border border-border bg-muted/60 text-foreground"
                >
                  <Icon aria-hidden />
                </ItemMedia>
                <ItemContent className="gap-2">
                  <ItemTitle className="text-h3 font-medium tracking-[-0.015em]">
                    {leak.title}
                  </ItemTitle>
                  <ItemDescription className="line-clamp-none text-[0.9375rem] leading-relaxed">
                    {leak.body}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
