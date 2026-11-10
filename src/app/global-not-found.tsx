import type { Metadata } from "next";
import Link from "next/link";
import { getGymProfile } from "@/features/gym-profile/gym-profile";
import { SiteDocument } from "@/features/site-shell/ui/SiteDocument";
import { getDictionary } from "@/i18n/dictionaries";
import { getRequestLocale } from "@/i18n/request-locale";
import "./globals.css";

// With a dynamic root layout (`[locale]`), a `not-found.tsx` under it is only
// rendered on the client. This page is server-rendered with status 404.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { notFound } = await getDictionary(locale);
  return {
    title: `${notFound.title} | ${getGymProfile(locale).name}`,
    // Next.js adds noindex only when it falls back to this page itself; on
    // Vercel the platform routes to /_not-found directly and it is missing.
    robots: { index: false },
  };
}

export default async function GlobalNotFound() {
  const locale = await getRequestLocale();
  const { notFound } = await getDictionary(locale);

  return (
    <SiteDocument locale={locale}>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <h1 className="text-4xl font-semibold tracking-tight">
          {notFound.title}
        </h1>
        <p className="text-lg">{notFound.text}</p>
        <p>
          <Link href={`/${locale}`} className="underline underline-offset-4">
            {notFound.homeLink}
          </Link>
        </p>
      </div>
    </SiteDocument>
  );
}
