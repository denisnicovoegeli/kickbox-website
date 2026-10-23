# UC-002-SITE-SHELL

Type: feature
Status: designed

## Intent
As a visitor, I want a consistent header, footer and "not found" page on every page, so that I can find my way around, switch language, and reach the gym from anywhere on the site.

## Preconditions
- A valid gym profile is selected (UC-001); the shell reads the gym name, logo, address, phone, email and social links from it.
- The site languages are de (default), fr and en.

## Flow
1. The visitor opens any page under `/de`, `/fr` or `/en`.
2. The first focusable element is a "Skip to content" link, visible only when focused; it moves focus to the main content.
3. The **header** shows:
   - the gym logo (or wordmark), linking to the home page in the current language
   - the main navigation, listing only pages that exist; the current page is marked
   - the language switcher, listing Deutsch, Français and English with the current language marked; choosing another language opens the same page in that language
4. Below 768 px viewport width, the navigation and the language switcher are behind a "Menu" button. The button opens and closes them, announces its state, and Escape closes the menu and returns focus to the button. From 768 px, they are always visible and there is no menu button. The header is not fixed while scrolling.
5. The **footer** shows, from the gym profile:
   - the address
   - the phone number as a link that starts a call
   - the email address as a link that starts an email
   - the social links, labelled with their platform names, opening in the same tab
   - "© <current year> <gym name>"
6. An unknown path under a language (e.g. `/fr/nope`) shows the **404 page** in that language with HTTP status 404: header and footer, a heading, a short text and a link to the home page. Search engines are told not to index it.
7. An unknown path without a language (e.g. `/nope`) is first redirected to the visitor's language, as today, and then shows the 404 page.

### Navigation entries
Each page UC adds its own entry when it ships, so no entry links to a missing page. In this UC only **Home** exists.

| Order | Entry | de | fr | en | Added by |
|-------|-------|----|----|----|----------|
| 1 | Home | Start | Accueil | Home | UC-002 |
| 2 | Schedule | Stundenplan | Horaire | Schedule | UC-004 |
| 3 | Prices | Preise | Tarifs | Prices | UC-005 |
| 4 | Coaches | Coaches | Coachs | Coaches | UC-006 |
| 5 | Gallery | Galerie | Galerie | Gallery | UC-010 |
| 6 | Trial & Contact | Probetraining & Kontakt | Essai & contact | Trial & Contact | UC-007 |
| — | Call to action "Trial lesson" (highlighted) | Probetraining | Cours d’essai | Trial lesson | UC-007 |

### Footer legal links
The Impressum, privacy policy and AGB links are added to the footer by UC-008, together with those pages. This UC ships without legal links.

### Shell texts
| Text | de | fr | en |
|------|----|----|----|
| Skip link | Zum Inhalt springen | Aller au contenu | Skip to content |
| Main navigation (label) | Hauptnavigation | Navigation principale | Main navigation |
| Menu button | Menü | Menu | Menu |
| Language switcher (label) | Sprache | Langue | Language |
| Footer: contact heading | Kontakt | Contact | Contact |
| Footer: social heading | Folgen Sie uns | Suivez-nous | Follow us |
| 404 heading | Seite nicht gefunden | Page introuvable | Page not found |
| 404 text | Diese Seite gibt es nicht (mehr). | Cette page n’existe pas (ou plus). | This page doesn't exist (anymore). |
| 404 link | Zur Startseite | Retour à l’accueil | Back to home |

Language names in the switcher are always written in their own language (Deutsch, Français, English).

## Edge Cases & Errors
- Profile without social links → the footer has no social section and no empty heading.
- Profile with a logo → the header shows the logo image with the gym name as alt text; without one, the wordmark.
- Long gym name (60 characters) → header and footer wrap without horizontal scrolling at 320 px.
- Switching language on the 404 page → the same unknown path in the other language, which is again a 404 in that language.
- JavaScript unavailable → below 768 px the navigation and language switcher are still reachable.
- Menu open and viewport widened to ≥ 768 px → navigation is shown normally, without the menu button.
- Menu open and a navigation link chosen → the menu closes on the new page.
- Clicking outside the open menu closes it.

