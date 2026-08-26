import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";

import { company } from "@/lib/friction/content";
import { siteUrl } from "@/lib/site";

import "./friction.css";

/*
  A second root layout. Friction Company shares a domain with the other site in
  this repo and nothing else: its own fonts, its own stylesheet, its own
  metadata, its own <html>. Neither site's tokens can reach the other.
*/

/** Industrial grotesque. Tight, heavy, built for setting things in all caps. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

/** The measuring voice: step numbers, scores, labels, annotations. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const title = "Friction Company — everything between intention and action";
const description =
  "Friction is the distance between intention and action. We find it, measure it, and decide what should disappear and what should be harder.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${company.name}` },
  description,
  applicationName: company.name,
  alternates: { canonical: "/friction" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/friction`,
    siteName: company.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#16181B",
  colorScheme: "light",
};

export default function FrictionRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
