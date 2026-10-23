# UC-001-GYM-PROFILE

Type: feature
Status: done

## Intent
As a site operator, I want all gym-specific data (name, logo, brand colours, address, contact, social links, opening hours, disciplines) to come from one gym profile, so that I can rebrand the site for another gym without code changes.

## Preconditions
- The repository holds one or more gym profiles; the demo profile is `aare-boxing-club`.
- The deployment selects its profile with the env var `GYM_PROFILE`; when it is unset, the demo profile is used.

## Flow
1. The operator adds a profile for a gym (or edits an existing one) and sets `GYM_PROFILE` to its id.
2. The build validates the selected profile: required fields, value formats, translations for every site language and colour contrast.
3. Every page can read the validated profile, with translatable fields resolved for the page's language.
4. In this UC, the profile visibly drives:
   - the gym name in the home page heading and in the `<title>` and meta description of every page, in every language
   - the brand colours, applied site-wide as theme colours
   - the logo on the home page: the logo image if the profile has one, otherwise a text wordmark of the gym name
5. The remaining fields (address, contact, social links, opening hours, disciplines) are available to pages and are rendered by later UCs (site shell, home, schedule, contact, SEO).

### Demo profile "Aare Boxing Club" (placeholders, fictive)
| Field | Value |
|-------|-------|
| Id | `aare-boxing-club` |
| Name | Aare Boxing Club |
| Description | the three meta descriptions under SEO & Languages |
| Logo | none (text wordmark) |
| Colours | primary `#0E7490`, accent `#B91C1C`, background `#FFFFFF`, text `#111827` |
| Address | Musterstrasse 1, 3000 Bern, Switzerland |
| Phone | +41 31 000 00 00 |
| Email | info@aare-boxing-club.example |
| Social links | Instagram `https://www.instagram.com/aare.boxing.club.example`, Facebook `https://www.facebook.com/aare.boxing.club.example` |
| Opening hours | Mon–Fri 07:00–21:30 · Sat 09:00–14:00 · Sun closed |
| Disciplines | Boxing, Fitness Boxing, Kids Boxing, Sparring — each with a translated name and a one-sentence description (de/fr/en) |

The address, phone, email and social links are placeholders on reserved or non-existent addresses; a real gym replaces them with its own profile.

### Fields
| Field | Required | Translated (de/fr/en) | Rules |
|-------|----------|-----------------------|-------|
| id | yes | no | lowercase kebab case, unique |
| name | yes | no | 1–60 characters |
| description | yes | yes | 50–160 characters; used as the meta description |
| logo | no | no | image file with width and height; alt text is the gym name |
| colours (primary, accent, background, text) | yes | no | hex colour `#RRGGBB` |
| address (street, postcode, city, country) | yes | no | Swiss postcode is 4 digits |
| phone | yes | no | international format `+41 …` |
| email | yes | no | valid email address |
| social links | no | no | list of platform + `https://` URL |
| opening hours | yes | no | per weekday: closed, or one or more `HH:MM–HH:MM` ranges with start before end and no overlap |
| disciplines | yes, ≥ 1 | name and description | name 1–40 characters, description 1–200 characters |

## Edge Cases & Errors
- `GYM_PROFILE` names a profile that does not exist → the build fails and lists the available profile ids.
- A required field is missing → the build fails and names the profile and the field.
- A value breaks its rule (bad colour, email, URL, time range, postcode) → the build fails and names the field and the value.
- A translated field is missing in one of de/fr/en → the build fails and names the field and the language. There is no silent fallback to another language.
- Text on background, or primary on background, has a contrast ratio below 4.5:1 → the build fails and names the colour pair and its ratio.
- No logo → a text wordmark of the gym name is shown.
- No social links → nothing breaks; later UCs render no social section.
- Long gym name (up to 60 characters) → the heading wraps without horizontal scrolling at 320 px width.

