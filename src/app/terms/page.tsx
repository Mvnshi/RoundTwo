import type { Metadata } from "next";

import { LegalPage } from "@/components/layout/legal-page";
import { brand } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms for using the ${brand.name} website.`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms" updated="This draft">
      <p>
        These terms cover your use of the {brand.name} website. They do not cover a paid
        engagement — if we work together, that is governed by a separate written agreement.
      </p>

      <h2>What this site is</h2>
      <p>
        An explanation of a revenue recovery service for contractors, and a form for requesting a
        free recovery audit. {brand.name} is at the founding-partner stage: we build and run each
        recovery system with a small number of contractors rather than selling self-serve
        software.
      </p>

      <h2>Illustrative figures</h2>
      <p>
        The calculator, the example recovery workflow and the example messages on this site are
        illustrations of how the service is meant to work. They are not customer data, not case
        studies and not a promise of results. Actual outcomes depend on lead quality, close rates,
        job values, sales process and factors outside our control.
      </p>

      <h2>Requesting an audit</h2>
      <p>
        Submitting the form is a request, not a contract. We may decline if we do not think we can
        help. Please give accurate information — the audit is only as useful as what you tell us.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not submit the form on someone else&apos;s behalf without their permission.</li>
        <li>Do not attempt to disrupt, scrape or overload the site.</li>
        <li>Do not use anything on this site to build a competing representation of it.</li>
      </ul>

      <h2>Our content</h2>
      <p>
        The text, design and marks on this site belong to {brand.name}. You may share links to it
        freely. Copying it wholesale is not permitted.
      </p>

      <h2>No warranty</h2>
      <p>
        The site is provided as it is. We do our best to keep it accurate and available, but we do
        not warrant that it will be error-free or uninterrupted, and we are not liable for
        decisions made purely on the basis of the illustrative figures shown here.
      </p>

      <h2>Changes</h2>
      <p>
        We will update these terms as the product and the business change. Continuing to use the
        site after a change means you accept the current version.
      </p>

      <h2>Contact</h2>
      <p>
        Questions go to <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
