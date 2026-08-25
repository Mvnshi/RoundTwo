"use client";

import { ArrowRight } from "lucide-react";

import { useAuditDialog } from "@/components/lead/audit-dialog";
import { Button } from "@/components/ui/button";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { cta } from "@/lib/site";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof Button>;

export function AuditCta({
  source,
  label = cta.primary,
  event = "hero_cta_clicked",
  withArrow = true,
  className,
  variant = "brand",
  size = "xl",
  ...props
}: Omit<ButtonProps, "onClick"> & {
  /** Where on the page the click happened — reported with the event. */
  source: string;
  label?: string;
  event?: AnalyticsEvent;
  withArrow?: boolean;
}) {
  const { open } = useAuditDialog();

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={() => {
        track(event, { source });
        open(source);
      }}
      {...props}
    >
      {label}
      {withArrow ? <ArrowRight aria-hidden /> : null}
    </Button>
  );
}
