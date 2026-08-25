import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AuditDialogProvider } from "@/components/lead/audit-dialog";
import { Calculator } from "@/components/sections/calculator";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { FoundingPartners } from "@/components/sections/founding-partners";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Leak } from "@/components/sections/leak";
import { NotACrm } from "@/components/sections/not-a-crm";
import { PersistentContext } from "@/components/sections/persistent-context";
import { brand, getBookingUrl, seo, siteUrl } from "@/lib/site";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  url: siteUrl,
  description: seo.description,
  email: brand.supportEmail,
  slogan: brand.tagline,
};

export default function HomePage() {
  return (
    <AuditDialogProvider bookingUrl={getBookingUrl()}>
      <script
        type="application/ld+json"
        // Static, author-controlled object — no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />
        <Leak />
        <HowItWorks />
        <PersistentContext />
        <Calculator />
        <NotACrm />
        <FoundingPartners />
        <Faq />
        <FinalCta />
      </main>

      <SiteFooter />
    </AuditDialogProvider>
  );
}
