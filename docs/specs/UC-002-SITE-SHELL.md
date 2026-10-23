# UC-002-SITE-SHELL

Type: feature
Status: specified

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

## Acceptance Criteria
- [ ] **AC1** — Given any page in de, fr or en, when it loads, then the header shows the gym logo or wordmark linking to `/<locale>`, a navigation landmark labelled in that language with the "Home" entry, and the language switcher.
- [ ] **AC2** — Given the visitor is on the home page, when they look at the navigation, then the "Home" entry is marked as the current page (`aria-current="page"`).
- [ ] **AC3** — Given the visitor is on `/de/<path>`, when they choose "Français" in the language switcher, then `/fr/<path>` opens; the current language is marked (`aria-current`), and each language name is announced in its own language (`lang` attribute).
- [ ] **AC4** — Given a viewport below 768 px, when the page loads, then the navigation and language switcher are hidden behind a "Menu" button with `aria-expanded="false"`; activating it shows them and sets `aria-expanded="true"`; pressing Escape hides them and returns focus to the button.
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
_Filled in Phase 2: components per layer and the files to touch._

## Checklist
_Filled in Phase 2: the items from `docs/CHECKLIST.md` that apply to this UC._

## Test Plan
| AC  | Level (unit / integration / e2e) | Test |
|-----|----------------------------------|------|
| AC1 |                                  |      |