## Acceptance Criteria
- [ ] **AC1** — Given any page in de, fr or en, when it loads, then the header shows the gym logo or wordmark linking to `/<locale>`, a navigation landmark labelled in that language with the "Home" entry, and the language switcher.
- [ ] **AC2** — Given the visitor is on the home page, when they look at the navigation, then the "Home" entry is marked as the current page (`aria-current="page"`).
- [ ] **AC3** — Given the visitor is on `/de/<path>`, when they choose "Français" in the language switcher, then `/fr/<path>` opens; the current language is marked (`aria-current`), and each language name is announced in its own language (`lang` attribute).
- [ ] **AC4** — Given a viewport below 768 px, when the page loads, then the navigation and language switcher are hidden behind a "Menu" button that assistive technology announces as collapsed; activating it shows them and the button is announced as expanded; pressing Escape hides them and returns focus to the button. This also works with JavaScript disabled.
- [ ] **AC5** — Given a viewport of 768 px or wider, when the page loads, then the navigation and language switcher are visible and there is no menu button.
- [ ] **AC6** — Given any page, when the visitor presses Tab once, then a visible "Skip to content" link has focus; activating it moves focus to the main content.
- [ ] **AC7** — Given any page, when the visitor tabs through the header and footer, then every link and button is reached in visual order and shows a visible focus indicator.
- [ ] **AC8** — Given the demo profile, when any page loads, then the footer shows the address, a `tel:` link with the phone number, a `mailto:` link with the email, links labelled Instagram and Facebook to the profile URLs, and "© <current year> Aare Boxing Club".
- [ ] **AC9** — Given a profile without social links (example gym), when any page loads, then the footer shows that gym's contact data and has no social section.
- [ ] **AC10** — Given an unknown path `/<locale>/does-not-exist` for de, fr and en, when it is requested, then the response status is 404 and the page shows the header, footer, the 404 heading and text in that language, a link to `/<locale>`, and `<meta name="robots">` with `noindex`.
- [ ] **AC11** — Given an unknown path without a language, when it is requested, then the visitor is redirected to `/<their language>/<path>` and sees the 404 page.
- [ ] **AC12** — Given the dictionaries, when they are checked, then every shell text exists in de, fr and en.
- [ ] **AC13** — Given the home and 404 pages in every language and both profiles, when the quality gates run, then axe reports 0 serious or critical violations and Lighthouse meets the thresholds in `docs/PROJECT.md` (home and 404 pages).

## Out of Scope
- The content pages behind the other navigation entries (UC-003 to UC-010)
- Impressum, privacy policy and AGB pages and their footer links (UC-008)
- Cookie banner (none needed: no non-essential cookies)
- A cookie that remembers the chosen language
- Search, dark-mode toggle, icons for social links, a fixed header

## SEO & Languages
- 404 page: `<title>` "Seite nicht gefunden | Aare Boxing Club" / "Page introuvable | Aare Boxing Club" / "Page not found | Aare Boxing Club" (page name, then the gym name from the profile); `robots: noindex`; no canonical or `hreflang`.
- Home page metadata is unchanged (UC-001).
- The `<title>` convention "<page> | <gym name>" applies to all later pages.
- No structured data in this UC.

## Design

### Approach
- **The layout owns the shell.** `[locale]/layout.tsx` renders the skip link, `SiteHeader`, `<main id="main" tabIndex={-1}>` around the page, and `SiteFooter`. Pages no longer render their own `<main>`.
- **Mobile menu: native popover** (decided with the user).
  - Below 768 px, `<button popovertarget="site-menu">` toggles `<div id="site-menu" popover>`, which holds the navigation and the language switcher. The browser exposes the expanded state, closes the menu on Escape and on a click outside, and returns focus to the button. None of this needs JavaScript.
  - From 768 px (`md:`), CSS shows the popover inline and hides the button.
  - The popover API sets no `aria-expanded` attribute. AC4 is tested through Chromium's accessibility tree (CDP), which is what screen readers read.
