import { afterEach, describe, expect, it, vi } from "vitest";

// `next build` and `next dev` load next.config.ts first, so a throw here
// stops the build before any page is compiled.
describe("next.config.ts", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("loads with the default profile", async () => {
    vi.stubEnv("GYM_PROFILE", "");
    await expect(import("../../../next.config")).resolves.toBeDefined();
  });

  it("fails for an unknown GYM_PROFILE and lists the available ids", async () => {
    vi.stubEnv("GYM_PROFILE", "nope");
    await expect(import("../../../next.config")).rejects.toThrow(
      'Unknown GYM_PROFILE "nope". Available profiles: aare-boxing-club, example-gym',
    );
  });
});
