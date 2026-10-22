# AGENTS.md — AI-SDLC Router

## Context (load in order)
1. `docs/TASKS.md` — backlog (read-only for agents; the user owns it)
2. `docs/PROJECT.md` — stack, risk tier, quality gates, commands, deployment
3. Current UC — the `docs/specs/UC-NNN-NAME.md` matching the current branch `uc-NNN-name`
4. Phase skill — `.claude/skills/ai-sdlc-<phase>-*/SKILL.md`
5. `docs/CHECKLIST.md` — in phases 2, 4 and 5

## Phases
The UC's `Status` field is the phase state. It travels with the PR, so `main` is never edited directly.

| # | Phase     | Skill                  | Sets Status   | Exit criteria                                    |
|---|-----------|------------------------|---------------|--------------------------------------------------|
| 0 | Bootstrap | `ai-sdlc-0-bootstrap`  | —             | Stack chosen, CI gates green, `main` protected   |
| 1 | Specify   | `ai-sdlc-1-specify`    | `specified`   | UC with testable acceptance criteria             |
| 2 | Design    | `ai-sdlc-2-design`     | `designed`    | Components, test plan, checklist items in UC     |
| 3 | Develop   | `ai-sdlc-3-develop`    | `in-progress` | All AC tests green, draft PR open                |
| 4 | Validate  | `ai-sdlc-4-validate`   | `done`        | All quality gates and checklist items pass       |
| 5 | Deploy    | `ai-sdlc-5-deploy`     | —             | Merged, live, smoke-checked, monitored           |

Default flow: 1 → 2 → 3 → 4 → 5. A failing phase goes back to 1 (spec gap) or 3 (bug).

## Fast Path (no UC)
For typo and content fixes, dependency bumps and config tweaks that do not change behaviour:
branch `chore/<topic>` → PR → CI green → merge. If behaviour changes, it is not a chore; write a UC.

## Core Rules
- **Commands**: use only those in `docs/PROJECT.md`; never assume a toolchain.
- **Tests first**: write a failing test for every behaviour change, then implement (RED → GREEN → REFACTOR). Pure visual/layout work is covered by E2E or acceptance checks instead.
- **Architecture**: follow `docs/PROJECT.md`. Dependencies point inward; business logic stays free of framework, UI and I/O code.
- **Vertical slices**: one UC at a time, finished end to end before the next one starts.
- **Git**: one branch and one PR per UC or chore. Never commit or push to `main`; never force-push; never skip hooks.
- **Security & privacy**: apply `docs/CHECKLIST.md` up to the project's risk tier. Never read or commit `.env` files with real values; use platform env vars.
- **Minimal artifacts**: edit existing files before creating new ones; no speculative features; no duplicates.
- **Language**: docs, code, commits and specs are in English. Site content uses the languages listed in `docs/PROJECT.md`.

## Definition of Done
All quality gates in `docs/PROJECT.md` pass in CI, every AC is ticked, and the applicable checklist items are ticked.

## Stop and ask when
- requirements are ambiguous or conflict
- a dependency, credential or decision is missing
- an action is destructive or outward-facing (deleting files, changing repo settings, merging, deploying)

Do not guess.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
