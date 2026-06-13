# Task 3.0: Tests (integration & E2E)

## Overview

Prove the feature works end to end across the store, screen, routing gate, and
on-device persistence. This task consolidates the cross-cutting integration tests
and the Detox E2E specs that validate the show-once contract from a real device
perspective. It runs last because it exercises the fully assembled output of
Tasks 1.0 and 2.0.

<skills>
### Skills compliance

- **execute-task** — implement tests following rules + pinned Expo v56 docs.
- **execute-qa** — validate against PRD/spec, WCAG 2.2 checks, visual fidelity to DESIGN.md (E2E is **Detox** here, not playwright-cli — no web target).
- **execute-review** — full test suite must pass.
- **create-github-commit** / **create-github-pull-request** — Conventional Commit + PR targeting `dev`.
</skills>

<requirements>
- **Integration:** with `jest-expo` + `@testing-library/react-native` and mocked `AsyncStorage`, render the real onboarding screen + store and walk steps 1→2→3 then `Vamos lá!`; assert `hasSeenOnboarding` is persisted and a fresh render of the decider now routes to `/home`. Repeat asserting the **Skip from step 1** path produces the same persistence effect (FR 3.2, 5.x).
- **E2E (Detox):** add `e2e/onboarding.test.js` driving elements by `testID`:
  - Fresh install (`device.launchApp({ delete: true })`): onboarding visible on step 1 → tap `Próximo` twice → tap `Vamos lá!` → `/home` placeholder visible.
  - Relaunch (`newInstance: true`, no delete): onboarding bypassed, `/home` shown directly (FR 5.2).
- Mock only on-device boundaries (`AsyncStorage`, `expo-splash-screen`, `expo-font`); render real components otherwise.
- Detox requires a native prebuild (`pnpm e2e:prebuild`) and a simulator.
- Add the `testID`s required to drive E2E if they are missing from the components built in Task 2.0.
</requirements>

## Subtasks

- [ ] 3.1 Write the integration test: full 1→2→3→`Vamos lá!` walk persists the flag and re-renders decider → `/home`.
- [ ] 3.2 Extend the integration test with the Skip-from-step-1 path asserting identical persistence + routing.
- [ ] 3.3 Ensure required `testID`s exist on onboarding controls / screens for E2E targeting.
- [ ] 3.4 Write `e2e/onboarding.test.js`: fresh-install happy path to `/home`.
- [ ] 3.5 Add the relaunch case asserting onboarding is bypassed (FR 5.2); run via `pnpm e2e:prebuild` + simulator.

## Implementation details

See `techspec.md`:
- "Testing approach → Integration tests" (full screen+store+AsyncStorage walk; Skip parity).
- "Testing approach → E2E tests" (Detox specs, `delete`/`newInstance`, `testID` driving).
- "Development sequencing → Build order" step 6 and "Technical dependencies" (Detox prebuild + simulator).
- PRD FR 3.2, 5.1–5.3, 6.1 for the persistence/show-once contract under test.

## Success criteria

- Integration test proves both Finish (1→2→3) and Skip-from-step-1 persist `hasSeenOnboarding` and flip the decider to `/home`.
- Detox fresh-install spec reaches the `/home` placeholder; relaunch spec bypasses onboarding entirely.
- Full test suite (unit from Tasks 1–2 + integration + E2E) passes; `pnpm typecheck` green.

## Task tests

- [ ] Unit tests — covered in Tasks 1.0 and 2.0.
- [ ] Integration tests — onboarding screen + store + mocked AsyncStorage: Finish walk and Skip-from-step-1 both persist and route to `/home`.
- [ ] E2E tests — Detox `e2e/onboarding.test.js`: fresh-install happy path to `/home`; relaunch bypass.

## Relevant files

- `__tests__/*` (new — integration test for screen+store+decider)
- `e2e/onboarding.test.js` (new — Detox specs)
- `src/features/onboarding/components/*`, `src/app/onboarding.tsx`, `src/app/index.tsx`, `src/app/home.tsx` (add/verify `testID`s)
- References: `tasks/prd-onboarding/prd.md`, `tasks/prd-onboarding/techspec.md`
