import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[75rem] px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("label-mono text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      <Container>{children}</Container>
    </section>
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
    // The <header> landmark stays a real element inside the reveal, so the
    // document outline is identical whether or not the motion runs.
    <ScrollReveal y={18} blur={5} className={className}>
      <header
        className={cn(
          "flex flex-col gap-4",
          align === "center" && "items-center text-center",
        )}
      >
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2
          className={cn(
            "max-w-4xl text-h2",
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

/** The recurring surface: white, generously rounded, hairline ring, no shadow. */
export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card ring-1 ring-hairline",
        className,
      )}
    >
      {children}
    </div>
  );
}
