import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";

import { company } from "@/lib/friction/content";
import { siteUrl } from "@/lib/site";

import "./frictionv3.css";

/*
  A third root layout. It shares the repo's design ideology and none of its
  tokens' values: its own <html>, its own stylesheet, its own type.
*/

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

/** The display voice. Editorial, one weight, set very large. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

/** Reserved for data: step numbers, scores, section labels. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const title = "Friction Company — everything between intention and action";
const description =
  "Friction is the distance between intention and action. We find it, measure it, and decide what should disappear and what should be harder.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${company.name}` },
  description,
  applicationName: company.name,
  alternates: { canonical: "/frictionv3" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/frictionv3`,
    siteName: company.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F5F0E8",
  colorScheme: "light",
};

export default function FrictionV3RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
