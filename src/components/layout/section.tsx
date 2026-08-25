import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  bleed,
  children,
}: {
  id?: string;
  className?: string;
  /** Skip the container when a section manages its own full-bleed layout. */
  bleed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-24 lg:py-28", className)}>
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("label-mono text-muted-foreground", className)}>{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="max-w-4xl text-h2 font-medium">{title}</h2>
      {lead ? (
        <p
          className={cn(
            "max-w-2xl text-lead text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      ) : null}
    </header>
  );
}
