import { Frame } from "@/components/friction/section";
import { company } from "@/lib/friction/content";

const NAV = [
  { href: "#principle", label: "Principle" },
  { href: "#laws", label: "Laws" },
  { href: "#lexicon", label: "Lexicon" },
  { href: "#audit", label: "Audit" },
];

/**
 * A masthead, not a navbar: a rule, a name, and the fewest possible words.
 * It does not float, glow, or animate on scroll.
 */
export function Masthead() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-paper">
      <Frame>
        <div className="flex h-14 items-center justify-between gap-6">
          <a href="#top" className="flex min-w-0 items-center gap-2.5">
            <span aria-hidden className="h-3.5 w-3.5 shrink-0 bg-hazard" />
            <span className="fr-label truncate tracking-[0.18em]">
              {company.name}
            </span>
          </a>

          <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="fr-label text-dim transition-colors hover:text-hazard-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#audit"
            className="fr-label shrink-0 border border-ink bg-ink px-3 py-2 text-paper transition-colors hover:border-hazard-ink hover:bg-hazard-ink"
          >
            Request an audit
          </a>
        </div>
      </Frame>
    </header>
  );
}
