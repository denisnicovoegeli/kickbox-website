import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGymProfile } from "@/features/gym-profile/gym-profile";
import { GymLogo } from "@/features/gym-profile/ui/GymLogo";
import { isLocale, languageTags, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const gym = getGymProfile(locale);

  return {
    title: gym.name,
    description: gym.description,
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
  const gym = getGymProfile(locale);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight break-words">
        <GymLogo name={gym.name} logo={gym.logo} />
      </h1>
      <p className="text-lg">{home.intro}</p>
    </div>
  );
}
