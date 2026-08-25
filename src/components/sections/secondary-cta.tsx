"use client";

import { ArrowDownRight } from "lucide-react";

import { ButtonBadge, buttonVariants } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * A real anchor styled as a pill. Using the Button component here would stamp
 * role="button" on an element that navigates, which is the wrong semantics.
 */
export function SecondaryCta({
  href,
  label,
  source,
  className,
}: {
  href: string;
  label: string;
  source: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={() => track("secondary_cta_clicked", { source })}
      className={cn(buttonVariants({ variant: "outline", size: "xl" }), className)}
    >
      {label}
      <ButtonBadge tone="quiet">
        <ArrowDownRight strokeWidth={2.25} />
      </ButtonBadge>
    </a>
  );
}
