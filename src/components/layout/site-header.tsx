"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Wordmark } from "@/components/layout/brand-mark";
import { PrimaryNav } from "@/components/layout/primary-nav";
import { AuditCta } from "@/components/lead/audit-cta";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cta, navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * A floating navigation pill rather than a full-width bar: the nav sits on
 * top of the hero colour field with air on every side, and the CTA lives in
 * its own detached pill beside it.
 */
export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1200px] items-center justify-center gap-2.5 px-4 transition-[padding] duration-300 sm:px-6",
          isScrolled ? "py-3" : "py-4 sm:py-5",
        )}
      >
        <div className="flex h-14 min-w-0 flex-1 items-center justify-between gap-6 rounded-full bg-card ring-1 ring-hairline pr-2 pl-4 sm:pl-6 lg:flex-none lg:gap-10 lg:pr-6">
          <Wordmark />

          <PrimaryNav />

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="brand"
                  size="icon-lg"
                  className="size-10 shrink-0 lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu aria-hidden />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[min(21rem,90vw)] rounded-l-[2rem] bg-card"
            >
              <SheetHeader className="border-b border-hairline px-5 py-4">
                <SheetTitle className="text-left text-sm font-medium">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <nav aria-label="Mobile" className="flex flex-col gap-1 p-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-full px-4 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-secondary/70"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="mt-auto border-t border-hairline p-4">
                <AuditCta
                  source="mobile-nav"
                  label={cta.primary}
                  className="w-full"
                  onClickCapture={() => setIsMenuOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <AuditCta
          source="nav"
          label={cta.nav}
          event="hero_cta_clicked"
          badge="brand"
          className="hidden h-14 shrink-0 bg-card pr-1.5 pl-6 text-foreground ring-1 ring-hairline hover:bg-card/85 sm:inline-flex"
        />
      </div>
    </header>
  );
}
