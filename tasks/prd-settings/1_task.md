# Task 1.0: Settings foundation: preference store, Toggle component, and static content

## Overview

Build every piece of the Settings feature that has no screen-level dependency: the persisted budget-alert preference store (wired into the root hydration gate), the reusable animated `Toggle` UI component, and the typed static content describing the SOBRE rows. After this task, all state, the switch control, and the row data contract exist and are fully unit-tested, unblocking the presentational components in Task 2.0.

<skills>
### Skills compliance

- `execute-task` — implement this task following the loaded project rules and skills, using Context7 MCP for Expo v56 / Zustand / Reanimated documentation.
- `execute-review` — review the produced changes before marking the task complete.
</skills>

<requirements>
- The preference defaults to ON for a user who has never changed it (PRD 2.3).
- The preference persists locally on-device and is restored on relaunch, with no account or network (PRD 2.5).
- The preference is readable by other features via the store (PRD 2.6).
- The root layout readiness gate includes the settings store's `hasHydrated` so the toggle never flashes the wrong state on launch (techspec Key decisions).
- The Toggle matches DESIGN.md exactly: 38×22 px pill, 11 px radius, Herbal Leaf Green on / Fog Gray off, white knob with soft shadow, ~200 ms slide (PRD UX spec).
- The Toggle exposes `accessibilityRole: "switch"` and `accessibilityState: { checked }` with a PT-BR label, touch target ≥ 44 px (PRD accessibility).
- SOBRE rows are a typed `readonly` constant with verbatim PT-BR labels in order: Central de ajuda → Termos e privacidade → Versão (PRD 3.1).
- All identifiers in English; constants for magic numbers (toggle geometry, animation duration); no enums (union `type AboutRowKind`); files within length standards.
</requirements>

## Subtasks

- [x] 1.1 Create `src/features/settings/settings-store.ts` (Zustand + `persist` + AsyncStorage, key `checkit:settings`, `version: 0`, `partialize` persisting only `budgetAlertsEnabled`), mirroring `onboarding-store.ts` / `active-list-store.ts`.
- [x] 1.2 Wire `useSettingsStore` `hasHydrated` into the `isReady` gate in `src/app/_layout.tsx`.
- [x] 1.3 Create `src/components/ui/toggle.tsx` — controlled Reanimated pill per `ToggleProps` in techspec.md, following the `step-indicator.tsx` Reanimated pattern.
- [x] 1.4 Create `src/features/settings/settings-content.ts` — `SETTINGS_ABOUT_ROWS: readonly AboutRow[]` with icons, tints, routes, and `AboutRowKind` discriminator, mirroring `onboarding-steps.ts`.
- [x] 1.5 Unit tests: `__tests__/settings-store.test.ts`, `__tests__/toggle.test.tsx`, `__tests__/settings-content.test.ts`.

## Implementation details

See techspec.md — "Main interfaces" (`SettingsState`, `ToggleProps`), "Data models" (persisted shape, SOBRE rows constant), "Key decisions" (custom Reanimated Toggle, hydration gate, AsyncStorage namespace), and "Known risks" (Reanimated worklet config, hydration race, key collision).

## Success criteria

- Store defaults to `budgetAlertsEnabled: true`; `setBudgetAlertsEnabled(false)` updates state; the value survives a simulated rehydrate.
- Root layout does not render the app until the settings store is hydrated.
- Toggle renders both states, animates on press, and reports correct accessibility role/state.
- `SETTINGS_ABOUT_ROWS` carries exactly three rows in the specified order with verbatim PT-BR copy and correct routes (`/help`, `/terms`).
- TypeScript strict passes; all new and existing tests pass.

## Task tests

- [x] Unit tests: `settings-store.test.ts` (default ON, update, persistence/rehydrate with mocked AsyncStorage); `toggle.test.tsx` (switch role, checked state, `onValueChange` with negated value, accessibility label, ≥ 44 px touch target); `settings-content.test.ts` (three rows, order, verbatim labels, routes).
- [ ] Integration tests: not applicable in this task (covered in Task 3.0).
- [ ] E2E tests: not applicable in this task (covered in Task 3.0).

## Relevant files

- `src/features/settings/settings-store.ts` (new)
- `src/features/settings/settings-content.ts` (new)
- `src/components/ui/toggle.tsx` (new)
- `src/app/_layout.tsx` (modified — hydration gate)
- `src/features/onboarding/onboarding-store.ts`, `src/features/home/active-list-store.ts` (persisted-store pattern)
- `src/features/onboarding/onboarding-steps.ts` (static typed data pattern)
- `src/features/onboarding/components/step-indicator.tsx` (Reanimated pattern)
- `tailwind.config.js`, `DESIGN.md` (colors, geometry)
- `__tests__/settings-store.test.ts`, `__tests__/toggle.test.tsx`, `__tests__/settings-content.test.ts` (new)
