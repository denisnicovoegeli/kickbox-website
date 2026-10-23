# PROJECT.md

## Purpose
Customizable website for boxing gyms, shown as a demo for a fictive gym in Bern ("Aare Boxing Club"). Visitors learn about the gym and its classes; members buy memberships and class passes online and manage them in a personal account. Each real gym gets its own branding, content and configuration from one gym profile, without code changes.

## Risk Tier
**3** — see `docs/CHECKLIST.md`
- 1: content pages + contact form
- 2: + CMS, booking or other third-party data flows
- 3: + login, personal accounts or payments

## Stack
- Language / framework: TypeScript, Next.js 16 (App Router), React 19, Tailwind CSS 4
- Package manager: pnpm (version pinned in `package.json` → `packageManager`), Node.js ≥ 24
- Tests: Vitest (unit), Playwright + axe-core (E2E, accessibility), Lighthouse CI
- Auth: Supabase Auth
- Payments: Stripe (hosted Checkout)
- CMS / booking: none; content lives in the repo
- Email: Resend
- Hosting: Vercel (function region `fra1`)

## Languages
- Site content: de-CH (default, `/de`), fr-CH (`/fr`), en (`/en`)
- With more than one language: i18n is set up from the start (localized routes, `hreflang`, translated metadata).

## Architecture
Feature folders with ports and adapters. Dependency rule: `app` → `features` → `domain`; domain code is plain TypeScript with no Next.js, React or I/O imports.

- Pages and route handlers in `src/app/[locale]/` stay thin: they parse input, call a feature and render.
- Each feature lives in `src/features/<feature>/`, with `domain/` (pure logic, unit tested) and `adapters/` (Supabase, Stripe, Resend).
- External services sit behind the interfaces in `src/services/`. Tests and CI use fakes; real adapters are chosen from env vars.
- Every page is rendered per request, so `src/proxy.ts` can set a CSP nonce. No `unsafe-inline` scripts; static pages and PPR are off by design.

## Structure
| Path | Contents |
|------|----------|
| `src/app/[locale]/` | Routes; every page is under a locale segment |
| `src/features/` | One folder per feature (`domain/`, `adapters/`), added by use cases |
| `src/profiles/` | Gym profiles (one JSON per gym, registered in `index.ts`); `GYM_PROFILE` selects one, validated at build |
| `src/services/` | Interfaces and adapters for email, auth and payments |
| `src/i18n/` | Locale config, negotiation and dictionaries (`dictionaries/<locale>.json`) |
| `src/security/` | CSP and security headers |
| `src/proxy.ts` | Locale redirect and per-request CSP nonce |
| `e2e/` | Playwright tests, including the header and axe smoke tests |
| `docs/` | Project docs, checklist, backlog and use-case specs |

## Commands
| Task       | Command |
|------------|---------|
| Install    | `pnpm install` |
| Dev        | `pnpm dev` |
| Lint       | `pnpm lint` (ESLint + Prettier check; fix formatting with `pnpm format`) |
| Typecheck  | `pnpm typecheck` |
| Test       | `pnpm test` |
| E2E        | `pnpm test:e2e` (builds and starts the app; first run: `pnpm exec playwright install chromium`) |
| Build      | `pnpm build` |
| Lighthouse | `pnpm lighthouse` (builds, then runs `@lhci/cli` via `pnpm dlx`) |
| Audit      | `pnpm audit --audit-level high` |

## Quality Gates (CI, required to merge)
| Gate             | Threshold |
|------------------|-----------|
| Lint, typecheck  | no errors |
| Unit + E2E tests | all pass |
| Accessibility    | WCAG 2.2 AA; axe in E2E: 0 serious or critical violations |
| Security headers | E2E test asserts the headers from `CHECKLIST.md` (CSP with nonce in `src/proxy.ts`, other headers in `next.config.ts`) |
| Dependencies     | audit: no high or critical; Dependabot enabled |
| Lighthouse       | Performance ≥ 90 · Accessibility ≥ 95 · Best Practices ≥ 95 · SEO ≥ 95 |
| Core Web Vitals  | LCP ≤ 2.5 s · CLS ≤ 0.1 · TBT ≤ 200 ms |

Lighthouse runs in CI against a local production build: mobile profile, median of 3 runs. Pages: home, contact, and one page per template. Config: `lighthouserc.json`.

### Exceptions
| Page | Gate | Threshold | Reason |
|------|------|-----------|--------|
| 404 pages | Lighthouse | not run | Lighthouse aborts on a document with status 404 (`ERRORED_DOCUMENT_REQUEST`), so it cannot audit them. axe in the E2E suite covers their accessibility. UC-002; approved by the user, 2026-10-23. |
| all | Dependencies | ignore `GHSA-vfj7-8cjw-p6xm` (`braces`) | Dev-only, via `eslint-config-next`; no patched version exists. Remove from `package.json` → `pnpm.auditConfig` once one ships. |

## Privacy (Swiss revDSG)
| Processor | Purpose | Data | Location |
|-----------|---------|------|----------|
| Vercel    | Hosting | IP, request logs | Functions in `fra1` (Frankfurt); CDN global |
| Supabase  | Member accounts (auth) | Email, login metadata | EU project region (Frankfurt), set when the accounts UC is built |
| Stripe    | Payments for memberships and class passes | Name, email, payment data (card data only at Stripe) | EU (Stripe Payments Europe, Ireland); transfers to the US |
| Resend    | Transactional and contact email | Email address, message content | EU region (Ireland), set when the contact UC is built |

## Deployment
- Preview: every pull request (Vercel Git integration)
- Production: squash-merge to protected `main` after CI passes (0 approvals required, admins included)
- Dependencies: Dependabot weekly; patch and minor updates auto-merge when CI is green
- Env vars: managed in Vercel; listed (names only) in `.env.example`
- Monitoring: _open decision; choose the uptime monitor and error tracking before go-live (phase 5)_
