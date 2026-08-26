import { Suspense } from "react";
import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/layout/container";
import { AuditDialogProvider } from "@/components/lead/audit-dialog";
import { ScorecardFlow } from "@/components/scorecard/scorecard-flow";
import { brand, getBookingUrl, siteUrl } from "@/lib/site";

const title = "Lead Leak Scorecard — find out what your follow-up is costing you";
const description =
  "Nine questions, about ninety seconds. Get a leak score out of 100, a breakdown of where opportunities are falling through, and an illustrative figure for what recovering them would be worth. No email needed to see your result.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/scorecard" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/scorecard`,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "RoundTwo Lead Leak Scorecard",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${siteUrl}/scorecard`,
  description,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: brand.name, url: siteUrl },
};

export default function ScorecardPage() {
  return (
    <AuditDialogProvider bookingUrl={getBookingUrl()}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-brand-field">
        <SiteHeader />
        <Container className="pt-10 pb-24 sm:pt-14 sm:pb-32">
          <div className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
            <p className="label-mono flex items-center gap-2 rounded-full bg-card px-4 py-2 text-foreground">
              <span className="size-1.5 rounded-full bg-brand-strong" aria-hidden />
              Free · No signup
            </p>
            <h1 className="mt-7 max-w-[18ch] text-display text-foreground sm:mt-8">
              What is your follow-up actually costing you?
            </h1>
            <p className="mt-7 max-w-[52ch] text-lead text-foreground/85 sm:mt-8">
              Nine questions about how leads move through your business. You get a leak
              score, where it&apos;s going, and a conservative figure for what recovering
              it would be worth.
            </p>
          </div>
        </Container>
      </div>

      <main id="main" className="relative z-10 -mt-16 flex-1 pb-20 sm:-mt-20 sm:pb-24">
        <Container>
          <Suspense
            fallback={
              <div className="mx-auto h-[28rem] w-full max-w-[44rem] animate-pulse rounded-[2rem] bg-card" />
            }
          >
            <ScorecardFlow bookingUrl={getBookingUrl()} />
          </Suspense>
        </Container>
      </main>

      <SiteFooter />
    </AuditDialogProvider>
  );
}
