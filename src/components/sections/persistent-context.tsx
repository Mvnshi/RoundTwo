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
    <Section id="why-it-works">
      <SectionHeading
        eyebrow="Why it works"
        title={<>&ldquo;Just following up&rdquo; isn&apos;t a sales strategy.</>}
        lead="Every follow-up tool can send a message on day seven. The difference is whether the message knows anything. Same customer, same day — two very different texts."
      />

      <div className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-2">
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
                <BubbleContent className="px-4 py-3 text-[0.9375rem] text-muted-foreground">
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
          <div className="mb-5 rounded-[1.25rem] bg-secondary/70 p-4">
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
                <BubbleContent className="border-transparent bg-brand/20 px-4 py-3 text-[0.9375rem] text-foreground">
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
        "flex flex-col overflow-hidden rounded-[2rem] bg-card",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-6 py-4",
          isContextual ? "bg-brand" : "bg-secondary",
        )}
      >
        {isContextual ? (
          <span aria-hidden className="size-1.5 rounded-full bg-brand-strong" />
        ) : (
          <X className="size-3.5 text-muted-foreground" strokeWidth={2.5} aria-hidden />
        )}
        <h3 className="label-mono text-foreground">{label}</h3>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="mb-4 text-[0.8125rem] text-muted-foreground">{caption}</p>
        {children}
        <p
          className={cn(
            "mt-auto border-t border-hairline pt-5 text-[0.875rem] leading-snug",
            isContextual ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {outcome}
        </p>
      </div>
    </article>
  );
}
