# Gladiators Fighting Gym — Website

Redesign of [gladiatorsfightinggym.ch](https://www.gladiatorsfightinggym.ch/): the gym, its classes, and online memberships and class passes with a member account.
Next.js on Vercel, in German (default), French and English.

## Setup
Prerequisites: Node.js ≥ 24, pnpm, GitHub CLI and Vercel CLI.

```sh
pnpm install
pnpm exec playwright install chromium
cp .env.example .env.local   # optional: without keys, email goes to a fake sender
pnpm dev                     # http://localhost:3000 → redirects to /de, /fr or /en
```

## Commands
| Task | Command |
|------|---------|
| Lint + format check | `pnpm lint` (fix with `pnpm format`) |
| Typecheck | `pnpm typecheck` |
| Unit tests | `pnpm test` |
| E2E + accessibility | `pnpm test:e2e` |
| Lighthouse | `pnpm lighthouse` |
| Dependency audit | `pnpm audit --audit-level high` |

All of them run in CI and must pass before a PR can merge.

## Workflow
This repo follows the AI-SDLC in `AGENTS.md`: one use case per branch and PR, specified in `docs/specs/`, with the backlog in `docs/TASKS.md`.
Stack, quality gates and processors are in `docs/PROJECT.md`; security, privacy and SEO checks in `docs/CHECKLIST.md`.
