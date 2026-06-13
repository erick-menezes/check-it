# Task 3.0: Integration & Detox E2E tests

## Overview

Validate the assembled Home end-to-end: integration tests over the `(tabs)` layout +
store + mocked AsyncStorage, and a Detox E2E flow covering the anonymous Home journey
through the tab bar, CTA, card, and header stubs.

<skills>
### Skills compliance

- **execute-task** — implement following project rules and the pinned Expo v56 docs.
- **design-md** — confirm the rendered flows match DESIGN.md fidelity for the tab
  bar, hero, card, and empty state.
</skills>

<requirements>
- Integration tests over the real `(tabs)` layout + `active-list-store` + mocked
  AsyncStorage (mock only on-device boundaries per `jest.setup.js`).
- Pre-populated `activeList` → Home shows the card; "Abrir"/card calls `router.push`
  to the shop stub; CTA pushes the limit stub (FR 2.2/2.3, 3.4).
- Empty store → empty state, CTA still routes (FR 4.x).
- Tab press switches `TabSlot` between Home and Settings (FR 5.1).
- Detox E2E `e2e/home.test.js`, driving elements by `testID`:
  - Fresh launch past onboarding lands on Home; empty state visible; tab bar shows
    only "Início" + "Ajustes" (FR 4.2, 5.2).
  - Tap "Criar lista" → stub → back → Home (no dead end, FR 2.3/5.4).
  - Tap "Ajustes" → Settings stub; tap "Início" → Home (FR 5.1).
  - Header help/notifications open their stubs and return.
</requirements>

## Subtasks

- [x] 3.1 Write integration tests for the `(tabs)` layout + store + AsyncStorage
  (card vs. empty, CTA/card/Abrir routing, tab switching).
- [x] 3.2 Write `e2e/home.test.js` Detox flow.
- [x] 3.3 Run the full suite + `pnpm typecheck`; ensure native prebuild for Detox.

## Implementation details

See `techspec.md` — "Testing approach › Integration tests / E2E tests" and
"Development sequencing › Technical dependencies" (Detox needs `pnpm e2e:prebuild`
and a simulator; no web target, so playwright-cli does not apply).

## Success criteria

- Integration tests pass for both store states and all routing/tab-switch paths.
- Detox E2E flow passes on a simulator with no dead ends.
- Full test suite and `pnpm typecheck` pass.

## Task tests

- [x] Unit tests — n/a (covered in Tasks 1.0 and 2.0).
- [x] Integration tests — `(tabs)` layout + store + AsyncStorage as specified above.
- [x] E2E tests — `e2e/home.test.js` Detox flow.

## Relevant files

- `__tests__/*` (new integration tests)
- `e2e/home.test.js` (new)
- References: `tasks/prd-home/techspec.md`, `jest.setup.js`