## Acceptance Criteria
- [x] **AC1** — Given `GYM_PROFILE` is unset, when a visitor opens `/de`, `/fr` and `/en`, then the home heading and the page `<title>` show "Aare Boxing Club". _Proof: e2e `gym-profile.spec.ts` › `/de|fr|en shows the demo gym name and metadata`._
- [x] **AC2** — Given `GYM_PROFILE` selects a second (test) profile with a different name, colours and a logo image, when the site is built and the home page is opened, then it shows that profile's name, logo (with the gym name as alt text) and colours, with no code changes. _Proof: e2e `gym-profile.spec.ts` › `with GYM_PROFILE=example-gym` (second server, same build)._
- [x] **AC3** — Given the demo profile, when a visitor opens the home page, then the site's primary, accent, background and text theme colours equal the profile's colours. _Proof: e2e `gym-profile.spec.ts` › `applies the demo profile colours`._
- [x] **AC4** — Given a profile without a logo, when a visitor opens the home page, then a text wordmark with the gym name is shown and no broken image appears. _Proof: e2e `gym-profile.spec.ts` › demo `h1` has text and no `img`._
- [x] **AC5** — Given a profile missing any required field, when it is validated, then validation fails with a message naming the profile and the missing field. _Proof: unit `profile.test.ts` › `names the profile and the missing field …`._
- [x] **AC6** — Given a profile with an invalid value (colour not `#RRGGBB`, invalid email, non-`https` social URL, malformed or overlapping opening-hours range, start not before end, postcode not 4 digits), when it is validated, then validation fails with a message naming the field and the value. _Proof: unit `profile.test.ts` › `names the invalid field … and its value` (incl. protocol-relative logo path)._
- [x] **AC7** — Given a profile whose text-on-background or primary-on-background contrast is below 4.5:1, when it is validated, then validation fails with a message naming the colour pair and its ratio. _Proof: unit `contrast.test.ts` and `profile.test.ts` › `rejects low contrast …`._
- [x] **AC8** — Given the profile description, or a discipline name or description, missing in de, fr or en, when it is validated, then validation fails with a message naming the field and the language. _Proof: unit `profile.test.ts` › `names the missing translation …`._
- [x] **AC9** — Given `GYM_PROFILE` names an unknown profile, when the site is built, then the build fails with a message listing the available profile ids. _Proof: unit `registry.test.ts`, integration `build-validation.test.ts`; `GYM_PROFILE=nope pnpm build` fails with the id list._
- [x] **AC10** — Given the demo profile, when it is read for the language `fr`, then it returns all fields, with the discipline names and descriptions in French, and the address, contact, social links and opening hours unchanged. _Proof: unit `profile.test.ts` › `localizeProfile`._
- [x] **AC11** — Given the demo profile, when the home page is checked in de, fr and en, then it has a `<title>` and meta description containing the gym name, a canonical URL and `hreflang` alternates. _Proof: e2e `gym-profile.spec.ts` › title, description, canonical and `hreflang` per locale._
- [x] **AC12** — Given the demo profile, when the quality gates run, then axe reports 0 serious or critical violations and Lighthouse meets the thresholds in `docs/PROJECT.md`. _Proof: e2e `smoke.spec.ts` axe on both profiles; `pnpm lighthouse` 0 failures locally and in CI._

## Out of Scope
- An admin UI for editing profiles
- Custom fonts per gym
- Several locations per gym
- Holiday or exception opening hours
- Rendering address, contact, social links, opening hours and disciplines (later UCs)

## SEO & Languages
- `<title>`: the gym name, the same in every language (later page UCs prepend their page name).
- Meta description per language, from the profile `description` (demo values):
  - de: "Boxtraining für alle Stufen im Aare Boxing Club in Bern."
  - fr: "Entraînement de boxe pour tous les niveaux à l’Aare Boxing Club à Berne."
  - en: "Boxing training for every level at Aare Boxing Club in Bern."
- No structured data in this UC; `LocalBusiness` from the profile is UC-009.

## Design

