"use client";

import { usePathname } from "next/navigation";
import {
  languageNames,
  languageTags,
  locales,
  type Locale,
} from "@/i18n/config";
import { localizedPath } from "../domain/navigation";

/** Plain links, so `<html lang>` and metadata update with a full page load. */
export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label={label}>
      <ul className="flex gap-4">
        {locales.map((l) => (
          <li key={l}>
            <a
              href={localizedPath(pathname, l)}
              lang={l}
              hrefLang={languageTags[l]}
              aria-current={l === locale ? "true" : undefined}
              className="aria-[current=true]:font-semibold aria-[current=true]:underline aria-[current=true]:underline-offset-4"
            >
              {languageNames[l]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
