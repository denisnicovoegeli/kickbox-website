import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { exampleGymURL } from "./servers";

const localePaths = ["/de", "/fr", "/en"];
// Every page is also checked with the example gym's colours and logo.
const pages = [
  ...localePaths,
  ...localePaths.map((path) => `${exampleGymURL}${path}`),
];

test("redirects / to the visitor's language", async ({ browser }) => {
  const context = await browser.newContext({ locale: "fr-CH" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/fr$/);
  await context.close();
});

test("sends the security headers from CHECKLIST.md", async ({ request }) => {
  const response = await request.get("/de");
  const headers = response.headers();

  const csp = headers["content-security-policy"];
  expect(csp).toMatch(/script-src 'self' 'nonce-[^']+' 'strict-dynamic'/);
  expect(csp).not.toContain("unsafe-inline");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(headers["strict-transport-security"]).toContain("max-age=");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toBeTruthy();
  expect(headers["x-powered-by"]).toBeUndefined();
});

for (const path of pages) {
  test(`${path} renders without CSP violations or serious a11y issues`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.locator(`link[rel="alternate"][hreflang="fr-CH"]`),
    ).toHaveCount(1);
    expect(errors).toEqual([]);

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const blocking = violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(blocking).toEqual([]);
  });
}
