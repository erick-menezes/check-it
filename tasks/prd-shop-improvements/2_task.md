# Task 2.0: Total previsto — projection derivations and Shop header line

## Overview

Add the projected-total derivations to the active-list domain and surface them in the Shop header as a "Previsto" line under "No carrinho", with its own warning/over-limit treatment and a new status-line case. The checked total remains the only input to the progress bar, `getBudgetStatus` and budget notifications.

<skills>
### Skills compliance

- `execute-task`, `execute-review`, `create-github-commit`.
</skills>

<requirements>
- `getProjectedTotalInCents`, `getPendingPricedTotalInCents` (moved from the header helpers) and `getProjectedBudgetStatus` live in `src/features/home/active-list.ts`; the 85 % / 100 % thresholds are shared with `getBudgetStatus` through one private `getStatusForTotal(total, limit)`.
- The projection is derived on render; nothing new is stored and `budget-alerts.ts` is not modified.
- "Previsto" renders only when at least one unchecked priced item exists (PRD FR 1.1–1.2), as a second line under the cart total (techspec *Key decisions › Header layout*).
- Warning and over-limit states carry a textual cue, never color alone (PRD FR 1.3).
- `buildStatusLine` precedence: cart over limit → "Previsto estoura em R$ X" → pending items → remaining budget (PRD FR 1.4).
- The chip `accessibilityLabel` includes "Previsto R$ X de R$ Y" when shown.
- New test IDs: `shop-projection`, `shop-projection-{status}`; all existing header IDs unchanged.
</requirements>

## Subtasks

- [x] 2.1 Add the projection derivations and `getStatusForTotal` refactor to `active-list.ts`; re-export `getPendingPricedTotalInCents` from `shop-header/helpers` to keep existing imports working.
- [x] 2.2 Extend `buildStatusLine` with the projected-over case and its precedence.
- [x] 2.3 Render the "Previsto" line and its status treatment in `shop-header/index.tsx`; extend the chip accessibility label; keep the layout within ~360 px (wrap allowed).
- [x] 2.4 Update `src/features/home/AGENTS.md` (derivations list) and `src/features/shop/AGENTS.md` (header behavior).
- [x] 2.5 Write the tests listed under *Task tests*; run `pnpm typecheck`, `pnpm lint`, `pnpm test`.

## Implementation design

See `techspec.md` → *Component overview › Shop header*, *Main interfaces* (`getProjectedTotalInCents`, `getProjectedBudgetStatus`) and *Key decisions* ("Projection is derived, never stored", "Header layout").

## Success criteria

- With one unchecked priced item the header shows "Previsto" equal to checked + pending priced totals; checking every item hides it.
- `getProjectedBudgetStatus` returns `onTrack` at 84.9 %, `warning` at 85 % and 100 %, `overBudget` above 100 %; `onTrack` when `limitInCents <= 0`.
- The progress bar fill, `shop-progress-{status}` and the notification latch behave exactly as before for the same checked totals.
- A list whose projection crosses 85 % while the cart stays below emits no notification.

## Task tests

- [x] Unit tests — `__tests__/active-list.test.ts` (extend: projection value, equality with `getListTotalInCents`, status thresholds), `__tests__/shop-header.test.tsx` (extend: hidden/shown, `shop-projection-warning`, `shop-projection-overBudget`, status-line precedence, accessibility label), `__tests__/budget-alerts.test.ts` (extend: projection-only crossing emits nothing).
- [x] Integration tests — `__tests__/shop-list-integration.test.tsx` (extend: add two priced items, check one → projection visible with the right value; check the other → hidden; cart total updates in the same interaction).
- [x] E2E tests — `e2e/shop.test.js`: projection is visible while Arroz is priced and pending, and hides once it is checked (adapted to the existing sequential flow, where the second product has no price).

## Relevant files

- `src/features/home/active-list.ts`
- `src/features/shop/components/shop-header/index.tsx`
- `src/features/shop/components/shop-header/helpers/index.ts`
- `src/features/shop/components/shop-header/components/budget-bar-fill.tsx` (reference for status styling)
- `src/features/notifications/budget-alerts.ts` (must stay unchanged)
- `src/features/home/AGENTS.md`, `src/features/shop/AGENTS.md`
- `__tests__/active-list.test.ts`, `__tests__/shop-header.test.tsx`, `__tests__/budget-alerts.test.ts`, `__tests__/shop-list-integration.test.tsx`
- `e2e/shop.test.js`
