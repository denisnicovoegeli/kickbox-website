import Link from "next/link";
import type { LocalizedGymProfile } from "@/features/gym-profile/domain/profile";
import { GymLogo } from "@/features/gym-profile/ui/GymLogo";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { navEntries } from "../domain/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MainNav } from "./MainNav";
import { SITE_MENU_ID, SiteMenu } from "./SiteMenu";

type Props = {
  locale: Locale;
  gym: LocalizedGymProfile;
  t: Dictionary["shell"];
};

export function SiteHeader({ locale, gym, t }: Props) {
  return (
    <header className="border-b border-foreground/15">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link
          href={`/${locale}`}
          className="text-xl font-semibold tracking-tight break-words"
        >
          <GymLogo name={gym.name} logo={gym.logo} />
        </Link>
        <button
          type="button"
          popoverTarget={SITE_MENU_ID}
          className="rounded border border-foreground/40 px-3 py-1.5 md:hidden"
        >
          {t.menu}
        </button>
        <SiteMenu>
          <MainNav
            locale={locale}
            label={t.mainNav}
            entries={navEntries.map((entry) => ({
              ...entry,
              label: t.nav[entry.id],
            }))}
          />
          <LanguageSwitcher locale={locale} label={t.language} />
        </SiteMenu>
      </div>
    </header>
  );
}
