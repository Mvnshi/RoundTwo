import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { brand } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The mark is a return/second-pass arrow — the whole product in one glyph.
 * Drawn from Lucide's geometry rather than a bespoke illustration.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-[7px] bg-foreground",
        className,
      )}
    >
      <RotateCcw className="size-4 text-brand" strokeWidth={2.5} />
    </span>
  );
}

export function Wordmark({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "-my-1 flex w-fit items-center gap-2.5 rounded-sm py-1 text-foreground transition-opacity hover:opacity-80",
        className,
      )}
    >
      <BrandMark />
      <span className="text-[1.0625rem] font-semibold tracking-[-0.03em]">
        {brand.wordmark.lead}
        {brand.wordmark.tail}
      </span>
      <span className="sr-only">— {brand.descriptor}</span>
    </Link>
  );
}
