"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useAuditDialog } from "@/components/lead/audit-dialog";
import { Button, ButtonBadge } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cta } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Mobile-only action bar. It stays out of the way until the visitor has scrolled
 * past the hero — doubling up on the hero's own CTA would just cover it — and
 * offers both intents: talk to us now, or self-serve the scorecard.
 */
export function MobileCtaBar() {
  const { open } = useAuditDialog();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-card/95 px-4 pt-3 transition-transform duration-300 supports-backdrop-filter:backdrop-blur-lg lg:hidden",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      // Hidden from assistive tech while off-screen so it isn't announced twice.
      aria-hidden={!visible}
      inert={!visible ? true : undefined}
    >
      <div className="flex items-center gap-2.5">
        <Button
          variant="default"
          size="xl"
          className="h-12 min-w-0 flex-1 pl-5"
          onClick={() => {
            track("hero_cta_clicked", { source: "mobile-bar" });
            open("mobile-bar");
          }}
        >
          {cta.primary}
          <ButtonBadge tone="brand" className="size-9">
            <ArrowRight strokeWidth={2.25} />
          </ButtonBadge>
        </Button>

        <Link
          href="/scorecard"
          onClick={() => track("secondary_cta_clicked", { source: "mobile-bar" })}
          className="hidden h-12 shrink-0 place-items-center rounded-full border border-hairline px-4 text-[0.875rem] font-medium min-[380px]:grid"
        >
          Scorecard
        </Link>
      </div>
    </div>
  );
}
