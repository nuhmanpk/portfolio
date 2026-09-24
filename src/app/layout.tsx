import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { RESUME_DATA } from "@/data/resume-data";
import { DESCRIPTION, KEYWORDS, OG_IMAGE, SITE_NAME, SITE_URL, TITLE, jsonLd, url } from "@/lib/seo";

import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: RESUME_DATA.name, url: SITE_URL }],
  creator: RESUME_DATA.name,
  publisher: RESUME_DATA.name,
  category: "technology",
  keywords: KEYWORDS,
  alternates: {
    canonical: SITE_URL,
    // Plain-text versions for LLMs / AI search
    types: { "text/markdown": url("llms-full.txt") },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    firstName: "Nuhman",
    lastName: "PK",
    username: "nuhmanpk",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@pk__nuhman",
    images: [OG_IMAGE],
  },
  verification: {
    google: "PXoQnkWcZHvERUZ4PrJKs5lgcOlzmtGF8BJd1Dacjts",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0c" },
    { media: "(prefers-color-scheme: light)", color: "#f5f3ee" },
  ],
};

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
  // next/font has no fallback metrics for this font yet; skip instead of warning on every build
  adjustFontFallback: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable} ${serif.variable} font-sans`}
    >
      <body className="relative min-h-screen overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
        />
        {/* Background Effects */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="glow -right-40 -top-40 h-[36rem] w-[36rem]" />
          <div className="glow -left-60 top-[60%] h-[28rem] w-[28rem]" />
        </div>
        <div className="grain" aria-hidden />

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