### Approach
- **Profiles are data.** Each gym is one JSON file in `src/profiles/`, registered in `src/profiles/index.ts` (one import line per gym). Static imports bundle every profile, so it works on Vercel with no runtime file access. Adding a gym means adding data and one registry line, with no logic changes.
- **Selection at runtime, validation at build.** `GYM_PROFILE` picks the profile when a request is served. `next.config.ts` validates **every** registered profile and the selected id when the config loads, so `next build` (and `next dev`) fail on any invalid profile. Because one build contains all profiles, the E2E suite can serve a second profile from the same build.
- **Validation** uses `zod`, a new runtime dependency that UC-007 will reuse for form input. Custom rules sit on top of it: contrast, opening-hours ranges, and the required locales. The locales come in as a parameter, so the domain stays free of imports.
- **Theme colours under the CSP.** The layout renders `<style nonce={nonce}>:root{--brand-…}</style>` with the per-request nonce from `x-nonce`. This needs no `unsafe-inline`; inline `style` attributes can't carry a nonce, so they aren't used. The values are validated `#RRGGBB`, so they can't inject CSS. Tailwind exposes them as `primary`, `accent`, `background` and `foreground`. The dark-mode override in `globals.css` is removed, because the validated contrast holds only for the profile's own pair.
- **Accent is decorative only.** Its contrast isn't validated, so it must not be used for text.
- **Logo.** `GymLogo` renders the optimized props from `getImageProps` (`next/image`) on a plain `<img>` with the gym name as alt text, otherwise a text wordmark. `<Image>` itself is not used because it adds an inline `style` attribute that the CSP blocks. The home `h1` wraps `GymLogo`. UC-002 reuses it in the header.
- **Metadata.** `<title>` is the profile name. The meta description is the profile `description` for the page's locale. The `home.title`, `home.heading` and `home.description` dictionary keys are removed; `home.intro` stays.

### Components per layer
| Layer | Component | Responsibility |
|-------|-----------|----------------|
| domain | `features/gym-profile/domain/profile.ts` | schema and types, `parseGymProfile(input, locales)` with field-named errors, `localizeProfile(profile, locale)` |
| domain | `features/gym-profile/domain/contrast.ts` | WCAG relative luminance and contrast ratio |
| adapter | `features/gym-profile/adapters/registry.ts` | `loadGymProfile(id, registry)`: unknown id → error listing the ids; `validateAllProfiles(registry)` for the build |
| feature | `features/gym-profile/gym-profile.ts` (`server-only`) | `getGymProfile(locale)`: reads `GYM_PROFILE` (default `aare-boxing-club`), memoized per process |
| ui | `features/gym-profile/ui/GymLogo.tsx` | logo image or wordmark |
| app | `app/[locale]/layout.tsx`, `app/[locale]/page.tsx` | theme style tag, metadata and heading from the profile |
| config | `next.config.ts` | build-time validation |

### Files
| Action | File |
|--------|------|
| add dep | `zod` |
| create | `src/features/gym-profile/domain/profile.ts`, `profile.test.ts` |
| create | `src/features/gym-profile/domain/contrast.ts`, `contrast.test.ts` |
| create | `src/features/gym-profile/adapters/registry.ts`, `registry.test.ts` |
| create | `src/features/gym-profile/gym-profile.ts` |
| create | `src/features/gym-profile/build-validation.test.ts` (imports `next.config.ts`) |
| create | `src/features/gym-profile/ui/GymLogo.tsx` |
| create | `src/profiles/index.ts`, `src/profiles/aare-boxing-club.json`, `src/profiles/example-gym.json` |
| create | `public/profiles/example-gym/logo.svg` (second profile with a logo, used by E2E for AC2) |
| create | `e2e/gym-profile.spec.ts`, `e2e/servers.ts` (ports of both servers) |
| change | `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/app/globals.css` |
| change | `src/i18n/dictionaries/{de,fr,en}.json` (remove keys that move to the profile) |
| change | `next.config.ts`, `playwright.config.ts` (second `next start` with `GYM_PROFILE=example-gym` on port 3001, same build) |
| change | `.env.example` (`GYM_PROFILE`), `docs/PROJECT.md` (Structure: `src/profiles/`) |

There is no new processor and no personal data, and the risk tier is unchanged.

