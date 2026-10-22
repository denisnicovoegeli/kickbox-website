import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  de: () => import("./dictionaries/de.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["de"]>>;

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
