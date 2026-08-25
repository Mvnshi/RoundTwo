import { Quote, X } from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent, MessageHeader } from "@/components/ui/message";
import { contextComparison } from "@/lib/content";
import { brand } from "@/lib/site";
import { cn } from "@/lib/utils";

const { generic, contextual } = contextComparison;

export function PersistentContext() {
  return (
    <Section id="why-it-works" className="border-t border-border">
      <SectionHeading
        eyebrow="Why it works"
        title={<>&ldquo;Just following up&rdquo; isn&apos;t a sales strategy.</>}
        lead="Every follow-up tool can send a message on day seven. The difference is whether the message knows anything. Same customer, same day — two very different texts."
      />

      <div className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-2 lg:gap-6">
        <ComparisonPanel
          tone="generic"
          label={generic.label}
          caption={generic.caption}
          outcome={generic.outcome}
        >
          <Message align="start">
            <MessageContent>
              <MessageHeader>Acme Roofing · Automated</MessageHeader>
              <Bubble variant="muted">
                <BubbleContent className="px-3.5 py-2.5 text-[0.9375rem] text-muted-foreground">
                  {generic.message}
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </ComparisonPanel>

        <ComparisonPanel
          tone="contextual"
          label={contextual.label}
          caption={contextual.caption}
          outcome={contextual.outcome}
        >
          <div className="mb-4 rounded-lg border border-border bg-muted/50 p-3.5">
            <p className="label-mono flex items-center gap-2 text-muted-foreground">
              <Quote className="size-3" aria-hidden />
              {contextual.context.source}
            </p>
            <p className="mt-2 text-[0.875rem] leading-snug text-foreground">
              &ldquo;{contextual.context.quote}&rdquo;
            </p>
          </div>

          <Message align="start">
            <MessageContent>
              <MessageHeader>Acme Roofing · {brand.name}</MessageHeader>
              <Bubble variant="outline">
                <BubbleContent className="border-border-strong px-3.5 py-2.5 text-[0.9375rem] text-foreground">
                  {contextual.message}
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </ComparisonPanel>
      </div>

      <p className="mt-6 text-[0.8125rem] text-muted-foreground">
        Example messages written to show the difference in approach. Not generated from customer
        data.
      </p>
    </Section>
  );
}

function ComparisonPanel({
  tone,
  label,
  caption,
  outcome,
  children,
}: {
  tone: "generic" | "contextual";
  label: string;
  caption: string;
  outcome: string;
  children: React.ReactNode;
}) {
  const isContextual = tone === "contextual";

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border bg-card",
        isContextual ? "border-foreground/15" : "border-border",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b px-5 py-3.5",
          isContextual ? "border-foreground/12 bg-brand/12" : "border-border",
        )}
      >
        {isContextual ? (
          <span aria-hidden className="size-1.5 rounded-full bg-brand-strong" />
        ) : (
          <X className="size-3.5 text-muted-foreground" strokeWidth={2.5} aria-hidden />
        )}
        <h3 className="label-mono text-foreground">{label}</h3>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-4 text-[0.8125rem] text-muted-foreground">{caption}</p>
        {children}
        <p
          className={cn(
            "mt-auto border-t border-border pt-5 text-[0.875rem] leading-snug",
            isContextual ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {outcome}
        </p>
      </div>
    </article>
  );
}
