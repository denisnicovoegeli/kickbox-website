import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, languageTags, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { home } = await getDictionary(locale);

  return {
    title: home.title,
    description: home.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [languageTags[l], `/${l}`]),
      ),
    },
  };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { home } = await getDictionary(locale);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">{home.heading}</h1>
      <p className="text-lg">{home.intro}</p>
    </main>
  );
}
