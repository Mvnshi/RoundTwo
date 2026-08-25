import { SiteFooter } from "@/components/layout/site-footer";
import { MobileCtaBar } from "@/components/layout/mobile-cta-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { AuditDialogProvider } from "@/components/lead/audit-dialog";
import { Calculator } from "@/components/sections/calculator";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { FoundingPartners } from "@/components/sections/founding-partners";
import { Hero, HeroVisual } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Leak } from "@/components/sections/leak";
import { NotACrm } from "@/components/sections/not-a-crm";
import { PersistentContext } from "@/components/sections/persistent-context";
import { faqs } from "@/lib/content";
import { brand, getBookingUrl, seo, siteUrl } from "@/lib/site";

/**
 * One @graph rather than several script tags: answer engines and rich-result
 * parsers both prefer a single connected document, and the FAQ block is what
 * actually gets lifted into answers.
 */
const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: brand.name,
      url: siteUrl,
      description: seo.description,
      email: brand.supportEmail,
      slogan: brand.tagline,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: brand.name,
      description: seo.description,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Service",
      name: `${brand.name} revenue recovery`,
      serviceType: "Lead recovery and follow-up for contractors",
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: "US",
      audience: {
        "@type": "Audience",
        audienceType:
          "Roofing, remodeling, electrical, HVAC and plumbing contractors",
      },
      offers: {
        "@type": "Offer",
        name: "Free recovery audit",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <AuditDialogProvider bookingUrl={getBookingUrl()}>
      <script
        type="application/ld+json"
        // Static, author-controlled object — no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to content
      </a>

      <div className="bg-brand-field">
        <SiteHeader />
        <Hero />
      </div>

      <main id="main" className="flex-1">
        <HeroVisual />
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
      <MobileCtaBar />
    </AuditDialogProvider>
  );
}
