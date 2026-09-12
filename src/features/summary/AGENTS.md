# Feature: Summary ("Resumo da lista")

**Route:** `/summary` · **Entry:** `src/app/summary.tsx`

## What it means

The "where did the money go" view for the current list, reached from the Shop
screen's summary preview card. It answers two questions: how the spend splits
across categories, and which items are eating the budget.

It is a read-only projection — no state of its own, no store. Everything is
derived on render from the active list.

## How it works

Three blocks, all fed by pure functions from `@/features/home/active-list`:

- `SummaryTotalTile` — `getListTotalInCents(list)`.
- `StackedCategoryBar` — `getCategoryBreakdown(list)`, a single stacked bar
  (an agreed deviation from the design's per-category rows), sorted by total
  descending, skipping zero-total items, with `null` rendered as "Sem
  categoria".
- `TopItemsList` — `getTopItems(list)`, the 5 most expensive items by line
  total.

## Invariants

- **Summary uses `getListTotalInCents` — all items, checked or not.** That is
  deliberately different from the Home/Shop header total
  (`getCheckedTotalInCents`, "no carrinho"). Do not "fix" one to match the
  other; they answer different questions.
- The screen returns `null` when there is no active list; it is only reachable
  from Shop, which requires one.

## Tests

`__tests__/summary-screen.test.tsx`, `summary-total-tile.test.tsx`,
`stacked-category-bar.test.tsx`, `top-items-list.test.tsx`,
`shop-summary-integration.test.tsx`, `e2e/summary.test.js`.
