# Task 1.0: Tab shell, navigation migration & stub destinations

## Overview

Establish the app's first bottom tab bar using Expo Router v56 headless tabs
(`expo-router/ui`), migrate Home into a new `(tabs)` route group, and create every
stub destination so no Home action dead-ends. This task delivers the navigation
skeleton with placeholder content before the real Home visuals are built.

<skills>
### Skills compliance

- **execute-task** — implement following project rules and the pinned Expo v56 docs.
- **design-md** — apply DESIGN.md for the 64 px tab bar (hairline top border,
  idle→active icon swap, brand recolor, dynamic column count).
</skills>

<requirements>
- Headless `(tabs)/_layout` host with `TabSlot`, custom `BottomTabBar`, and a hidden
  `TabList` declaring only `home` + `settings` (FR 5.1).
- Account-gated tabs ("Listas", "Resumo") are NOT declared — hidden, not disabled
  (FR 5.2).
- Active tab visually emphasized (filled icon + brand color), inactive muted
  (FR 5.3), per DESIGN.md.
- Migrate `app/home.tsx` → `app/(tabs)/home.tsx` (placeholder content for now) and
  add `app/(tabs)/settings.tsx` stub.
- Update `app/index.tsx` decider and the onboarding exit to redirect/replace to
  `/(tabs)/home`.
- Extend the root `_layout` splash/hydration gate to also await
  `activeList.hasHydrated` (the flag is wired in Task 2.0; gate must render `null`
  until ready).
- Shared `stub-screen` presentational component + per-destination routes
  (`help`, `notifications`, `limit`, `shop`) on the parent stack so they cover the
  bar (FR 5.4, 2.3, 3.4). Each stub has a working back affordance — no dead end.
- Drive testable elements by `testID`.
</requirements>

## Subtasks

- [x] 1.1 Create `src/lib/stub-screen.tsx` shared presentational stub (title + back).
- [x] 1.2 Create the stub routes `app/help.tsx`, `app/notifications.tsx`,
  `app/limit.tsx`, `app/shop.tsx` on the parent stack.
- [x] 1.3 Create `src/components/ui/bottom-tab-bar.tsx` consuming `TabTrigger`
  `isFocused`; columns sized to visible tab count.
- [x] 1.4 Create `app/(tabs)/_layout.tsx` headless `Tabs` host (`TabSlot`,
  `BottomTabBar`, hidden `TabList` with `home` + `settings`).
- [x] 1.5 Migrate Home into `app/(tabs)/home.tsx` (placeholder) and add
  `app/(tabs)/settings.tsx` stub; remove `app/home.tsx`.
- [x] 1.6 Update `app/_layout.tsx` (register `(tabs)` + stubs, extend hydration gate),
  `app/index.tsx` (redirect to `/(tabs)/home`), and onboarding exit
  (`router.replace('/(tabs)/home')`).
- [x] 1.7 Update existing `home-screen.test.tsx` import paths for the new route.
- [x] 1.8 Unit tests for the tab bar and stub screen.

## Implementation details

See `techspec.md` — "System architecture › Component overview" (routing/layout list),
"Technical considerations › Key decisions" (headless tabs over default `<Tabs>`;
`(tabs)` group; per-destination stubs) and "Development sequencing › Build order"
steps 2–3. Follow the pinned Expo v56 docs per `CLAUDE.md`.

## Success criteria

- App launches past onboarding and lands on `/(tabs)/home` with the tab bar visible.
- Tab bar shows only "Início" + "Ajustes"; gated tabs never render (FR 5.2).
- Active tab is emphasized per DESIGN.md (FR 5.3).
- Every header/CTA/card target routes to a stub that renders and returns via back —
  no dead ends or errors (FR 5.4).
- `pnpm typecheck` and the full suite pass after the route migration.

## Task tests

- [x] Unit tests — `bottom-tab-bar` renders exactly the visible tabs, never the gated
  ones (FR 5.2), active trigger gets filled icon + brand color (FR 5.3);
  `stub-screen` renders its title and a working back affordance.
- [ ] Integration tests — covered in Task 3.0 (tab press switches `TabSlot`).
- [ ] E2E tests — covered in Task 3.0.

## Relevant files

- `src/app/(tabs)/_layout.tsx`, `src/app/(tabs)/home.tsx`,
  `src/app/(tabs)/settings.tsx` (new)
- `src/app/{help,notifications,limit,shop}.tsx` (new stubs)
- `src/app/_layout.tsx`, `src/app/index.tsx`, `src/app/onboarding.tsx` (modify)
- `src/app/home.tsx` (remove/migrate)
- `src/components/ui/bottom-tab-bar.tsx`, `src/lib/stub-screen.tsx` (new)
- `__tests__/home-screen.test.tsx` (update import paths),
  `__tests__/bottom-tab-bar.test.tsx`, `__tests__/stub-screen.test.tsx` (new)
