# Task 2.0: Settings UI components and Terms placeholder route

## Overview

Build all presentational pieces of the Settings screen on top of the Task 1.0 foundation: the shared tinted icon tile, the store-connected notification row, the navigation and version rows, the section and header wrappers, and the `/terms` placeholder route so "Termos e privacidade" is never a dead end. After this task every visual building block exists and is unit-tested, leaving only screen composition for Task 3.0.

<skills>
### Skills compliance

- `execute-task` — implement this task following the loaded project rules and skills, using Context7 MCP for Expo v56 / Expo Router documentation.
- `execute-review` — review the produced changes before marking the task complete.
</skills>

<requirements>
- Notification row shows the bell tile, "Alertas de orçamento" title, "Quando ultrapassar 80% do limite" caption, and a trailing Toggle that reads/writes `useSettingsStore` (PRD 2.2, 2.4).
- Navigation rows show a tinted icon tile, label, and trailing chevron; the full row is the touch target with `accessibilityRole: "button"` and a PT-BR `accessibilityLabel` (PRD 3.2, accessibility).
- Version row shows a bookmark/tag tile, "Versão" label, and the trailing version from `Constants.expoConfig?.version` with a `??` fallback; it is not pressable — no chevron, no button role (PRD 3.5).
- Header is the minimal variant: Pure Snow background, hairline bottom border, "Ajustes" in H1 scale, safe-area top inset via `useSafeAreaInsets()` (PRD §1).
- Sections render the eyebrow label (Eyebrow style per DESIGN.md) above a soft surface card with hairline dividers between rows (PRD UX spec).
- Icon tile is ~38–40 px with an 18% color-wash background and pure-color glyph, shared by every row (DESIGN §7).
- `/terms` is a new route built with the existing `StubScreen`, matching `notifications.tsx` / `limit.tsx` (PRD 3.4).
- Explicit props (no spreading), components ≤ 50 lines, NativeWind `className` + `cn`, all rows ≥ 44 px tall.
</requirements>

## Subtasks

- [x] 2.1 Create `src/features/settings/components/setting-icon-tile.tsx`.
- [x] 2.2 Create `src/features/settings/components/notification-row.tsx` (bell tile + title + caption + `Toggle`, connected to `useSettingsStore`).
- [x] 2.3 Create `src/features/settings/components/navigation-row.tsx` per `NavigationRowProps` in techspec.md.
- [x] 2.4 Create `src/features/settings/components/version-row.tsx` (version via `expo-constants`).
- [x] 2.5 Create `src/features/settings/components/settings-section.tsx` (eyebrow + card + dividers, reusing `section-label.tsx`) and `settings-header.tsx`.
- [x] 2.6 Create `src/app/terms.tsx` using `StubScreen`.
- [x] 2.7 Unit tests: `__tests__/notification-row.test.tsx`, `__tests__/navigation-row.test.tsx`, `__tests__/version-row.test.tsx`.

## Implementation details

See techspec.md — "Component overview" (one entry per component), "Main interfaces" (`NavigationRowProps`), "Data models" (app version source), "Integration points" (`expo-constants`, safe-area), and "Key decisions" (shared tinted icon tile, `/terms` via `StubScreen`).

## Success criteria

- Each row renders pixel-faithfully to DESIGN.md (tile, typography, chevron/control alignment) and meets the ≥ 44 px touch target.
- Toggling in `NotificationRow` immediately reflects and persists the new state through the store.
- Navigating to `/terms` renders the placeholder screen with no dead end.
- Version row displays the `app.json` version and exposes no pressable affordance.
- TypeScript strict passes; all new and existing tests pass.

## Task tests

- [x] Unit tests: `notification-row.test.tsx` (title, caption, bell tile; toggle reflects store value; toggling writes to the store); `navigation-row.test.tsx` (label + chevron, full-row press fires `onPress`, PT-BR label, button role); `version-row.test.tsx` ("Versão" + version value, not pressable, no chevron/button role).
- [ ] Integration tests: not applicable in this task (covered in Task 3.0).
- [ ] E2E tests: not applicable in this task (covered in Task 3.0).

## Relevant files

- `src/features/settings/components/setting-icon-tile.tsx` (new)
- `src/features/settings/components/notification-row.tsx` (new)
- `src/features/settings/components/navigation-row.tsx` (new)
- `src/features/settings/components/version-row.tsx` (new)
- `src/features/settings/components/settings-section.tsx` (new)
- `src/features/settings/components/settings-header.tsx` (new)
- `src/app/terms.tsx` (new)
- `src/features/settings/settings-store.ts`, `settings-content.ts`, `src/components/ui/toggle.tsx` (Task 1.0 outputs)
- `src/components/ui/section-label.tsx`, `src/lib/stub-screen.tsx`, `src/lib/utils.ts`, `src/lib/fonts.ts`
- `src/features/help/components/help-header.tsx`, `src/features/home/components/home-header.tsx` (header/safe-area pattern)
- `DESIGN.md`, `tailwind.config.js`, `app.json`
- `__tests__/notification-row.test.tsx`, `__tests__/navigation-row.test.tsx`, `__tests__/version-row.test.tsx` (new)
