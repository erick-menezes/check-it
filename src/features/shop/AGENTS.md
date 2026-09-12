# Feature: Shop list ("Passo 2 de 2")

**Route:** `/shop` · **Entry:** `src/app/shop.tsx`

## What it means

The heart of the product. The user builds the list at home, then checks items
off in the store while the header shows cart total against the limit in real
time. Every mutation auto-persists — there is no "save" button anywhere, by
design.

## What lives here

**This folder owns the item-level model** (`list-item.ts`), which the Home
aggregate composes:

- `ListItem` — `name`, `quantity` (≥ 1, truncated), `unitPriceInCents | null`,
  `category | null`, `checked`, `createdAt`.
- `getLineTotalInCents` — `0` when the item has no price, so priceless items
  count toward `itemCount` but never toward money.
- `CATEGORIES` / `CATEGORY_META` — the seven categories with label, hex and
  Lucide icon, plus the Tailwind class helpers
  (`getCategoryBackgroundClass`, `getCategoryTintClass`, `getCategoryTile`).
  **Category colors exist twice on purpose:** as `checkit-*-label-color`
  Tailwind classes for views, and as hex in `CATEGORY_META` for SVG/icon props.
  Adding a category means touching both.

Screen behavior:

- `components/add-product-input.tsx` + `suggestions.ts` — typing adds an item;
  focusing the empty field shows 5 random suggestions from a fixed pt-BR pool.
- `use-visible-items.ts` — search + the six sort options (`SORT_OPTIONS`,
  default `recent`). Pure derivation over the store's items.
- `components/item-row/` — check, swipe/remove (with confirm), tap to edit.
- `components/edit-item-sheet/` — name, price (`use-price-input.ts`, the same
  cents-fill mechanic as Limit), quantity, category.
- `components/shop-header/` — editable list title, total/limit, progress bar and
  the green → yellow (≥85%) → red status shifts.
- `components/mark-all-row.tsx`, `sort-sheet.tsx`, `search-field.tsx`,
  `summary-preview-card/` (→ `/summary`), `delete-list-button.tsx` (deletes the
  list and `router.replace('/home')`).

## Invariants

- **Checking an item is what moves money.** The header total reflects checked
  items only; it must update within the same interaction, with no manual
  refresh.
- Mutations go through the store actions, never by editing `activeList` in
  place — `recomputeTotals` runs there.
- Quantity floors at `MIN_QUANTITY = 1`; price of `null` ≠ price of `0`.
  `applyItemChanges` distinguishes "field absent" from "explicitly null" using
  `'field' in changes`.
- Deleting the list is destructive and unrecoverable (no history) — it must stay
  behind a confirmation.

## Tests

`shop-screen`, `shop-header`, `item-row`, `add-product-input`, `search-field`,
`sort-sheet`, `mark-all-row`, `edit-item-sheet`, `delete-list-button`,
`shop-empty-state`, `summary-preview-card`, `suggestions`, `use-price-input`,
`use-visible-items` in `__tests__/`, plus `shop-list-integration.test.tsx` and
`e2e/shop.test.js`.
