import { describe, expect, it } from "vitest";
import demo from "@/profiles/aare-boxing-club.json";
import { loadGymProfiles, selectGymProfile } from "./registry";

const locales = ["de", "fr", "en"] as const;
const other = { ...demo, id: "other-gym", name: "Other Gym" };

describe("loadGymProfiles", () => {
  it("indexes valid profiles by id", () => {
    const profiles = loadGymProfiles([demo, other], locales);
    expect([...profiles.keys()]).toEqual(["aare-boxing-club", "other-gym"]);
  });

  it("fails if any profile is invalid", () => {
    expect(() =>
      loadGymProfiles([demo, { ...other, email: "nope" }], locales),
    ).toThrow(/"other-gym" is invalid:\n- email:/);
  });

  it("fails on duplicate ids", () => {
    expect(() => loadGymProfiles([demo, demo], locales)).toThrow(
      'Duplicate gym profile id "aare-boxing-club"',
    );
  });
});

describe("selectGymProfile", () => {
  const profiles = loadGymProfiles([demo, other], locales);

  it("defaults to the demo profile", () => {
    expect(selectGymProfile(profiles, undefined).id).toBe("aare-boxing-club");
    expect(selectGymProfile(profiles, "").id).toBe("aare-boxing-club");
  });

  it("selects a profile by id", () => {
    expect(selectGymProfile(profiles, "other-gym").name).toBe("Other Gym");
  });

  it("lists the available ids for an unknown id", () => {
    expect(() => selectGymProfile(profiles, "nope")).toThrow(
      'Unknown GYM_PROFILE "nope". Available profiles: aare-boxing-club, other-gym',
    );
  });
});
