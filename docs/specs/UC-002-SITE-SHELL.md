# UC-002-SITE-SHELL

Type: feature
Status: in-progress

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
- [x] **AC1** — Given any page in de, fr or en, when it loads, then the header shows the gym logo or wordmark linking to `/<locale>`, a navigation landmark labelled in that language with the "Home" entry, and the language switcher. _Proof: e2e `site-shell.spec.ts` › `/de|fr|en has the header with logo, navigation and languages`._
- [x] **AC2** — Given the visitor is on the home page, when they look at the navigation, then the "Home" entry is marked as the current page (`aria-current="page"`). _Proof: unit `navigation.test.ts` › `isCurrentPath`; e2e `/de|fr|en has the header …` (Home has `aria-current="page"`)._
- [x] **AC3** — Given the visitor is on `/de/<path>`, when they choose "Français" in the language switcher, then `/fr/<path>` opens; the current language is marked (`aria-current`), and each language name is announced in its own language (`lang` attribute). _Proof: unit `navigation.test.ts` › `localizedPath`; e2e `switching language keeps the page` (`/de/does-not-exist` → `/fr/does-not-exist`, `aria-current`, `lang`)._
- [x] **AC4** — Given a viewport below 768 px, when the page loads, then the navigation and language switcher are hidden behind a "Menu" button that assistive technology announces as collapsed; activating it shows them and the button is announced as expanded; pressing Escape hides them and returns focus to the button. This also works with JavaScript disabled. _Proof: e2e `below 768 px` › `the menu button toggles navigation and languages` (CDP accessibility tree collapsed/expanded, Escape returns focus) and `the menu works without JavaScript`._
- [x] **AC5** — Given a viewport of 768 px or wider, when the page loads, then the navigation and language switcher are visible and there is no menu button. _Proof: e2e `from 768 px` › `navigation and languages are visible without a menu button`._
- [x] **AC6** — Given any page, when the visitor presses Tab once, then a visible "Skip to content" link has focus; activating it moves focus to the main content. _Proof: e2e `the skip link is the first stop and moves focus to the content`._
- [x] **AC7** — Given any page, when the visitor tabs through the header and footer, then every link and button is reached in visual order and shows a visible focus indicator. _Proof: e2e `keyboard order follows the layout with a visible focus indicator`; scripted check at 375 px through the open menu (every stop has a 2 px solid outline)._
- [x] **AC8** — Given the demo profile, when any page loads, then the footer shows the address, a `tel:` link with the phone number, a `mailto:` link with the email, links labelled Instagram and Facebook to the profile URLs, and "© <current year> Aare Boxing Club". _Proof: e2e `the footer shows the demo gym's contact and social links`._
- [x] **AC9** — Given a profile without social links (example gym), when any page loads, then the footer shows that gym's contact data and has no social section. _Proof: e2e `with GYM_PROFILE=example-gym` › `the footer has no social section without social links`._
- [x] **AC10** — Given an unknown path `/<locale>/does-not-exist` for de, fr and en, when it is requested, then the response status is 404 and the page shows the header, footer, the 404 heading and text in that language, a link to `/<locale>`, and `<meta name="robots">` with `noindex`. _Proof: e2e `/de|fr|en/does-not-exist is a localized 404 page` (status 404, `noindex`); server-rendered via `global-not-found.tsx`._
- [x] **AC11** — Given an unknown path without a language, when it is requested, then the visitor is redirected to `/<their language>/<path>` and sees the 404 page. _Proof: e2e `a path without a language shows the 404 page in the visitor's language`._
- [x] **AC12** — Given the dictionaries, when they are checked, then every shell text exists in de, fr and en. _Proof: unit `dictionaries.test.ts`._
- [x] **AC13** — Given the home and 404 pages in every language and both profiles, when the quality gates run, then axe reports 0 serious or critical violations; Lighthouse meets the thresholds in `docs/PROJECT.md` on the home pages (Lighthouse cannot audit a 404 response, see Exception). _Proof: e2e `smoke.spec.ts` axe on 12 pages (home and 404, 3 languages, 2 profiles), 0 serious/critical; CI Lighthouse on PR #7 passes every assertion on the home pages. Locally Lighthouse misses TBT (300–410 ms) and one LCP (2.6 s); `main` measured the same on this machine today, so the CI result is the gate of record. 404 excepted, see Exception._

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
- **Localized 404: `app/global-not-found.tsx`** (changed in phase 3).
  - The first design (`[locale]/[...missing]/page.tsx` calling `notFound()` plus `[locale]/not-found.tsx`) returned status 404, but the server sent Next.js's empty error shell (`<html id="__next_error__">`) and the whole page was rendered only in the browser. With a dynamic root layout, a `not-found` boundary under it is only applied on the client. The Next.js docs recommend `global-not-found.tsx` for exactly this case.
  - `global-not-found.tsx` (flag `experimental.globalNotFound`) handles every unmatched URL. It is fully server-rendered with status 404, the request nonce, and `robots: noindex` injected by Next.js.
  - It renders the same document as the locale layout through `SiteDocument` (html/head/body, brand colours, skip link, header, footer), so both stay identical.
  - It gets no params, so `src/proxy.ts` adds an `x-locale` request header for paths that start with a locale, read by `getRequestLocale()`; paths the proxy skips (with a file extension) fall back to the default locale.
  - The 404 `<title>` comes from its `generateMetadata`.
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
| ui (server) | `features/site-shell/ui/SiteDocument.tsx` | html/head/body, brand colours, skip link, header, `main`, footer |
| app | `[locale]/layout.tsx`, `[locale]/page.tsx`, `global-not-found.tsx` | shell composition, 404 |
| proxy | `src/proxy.ts` | `x-locale` request header |

