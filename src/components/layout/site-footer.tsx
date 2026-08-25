import Link from "next/link";

import { Wordmark } from "@/components/layout/brand-mark";
import { Container } from "@/components/layout/container";
import { brand, footerLinks } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-secondary/60">
      <Container className="py-14 pb-28 sm:py-16 lg:pb-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <div className="flex max-w-sm flex-col gap-4 lg:col-span-2">
            <Wordmark />
            <p className="text-[0.875rem] leading-relaxed text-muted-foreground">
              {brand.tagline} {brand.name} helps contractors recover the leads, calls and
              estimates they have already paid for.
            </p>
            <a
              href={`mailto:${brand.supportEmail}`}
              className="-my-1 w-fit py-1 text-[0.875rem] font-medium underline underline-offset-4 hover:text-foreground"
            >
              {brand.supportEmail}
            </a>
          </div>

          <FooterColumn title="Product" links={footerLinks.product} />
          <FooterColumn title="Free tools" links={footerLinks.resources} />
          <FooterColumn title="Legal" links={footerLinks.legal} />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-8 text-[0.75rem] leading-relaxed text-muted-foreground sm:mt-14">
          <p className="max-w-3xl">
            {brand.name} is an early-stage company currently working with a small number of
            founding partners. Figures shown on this site are illustrative examples, not
            guarantees or customer results. Follow-up only ever uses channels and contacts a
            business is authorised to contact, with consent and opt-out handling in place.
          </p>
          <p>
            © {year} {brand.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <nav aria-label={title} className="flex flex-col gap-3.5">
      <h2 className="label-mono text-muted-foreground">{title}</h2>
      <ul className="flex flex-col gap-1">
        {links.map((link) => (
          <li key={link.href}>
            {link.href.startsWith("/") ? (
              <Link
                href={link.href}
                className="block py-1.5 text-[0.875rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                className="block py-1.5 text-[0.875rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
