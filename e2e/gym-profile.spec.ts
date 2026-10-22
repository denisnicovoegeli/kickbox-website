import { expect, test, type Page } from "@playwright/test";
import demo from "../src/profiles/aare-boxing-club.json";
import exampleGym from "../src/profiles/example-gym.json";
import { exampleGymURL } from "./servers";

const locales = ["de", "fr", "en"] as const;

async function themeColors(page: Page) {
  return page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    return {
      primary: root.getPropertyValue("--brand-primary").trim(),
      accent: root.getPropertyValue("--brand-accent").trim(),
      background: root.getPropertyValue("--brand-background").trim(),
      text: root.getPropertyValue("--brand-text").trim(),
      bodyBackground: body.backgroundColor,
      bodyColor: body.color,
    };
  });
}

function rgb(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgb(${r}, ${g}, ${b})`;
}

for (const locale of locales) {
  test(`/${locale} shows the demo gym name and metadata`, async ({ page }) => {
    await page.goto(`/${locale}`);

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toHaveText(demo.name);
    await expect(heading.locator("img")).toHaveCount(0);
    await expect(page).toHaveTitle(demo.name);

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      demo.description[locale],
    );
    expect(demo.description[locale]).toContain(demo.name);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`/${locale}$`),
    );
    for (const hreflang of ["de-CH", "fr-CH", "en"]) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`),
      ).toHaveCount(1);
    }
  });
}

test("applies the demo profile colours", async ({ page }) => {
  await page.goto("/de");
  expect(await themeColors(page)).toEqual({
    ...demo.colors,
    bodyBackground: rgb(demo.colors.background),
    bodyColor: rgb(demo.colors.text),
  });
});

test.describe("with GYM_PROFILE=example-gym", () => {
  test.use({ baseURL: exampleGymURL });

  test("shows that gym's name, logo and colours", async ({ page }) => {
    await page.goto("/en");

    const logo = page
      .getByRole("heading", { level: 1 })
      .getByRole("img", { name: exampleGym.name });
    await expect(logo).toBeVisible();
    expect(
      await logo.evaluate((img: HTMLImageElement) => img.naturalWidth),
    ).toBeGreaterThan(0);
    await expect(page).toHaveTitle(exampleGym.name);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      exampleGym.description.en,
    );

    expect(await themeColors(page)).toEqual({
      ...exampleGym.colors,
      bodyBackground: rgb(exampleGym.colors.background),
      bodyColor: rgb(exampleGym.colors.text),
    });
  });
});
