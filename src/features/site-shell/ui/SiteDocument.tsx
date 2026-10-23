import { Geist } from "next/font/google";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { getGymProfile } from "@/features/gym-profile/gym-profile";
import { languageTags, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * The whole document around a page: brand colours, skip link, header and
 * footer. Shared by the locale layout and `app/global-not-found.tsx`.
 */
export async function SiteDocument({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  // Reading the request headers renders every page per request, so Next.js
  // can attach the CSP nonce set by src/proxy.ts to its scripts.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const gym = getGymProfile(locale);
  const { colors } = gym;
  const { shell } = await getDictionary(locale);

  return (
    <html
      lang={languageTags[locale]}
      className={`${geistSans.variable} h-full antialiased`}
    >
      {/* eslint-disable-next-line @next/next/no-head-element -- App Router document; next/head is Pages Router only */}
      <head>
        {/* The colours are validated #RRGGBB values, so they cannot inject CSS. */}
        <style nonce={nonce}>
          {`:root{--brand-primary:${colors.primary};--brand-accent:${colors.accent};--brand-background:${colors.background};--brand-text:${colors.text}}`}
        </style>
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">
          {shell.skipLink}
        </a>
        <SiteHeader locale={locale} gym={gym} t={shell} />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
          {children}
        </main>
        <SiteFooter gym={gym} t={shell} />
      </body>
    </html>
  );
}
