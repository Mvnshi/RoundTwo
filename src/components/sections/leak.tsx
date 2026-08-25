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
    <Section id="the-leak">
      <SectionHeading
        eyebrow="Where the money goes"
        title={
          <>
            Most contractors don&apos;t need more leads.
            <br />
            <span className="text-muted-foreground">They need fewer leads to disappear.</span>
          </>
        }
        lead="Four moments account for most of the revenue that quietly leaves a contracting business. None of them show up as a line item, because nothing was ever bought — it was just never worked."
      />

      <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2">
        {leaks.map((leak) => {
          const Icon = leak.icon;

          return (
            <div
              key={leak.index}
              className={cn("flex flex-col gap-6 rounded-[2rem] bg-card p-7 sm:p-8 lg:p-9")}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="label-mono text-muted-foreground">{leak.index}</span>
                <span className="rounded-full bg-lost-soft/20 px-3 py-1.5 label-mono text-lost">
                  {leak.cost}
                </span>
              </div>

              <Item variant="default" className="items-start gap-4 p-0">
                <ItemMedia
                  variant="icon"
                  className="mt-0.5 size-11 rounded-full bg-secondary text-foreground"
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
