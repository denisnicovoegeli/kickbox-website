# UC-001-GYM-PROFILE

Type: feature
Status: specified

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
| logo | no | no | image file in the profile; alt text is the gym name |
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
- [ ] **AC1** — Given `GYM_PROFILE` is unset, when a visitor opens `/de`, `/fr` and `/en`, then the home heading and the page `<title>` show "Aare Boxing Club".
- [ ] **AC2** — Given `GYM_PROFILE` selects a second (test) profile with a different name, colours and a logo image, when the site is built and the home page is opened, then it shows that profile's name, logo (with the gym name as alt text) and colours, with no code changes.
- [ ] **AC3** — Given the demo profile, when a visitor opens the home page, then the site's primary, accent, background and text theme colours equal the profile's colours.
- [ ] **AC4** — Given a profile without a logo, when a visitor opens the home page, then a text wordmark with the gym name is shown and no broken image appears.
- [ ] **AC5** — Given a profile missing any required field, when it is validated, then validation fails with a message naming the profile and the missing field.
- [ ] **AC6** — Given a profile with an invalid value (colour not `#RRGGBB`, invalid email, non-`https` social URL, malformed or overlapping opening-hours range, start not before end, postcode not 4 digits), when it is validated, then validation fails with a message naming the field and the value.
- [ ] **AC7** — Given a profile whose text-on-background or primary-on-background contrast is below 4.5:1, when it is validated, then validation fails with a message naming the colour pair and its ratio.
- [ ] **AC8** — Given a discipline whose name or description is missing in de, fr or en, when it is validated, then validation fails with a message naming the field and the language.
- [ ] **AC9** — Given `GYM_PROFILE` names an unknown profile, when the site is built, then the build fails with a message listing the available profile ids.
- [ ] **AC10** — Given the demo profile, when it is read for the language `fr`, then it returns all fields, with the discipline names and descriptions in French, and the address, contact, social links and opening hours unchanged.
- [ ] **AC11** — Given the demo profile, when the home page is checked in de, fr and en, then it has a `<title>` and meta description containing the gym name, a canonical URL and `hreflang` alternates.
- [ ] **AC12** — Given the demo profile, when the quality gates run, then axe reports 0 serious or critical violations and Lighthouse meets the thresholds in `docs/PROJECT.md`.

## Out of Scope
- An admin UI for editing profiles
- Custom fonts per gym
- Several locations per gym
- Holiday or exception opening hours
- Rendering address, contact, social links, opening hours and disciplines (later UCs)

## SEO & Languages
- `<title>`: the gym name, the same in every language (later page UCs prepend their page name).
- Meta description per language, containing the gym name:
  - de: "Boxtraining für alle Stufen im Aare Boxing Club in Bern."
  - fr: "Entraînement de boxe pour tous les niveaux à l’Aare Boxing Club à Berne."
  - en: "Boxing training for every level at Aare Boxing Club in Bern."
- No structured data in this UC; `LocalBusiness` from the profile is UC-009.

## Design
_Filled in Phase 2: components per layer and the files to touch._

## Checklist
_Filled in Phase 2: the items from `docs/CHECKLIST.md` that apply to this UC._

## Test Plan
| AC  | Level (unit / integration / e2e) | Test |
|-----|----------------------------------|------|
| AC1 |                                  |      |
