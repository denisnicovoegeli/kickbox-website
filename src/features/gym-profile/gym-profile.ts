import "server-only";
import { locales, type Locale } from "@/i18n/config";
import { rawProfiles } from "@/profiles";
import { loadGymProfiles, selectGymProfile } from "./adapters/registry";
import {
  localizeProfile,
  type GymProfile,
  type LocalizedGymProfile,
} from "./domain/profile";

let selected: GymProfile | undefined;

/** The gym profile chosen by `GYM_PROFILE`, resolved for one locale. */
export function getGymProfile(locale: Locale): LocalizedGymProfile {
  selected ??= selectGymProfile(
    loadGymProfiles(rawProfiles, locales),
    process.env.GYM_PROFILE,
  );
  return localizeProfile(selected, locale);
}
