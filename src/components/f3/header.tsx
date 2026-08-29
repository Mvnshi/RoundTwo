"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { navItems } from "@/components/f3/nav-items";
import { Container } from "@/components/f3/primitives";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#method", label: "Method" },
  { href: "#good-friction", label: "Good friction" },
  { href: "#laws", label: "Laws" },
  { href: "#lexicon", label: "Lexicon" },
];

/**
 * A floating split pill rather than a full-width bar: the nav sits on top of
 * the hero colour field with air on every side, and the CTA lives in its own
 * detached pill beside it.
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
      <Container
        className={cn(
          "flex max-w-[75rem] items-center justify-center gap-2.5 transition-[padding] duration-300",
          isScrolled ? "py-3" : "py-4 sm:py-5",
        )}
      >
        <div className="flex h-14 min-w-0 flex-1 items-center justify-between gap-6 rounded-full bg-card pr-2 pl-4 ring-1 ring-hairline sm:pl-6 lg:flex-none lg:gap-10 lg:pr-6">
          <a href="#top" className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden
              className="size-5 shrink-0 rounded-[0.4rem] bg-foreground"
            />
            <span className="truncate text-[0.9375rem] font-semibold tracking-[-0.01em]">
              Friction Company
            </span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            {navItems(NAV)}
          </nav>

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
                {NAV.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <a
                        href={item.href}
                        className="rounded-2xl px-4 py-3 text-[0.9375rem] transition-colors hover:bg-secondary/70"
                      >
                        {item.label}
                      </a>
                    }
                  />
                ))}
              </nav>

              <div className="mt-auto border-t border-hairline p-4">
                <SheetClose
                  render={
                    <a
                      href="#audit"
                      className={cn(buttonVariants({ variant: "brand" }), "w-full")}
                    >
                      Request an audit
                    </a>
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <a
          href="#audit"
          className="hidden h-14 shrink-0 items-center gap-3 rounded-full bg-card pr-2 pl-6 text-[0.9375rem] font-medium ring-1 ring-hairline transition-colors hover:bg-secondary/40 lg:inline-flex"
        >
          Request an audit
          <span
            aria-hidden
            className="grid size-10 place-items-center rounded-full bg-brand text-foreground"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </Container>
    </header>
  );
}
