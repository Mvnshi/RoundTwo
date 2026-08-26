import { Container } from "@/components/layout/container";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
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
    <section id={id} className={cn("py-14 sm:py-16 lg:py-[4.5rem]", className)}>
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
    <p className={cn("label-mono text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    // The reveal wrapper is presentational; the <header> landmark and its
    // heading stay real elements inside it so the document outline is
    // unchanged whether or not motion runs.
    <ScrollReveal y={20} blur={6} className={className}>
      <header
        className={cn(
          "flex flex-col gap-4",
          align === "center" && "items-center text-center",
        )}
      >
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2
          className={cn(
            "max-w-4xl text-h2 font-medium",
            align === "center" && "mx-auto",
          )}
        >
          {title}
        </h2>
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
    </ScrollReveal>
  );
}
