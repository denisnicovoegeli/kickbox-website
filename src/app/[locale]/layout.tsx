import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getGymProfile } from "@/features/gym-profile/gym-profile";
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
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const { colors } = getGymProfile(locale);

  return (
    <html
      lang={languageTags[locale]}
      className={`${geistSans.variable} h-full antialiased`}
    >
      <head>
        {/* The colours are validated #RRGGBB values, so they cannot inject CSS. */}
        <style nonce={nonce}>
          {`:root{--brand-primary:${colors.primary};--brand-accent:${colors.accent};--brand-background:${colors.background};--brand-text:${colors.text}}`}
        </style>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
