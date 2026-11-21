import { expect, test, type Locator, type Page } from "@playwright/test";
import de from "../src/i18n/dictionaries/de.json";
import en from "../src/i18n/dictionaries/en.json";
import fr from "../src/i18n/dictionaries/fr.json";
import demo from "../src/profiles/aare-boxing-club.json";
import exampleGym from "../src/profiles/example-gym.json";
import { exampleGymURL } from "./servers";

const dictionaries = { de, fr, en };
const locales = ["de", "fr", "en"] as const;
const mobile = { width: 375, height: 740 };
const desktop = { width: 1280, height: 800 };

/** The expanded state Chromium exposes to screen readers. */
async function expandedState(page: Page, name: string) {
  const cdp = await page.context().newCDPSession(page);
  const { nodes } = await cdp.send("Accessibility.getFullAXTree");
  const button = nodes.find(
    (n) => n.role?.value === "button" && n.name?.value === name,
  );
  return button?.properties?.find((p) => p.name === "expanded")?.value.value;
}

function shell(page: Page, locale: (typeof locales)[number]) {
  const t = dictionaries[locale].shell;
  return {
    t,
    menuButton: page.getByRole("button", { name: t.menu }),
    mainNav: page.getByRole("navigation", { name: t.mainNav }),
    languages: page.getByRole("navigation", { name: t.language }),
  };
}

