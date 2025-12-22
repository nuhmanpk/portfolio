import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Nuhman PK | Software Engineer & Portfolio",
  description:
    "Portfolio of Nuhman PK showcasing projects, skills, and experience in software development and AI.",
  metadataBase: new URL("https://nuhmanpk.github.io/portfolio"),
  alternates: {
    canonical: "https://nuhmanpk.github.io/portfolio",
  },
  keywords: [
    "nuhman",
    "nuhman pk",
    "pk nuhman",
    "nuhman portfolio",
    "nuhman pk portfolio",
    "nuhman developer",
    "nuhman software engineer",
    "nuhman pk developer",
    "nuhman full stack",
    "nuhman pk software engineer",
    "nuhman official website",
    "nuhman personal website",
    "nuhman tech",
    "nuhman programmer",
    "nuhman engineer"
  ],
  openGraph: {
    title: "Nuhman PK | Software Engineer",
    description:
      "Explore Nuhman PK’s projects, achievements, and technical skills in web and software engineering.",
    url: "https://nuhmanpk.github.io/portfolio",
    siteName: "Nuhman PK Portfolio",
    images: [
      {
        url: "https://media.licdn.com/dms/image/v2/D5603AQHsj5-yhlVfdQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1719462659919?e=1762992000&v=beta&t=2x4zUevN0KkfBRv6gDJBcsrrRFV9EjsVZwVGVxq7fpc",
        width: 800,
        height: 800,
        alt: "Nuhman PK – Software Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuhman PK | Senior Software Engineer",
    description:
      "Full-stack engineer portfolio — Next.js, React, and Node.js.",
    images: [
      "https://media.licdn.com/dms/image/D4D03AQGxxxxxxxx/profile-displayphoto-shrink_800_800/0/xxxxx",
    ],
  },
  verification: {
    google: "PXoQnkWcZHvERUZ4PrJKs5lgcOlzmtGF8BJd1Dacjts",
  },
};

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}