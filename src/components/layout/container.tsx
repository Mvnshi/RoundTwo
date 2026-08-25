import { cn } from "@/lib/utils";

/**
 * The single horizontal rhythm for the site. Every section uses it so the
 * left edge of text lines up from the navbar down to the footer.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>
  );
}
