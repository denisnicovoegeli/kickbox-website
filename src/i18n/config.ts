export const locales = ["de", "fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

/** Language tags for `<html lang>` and `hreflang`. */
export const languageTags: Record<Locale, string> = {
  de: "de-CH",
  fr: "fr-CH",
  en: "en",
};

/** Each language named in itself, for the language switcher. */
export const languageNames: Record<Locale, string> = {
  de: "Deutsch",
  fr: "Français",
  en: "English",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Picks the best supported locale from an `Accept-Language` header. */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter(({ q }) => q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const language = tag.split("-")[0];
    if (isLocale(language)) return language;
  }
  return defaultLocale;
}
