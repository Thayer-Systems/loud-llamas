import type { Metadata } from "next";
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
      <body className={`${geist.variable} antialiased`}>{children}</body>
    </html>
  );
}
