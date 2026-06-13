# Task 2.0: Budget-alert generation engine and app wiring

## Overview

Implement the event-driven generation engine that watches the active list outside React, detects budget threshold crossings, and emits budget-alert notifications through the store; wire it into the root layout so it starts once after all stores hydrate. Delivers FR9–FR13.

<skills>
### Skills compliance

- `execute-task` — use to implement this task with the proper context loading and completion flow.
- `execute-review` — use to review the diff before marking the task complete.
- `create-github-commit` — use for the Conventional Commits commit once the task passes review.
</skills>

<requirements>
- `startBudgetAlertTracking()` subscribes to `useActiveListStore` via vanilla zustand `subscribe` and returns the unsubscribe function.
- Band order is `onTrack < warning < overBudget`, computed with the existing `getBudgetStatus` (unmodified).
- A notification fires only on an upward band transition, and only for the band arrived at (direct `onTrack → overBudget` fires only the exceeded alert).
- Every transition (up or down) updates the persisted latch; downward moves re-arm the threshold.
- Unknown list ids latch as `onTrack` before evaluation; `setActiveList(null)` leaves latch entries untouched.
- `budgetAlertsEnabled === false` (read via `useSettingsStore.getState()` at emission time) suppresses the notification but still updates the latch.
- PT-BR copy built with `formatBRL` exactly per techspec.md ("Notification copy" section).
- Defensive guards: no active list or `limitInCents <= 0` → no-op.
- `_layout.tsx`: notifications store `hasHydrated` joins the existing `isReady` gate; a `useEffect` starts tracking after readiness and cleans up on unmount.
</requirements>

## Subtasks

- [x] 2.1 Create `src/features/notifications/budget-alerts.ts` with `startBudgetAlertTracking` and the transition/latch logic (early returns, no nesting beyond two levels).
- [x] 2.2 Build the warning and exceeded copy with `formatBRL` and the computed percentage.
- [x] 2.3 Wire `src/app/_layout.tsx`: extend the hydration gate and start/cleanup the engine in an effect.
- [x] 2.4 Write `__tests__/budget-alerts.test.ts` covering the full transition matrix.

## Implementation details

See techspec.md sections "Data flow", "Threshold transition rules", "Notification copy", "Integration points", and the key decisions "Vanilla store subscription over a React hook" and "Persisted latch instead of scanning notifications". The engine imports only public store APIs; the active-list and settings stores are not modified.

## Success criteria

- FR9: crossing into ≥85% creates exactly one warning notification with spent/limit amounts in BRL.
- FR10: crossing >100% creates exactly one exceeded notification.
- FR11: re-renders, repeated `setActiveList` calls with the same band, and simulated restarts (rehydrated latch) never duplicate notifications.
- Re-arm semantics: `warning → onTrack → warning` fires the warning twice in total.
- FR13: emission goes exclusively through `addNotification`, leaving the store/screen agnostic of budget logic.
- Typecheck, lint, and the full existing test suite pass.

## Task tests

- [x] Unit tests: `__tests__/budget-alerts.test.ts` — onTrack→warning fires once; warning→warning fires nothing; warning→onTrack→warning re-fires; onTrack→overBudget fires only the exceeded alert; warning→overBudget fires the exceeded alert; `budgetAlertsEnabled: false` suppresses but latches; new list id starts fresh at onTrack; restart simulation with rehydrated latch does not duplicate; unsubscribe stops emission; `limitInCents <= 0` and null list are no-ops; copy asserted loosely via regex with BRL values.
- [x] Integration tests: root-layout wiring exercised indirectly via the flow test in task 4.0.
- [x] E2E tests: not applicable (no real writer screen exists yet; see techspec.md "Known risks").

## Relevant files

- `src/features/notifications/budget-alerts.ts` (new)
- `src/app/_layout.tsx` (modified)
- `__tests__/budget-alerts.test.ts` (new)
- `src/features/home/active-list.ts` — `getBudgetStatus`, `BudgetStatus` (read-only)
- `src/features/home/active-list-store.ts` — event source (read-only)
- `src/features/settings/settings-store.ts` — `budgetAlertsEnabled` gate (read-only)
- `src/lib/currency.ts` — `formatBRL`
- `src/features/notifications/notifications-store.ts` — emission target (from task 1.0)
