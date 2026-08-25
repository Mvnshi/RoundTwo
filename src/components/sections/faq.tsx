"use client";

import { useRef, useState } from "react";

import { Section, SectionHeading } from "@/components/layout/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { track } from "@/lib/analytics";
import { faqs } from "@/lib/content";
import { brand } from "@/lib/site";

export function Faq() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const reported = useRef(new Set<string>());

  function onValueChange(value: unknown) {
    const next = (Array.isArray(value) ? value : [value]).filter(
      (item): item is string => typeof item === "string",
    );
    setOpenItems(next);

    for (const item of next) {
      if (reported.current.has(item)) continue;
      reported.current.add(item);
      track("faq_opened", { question: item });
    }
  }

  return (
    <Section id="faq" className="border-t border-border">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
        <SectionHeading
          eyebrow="Questions"
          title="The things contractors ask first."
          lead={`Straight answers about what ${brand.name} is today, not what it might be later.`}
          className="lg:sticky lg:top-24 lg:self-start"
        />

        <Accordion
          multiple
          value={openItems}
          onValueChange={onValueChange}
          className="border-t border-border"
        >
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question} className="border-b">
              <AccordionTrigger className="gap-6 py-5 text-[1.0625rem] leading-snug font-medium hover:no-underline sm:py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="max-w-2xl pb-6 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
