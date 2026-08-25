"use client";

import { ArrowRight } from "lucide-react";

import { useAuditDialog } from "@/components/lead/audit-dialog";
import { Button, ButtonBadge } from "@/components/ui/button";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { cta } from "@/lib/site";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof Button>;

export function AuditCta({
  source,
  label = cta.primary,
  event = "hero_cta_clicked",
  badge = "brand",
  className,
  variant = "default",
  size = "xl",
  ...props
}: Omit<ButtonProps, "onClick"> & {
  /** Where on the page the click happened — reported with the event. */
  source: string;
  label?: string;
  event?: AnalyticsEvent;
  /** Colour of the circular accent, or `none` for a plain pill. */
  badge?: "brand" | "quiet" | "invert" | "none";
}) {
  const { open } = useAuditDialog();

  return (
    <Button
      variant={variant}
      size={badge === "none" ? "xl-plain" : size}
      className={cn(className)}
      onClick={() => {
        track(event, { source });
        open(source);
      }}
      {...props}
    >
      {label}
      {badge === "none" ? null : (
        <ButtonBadge tone={badge}>
          <ArrowRight strokeWidth={2.25} />
        </ButtonBadge>
      )}
    </Button>
  );
}
