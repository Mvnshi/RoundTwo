import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Sans } from "next/font/google";

import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { AttributionBoot } from "@/components/analytics/attribution-boot";
import { brand, seo, siteUrl } from "@/lib/site";

import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

/** Reserved for data: step numbers, status codes, money, section labels. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.title,
    template: `%s | ${brand.name}`,
  },
  description: seo.description,
  applicationName: brand.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: brand.name,
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F4EF",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AttributionBoot />
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
