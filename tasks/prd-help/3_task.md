# Task 3.0: Integration & E2E tests

## Overview

Validate the full screen behavior end-to-end. Depends on Tasks 1.0 and 2.0.
Delivers the component-integration spec (HelpScreen + `useHelpAccordion` +
`FaqSection` together with the real static data) and the Detox E2E flow that
exercises the screen from the Home header through to closing it.

<skills>
### Skills compliance

- **execute-task** — implement following the loaded rules/skills.
- **.claude/rules/react-native-standards.md** — `@testing-library/react-native`
  for the integration test; mock only genuine externals (`expo-router`,
  `react-native`'s `Linking`).
- **execute-qa** — for final validation of the implemented behavior against the
  PRD acceptance criteria, if a QA pass is run.
</skills>

<requirements>
- **Integration (`help-screen.test.tsx`):** three section headers present; Listas
  content visible on mount (PRD 2.5); tapping Limites hides Listas content and
  shows Limites content (single-open, PRD 2.3). Uses the real `HELP_SECTIONS`;
  mocks only `expo-router` and `Linking`.
- **E2E (`e2e/help.test.js`, Detox):** from Home, tap the `header-help` control;
  assert the Help screen and default-open Listas content are visible; tap the
  Limites header and assert its content appears while Listas collapses; tap the
  close (X) and assert return to Home. The support `mailto:` action is NOT asserted
  in E2E (it leaves the app — covered by the unit test in Task 2.0).
</requirements>

## Subtasks

- [x] 3.1 Write `__tests__/help-screen.test.tsx` integration spec.
- [x] 3.2 Write `e2e/help.test.js` Detox flow (mirroring `e2e/home.test.js`).
- [x] 3.3 Run the full unit suite and the E2E flow; confirm all green.

## Implementation details

See `techspec.md` → "Testing approach → Unit tests (`help-screen.test.tsx`),
Integration tests, and E2E tests". The project uses **Detox** (not Playwright);
follow the existing `e2e/home.test.js` for setup and the `header-help` testID
wired from the Home header.

## Success criteria

- `help-screen.test.tsx` passes: three headers, Listas open on mount, switching to
  Limites collapses Listas and reveals Limites content.
- `e2e/help.test.js` passes the open → default Listas → switch to Limites → close
  → back-to-Home flow.
- Entire unit test suite is green; no regressions in existing specs.

## Task tests

- [x] Unit tests — n/a (delivered in Tasks 1.0 and 2.0).
- [x] Integration tests — `__tests__/help-screen.test.tsx`.
- [x] E2E tests — `e2e/help.test.js` (Detox).

## Relevant files

- `__tests__/help-screen.test.tsx` (new)
- `e2e/help.test.js` (new)
- `e2e/home.test.js` (pattern reference)
- `src/app/help.tsx`, `src/features/help/*` (under test)
