# Task 4.0: E2E coverage (Detox)

## Overview

Prove the full flow on device/simulator with Detox: entry from Home, cents-fill typing, presets, confirm into the shop stub, restart persistence, and the X-close path — plus fixing the stale stub assertions the new screen breaks in the existing Home suite.

<skills>
### Skills compliance

- `execute-task` — drives the implementation flow for this task
- `execute-qa` — validates the implementation against PRD/TechSpec acceptance criteria
- `execute-review` — code review after the task is finalized
- `create-github-commit` — Conventional Commits when committing the deliverable
</skills>

<requirements>
- New `e2e/limit.test.js` mirroring the existing Detox suites (skip-onboarding helper, `testID` queries)
- Cover: Home CTA → limit screen visible; typing via `typeText` on `limit-hidden-input` (holds focus from `autoFocus`); formatted hero assertion; preset tap (`limit-preset-500`); confirm → `stub-shop` visible; relaunch (`newInstance: true`, no `delete`) → Home shows the active-list card (FR 15); X-close leaves Home unchanged (FR 16)
- Update `e2e/home.test.js:34-35`: replace `stub-limit`/`stub-limit-back` assertions with the real screen (`limit-screen`) and exit via `limit-close`
- Required `testID`s exist on the screen from task 3.0 (`limit-screen`, `limit-close`, `limit-hidden-input`, `limit-preset-*`, CTA)
- Known risk watch: if `typeText` into the hidden input is flaky, drive the value via preset pills plus a reduced typing assertion (techspec "Known risks")
</requirements>

## Subtasks

- [x] 4.1 Write `e2e/limit.test.js` (happy path: type → confirm → shop stub)
- [x] 4.2 Add preset-path and X-close-path specs
- [x] 4.3 Add relaunch persistence spec (FR 15)
- [x] 4.4 Fix `e2e/home.test.js:34-35` stub assertions
- [x] 4.5 Run the full Detox suite and the full Jest suite

## Implementation details

See techspec.md → "E2E tests" and "Known risks" (Detox typing into a hidden input). The repo's established E2E harness is Detox; follow the conventions of the existing `e2e/*.test.js` suites.

## Success criteria

- All new `e2e/limit.test.js` specs pass locally
- `e2e/home.test.js` passes with the updated assertions; no other suite regresses
- Restart persistence verified: after relaunch the active list with the chosen limit is visible on Home (FR 15)
- Full Jest suite still green

## Task tests

- [x] Unit tests: not applicable (covered by tasks 1.0–3.0)
- [x] Integration tests: not applicable (covered by tasks 1.0 and 3.0)
- [x] E2E tests: `e2e/limit.test.js` (new), `e2e/home.test.js` (updated)

## Relevant files

- `e2e/limit.test.js` (new)
- `e2e/home.test.js` (modified — lines 34-35)
- `src/app/limit.tsx`, `src/features/limit/*` (testIDs, from tasks 2.0–3.0)
- Existing `e2e/` suites and helpers (referenced for conventions)
