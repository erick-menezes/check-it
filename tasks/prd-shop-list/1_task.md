# Task 1.0: Data model, store extension and category tokens

## Overview

Extend the persisted active-list state with the `ListItem` model and every list mutation the feature needs, recomputing the denormalized `totalInCents` (checked items only) and `itemCount` on each action so Home's active-list card and budget-alerts keep working unchanged. Add the v0→v1 persistence migration and the English category color tokens to the Tailwind config. This is the foundation every other task consumes.

<skills>
### Skills compliance

- `execute-task` — implementation workflow for this task.
- `execute-review` — code review after implementation.
- `create-github-commit` — Conventional Commits for the resulting changes.
</skills>

<requirements>
- `ListItem` and `Category` defined per the techspec data models (nullable `unitPriceInCents` and `category`, integer `quantity ≥ 1`, ISO `createdAt`).
- Category metadata map carries the pt-BR display label, hex token and icon per category; Tailwind gains `[category]-label-color` tokens under `checkit` plus 18% tint variants.
- All mutations route through one internal `commit(list)` helper that recomputes totals before persisting; priceless items contribute R$ 0,00.
- Persisted schema bumps to version 1 with a `migrate` that adds `items: []` to a stored v0 list; migration failures warn and fall back to `null` list.
- Home (`active-list-card`, `budget-progress-bar`) and `budget-alerts` keep working with zero changes.
</requirements>

## Subtasks

- [x] 1.1 Create `src/features/shop/list-item.ts`: `ListItem` model, `Category` union, category metadata map (pt-BR labels, hex tokens, icons).
- [x] 1.2 Add category palette tokens to `tailwind.config.js` (`grocery-label-color` … `other-label-color` + 18% tints).
- [x] 1.3 Extend `src/features/home/active-list.ts`: `items` field, pure functions `addItem`, `toggleItem`, `setAllChecked`, `updateItem`, `removeItem`, `renameList`; selectors `getCheckedTotalInCents`, `getPendingSummary`, `getCategoryBreakdown`, `getTopItems`.
- [x] 1.4 Extend `src/features/home/active-list-store.ts`: item-level actions wrapping the pure functions (incl. `addItems` for receipt import and `deleteList`), totals recomputed via a single `commit` helper.
- [x] 1.5 Bump `persist` version 0 → 1 with `migrate` adding `items: []`; keep the existing rehydration `console.warn` pattern.
- [x] 1.6 Unit tests: mutations and total recomputation, migration v0→v1, persistence side effects (mocked AsyncStorage), extending `__tests__/active-list-store.test.ts`.
- [x] 1.7 Integration tests: Home regression — `active-list-card` reflects item count/totals after store mutations; budget-alerts fires warning/exceeded when checked totals cross 85%/100%.

## Implementation details

See techspec.md — "Main interfaces", "Data models", "System architecture > Component overview (Modified)" and "Key decisions" (denormalized totals via `commit`, extend store in place).

## Success criteria

- Every mutation leaves `totalInCents` equal to Σ checked (price × quantity) and `itemCount` equal to `items.length`.
- A v0 persisted list hydrates under v1 without crashing; corrupted payloads warn and fall back to `null`.
- All pre-existing Home/budget-alerts/notifications tests pass without modification to those features.
- TypeScript strict mode passes; models are `readonly`; no `any`/`!`/blind `as`.

## Task tests

- [x] Unit tests (mutations, totals, selectors, migration, persistence)
- [x] Integration tests (Home card + budget-alerts regression loop)
- [ ] E2E tests — not applicable (covered in task 6.0)

## Relevant files

- `src/features/home/active-list.ts`
- `src/features/home/active-list-store.ts`
- `src/features/shop/list-item.ts` (new)
- `tailwind.config.js`
- `src/lib/currency.ts`, `src/lib/id.ts`
- `__tests__/active-list-store.test.ts`, `__tests__/active-list.test.ts`, `__tests__/budget-alerts.test.ts`, `__tests__/home-tabs-integration.test.tsx`
