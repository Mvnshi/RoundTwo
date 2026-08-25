import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * A small set of content primitives so posts stay readable as source and
 * consistent as output. Deliberately not a markdown pipeline: these posts
 * carry tables and sourced callouts that want real components.
 */

export function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lead leading-relaxed text-foreground">{children}</p>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[1.0625rem] leading-[1.7] text-muted-foreground">{children}</p>
  );
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-6 scroll-mt-28 text-[1.5rem] leading-[1.2] font-medium tracking-[-0.025em] text-foreground sm:text-[1.875rem]">
      {children}
    </h2>
  );
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex flex-col gap-3 text-[1.0625rem] leading-[1.7] text-muted-foreground">
      {children}
    </ul>
  );
}

export function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-6 before:absolute before:top-[0.7em] before:left-0 before:size-1.5 before:rounded-full before:bg-brand-strong">
      {children}
    </li>
  );
}

export function OL({ children }: { children: React.ReactNode }) {
  return (
    <ol className="flex flex-col gap-5 text-[1.0625rem] leading-[1.7] text-muted-foreground [counter-reset:step]">
      {children}
    </ol>
  );
}

export function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="relative pl-12 [counter-increment:step] before:absolute before:top-0 before:left-0 before:grid before:size-8 before:place-items-center before:rounded-full before:bg-brand before:font-mono before:text-[0.75rem] before:font-medium before:text-brand-foreground before:content-[counter(step)]">
      <strong className="block text-[1.0625rem] font-medium text-foreground">{title}</strong>
      <span className="mt-1.5 block">{children}</span>
    </li>
  );
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-medium text-foreground">{children}</strong>;
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  const className =
    "font-medium text-foreground underline decoration-brand-strong decoration-2 underline-offset-4 transition-colors hover:decoration-foreground";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** The direct answer, formatted so answer engines can lift it cleanly. */
export function AnswerBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[1.75rem] bg-brand p-6 sm:p-7">
      <p className="label-mono text-brand-foreground/70">The short answer</p>
      <p className="mt-3 text-[1.0625rem] leading-[1.6] font-medium text-brand-foreground">
        {children}
      </p>
    </div>
  );
}

export function Callout({
  tone = "neutral",
  title,
  children,
}: {
  tone?: "neutral" | "warning";
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] p-6",
        tone === "warning" ? "bg-lost-soft/15" : "bg-secondary/60",
      )}
    >
      <p
        className={cn(
          "label-mono",
          tone === "warning" ? "text-lost" : "text-muted-foreground",
        )}
      >
        {title}
      </p>
      <div className="mt-3 text-[0.9375rem] leading-[1.65] text-foreground">{children}</div>
    </div>
  );
}

export function DataTable({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: React.ReactNode[][];
  caption?: string;
}) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-[1.5rem] bg-card">
        <table className="w-full min-w-[36rem] border-collapse text-left text-[0.9375rem]">
          <thead>
            <tr className="border-b border-hairline">
              {head.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-5 py-4 label-mono font-medium text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-hairline last:border-0">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      "px-5 py-4 align-top leading-[1.6]",
                      j === 0 ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? (
        <figcaption className="text-[0.8125rem] text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function SourceList({
  sources,
}: {
  sources: Array<{ label: string; href: string; note?: string }>;
}) {
  return (
    <div className="rounded-[1.5rem] bg-card p-6 sm:p-7">
      <h2 className="label-mono text-muted-foreground">Sources</h2>
      <ul className="mt-4 flex flex-col gap-3.5">
        {sources.map((s) => (
          <li key={s.href} className="text-[0.9375rem] leading-[1.6]">
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4"
            >
              {s.label}
            </a>
            {s.note ? (
              <span className="block text-muted-foreground">{s.note}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
