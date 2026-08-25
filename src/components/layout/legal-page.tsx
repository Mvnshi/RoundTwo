import { Container } from "@/components/layout/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AuditDialogProvider } from "@/components/lead/audit-dialog";
import { brand, getBookingUrl } from "@/lib/site";

/**
 * Shared shell for the legal pages. The copy inside them is a starting
 * point that still needs review by a lawyer before launch.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <AuditDialogProvider bookingUrl={getBookingUrl()}>
      <SiteHeader />

      <main id="main" className="flex-1 pt-12 pb-20 sm:pt-16 sm:pb-24">
        <Container className="max-w-[52rem]">
          <div className="rounded-[2rem] bg-card p-7 sm:p-10 lg:p-12">
            <p className="label-mono text-muted-foreground">
              Last updated {updated}
            </p>
            <h1 className="mt-4 text-h2 font-medium">{title}</h1>

            <div
              className={[
                "mt-10 flex flex-col gap-6 text-[0.9375rem] leading-relaxed text-muted-foreground",
                "[&_h2]:mt-6 [&_h2]:text-h3 [&_h2]:font-medium [&_h2]:text-foreground",
                "[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5",
                "[&_li]:list-disc",
                "[&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
                "[&_strong]:font-medium [&_strong]:text-foreground",
              ].join(" ")}
            >
              {children}
            </div>

            <div className="mt-12 rounded-[1.5rem] bg-background p-6 text-[0.8125rem] leading-relaxed text-muted-foreground">
              <p>
                <strong className="font-medium text-foreground">
                  Placeholder notice.
                </strong>{" "}
                This page is a working draft written to be readable, not a
                substitute for legal advice. {brand.name} should have it
                reviewed by a qualified lawyer before running paid traffic at
                scale or handling customer data on behalf of partners.
              </p>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </AuditDialogProvider>
  );
}
