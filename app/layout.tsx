import type { Metadata } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loud Llamas | Marketing Setup. Done Once. Done Right.",
  description:
    "Pick your marketing channel. Pay once. Get a fully configured setup in 5 to 7 business days. No retainers. No calls. No subscriptions.",
  icons: {
    icon: [{ url: "/favicon.png", sizes: "64x64", type: "image/png" }],
    apple: [{ url: "/favicon.png" }],
  },
  verification: {
    google: "qg2IuwYhGRmf-NtVPAxDA1Oqy77FckMfPnyGIi0brCE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Tracking/analytics script (CloudFront-hosted). Loaded with async semantics
            via next/script's afterInteractive strategy so it never blocks render
            but still fires on every page view across client navigations. */}
        <Script
          src="https://d2mvefebd70kbz.cloudfront.net/scripts/019e698d-a710-7453-9dfd-fdaabcddaf7a.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geist.variable} antialiased`}>{children}</body>
    </html>
  );
}
