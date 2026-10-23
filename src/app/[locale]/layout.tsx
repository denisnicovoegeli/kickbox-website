import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteDocument } from "@/features/site-shell/ui/SiteDocument";
import { isLocale } from "@/i18n/config";
import "../globals.css";

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

  return <SiteDocument locale={locale}>{children}</SiteDocument>;
}
