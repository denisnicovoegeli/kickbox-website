import {
  GymProfileError,
  parseGymProfile,
  type GymProfile,
} from "../domain/profile";

export const DEFAULT_GYM_PROFILE = "aare-boxing-club";

/** Validates every profile and indexes them by id; fails on any problem. */
export function loadGymProfiles(
  raw: readonly unknown[],
  locales: readonly string[],
): Map<string, GymProfile> {
  const profiles = new Map<string, GymProfile>();
  const errors: string[] = [];

  for (const input of raw) {
    try {
      const profile = parseGymProfile(input, locales);
      if (profiles.has(profile.id)) {
        errors.push(`Duplicate gym profile id "${profile.id}"`);
      }
      profiles.set(profile.id, profile);
    } catch (error) {
      if (!(error instanceof GymProfileError)) throw error;
      errors.push(error.message);
    }
  }

  if (errors.length > 0) throw new GymProfileError(errors.join("\n\n"));
  return profiles;
}

/** Picks the profile named by `GYM_PROFILE`, or the demo profile if unset. */
export function selectGymProfile(
  profiles: ReadonlyMap<string, GymProfile>,
  id: string | undefined,
): GymProfile {
  const selected = id || DEFAULT_GYM_PROFILE;
  const profile = profiles.get(selected);
  if (!profile) {
    throw new GymProfileError(
      `Unknown GYM_PROFILE "${selected}". Available profiles: ${[...profiles.keys()].join(", ")}`,
    );
  }
  return profile;
}
