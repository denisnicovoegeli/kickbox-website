import type { NextConfig } from "next";
import {
  loadGymProfiles,
  selectGymProfile,
} from "./src/features/gym-profile/adapters/registry";
import { locales } from "./src/i18n/config";
import { rawProfiles } from "./src/profiles";
import { staticSecurityHeaders } from "./src/security/headers";

// Pages render per request, so validate every gym profile and the selected
// one here to make `next build` fail on a broken profile.
selectGymProfile(
  loadGymProfiles(rawProfiles, locales),
  process.env.GYM_PROFILE,
);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The 404 page for the dynamic [locale] root layout (app/global-not-found.tsx).
  experimental: { globalNotFound: true },
  async headers() {
    return [{ source: "/:path*", headers: staticSecurityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
