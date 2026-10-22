import { describe, expect, it } from "vitest";
import demo from "@/profiles/aare-boxing-club.json";
import { localizeProfile, parseGymProfile } from "./profile";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- tests mutate arbitrary JSON
type Draft = Record<string, any>;

const locales = ["de", "fr", "en"] as const;

/** A deep copy of the demo profile with one change applied. */
function variant(change: (p: Draft) => void) {
  const copy = structuredClone(demo) as Draft;
  change(copy);
  return copy;
}

function errorOf(input: unknown): string {
  try {
    parseGymProfile(input, locales);
  } catch (error) {
    return (error as Error).message;
  }
  throw new Error("expected the profile to be invalid");
}

describe("parseGymProfile", () => {
  it("accepts the demo profile", () => {
    expect(parseGymProfile(demo, locales).name).toBe("Aare Boxing Club");
  });

  it.each([
    ["name", (p: Draft) => delete p.name],
    ["colors.primary", (p: Draft) => delete p.colors.primary],
    ["address.city", (p: Draft) => delete p.address.city],
    ["phone", (p: Draft) => delete p.phone],
    ["email", (p: Draft) => delete p.email],
    ["openingHours.sun", (p: Draft) => delete p.openingHours.sun],
    ["disciplines", (p: Draft) => (p.disciplines = [])],
  ])("names the profile and the missing field %s", (field, change) => {
    const message = errorOf(variant(change));
    expect(message).toContain('"aare-boxing-club"');
    expect(message).toContain(`${field}:`);
  });

  it("accepts a profile without a logo or social links", () => {
    const profile = parseGymProfile(
      variant((p) => delete p.socialLinks),
      locales,
    );
    expect(profile.logo).toBeUndefined();
    expect(profile.socialLinks).toEqual([]);
  });

  it.each([
    ["colors.accent", "red", (p: Draft) => (p.colors.accent = "red")],
    ["email", "info@", (p: Draft) => (p.email = "info@")],
    [
      "socialLinks.0.url",
      "http://instagram.com/x",
      (p: Draft) => (p.socialLinks[0].url = "http://instagram.com/x"),
    ],
    [
      "openingHours.mon.0.opens",
      "7:00",
      (p: Draft) => (p.openingHours.mon[0].opens = "7:00"),
    ],
    [
      "openingHours.tue",
      "21:30–07:00",
      (p: Draft) =>
        (p.openingHours.tue = [{ opens: "21:30", closes: "07:00" }]),
    ],
    [
      "openingHours.wed",
      "12:00–14:00",
      (p: Draft) =>
        (p.openingHours.wed = [
          { opens: "07:00", closes: "13:00" },
          { opens: "12:00", closes: "14:00" },
        ]),
    ],
    ["address.postcode", "30000", (p: Draft) => (p.address.postcode = "30000")],
  ])("names the invalid field %s and its value", (field, value, change) => {
    const message = errorOf(variant(change));
    expect(message).toContain(`${field}:`);
    expect(message).toContain(value);
  });

  it.each([
    ["text", (p: Draft) => (p.colors.text = "#CCCCCC")],
    ["primary", (p: Draft) => (p.colors.primary = "#7DD3FC")],
  ])("rejects low contrast of %s on background", (pair, change) => {
    const message = errorOf(variant(change));
    expect(message).toContain(`${pair} on background`);
    expect(message).toMatch(/\d\.\d\d:1/);
  });

  it.each([
    ["description.fr", (p: Draft) => delete p.description.fr],
    ["disciplines.1.name.en", (p: Draft) => delete p.disciplines[1].name.en],
    [
      "disciplines.2.description.de",
      (p: Draft) => delete p.disciplines[2].description.de,
    ],
  ])("names the missing translation %s", (field, change) => {
    const message = errorOf(variant(change));
    expect(message).toContain(`${field}: missing translation`);
  });

  it("reports every problem at once", () => {
    const message = errorOf(
      variant((p) => {
        delete p.phone;
        p.colors.accent = "red";
      }),
    );
    expect(message).toContain("phone:");
    expect(message).toContain("colors.accent:");
  });
});

describe("localizeProfile", () => {
  it("resolves translated fields and keeps the rest", () => {
    const profile = parseGymProfile(demo, locales);
    const fr = localizeProfile(profile, "fr");

    expect(fr.description).toBe(demo.description.fr);
    expect(fr.disciplines.map((d) => d.name)).toEqual([
      "Boxe",
      "Boxe fitness",
      "Boxe enfants",
      "Sparring",
    ]);
    expect(fr.disciplines[0].description).toBe(
      demo.disciplines[0].description.fr,
    );
    expect(fr.address).toEqual(demo.address);
    expect(fr.phone).toBe(demo.phone);
    expect(fr.email).toBe(demo.email);
    expect(fr.socialLinks).toEqual(demo.socialLinks);
    expect(fr.openingHours).toEqual(demo.openingHours);
    expect(fr.colors).toEqual(demo.colors);
  });
});
