# Task 3.0: Settings screen composition, tab integration, and E2E

## Overview

Replace the "Em breve" placeholder in `src/app/(tabs)/settings.tsx` with the real screen composed from the Task 1.0/2.0 building blocks: minimal header, NOTIFICAÇÕES section, and SOBRE section inside a `ScrollView` that clears the 64 px tab bar. Validate the whole feature with the integration spec and the Detox E2E flow, closing out every PRD success criterion.

<skills>
### Skills compliance

- `execute-task` — implement this task following the loaded project rules and skills, using Context7 MCP for Expo Router / Detox documentation.
- `execute-review` — review the produced changes before marking the task complete.
- `execute-qa` — validate the implemented screen against the PRD/techspec acceptance criteria.
</skills>

<requirements>
- The Ajustes tab renders the real screen with NOTIFICAÇÕES then SOBRE; the placeholder copy "Em breve" is never present (PRD objectives).
- The screen renders within the existing bottom-tab navigation with the Ajustes tab active, with no tab-bar code change (PRD 4.1, techspec Integration points).
- Scrollable content reserves bottom padding so the last row clears the 64 px tab bar (PRD 4.2).
- "Central de ajuda" navigates via `router.push('/help')`; "Termos e privacidade" via `router.push('/terms')` (PRD 3.3–3.4).
- Returning from Help preserves the toggle state (PRD main flow).
- The screen renders identically for every user — no authentication branches (PRD high-level constraints).
- `ScrollView` composition (justified `FlatList` deviation per techspec Key decisions); screen file ≤ 300 lines, functions ≤ 50 lines.
</requirements>

## Subtasks

- [x] 3.1 Compose `src/app/(tabs)/settings.tsx`: `SettingsHeader` + `SettingsSection` ("NOTIFICAÇÕES" → `NotificationRow`) + `SettingsSection` ("SOBRE" → rows mapped from `SETTINGS_ABOUT_ROWS` to `NavigationRow` / `VersionRow`).
- [x] 3.2 Apply bottom padding clearing the 64 px tab bar and 22 px page gutters per DESIGN.md.
- [x] 3.3 Integration test `__tests__/settings-screen.test.tsx` per techspec "Integration tests".
- [x] 3.4 Detox E2E `e2e/settings.test.js` per techspec "E2E tests".
- [x] 3.5 Run the full test suite and typecheck; confirm all PRD success criteria.

## Implementation details

See techspec.md — "Component overview" (`settings.tsx` route entry, data flow), "Integration points" (Expo Router tab wiring, no tab-bar change), "Testing approach" (integration and E2E scope), and "Development sequencing" steps 6–7.

## Success criteria

- Landing on the Ajustes tab shows both sections, never the placeholder.
- Toggling "Alertas de orçamento" updates immediately and is still in effect after relaunch (store-level persistence proven in Task 1.0 tests; E2E asserts in-session state).
- "Central de ajuda" reaches the existing Help screen; "Termos e privacidade" reaches the `/terms` placeholder; "Versão" shows the app version inline.
- Full Jest suite and TypeScript strict pass; Detox flow passes.

## Task tests

- [ ] Unit tests: covered by Tasks 1.0 and 2.0 (no new isolated units in this task).
- [ ] Integration tests: `settings-screen.test.tsx` — both eyebrows render; toggling updates accessibility state and store; "Central de ajuda" calls `router.push('/help')` and "Termos e privacidade" calls `router.push('/terms')` (router mocked); "Em breve" is never present.
- [ ] E2E tests: `e2e/settings.test.js` — from Home tap `tab-settings`; NOTIFICAÇÕES/SOBRE visible and placeholder gone; toggle flips its accessibility state; Help navigation round-trip preserves toggle state; Terms placeholder reachable.

## Relevant files

- `src/app/(tabs)/settings.tsx` (modified — placeholder replaced)
- `src/features/settings/components/*` , `settings-store.ts`, `settings-content.ts`, `src/components/ui/toggle.tsx` (Task 1.0/2.0 outputs)
- `src/app/(tabs)/_layout.tsx`, `src/components/ui/bottom-tab-bar.tsx` (existing tab wiring — no change expected)
- `src/app/help.tsx`, `src/app/terms.tsx` (navigation targets)
- `DESIGN.md` (spacing, tab-bar clearance)
- `__tests__/settings-screen.test.tsx` (new), `e2e/settings.test.js` (new), `e2e/home.test.js` (Detox pattern)