for (const locale of locales) {
  test(`/${locale} has the header with logo, navigation and languages`, async ({
    page,
  }) => {
    await page.setViewportSize(desktop);
    await page.goto(`/${locale}`);
    const { t, mainNav, languages } = shell(page, locale);

    await expect(
      page.getByRole("banner").getByRole("link", { name: demo.name }),
    ).toHaveAttribute("href", `/${locale}`);
    await expect(
      mainNav.getByRole("link", { name: t.nav.home }),
    ).toHaveAttribute("aria-current", "page");

    for (const [code, name] of [
      ["de", "Deutsch"],
      ["fr", "Français"],
      ["en", "English"],
    ]) {
      const link = languages.getByRole("link", { name });
      await expect(link).toHaveAttribute("lang", code);
      await expect(link).toHaveAttribute("href", `/${code}`);
      if (code === locale) {
        await expect(link).toHaveAttribute("aria-current", "true");
      } else {
        await expect(link).not.toHaveAttribute("aria-current");
      }
    }
  });

  test(`/${locale}/does-not-exist is a localized 404 page`, async ({
    page,
  }) => {
    const t = dictionaries[locale].notFound;
    const response = await page.goto(`/${locale}/does-not-exist`);

    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(`${t.title} | ${demo.name}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(t.title);
    await expect(page.getByText(t.text)).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: t.homeLink }),
    ).toHaveAttribute("href", `/${locale}`);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    // In the server HTML, so crawlers see it. Locally Next.js adds its own
    // identical tag next to the one from generateMetadata.
    const robots = (await response?.text())?.match(
      /<meta name="robots"[^>]*>/g,
    );
    expect(robots?.length).toBeGreaterThan(0);
    for (const tag of robots ?? []) expect(tag).toContain("noindex");
  });
}

test("a path without a language shows the 404 page in the visitor's language", async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: "fr-CH" });
  const page = await context.newPage();
  await page.goto("/does-not-exist");
  await expect(page).toHaveURL(/\/fr\/does-not-exist$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    fr.notFound.title,
  );
  await context.close();
});

test("switching language keeps the page", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.goto("/de/does-not-exist");
  await shell(page, "de")
    .languages.getByRole("link", { name: "Français" })
    .click();
  await expect(page).toHaveURL(/\/fr\/does-not-exist$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr-CH");
});

test.describe("below 768 px", () => {
  test.use({ viewport: mobile });

  test("the menu button toggles navigation and languages", async ({ page }) => {
    await page.goto("/de");
    const { t, menuButton, mainNav, languages } = shell(page, "de");

    await expect(mainNav).toBeHidden();
    await expect(languages).toBeHidden();
    expect(await expandedState(page, t.menu)).toBe(false);

    await menuButton.click();
    await expect(mainNav).toBeVisible();
    await expect(languages).toBeVisible();
    expect(await expandedState(page, t.menu)).toBe(true);

    await mainNav.getByRole("link", { name: t.nav.home }).focus();
    await page.keyboard.press("Escape");
    await expect(mainNav).toBeHidden();
    await expect(menuButton).toBeFocused();
  });

  test("the menu works without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: mobile,
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto("/de");
    const { menuButton, mainNav } = shell(page, "de");

    await expect(mainNav).toBeHidden();
    await menuButton.click();
    await expect(mainNav).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(mainNav).toBeHidden();
    await context.close();
  });

  test("the menu closes on a click outside and after navigating", async ({
    page,
  }) => {
    await page.goto("/de/does-not-exist");
    const { t, menuButton, mainNav } = shell(page, "de");

    await menuButton.click();
    await page.mouse.click(10, mobile.height - 10);
    await expect(mainNav).toBeHidden();

    await menuButton.click();
    await mainNav.getByRole("link", { name: t.nav.home }).click();
    await expect(page).toHaveURL(/\/de$/);
    await expect(mainNav).toBeHidden();
  });

  test("an open menu turns into the desktop navigation when widened", async ({
    page,
  }) => {
    await page.goto("/de");
    const { menuButton, mainNav } = shell(page, "de");

    await menuButton.click();
    await page.setViewportSize(desktop);
    await expect(menuButton).toBeHidden();
    await expect(mainNav).toBeVisible();
    const box = await mainNav.boundingBox();
    const header = await page.getByRole("banner").boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(
      header!.y + header!.height,
    );
  });
});

test.describe("from 768 px", () => {
  test.use({ viewport: { width: 768, height: 800 } });

  test("navigation and languages are visible without a menu button", async ({
    page,
  }) => {
    await page.goto("/de");
    const { menuButton, mainNav, languages } = shell(page, "de");
    await expect(menuButton).toBeHidden();
    await expect(mainNav).toBeVisible();
    await expect(languages).toBeVisible();
  });
});

test("the skip link is the first stop and moves focus to the content", async ({
  page,
}) => {
  await page.goto("/de");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: de.shell.skipLink });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("keyboard order follows the layout with a visible focus indicator", async ({
  page,
}) => {
  await page.setViewportSize(desktop);
  await page.goto("/de");

  const expected = [
    de.shell.skipLink,
    demo.name,
    de.shell.nav.home,
    "Deutsch",
    "Français",
    "English",
    demo.phone,
    demo.email,
    ...demo.socialLinks.map((s) => s.platform),
  ];
  const reached: string[] = [];
  for (let i = 0; i < expected.length; i++) {
    await page.keyboard.press("Tab");
    const focused: Locator = page.locator(":focus");
    reached.push((await focused.innerText()).trim());
    const outline = await focused.evaluate((el) => {
      const style = getComputedStyle(el);
      return `${style.outlineStyle} ${style.outlineWidth}`;
    });
    expect(outline, `focus indicator on ${reached.at(-1)}`).not.toMatch(
      /^none|0px$/,
    );
  }
  expect(reached).toEqual(expected);
});

test("the footer shows the demo gym's contact and social links", async ({
  page,
}) => {
  await page.goto("/de");
  const footer = page.getByRole("contentinfo");

  await expect(footer).toContainText(demo.address.street);
  await expect(footer).toContainText(
    `${demo.address.postcode} ${demo.address.city}`,
  );
  await expect(footer.getByRole("link", { name: demo.phone })).toHaveAttribute(
    "href",
    `tel:${demo.phone.replace(/\s/g, "")}`,
  );
  await expect(footer.getByRole("link", { name: demo.email })).toHaveAttribute(
    "href",
    `mailto:${demo.email}`,
  );
  for (const social of demo.socialLinks) {
    const link = footer.getByRole("link", { name: social.platform });
    await expect(link).toHaveAttribute("href", social.url);
    await expect(link).not.toHaveAttribute("target");
  }
  await expect(footer).toContainText(
    `© ${new Date().getFullYear()} ${demo.name}`,
  );
});

test.describe("with GYM_PROFILE=example-gym", () => {
  test.use({ baseURL: exampleGymURL });

  test("the footer has no social section without social links", async ({
    page,
  }) => {
    await page.goto("/en");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toContainText(exampleGym.address.street);
    await expect(
      footer.getByRole("link", { name: exampleGym.email }),
    ).toBeVisible();
    await expect(footer.getByText(en.shell.social)).toHaveCount(0);
  });
});
