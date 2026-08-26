import { cn } from "@/lib/utils";

/** Page gutter. Wide, because the grid should feel like a spread. */
export function Frame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[86rem] px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/**
 * Sections are numbered like clauses in a specification. The number is not
 * decoration: it is how the page tells you it is a document.
 */
export function Section({
  n,
  label,
  id,
  children,
  tone = "paper",
  className,
}: {
  n: string;
  label: string;
  id?: string;
  children: React.ReactNode;
  tone?: "paper" | "void";
  className?: string;
}) {
  const dark = tone === "void";
  return (
    <section
      id={id}
      className={cn(
        "border-t",
        dark ? "border-ink bg-void text-paper" : "border-ink",
        className,
      )}
    >
      <Frame>
        <div
          className={cn(
            "flex items-center gap-4 border-b py-3",
            dark ? "border-void-rule" : "border-rule",
          )}
        >
          <span className={cn("fr-num text-xs", dark ? "text-void-dim" : "text-dim")}>
            {n}
          </span>
          <span className={cn("fr-label", dark ? "text-void-dim" : "text-dim")}>
            {label}
          </span>
        </div>
        <div className="py-14 sm:py-20">{children}</div>
      </Frame>
    </section>
  );
}

/** A statement, set large. The site argues in short declarative sentences. */
export function Statement({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("fr-title max-w-4xl text-balance", className)}>
      {children}
    </h2>
  );
}

export function Lede({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("fr-lead mt-5 max-w-2xl text-pretty", className)}>
      {children}
    </p>
  );
}
