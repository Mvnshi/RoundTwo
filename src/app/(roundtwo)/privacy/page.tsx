import type { Metadata } from "next";

import { LegalPage } from "@/components/layout/legal-page";
import { brand } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${brand.name} handles information submitted through this website.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy" updated="This draft">
      <p>
        {brand.name} is an early-stage company. This site exists to explain what we do and to let
        contractors ask for a recovery audit. This page explains what we collect when you do that.
      </p>

      <h2>What we collect</h2>
      <p>
        When you submit the recovery audit form we collect the information you type: your first
        name, work email, company name, company website, type of business, approximate lead volume
        and the CRM or lead-management system you use.
      </p>
      <p>
        We also record technical context that arrives with the submission: the page you landed on,
        the site that referred you, any campaign parameters in the URL (such as{" "}
        <strong>utm_source</strong> or <strong>gclid</strong>), your IP address, your browser user
        agent and the time of submission. This tells us which of our ads and pages actually reach
        contractors.
      </p>

      <h2>Why we collect it</h2>
      <ul>
        <li>To prepare and send you the recovery audit you asked for.</li>
        <li>To contact you about that audit and about working together.</li>
        <li>To understand which marketing channels bring in contractors we can help.</li>
        <li>To protect the form from automated abuse.</li>
      </ul>

      <h2>Analytics</h2>
      <p>
        This site can be configured to use Google Analytics, the Meta pixel and PostHog. Where they
        are enabled they set cookies or similar identifiers and receive page views and the
        interaction events listed in our product analytics, such as opening the audit form or
        submitting it. If none are configured, no analytics scripts load at all.
      </p>

      <h2>Who we share it with</h2>
      <p>
        We do not sell your information and we do not add you to marketing lists you did not ask
        for. We share it only with the service providers that operate this site and our own
        pipeline — for example our hosting provider, our email provider and the automation or CRM
        tooling we use to track audit requests.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep audit requests for as long as we are in contact with you about working together,
        and for a reasonable period afterwards for our own records. You can ask us to delete your
        information at any time.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us for a copy of what we hold about you, ask us to correct it, or ask us to
        delete it. Email <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a> and we
        will handle it. Every email we send includes a way to stop hearing from us.
      </p>

      <h2>Follow-up on behalf of partners</h2>
      <p>
        When we build a recovery system for a contractor, that contractor remains responsible for
        their own customer relationships and consent. Follow-up only ever uses channels and
        contacts the business is authorised to contact, and opt-out requests are honoured.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this page go to{" "}
        <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