- **Current path needs small client components.** Next.js keeps layouts mounted during client navigation, so a server-rendered "current page" mark or language link would go stale.
  - `MainNav` and `LanguageSwitcher` are `"use client"` components that use `usePathname()`. They get their labels as props from the server, so no dictionary is shipped to the browser.
  - `SiteMenu` (client) wraps the popover and closes it when the path changes or the viewport reaches 768 px.
  - The toggle itself still works without JavaScript.
- **Navigation links** use `next/link`. **Language links** are plain `<a>` elements, so a language switch loads a full page and `<html lang>`, the metadata and the server-rendered content all update.
- **Localized 404.**
  - `[locale]/[...missing]/page.tsx` calls `notFound()`, and `[locale]/not-found.tsx` renders inside the locale layout, so the header and footer are present.
  - Next.js returns status 404 (`notFound()` runs before streaming) and injects `robots: noindex`.
  - `not-found.tsx` gets no props, so `src/proxy.ts` adds an `x-locale` request header for paths that start with a locale, and `not-found.tsx` reads it. It falls back to the default locale for paths the proxy skips, i.e. those with a file extension.
  - The 404 `<title>` comes from `generateMetadata` in `not-found.tsx`.
- **Focus indicator.** A global `:focus-visible` outline in `--brand-text` colour, offset 2 px. Its contrast against the background is at least 4.5:1, guaranteed by UC-001 validation, so it meets the 3:1 non-text minimum.
- **Footer.**
  - Server component reading `getGymProfile(locale)`.
  - The `tel:` href is the phone number without spaces.
  - The year comes from the server clock at render time (pages render per request).
  - There's no social section when `socialLinks` is empty.
- **Texts.** A new `shell` and `notFound` section in each dictionary.

### Components per layer
| Layer | Component | Responsibility |
|-------|-----------|----------------|
| domain | `features/site-shell/domain/navigation.ts` | `navEntries` (ordered; only Home now), `localizedPath(pathname, locale)` (swap the first segment), `isCurrentPath(pathname, locale, entryPath)` |
| ui (server) | `features/site-shell/ui/SiteHeader.tsx` | logo link (`GymLogo`), menu button, `SiteMenu` with `MainNav` and `LanguageSwitcher` |
| ui (client) | `features/site-shell/ui/SiteMenu.tsx` | popover container; closes on path change and at ≥ 768 px |
| ui (client) | `features/site-shell/ui/MainNav.tsx` | nav landmark, `aria-current="page"` |
| ui (client) | `features/site-shell/ui/LanguageSwitcher.tsx` | `<a lang hrefLang>` per locale, `aria-current="true"` on the current one |
| ui (server) | `features/site-shell/ui/SiteFooter.tsx` | address, `tel:`, `mailto:`, social links, copyright |
| app | `[locale]/layout.tsx`, `[locale]/page.tsx`, `[locale]/not-found.tsx`, `[locale]/[...missing]/page.tsx` | shell composition, 404 |
| proxy | `src/proxy.ts` | `x-locale` request header |

