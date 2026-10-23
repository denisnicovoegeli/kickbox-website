import { describe, expect, it } from "vitest";
import {
  entryHref,
  isCurrentPath,
  localizedPath,
  navEntries,
} from "./navigation";

describe("navEntries", () => {
  it("lists only the pages that exist, starting with Home", () => {
    expect(navEntries.map((e) => e.id)).toEqual(["home"]);
  });
});

describe("entryHref", () => {
  it("prefixes the entry path with the locale", () => {
    expect(entryHref("fr", "")).toBe("/fr");
    expect(entryHref("de", "/prices")).toBe("/de/prices");
  });
});

describe("localizedPath", () => {
  it.each([
    ["/de", "fr", "/fr"],
    ["/de/", "fr", "/fr"],
    ["/de/does-not-exist", "fr", "/fr/does-not-exist"],
    ["/fr/a/b", "en", "/en/a/b"],
    ["/en", "en", "/en"],
  ])("maps %s to %s as %s", (pathname, locale, expected) => {
    expect(localizedPath(pathname, locale)).toBe(expected);
  });

  it("adds the locale to a path without one", () => {
    expect(localizedPath("/", "de")).toBe("/de");
  });
});

describe("isCurrentPath", () => {
  it("matches the entry in the current locale only", () => {
    expect(isCurrentPath("/de", "de", "")).toBe(true);
    expect(isCurrentPath("/de/", "de", "")).toBe(true);
    expect(isCurrentPath("/de/prices", "de", "/prices")).toBe(true);
    expect(isCurrentPath("/de/prices", "de", "")).toBe(false);
    expect(isCurrentPath("/de/does-not-exist", "de", "")).toBe(false);
    expect(isCurrentPath("/fr", "de", "")).toBe(false);
  });
});
