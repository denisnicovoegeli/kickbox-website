import "server-only";
import { headers } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./config";

/**
 * The locale of the current request, for components without route params
 * (`global-not-found.tsx`). Paths the proxy skips fall back to the default
 * locale.
 */
export async function getRequestLocale(): Promise<Locale> {
  const locale = (await headers()).get("x-locale");
  return locale && isLocale(locale) ? locale : defaultLocale;
}
