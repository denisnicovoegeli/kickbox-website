import { defineConfig, devices } from "@playwright/test";
import { demoPort, exampleGymPort } from "./e2e/servers";

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://localhost:${demoPort}`, trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Web servers start in order, so the second one reuses the first one's build.
  webServer: [
    {
      command: `pnpm build && pnpm start --port ${demoPort}`,
      port: demoPort,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
    },
    {
      command: `pnpm start --port ${exampleGymPort}`,
      port: exampleGymPort,
      env: { GYM_PROFILE: "example-gym" },
      reuseExistingServer: !process.env.CI,
    },
  ],
});
