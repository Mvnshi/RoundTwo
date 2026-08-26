import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AuditDialogProvider } from "@/components/lead/audit-dialog";
import { posts, postDateFormat } from "@/lib/posts";
import { brand, getBookingUrl, siteUrl } from "@/lib/site";

const title = "Writing";
const description =
  "Research and playbooks on contractor lead follow-up — sourced properly, including when the sources disagree with us.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", url: `${siteUrl}/blog`, title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: `${brand.name} — Writing`,
  url: `${siteUrl}/blog`,
  description,
  publisher: { "@type": "Organization", name: brand.name, url: siteUrl },
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.published,
    url: `${siteUrl}/blog/${p.slug}`,
  })),
};

export default function BlogIndex() {
  return (
    <AuditDialogProvider bookingUrl={getBookingUrl()}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-brand-field">
        <SiteHeader />
        <Container className="pt-10 pb-20 sm:pt-14 sm:pb-24">
          <div className="mx-auto flex max-w-[42rem] flex-col items-center text-center">
            <p className="label-mono flex items-center gap-2 rounded-full bg-card px-4 py-2 text-foreground">
              <span className="size-1.5 rounded-full bg-brand-strong" aria-hidden />
              Writing
            </p>
            <h1 className="mt-7 max-w-[16ch] text-display text-foreground sm:mt-8">
              Sourced properly.
            </h1>
            <p className="mt-7 max-w-[46ch] text-lead text-foreground/85">
              This industry runs on statistics nobody can trace. We check ours, publish
              where they came from, and say so when the honest answer is “nobody knows.”
            </p>
          </div>
        </Container>
      </div>

      <main id="main" className="flex-1 py-14 sm:py-16 lg:py-[4.5rem]">
        <Container className="max-w-[52rem]">
          <ul className="flex flex-col gap-4">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col gap-4 rounded-[2rem] bg-card p-7 transition-colors hover:bg-secondary/40 sm:p-9"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 label-mono text-muted-foreground">
                    <span className="rounded-full bg-secondary px-3 py-1.5 text-foreground">
                      {p.tag}
                    </span>
                    <time dateTime={p.published}>
                      {postDateFormat.format(new Date(p.published))}
                    </time>
                    <span aria-hidden>·</span>
                    <span>{p.readingMinutes} min</span>
                  </div>

                  <h2 className="text-h3 font-medium">{p.title}</h2>

                  <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>

                  <span className="mt-1 inline-flex items-center gap-2 text-[0.875rem] font-medium">
                    Read it
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </main>

      <SiteFooter />
    </AuditDialogProvider>
  );
}
