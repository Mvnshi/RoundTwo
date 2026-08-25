import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AuditDialogProvider } from "@/components/lead/audit-dialog";
import { ButtonBadge, buttonVariants } from "@/components/ui/button";
import { posts, postDateFormat, type Post } from "@/lib/posts";
import { brand, getBookingUrl, siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ArticleLayout({ post, children }: { post: Post; children: React.ReactNode }) {
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.published,
        dateModified: post.updated ?? post.published,
        url: `${siteUrl}/blog/${post.slug}`,
        mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
        author: { "@type": "Organization", name: brand.name, url: siteUrl },
        publisher: { "@type": "Organization", name: brand.name, url: siteUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `${siteUrl}/blog/${post.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <AuditDialogProvider bookingUrl={getBookingUrl()}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <main id="main" className="flex-1 pt-8 pb-20 sm:pt-12 sm:pb-24">
        <Container className="max-w-[46rem]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[0.875rem] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All writing
          </Link>

          <header className="mt-8 flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 label-mono text-muted-foreground">
              <span className="rounded-full bg-secondary px-3 py-1.5 text-foreground">
                {post.tag}
              </span>
              <time dateTime={post.published}>
                {postDateFormat.format(new Date(post.published))}
              </time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
            </div>

            <h1 className="text-h2 font-medium">{post.title}</h1>
          </header>

          <article className="mt-10 flex flex-col gap-6">{children}</article>

          {/* ------------------------------------------------------- CTA */}
          <aside className="mt-14 rounded-[2rem] bg-foreground p-7 text-background sm:p-9">
            <p className="label-mono text-background/60">Put a number on your own</p>
            <h2 className="mt-4 max-w-lg text-h3 font-medium">
              Nine questions, about ninety seconds, no email to see the result.
            </h2>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-background/70">
              The Lead Leak Scorecard scores how leads move through your business and
              gives you a conservative figure for what recovering them would be worth.
            </p>
            <Link
              href="/scorecard"
              className={cn(buttonVariants({ variant: "brand", size: "xl" }), "mt-7")}
            >
              Take the scorecard
              <ButtonBadge tone="invert">
                <ArrowRight strokeWidth={2.25} />
              </ButtonBadge>
            </Link>
          </aside>

          {/* --------------------------------------------------- related */}
          {related.length > 0 ? (
            <nav aria-label="More writing" className="mt-14">
              <h2 className="label-mono text-muted-foreground">Keep reading</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="flex h-full flex-col gap-3 rounded-[1.75rem] bg-card p-6 transition-colors hover:bg-secondary/50"
                    >
                      <span className="label-mono text-muted-foreground">{p.tag}</span>
                      <span className="text-[1.0625rem] leading-snug font-medium">
                        {p.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </Container>
      </main>

      <SiteFooter />
    </AuditDialogProvider>
  );
}
