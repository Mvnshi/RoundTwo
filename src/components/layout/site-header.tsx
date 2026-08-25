"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { AuditCta } from "@/components/lead/audit-cta";
import { Wordmark } from "@/components/layout/brand-mark";
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

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-200",
        isScrolled
          ? "border-border bg-background/95 supports-backdrop-filter:backdrop-blur-lg"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Wordmark />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <AuditCta
            source="nav"
            label={cta.nav}
            event="hero_cta_clicked"
            withArrow={false}
            size="lg"
            className="hidden h-9 px-4 sm:inline-flex"
          />

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon-lg" className="size-11 lg:hidden" aria-label="Open menu" />
              }
            >
              <Menu aria-hidden />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,88vw)] bg-background">
              <SheetHeader className="border-b border-border">
                <SheetTitle className="text-left text-sm font-medium">Menu</SheetTitle>
              </SheetHeader>

              <nav aria-label="Mobile" className="flex flex-col p-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-md px-3 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="mt-auto border-t border-border p-4">
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
      </div>
    </header>
  );
}
