/**
 * Single source of truth for brand + site-level configuration.
 * Renaming the company is a one-line change here.
 */

export const brand = {
  name: "RoundTwo",
  /** Rendered as two weights in the wordmark: "Round" + "Two". */
  wordmark: { lead: "Round", tail: "Two" },
  descriptor: "Revenue recovery for contractors",
  tagline: "Paid for the lead. Get another shot.",
  domain: "roundtwo.com",
  supportEmail: "hello@roundtwo.com",
} as const;

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://roundtwo.com"
).replace(/\/$/, "");

export const seo = {
  title: `${brand.name} | Turn Lost Contractor Leads Into Booked Jobs`,
  shortTitle: `${brand.name} — ${brand.descriptor}`,
  description:
    "Recover missed calls, stale estimates and forgotten contractor leads with intelligent follow-up built around your existing sales process.",
} as const;

export const cta = {
  primary: "Find My Lost Revenue",
  primaryLong: "Get My Free Recovery Audit",
  secondary: "See a Recovery",
  nav: "Free Recovery Audit",
  booking: "Book a 15-minute call",
} as const;

export const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Why It Works", href: "#why-it-works" },
  { label: "ROI", href: "#roi" },
  { label: "FAQ", href: "#faq" },
] as const;

export const footerLinks = {
  product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Why It Works", href: "#why-it-works" },
    { label: "Recovery Calculator", href: "#roi" },
    { label: "Founding Partners", href: "#founding-partners" },
    { label: "FAQ", href: "#faq" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;

/**
 * Optional booking link shown after a lead is stored successfully.
 *
 * Read on the server and passed down as a prop rather than imported into a
 * client component: `NEXT_PUBLIC_*` values are inlined into the client bundle
 * at build time, so a client-side import would silently ignore the variable on
 * any host that sets env vars after the build.
 */
export function getBookingUrl(): string {
  return process.env.NEXT_PUBLIC_BOOKING_URL ?? "";
}