### Files
| Action | File |
|--------|------|
| create | `src/features/site-shell/domain/navigation.ts`, `navigation.test.ts` |
| create | `src/features/site-shell/ui/{SiteHeader,SiteMenu,MainNav,LanguageSwitcher,SiteFooter}.tsx` |
| create | `src/app/global-not-found.tsx`, `src/features/site-shell/ui/SiteDocument.tsx`, `src/i18n/request-locale.ts` |
| create | `src/i18n/dictionaries.test.ts` (key parity across locales) |
| create | `e2e/site-shell.spec.ts` |
| change | `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx` (drop `<main>`), `src/app/globals.css` (focus outline, popover styles) |
| change | `src/proxy.ts` (`x-locale`), `src/i18n/config.ts` (`languageNames`), `src/i18n/dictionaries/{de,fr,en}.json` (`shell`, `notFound`), `next.config.ts` (`experimental.globalNotFound`) |
| change | `e2e/smoke.spec.ts` (axe on 404 pages, both profiles) |
| change | `docs/PROJECT.md` (Exceptions: 404 page not in Lighthouse; approved) |

There are no new dependencies, processors or personal data, and the risk tier is unchanged.

### Exception (revised in phase 3, approved by the user, 2026-10-23)
The approved exception was "the 404 page in Lighthouse with every threshold except SEO". In phase 3, Lighthouse turned out to abort on any document that returns 404 (`ERRORED_DOCUMENT_REQUEST`), so no 404 page can be audited at all. Revised: the 404 page is not run through Lighthouse; axe in the E2E suite covers its accessibility (de/fr/en, both profiles). This is the fallback named in the design.

## Checklist
**Tier 1 — Security**
- [x] CSP without `unsafe-inline`: the shell adds no inline scripts or styles; the header test and the zero-console-errors check cover every new page _Proof: e2e header test and zero console errors on all 12 smoke pages; the brand `<style>` carries the nonce, also on the 404 page._
- [x] No secrets in the client bundle: the client components get only labels and locale props _Proof: diff review; `MainNav`, `LanguageSwitcher` and `SiteMenu` get only labels and the locale; `x-locale` is set only after `isLocale` and validated again in `getRequestLocale`._

**Tier 1 — Privacy (revDSG)**
- [ ] The Impressum is linked from every page. **Deferred to UC-008** by decision; this UC leaves room for the links in the footer. It must be done before public go-live.

**Tier 1 — Accessibility (WCAG 2.2 AA)**
- [ ] axe passes on the home and 404 pages in every language and both profiles. The manual keyboard, focus, screen-reader and 200 % zoom check is done; this is the first UC with interactive elements. _Scripted (Playwright, 2026-10-23): keyboard-only at 375 px — skip link, logo, Menü, then (open) Start, Deutsch, Français, English, footer links, each with a visible outline; Enter opens the menu, Escape closes it, a language is chosen by keyboard; Tab past the open menu never leaves focus hidden behind it (2.4.11; 375, 640, 320 px). 200 % zoom (640 CSS px): no horizontal scroll on `/de` and `/fr/does-not-exist`, menu button shown. 60-character name at 320 px wraps in header and footer, no horizontal scroll. axe green. **Open: screen-reader pass (NVDA/VoiceOver) and Vercel preview check by the user.**_

**Tier 1 — SEO & quality**
- [x] A unique `<title>` and meta description per page and language. The 404 page has a localized title; no description, because it isn't indexed. _Proof: e2e AC10 (localized 404 title); home metadata unchanged (UC-001 e2e)._
- [x] A custom 404 page _Proof: e2e AC10, AC11._
- [x] A canonical URL and `hreflang` on every indexable page (home unchanged; the 404 page is `noindex` by design) _Proof: UC-001 e2e on home; `smoke.spec.ts` asserts no `hreflang` on 404 pages._

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
| AC13 | e2e + CI | `smoke.spec.ts` axe on home and 404 for both profiles; `pnpm lighthouse` on the home pages (404 excepted, see Exception) |
| Edge: resize, link closes menu, click outside | e2e | `site-shell.spec.ts` |
| Edge: long name at 320 px | manual | phase 4 |
| Manual a11y | manual | keyboard-only flow incl. the mobile menu, focus visibility, NVDA/VoiceOver pass, 200 % zoom |
