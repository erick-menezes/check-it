# Task 4.0: Unidade por kg in the edit sheet and item row

## Overview

Let the user mark a product as sold by kg, type its weight with the cents-fill mechanic and its price per kg, and see the computed line total in the sheet, the row, the header and Summary. Builds on the domain (1.0), the hooks and the sheet skeleton (3.0).

<skills>
### Skills compliance

- `execute-task`, `execute-review`, `execute-qa`, `create-github-commit`.
</skills>

<requirements>
- `unit-toggle.tsx`: two-position `/un · /kg` attached to the price field, `accessibilityRole="radio"`-style states, test IDs `edit-unit-unit` / `edit-unit-kg`; price label "Preço" ↔ "Preço por kg" (PRD FR 2.2).
- `weight-field.tsx` replaces the quantity stepper in kg mode; fills from the right with three decimals (PRD FR 2.3); test ID `edit-weight-input`; screen-reader value via `formatWeightForSpeech`.
- Switching to kg defaults to `1,000 kg` unless a weight already exists; switching to unit resets quantity to 1; price preserved (PRD FR 2.5) — the sheet passes `unit` and lets `applyItemChanges` enforce the rest.
- Live "Total" in the sheet uses `getLineTotalInCents` semantics (same rounding as the row).
- Item row subtitle: `0,830 kg × R$ 29,90/kg` or `0,830 kg × sem preço` (PRD FR 2.7); no other screen special-cases kg (PRD FR 2.8).
- The toggle is hidden/disabled while `parts !== null` (hook exposes `canSelectUnit`; wired fully in 5.0).
- Touch targets ≥ 44 px; states exposed via `accessibilityState`.
</requirements>

## Subtasks

- [x] 4.1 Extend `use-edit-item-form.ts` with `selectUnit`, the grams draft (via `useWeightInput`), unit-aware `totalInCents` and `buildChanges()` emitting `unit` + grams-as-`quantity`.
- [x] 4.2 Create `components/unit-toggle.tsx` and `components/weight-field.tsx`; wire them into `edit-item-form.tsx` (stepper ↔ weight field swap, price label "Preço" ↔ "Preço por kg", incl. the price input's `accessibilityLabel`) via `price-quantity-card.tsx`, which also swaps the "Quantidade" ↔ "Peso" label. `use-edit-item-form.ts` extracts `create*`/`resolve*`/`build*` helpers at module scope so `useEditItemForm` itself stays at 27 lines, under the 50-line rule (the review caught an initial version at ~72 lines).
- [x] 4.3 Update `item-row/helpers/index.ts` `formatSubtitle` / `formatLineTotal` for kg items using `formatWeight`.
- [x] 4.4 Verify Summary, sort (`price-desc`/`price-asc`), search and the header consume kg items only through `getLineTotalInCents` (no code change was needed; integration assertions added).
- [x] 4.5 Update `src/features/shop/AGENTS.md` (edit sheet and item row sections).
- [x] 4.6 Write the tests listed under *Task tests*; run `pnpm typecheck`, `pnpm lint`, `pnpm test`; author the Detox spec (not executed here — no simulator in this environment).

## Implementation design

See `techspec.md` → *Component overview › Edit Item sheet*, *Main interfaces* (`EditItemFormState.selectUnit`), *Data models* (constants), *Key decisions* ("Reinterpret `quantity`", test IDs) and *Known risks* (silent misuse of `quantity`).

## Success criteria

- Flow "Alcatra → /kg → `830` → price `2990` → save" yields row `0,830 kg × R$ 29,90/kg — R$ 24,82`, header cart/projection consistent, Summary total includes `2482` cents.
- Switching an item with quantity 3 to kg shows `1,000 kg`, never `3 kg`; switching back shows quantity 1.
- A kg item without a price shows `sem preço`, contributes R$ 0,00 and counts toward the item count.
- Sorting by price orders a kg item by its rounded line total.
- All new controls have labels, roles and states; the weight is announced as "0,830 quilos".

## Task tests

- [x] Unit tests — `__tests__/unit-toggle.test.tsx` (new), `__tests__/weight-field.test.tsx` (new: digits → display, accessibility value), `__tests__/use-edit-item-form.test.ts` (extend: unit switch defaults, `buildChanges` for kg), `__tests__/edit-item-sheet.test.tsx` (extend: toggle swaps stepper/weight field, label change, live total), `__tests__/item-row.test.tsx` (extend: kg subtitles), `__tests__/use-visible-items.test.ts` (extend: price sort with a kg item).
- [x] Integration tests — `__tests__/shop-list-integration.test.tsx` (extend: kg round-trip through store → row → header), `__tests__/shop-summary-integration.test.tsx` (extend: kg item in total, category breakdown and top items).
- [x] E2E tests — `e2e/shop.test.js`: kg round-trip added (`edit-unit-kg`, `edit-weight-input` `830`, `edit-price-input` `2990`, save, assert subtitle and total, then clean up via swipe-to-delete); authored only, not executed — no simulator in this environment.

## Relevant files

- `src/features/shop/components/edit-item-sheet/use-edit-item-form.ts`
- `src/features/shop/components/edit-item-sheet/components/edit-item-form.tsx`
- `src/features/shop/components/edit-item-sheet/components/unit-toggle.tsx` (new)
- `src/features/shop/components/edit-item-sheet/components/weight-field.tsx` (new)
- `src/features/shop/components/item-row/helpers/index.ts`
- `src/features/shop/use-weight-input.ts`, `src/lib/weight.ts`
- `src/features/shop/list-item.ts` (consumer)
- `src/features/shop/AGENTS.md`
- `__tests__/unit-toggle.test.tsx`, `__tests__/weight-field.test.tsx`, `__tests__/use-edit-item-form.test.ts`, `__tests__/edit-item-sheet.test.tsx`, `__tests__/item-row.test.tsx`, `__tests__/use-visible-items.test.ts`, `__tests__/shop-list-integration.test.tsx`, `__tests__/shop-summary-integration.test.tsx`
- `e2e/shop.test.js`
