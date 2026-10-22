import { describe, expect, it } from "vitest";
import { defaultLocale, isLocale, negotiateLocale } from "./config";

describe("isLocale", () => {
  it("accepts supported locales only", () => {
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("it")).toBe(false);
  });
});

describe("negotiateLocale", () => {
  it("falls back to the default locale without a header", () => {
    expect(negotiateLocale(null)).toBe(defaultLocale);
  });

  it("matches region variants to their language", () => {
    expect(negotiateLocale("fr-CH,fr;q=0.9")).toBe("fr");
  });

  it("respects quality values", () => {
    expect(negotiateLocale("it;q=1, en;q=0.5, fr;q=0.8")).toBe("fr");
  });

  it("falls back when no language is supported", () => {
    expect(negotiateLocale("it-CH, es")).toBe(defaultLocale);
  });
});
