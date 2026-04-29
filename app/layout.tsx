import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouX — Products & Digital Agency",
  description:
    "YouX is a product studio that ships real software — SaaS platforms and custom solutions for ambitious teams.",
  openGraph: {
    title: "YouX — Products & Digital Agency",
    description:
      "Product studio and digital agency. We build University Engage, Reach, and custom software.",
    url: "https://youx.info",
    siteName: "YouX",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouX — Products & Digital Agency",
    description: "Product studio and digital agency. We ship real software.",
  },
  metadataBase: new URL("https://youx.info"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
