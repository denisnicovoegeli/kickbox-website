import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isLocale, languageTags } from "@/i18n/config";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Reading the request headers renders every page per request, so Next.js
  // can attach the CSP nonce set by src/proxy.ts to its scripts.
  await headers();

  return (
    <html
      lang={languageTags[locale]}
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