## Checklist
**Tier 1 — Security**
- [x] CSP without `unsafe-inline`: the theme `<style>` uses the request nonce, and the existing header test plus the zero-console-errors check stay green _Proof: e2e header test + zero console errors on all 6 pages (it caught `<Image>`'s inline style, fixed with `getImageProps`)._
- [x] Input is validated against a schema: profiles are validated with `zod` at build and on load _Proof: unit tests AC5–AC8; build check in `next.config.ts`._
- [x] No secrets in the client bundle: `GYM_PROFILE` is server-only (no `NEXT_PUBLIC_`), and the profile holds only public business data _Proof: diff review; client JS identical in size to `main` (569,574 bytes), no zod in `.next/static`._
- [x] Dependencies come from the lock file: `zod` is added through `pnpm`, and `pnpm-lock.yaml` is committed _Proof: `pnpm install --frozen-lockfile` and `pnpm audit --audit-level high` pass._

**Tier 1 — Accessibility (WCAG 2.2 AA)**
- [x] axe passes for both profiles. The manual keyboard, focus, screen-reader and 200 % zoom check is done; a 60-character name wraps at 320 px. _Scripted (Playwright): these pages have no focusable elements yet, so there is nothing to operate or focus; no horizontal scroll at 200 % zoom; a 60-character name wraps at 320 px; the accessibility tree has one `h1` with the gym name (logo alt text for the example gym); axe green on both profiles. Screen-reader pass and Vercel preview check done by the user (2026-10-22)._

**Tier 1 — SEO & quality**
- [x] A unique `<title>` and meta description per page and language _Proof: e2e AC1/AC11._
- [x] A canonical URL and `hreflang` on every page _Proof: e2e AC11._
- [x] Images are optimized: the logo uses `next/image` `getImageProps` with width and height; fonts are self-hosted (`next/font`) _Proof: `GymLogo` uses `getImageProps` with width and height; `next/font` unchanged._

Tiers 2 and 3 have no applicable items (no CMS, booking, accounts or payments in this UC).

## Test Plan
| AC  | Level (unit / integration / e2e) | Test |
|-----|----------------------------------|------|
| AC1 | e2e | `gym-profile.spec.ts`: `/de`, `/fr` and `/en` show "Aare Boxing Club" in the `h1` and `<title>` |
| AC2 | e2e | `gym-profile.spec.ts`: the port 3001 server (`example-gym`) shows its name, its logo `img[alt=<name>]` and its colours |
| AC3 | e2e | `gym-profile.spec.ts`: the computed `--brand-primary/accent/background/text` on `:root` and the body background and text colours equal the demo profile values |
| AC4 | e2e | `gym-profile.spec.ts`: the demo `h1` contains the text wordmark and no `img` |
| AC5 | unit | `profile.test.ts`: each required field removed → error names the profile and the field |
| AC6 | unit | `profile.test.ts`: table of invalid values (colour, email, `http:` URL, bad time, overlap, start ≥ end, postcode) → error names the field and the value |
| AC7 | unit | `contrast.test.ts` (known ratios, e.g. black/white = 21) and `profile.test.ts`: a low-contrast pair → error names the pair and the ratio |
| AC8 | unit | `profile.test.ts`: description or discipline text missing per locale → error names the field and the language |
| AC9 | unit + integration | `registry.test.ts`: unknown id → error lists the ids; `build-validation.test.ts`: importing `next.config.ts` with `GYM_PROFILE=nope` throws |
| AC10 | unit | `profile.test.ts`: `localizeProfile(demo, "fr")` returns French disciplines and unchanged contact, address, social links and hours |
| AC11 | e2e | `gym-profile.spec.ts`: per locale, the title and meta description contain the name, and the canonical link and `hreflang` alternates are present |
| AC12 | e2e + CI | `smoke.spec.ts` axe check (also run against the 3001 server) and `pnpm lighthouse` |
| CSP nonce | e2e | `smoke.spec.ts`: the header test, plus no console errors (a blocked style would log a CSP violation) |
| Manual a11y | manual | keyboard, focus, screen reader, 200 % zoom, 60-character name at 320 px; recorded in phase 4 |
