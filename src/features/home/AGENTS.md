# Feature: Home

**Route:** `/(tabs)/home` · **Entry:** `src/app/(tabs)/home.tsx`

## What it means

The app's anchor screen and first tab. Two jobs: greet the user, and offer
exactly one obvious next action — start a budgeted list, or resume the one in
progress. Because the app is anonymous and local, Home deliberately offers
nothing that requires an account: no history, no monthly goal, no dashboard, so
it never leads anywhere dead.

Two states only:

- **No active list** → `HomeEmptyState` + "Criar lista" CTA → `/limit`.
- **Active list** → "Lista atual" section with `ActiveListCard` (name, item
  count, total vs. limit, `BudgetProgressBar`) → tapping opens `/shop`.

## What lives here that is not "the Home screen"

**This folder owns the app's central aggregate.** Other features import from it.

- `active-list.ts` — the `ActiveList` type and every pure operation on it:
  `createActiveList`, `addItem(s)`, `toggleItem`, `setAllChecked`, `updateItem`,
  `removeItem`, `renameList`, plus the derivations `getCheckedTotalInCents`,
  `getListTotalInCents`, `getPendingSummary`, `getCategoryBreakdown`,
  `getTopItems`, `getBudgetStatus`, `getBudgetRatio`. All pure, all immutable,
  no React, no storage.
- `active-list-store.ts` — the only mutable layer. Every action funnels through
  `mutate()` → `recomputeTotals()`, so `itemCount` and `totalInCents` are never
  updated by hand. Persisted under `checkit:active-list` at version 2, with a
  `migrate` chain: v0 (no `items`) → v1 (items without `unit`/`parts`) → v2
  (every item gets `unit: 'unit'`, `parts: null`). Malformed payloads at any
  step fall back to `activeList: null` with a `console.warn` naming the stored
  version.

## Invariants

- **`totalInCents` counts only checked items** ("no carrinho"). The screen-wide
  total of everything in the list is `getListTotalInCents`, used by Summary.
- **Budget bands:** `warning` at ≥ 85%, `overBudget` above 100%.
  `getBudgetRatio` clamps to [0, 1] for rendering; `getBudgetStatus` does not.
- A limit of `0` yields ratio `0` and status `onTrack` — the Limit screen is
  what prevents zero-limit lists from being created in the first place.
- Mutating the list while none exists is a no-op, never a throw.

## Header

`components/home-header/` carries the greeting (`use-greeting.ts` — "Bom dia" /
"Boa tarde" / "Boa noite" by hour), a help action → `/help`, and a bell →
`/notifications` whose badge dot comes from `useUnreadNotifications`.

## Tests

`__tests__/home-screen.test.tsx`, `active-list.test.ts`,
`active-list-store.test.ts`, `active-list-card.test.tsx`,
`budget-progress-bar.test.tsx`, `home-header.test.tsx`,
`home-tabs-integration.test.tsx`, `use-greeting.test.ts`, `e2e/home.test.js`.
