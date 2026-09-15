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

- `ListItem` — `name`, `unit` (`'unit' | 'kg'`, default `'unit'`), `quantity`
  (≥ 1, truncated for unit items; **integer grams** when `unit === 'kg'` — the
  same field is reinterpreted, there is no separate weight field),
  `unitPriceInCents | null` (price per unit, or per kg), `parts` (optional
  price composition, see below), `category | null`, `checked`, `createdAt`.
- `parts: readonly PricePart[] | null` — an item may be a "conjunto": several
  `{ label, unitPriceInCents, quantity }` parts whose sum becomes the item's
  own `unitPriceInCents`. Every invariant lives in `applyItemChanges`: setting
  non-null `parts` forces `unit: 'unit'`, `quantity: 1` and derives the price —
  nothing else in the codebase (Summary, sort, search, notifications) ever
  reads `parts`; they all consume the item's single `unitPriceInCents`.
- `getLineTotalInCents` — `0` when the item has no price. For a `kg` item it is
  `unitPriceInCents × grams ÷ 1000`, rounded half-up in integer arithmetic
  (`Math.floor((price × grams + 500) / 1000)`), never a float division.
  Priceless items count toward `itemCount` but never toward money.
- `isKgItem` / `hasParts` — the only sanctioned way to branch on unit/parts;
  `getPartsTotalInCents` / `getPartsCount` back the parts UI.
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
  default `recent`), plus the `isSortOption` guard. Pure derivation over the
  store's items; it holds no state of its own.
- `sort-preference-store.ts` — the chosen sort, persisted under
  `checkit:shop-sort` and joined to the root hydration gate. It is a **global**
  preference, not per-list: it survives leaving the screen, deleting the list
  and restarting the app. `merge` falls back to `DEFAULT_SORT` when the stored
  value is not a known option. The search query, by contrast, stays ephemeral.
- `components/item-row/` — check, swipe/remove (with confirm), tap to edit.
  The subtitle branches, in order, on `hasParts(item)`, then `item.unit`: a
  conjunto reads `N itens · R$ X` (N = `getPartsCount`); a kg item reads
  `0,830 kg × R$ 29,90/kg` (or `0,830 kg × sem preço`) via `formatWeight`; a
  plain unit item reads `N× R$ X` (or `N× sem preço`). The line total always
  comes from `getLineTotalInCents` — the row never computes kg rounding or
  the parts sum itself.
- `components/edit-item-sheet/` — draft state lives in `use-edit-item-form.ts`
  (`name`, `unit`, `quantity`, the `price`/`weight` digit hooks, `parts`,
  `category`), composed by `edit-item-form.tsx` into `price-quantity-card.tsx`
  (price field + `unit-toggle.tsx`, swapping `quantity-stepper.tsx` for
  `weight-field.tsx` in kg mode — or, once "Somar vários" is tapped,
  swapping the whole card body for `price-parts-editor.tsx` +
  `price-part-row.tsx`) and `category-picker.tsx`. `use-price-input.ts` and
  `use-weight-input.ts` are thin wrappers over the generic
  `@/lib/digits-input` cents-fill mechanic (the same one Limit uses via its
  own `use-limit-input.ts`); a `PricePartDraft` row reuses the same pure
  `sanitizeDigits`/`digitsToInteger` helpers directly — no per-row hook, since
  rows are presentational and hooks are never called conditionally.
  Switching `/un · /kg` defaults the weight to `1,000 kg` unless one was
  already typed, and always resets the quantity to `1` when switching back —
  `applyItemChanges` enforces this too, but the sheet pre-computes it so the
  toggle feels instant. The unit toggle is unmounted (not just disabled)
  while parts exist (`canSelectUnit = parts === null`, tracking the *live*
  draft, not the original item, so it flips the instant "Somar vários" is
  tapped). "Salvar alterações" is disabled with a hint
  (`edit-save-hint`) whenever any non-blank part still lacks a price; a row
  with neither a label nor a price is dropped silently on save. The sheet's
  live "Total" reuses `getLineTotalInCents` directly (never a second
  rounding formula) so it can never drift from the row.
- `components/shop-header/` — editable list title, total/limit, progress bar and
  the green → yellow (≥85%) → red status shifts. Also renders "Previsto" (the
  projected total) as a second line under "No carrinho" whenever an unchecked
  priced item exists, with its own warning/over-limit text treatment
  (`shop-projection` / `shop-projection-{status}`) — this is purely visual;
  the progress bar, `getBudgetStatus` and every notification stay driven by
  the checked total only, never the projection.
- `components/mark-all-row.tsx`, `sort-sheet.tsx`, `search-field.tsx`,
  `summary-preview-card/` (→ `/summary`), `delete-list-button.tsx` (deletes the
  list and `router.replace('/home')`).

## Invariants

- **Checking an item is what moves money.** The header total reflects checked
  items only; it must update within the same interaction, with no manual
  refresh.
- Mutations go through the store actions, never by editing `activeList` in
  place — `recomputeTotals` runs there.
- Quantity floors at `MIN_QUANTITY = 1` for unit items; for `kg` items it is
  clamped to `[MIN_WEIGHT_IN_GRAMS, MAX_WEIGHT_IN_GRAMS]`. Price of `null` ≠
  price of `0`. `applyItemChanges` distinguishes "field absent" from
  "explicitly null" using `'field' in changes`.
- Switching `unit` from `'unit'` to `'kg'` defaults the weight to
  `DEFAULT_WEIGHT_IN_GRAMS` unless the change carries an explicit quantity;
  switching back resets it to `MIN_QUANTITY`. The price is preserved across
  either switch.
- A non-null `parts` always wins: it forces `unit: 'unit'`, `quantity: 1` and
  `unitPriceInCents = getPartsTotalInCents(parts)`, overriding any conflicting
  `unit`/`quantity`/`unitPriceInCents` in the same change.
- **Nothing outside `list-item.ts`, `use-edit-item-form.ts`, the edit-sheet
  components and `item-row/helpers` may read `parts`.** Summary, sort,
  search, notifications and the header consume the item's single
  `unitPriceInCents`/`getLineTotalInCents` only — the same rule already held
  for `unit`/`quantity` (kg) and is why neither feature needed a single line
  of code changed in those other screens.
- A part with neither a label nor a price is a stray empty row, not a real
  part: it is dropped silently on save, never blocks saving, and never
  emits a `PricePart`. A part with only a label but no price *does* block
  saving (`canSave = false`, `saveHint` set) until it is priced or removed —
  it is not "blank", just incomplete.
- Deleting the list is destructive and unrecoverable (no history) — it must stay
  behind a confirmation.

## Tests

`shop-screen`, `shop-header`, `item-row`, `add-product-input`, `search-field`,
`sort-sheet`, `mark-all-row`, `edit-item-sheet`, `delete-list-button`,
`shop-empty-state`, `summary-preview-card`, `suggestions`, `use-price-input`,
`use-weight-input`, `use-visible-items`, `use-edit-item-form`,
`quantity-stepper`, `unit-toggle`, `weight-field`, `price-parts-editor`,
`price-part-row` in `__tests__/`, plus `shop-list-integration.test.tsx`,
`shop-summary-integration.test.tsx` and `e2e/shop.test.js`.
