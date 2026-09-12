# Feature: Notifications

**Route:** `/notifications` · **Entry:** `src/app/notifications.tsx`

## What it means

An in-app inbox so budget-relevant events find the user instead of the user
having to go inspect their list. Reached from the bell in the Home header.

**These are not OS push notifications.** There is no backend and no push
infrastructure: the app generates them locally, while it is running, and stores
them on the device.

## How it works

- `notification.ts` — `AppNotification` plus `NOTIFICATION_TYPE_CATALOG`
  (icon + tint per type). Four types exist: `budgetAlert`, `priceChange`,
  `goalAchieved`, `collaboration`. **Only `budgetAlert` is ever emitted today**
  — the other three belong to features that are not built (price tracking,
  goals, sharing). Keep them; they are the catalog for rendering seeded or
  future events, not dead code to delete casually.
- `budget-alerts.ts` — the only producer. `startBudgetAlertTracking()` is called
  once from `src/app/_layout.tsx` after hydration and subscribes to the active
  list store. On every change it compares the list's `getBudgetStatus` against a
  per-list **latch** (`budgetThresholdLatch[listId]`) and emits **only on an
  upward transition** (`onTrack → warning → overBudget`), so the user is not
  spammed when they toggle an item back and forth across the 85% line.
- `notifications-store.ts` — newest first, capped at
  `MAX_STORED_NOTIFICATIONS = 50`; holds the latch too, so both survive
  restarts. Persisted under `checkit:notifications`.
- `use-unread-notifications.ts` — drives the Home bell badge dot, which must
  appear **only** when something is genuinely unread.
- `relative-time.ts` — pt-BR relative stamps: `agora`, `12min`, `3h`,
  `há 2 dias`, `há 3 sem`.

## Invariants

- The latch is keyed by list id and is written on **every** evaluation,
  including downward transitions — otherwise re-crossing a threshold would
  re-fire.
- `budgetAlertsEnabled` (settings) is checked **after** the latch is updated, so
  turning alerts off does not leave a stale threshold that fires later.
- Lists with `limitInCents <= 0` are skipped entirely.
- Tapping a card marks it read; "Marcar todas" marks everything read.

## Tests

`__tests__/notifications-screen.test.tsx`, `notifications-store.test.ts`,
`budget-alerts.test.ts`, `notifications-flow.test.ts`,
`notification-card.test.tsx`, `notifications-empty-state.test.tsx`,
`notifications-header.test.tsx`, `relative-time.test.ts`,
`e2e/notifications.test.js`.
