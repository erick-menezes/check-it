# Task 6.0: E2E suites and polish

## Overview

Close the feature with the Detox end-to-end suites covering the full user loop (create → add → check → edit → sort/search → summary → delete, plus restart persistence and the receipt sheet UI flow), then polish motion timings and run the accessibility audit against the PRD's requirements.

<skills>
### Skills compliance

- `execute-task` — implementation workflow for this task.
- `execute-qa` — E2E validation, accessibility (WCAG 2.2) and visual review with final verdict.
- `execute-review` — code review after implementation.
- `create-github-commit` — Conventional Commits for the resulting changes.
</skills>

<requirements>
- New `e2e/shop.test.js` and `e2e/summary.test.js` using the existing `skipOnboarding`/`openLimit` helpers and the `e2e:prebuild` workflow.
- Shop suite: create list → land on shop screen; add via input and via suggestion; check item and assert chip/status text; edit price/quantity through the sheet; sort and search; mark all; swipe-to-delete; delete list → Home.
- Summary suite: preview card values → "Ver completo" → Summary screen assertions (total tile, banner, stacked bar legend, top items) → back.
- Receipt flow e2e is UI-only: sheet opens from empty state and action row, permission messaging, backdrop dismissal (capture/OCR/parse correctness stays in Jest, per agreed decision).
- Restart persistence: relaunch via `device.launchApp({ newInstance: true })` without `delete` and assert items survive.
- Accessibility audit per the PRD: labels/roles/states on all interactive elements, ≥ 44 px targets, non-color cues for checked and over-budget states, chip summary announcement, legend-based stacked bar, non-gesture delete equivalent, pt-BR permission/scan copy.
- Motion polish: 320 ms slide-from-right entry, 280 ms sheet translate, swipe underlay behavior per `DESIGN.md`.
</requirements>

## Subtasks

- [x] 6.1 Write `e2e/shop.test.js` (full list loop + receipt sheet UI flow + restart persistence).
- [x] 6.2 Write `e2e/summary.test.js` (preview → summary assertions → back).
- [x] 6.3 Add testIDs/accessibility props wherever the suites require them.
- [x] 6.4 Run the accessibility audit and fix gaps (labels, roles, states, hit areas, non-color cues).
- [x] 6.5 Polish motion timings against `DESIGN.md`; verify camera-in-Modal behavior on the Detox Android build.
- [x] 6.6 Run the complete test suite (Jest + Detox) and ensure everything passes.

## Implementation details

See techspec.md — "E2E tests", "Known risks" (camera in Modal on Android, swipeable/pressable conflicts) and the PRD "User experience > Accessibility" section.

## Success criteria

- Both Detox suites pass on the existing e2e workflow; no flaky swipe/tap conflicts.
- Items, totals, title and sort survive an app relaunch.
- Accessibility requirements from the PRD verified item by item.
- Full Jest suite green alongside the new e2e specs.

## Task tests

- [x] Unit tests — gap-fill only (any fixes from the audit get coverage)
- [x] Integration tests — already covered in tasks 1.0–5.0
- [x] E2E tests (`e2e/shop.test.js`, `e2e/summary.test.js`)

## Relevant files

- `e2e/shop.test.js`, `e2e/summary.test.js` (new)
- `e2e/` existing helpers and config (`skipOnboarding`, `openLimit`, `e2e:prebuild`)
- `src/features/shop/**`, `src/features/summary/**`, `src/app/shop.tsx`, `src/app/summary.tsx` (testIDs/accessibility fixes)
- `DESIGN.md` (motion specs)