### Files
| Action | File |
|--------|------|
| create | `src/features/site-shell/domain/navigation.ts`, `navigation.test.ts` |
| create | `src/features/site-shell/ui/{SiteHeader,SiteMenu,MainNav,LanguageSwitcher,SiteFooter}.tsx` |
| create | `src/app/[locale]/not-found.tsx`, `src/app/[locale]/[...missing]/page.tsx` |
| create | `src/i18n/dictionaries.test.ts` (key parity across locales) |
| create | `e2e/site-shell.spec.ts` |
| change | `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx` (drop `<main>`), `src/app/globals.css` (focus outline, popover styles) |
| change | `src/proxy.ts` (`x-locale`), `src/i18n/dictionaries/{de,fr,en}.json` (`shell`, `notFound`) |
| change | `e2e/smoke.spec.ts` (axe on 404 pages, both profiles), `lighthouserc.json` (add `/de/does-not-exist`) |
| change | `docs/PROJECT.md` (Exceptions: 404 page SEO; **pending the user's approval**) |

There are no new dependencies, processors or personal data, and the risk tier is unchanged.

### Pending exception (needs approval)
Lighthouse SEO fails on any 404 page by design: the `http-status-code` audit fails, and `is-crawlable` fails because of `noindex`. Proposal: add the 404 page to Lighthouse with every threshold except the SEO category, which is recorded under Exceptions in `PROJECT.md` with that reason. If this isn't approved, the 404 page stays out of Lighthouse and only axe covers it.

## Checklist
**Tier 1 — Security**
- [ ] CSP without `unsafe-inline`: the shell adds no inline scripts or styles; the header test and the zero-console-errors check cover every new page
- [ ] No secrets in the client bundle: the client components get only labels and locale props

**Tier 1 — Privacy (revDSG)**
- [ ] The Impressum is linked from every page. **Deferred to UC-008** by decision; this UC leaves room for the links in the footer. It must be done before public go-live.

**Tier 1 — Accessibility (WCAG 2.2 AA)**
- [ ] axe passes on the home and 404 pages in every language and both profiles. The manual keyboard, focus, screen-reader and 200 % zoom check is done; this is the first UC with interactive elements.

**Tier 1 — SEO & quality**
- [ ] A unique `<title>` and meta description per page and language. The 404 page has a localized title; no description, because it isn't indexed.
- [ ] A custom 404 page
- [ ] A canonical URL and `hreflang` on every indexable page (home unchanged; the 404 page is `noindex` by design)

Tiers 2 and 3 have no applicable items.

## Test Plan
| AC  | Level (unit / integration / e2e) | Test |
|-----|----------------------------------|------|
| AC1 | e2e | `site-shell.spec.ts`: per locale, the logo link `href="/<locale>"`, a nav with the localized label containing "Home", and the switcher |
| AC2 | unit + e2e | `navigation.test.ts` `isCurrentPath`; e2e: Home has `aria-current="page"` on `/de` |
| AC3 | unit + e2e | `navigation.test.ts` `localizedPath` (root, nested, trailing slash, query-free); e2e: on `/de/does-not-exist`, "Français" goes to `/fr/does-not-exist`; current language has `aria-current`; each link has `lang` |
| AC4 | e2e | `site-shell.spec.ts` at 375 px: menu hidden; CDP AX tree reports the button collapsed, then expanded after a click; Escape hides it and focus is on the button; repeated with `javaScriptEnabled: false` |
| AC5 | e2e | at 1280 px: nav and switcher visible, menu button hidden |
| AC6 | e2e | first Tab focuses the visible skip link; Enter puts focus on `main#main` |
| AC7 | e2e | Tab sequence matches the expected order (skip link, logo, Home, languages, footer links); each focused element has a non-`none` outline |
| AC8 | e2e | footer texts and the `tel:`/`mailto:`/social hrefs equal the demo profile; copyright with the current year |
| AC9 | e2e | port 3001: example gym contact shown; no social heading or list |
| AC10 | e2e | per locale: `request.get` status 404; page shows header, footer, localized heading and text, home link; `meta[name=robots]` contains `noindex` |
| AC11 | e2e | `/does-not-exist` with `fr-CH` lands on `/fr/does-not-exist` showing the French 404 |
| AC12 | unit | `dictionaries.test.ts`: fr and en have exactly the de key set, with no empty strings |
| AC13 | e2e + CI | `smoke.spec.ts` axe on home and 404 for both profiles; `pnpm lighthouse` incl. `/de/does-not-exist` (see the pending exception) |
| Edge: resize, link closes menu, click outside | e2e | `site-shell.spec.ts` |
| Edge: long name at 320 px | manual | phase 4 |
| Manual a11y | manual | keyboard-only flow incl. the mobile menu, focus visibility, NVDA/VoiceOver pass, 200 % zoom |
