/** Main navigation in display order; each page use case adds its entry. */
export const navEntries = [{ id: "home", path: "" }] as const;

export type NavEntryId = (typeof navEntries)[number]["id"];

export function entryHref(locale: string, path: string): string {
  return `/${locale}${path}`;
}

/**
 * The same page in another locale. Every routed path starts with a locale
 * (the proxy redirects the rest), so the first segment is swapped.
 */
export function localizedPath(pathname: string, locale: string): string {
  const [, ...rest] = pathname.split("/").filter(Boolean);
  return entryHref(locale, rest.map((segment) => `/${segment}`).join(""));
}

export function isCurrentPath(
  pathname: string,
  locale: string,
  path: string,
): boolean {
  return pathname.replace(/\/$/, "") === entryHref(locale, path);
}
