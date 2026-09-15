# Task 5.0: Conjunto (price composition) in the edit sheet and item row

## Overview

Add the opt-in parts editor to the Edit Item sheet ("Somar vários" → list of parts with optional label, price and quantity → live sum) and the "3 itens · R$ 11,97" subtitle in the item row. The sum becomes the item's single price on save through `applyItemChanges`; nothing outside the sheet and the row learns about parts. Closes Block 1.

<skills>
### Skills compliance

- `execute-task`, `execute-review`, `execute-qa`, `create-github-commit`, `create-github-pull-request` (block PR once 5.0 is reviewed).
</skills>

<requirements>
- Every item starts simple; the parts editor appears only after "Somar vários" (`edit-parts-enable`) inside the price field (PRD FR 3.1).
- Entering composition pre-fills the first part with the current price (if any) and adds one empty row (PRD FR 3.2).
- Part row: optional label, cents-fill price, quantity stepper ≥ 1; parts are units only; the unit toggle is unavailable while parts exist (PRD FR 3.3); parts capped at `MAX_PRICE_PARTS`.
- "Salvar alterações" disabled with hint (`edit-save-hint`) while a part lacks a price; rows with neither label nor price are dropped on save (PRD FR 3.6).
- "Voltar a preço único" (`edit-parts-disable`) removes parts and keeps the sum as the price (PRD FR 3.7).
- Row subtitle `N itens · R$ X` with N = sum of part quantities (PRD FR 3.8); the row and the sheet are the only readers of `parts` (PRD FR 3.9).
- Part rows are presentational; the draft (including each part's `priceDigits`) lives in `use-edit-item-form.ts`; keys come from `PricePart.id`, never the index.
- The sheet stays scrollable with the keyboard open as the parts list grows.
- Test IDs per techspec: `edit-parts-enable`, `edit-parts-disable`, `edit-part-add`, `edit-part-row-{id}`, `edit-part-label-{id}`, `edit-part-price-{id}`, `edit-part-qty-increment-{id}`, `edit-part-qty-decrement-{id}`, `edit-part-remove-{id}`, `edit-save-hint`.
</requirements>

## Subtasks

- [x] 5.1 Extend `use-edit-item-form.ts` with the `PricePartDraft` list, `enableParts`, `disableParts`, `addPart`, `updatePart`, `removePart`, `incrementPartQuantity`/`decrementPartQuantity`, `canSelectUnit`, `canSave`/`saveHint` rules and `buildChanges()` emitting `parts` (or `parts: null` + sum). `useEditItemForm` itself stays at 41 lines by extracting every rule into a small `resolve*`/`create*`/`build*` helper (per Task 4.0's review lesson).
- [x] 5.2 Create `components/price-parts-editor.tsx` and `components/price-part-row.tsx`; wire "Somar vários" into the price field area (`price-quantity-card.tsx` swaps its whole body — price+quantity vs. the parts editor — rather than hiding the stepper/unit-toggle inline).
- [x] 5.3 Update `item-row/helpers/index.ts` `formatSubtitle` for parts (`getPartsCount`, `formatBRL`), checked ahead of the kg branch.
- [x] 5.4 Verified by code inspection only (no simulator/device here): `BottomSheet` rendered `children` in a plain, non-scrolling `View` — a parts list approaching `MAX_PRICE_PARTS` would have overflowed with no way to reach the lower rows or the Save button. Added a `max-h-[86%]` cap plus an internal `ScrollView` (`keyboardShouldPersistTaps="handled"`) to the shared `BottomSheet` component, benefiting both this sheet and `sort-sheet.tsx` at no visual cost when content already fits.
- [x] 5.5 Update `src/features/shop/AGENTS.md` (edit sheet, item row, invariants). Skipped the `ROADMAP.md` half: that file is untracked in the main checkout (per the original `git status`) and absent from this worktree — it's the user's personal, uncommitted roadmap draft, not a tracked project doc. Adding/committing it here would fork a file they may still be editing locally, so it's left untouched; the Block 1 open decisions (visual-only projection, units-only parts, quantity-as-grams) are recorded in this PRD's own `prd.md`/`techspec.md` instead.
- [x] 5.6 Wrote the tests listed under *Task tests*; ran `pnpm typecheck`, `pnpm lint` (via `rtk proxy npx biome check .`), `pnpm test`. Authored `e2e/shop.test.js`'s three new specs but did not run `pnpm e2e:build && pnpm e2e:test` — no iOS simulator/build toolchain in this environment.

## Implementation design

See `techspec.md` → *Component overview › Edit Item sheet*, *Main interfaces* (`EditItemFormState` part intents), *Data models* (`PricePart`, `PricePartDraft`, `MAX_PRICE_PARTS`), *Key decisions* ("Price derivation from parts happens in `applyItemChanges`") and *Known risks* (keyboard/scroll, per-row hooks, float creep).

## Success criteria

- Flow "Biscoitos → Somar vários → prices `399`, `399`, `399` → save" yields subtitle `3 itens · R$ 11,97`, item price `1197`, quantity 1, unit `'unit'`; Summary and header use `1197` with no code change in those screens.
- Reopening shows the three parts; "Voltar a preço único" then save keeps `R$ 11,97` as a plain price and re-enables the unit toggle.
- Save is disabled with a visible hint while any priced-less part remains; an untouched empty row is silently dropped.
- No `parts` reference exists outside `list-item.ts`, `use-edit-item-form.ts`, the sheet components, `item-row/helpers` and tests (grep-verified in review).
- All part controls expose labels/roles/states; touch targets ≥ 44 px.

## Task tests

- [x] Unit tests — `__tests__/price-parts-editor.test.tsx` (new), `__tests__/price-part-row.test.tsx` (new), `__tests__/use-edit-item-form.test.ts` (extend: enable pre-fill, add/remove/cap, `canSave` + hint, empty-row drop, disable keeps sum, `canSelectUnit`), `__tests__/edit-item-sheet.test.tsx` (extend: full compose → save → reopen → single price), `__tests__/item-row.test.tsx` (extend: parts subtitle), `__tests__/list-item.test.ts` (verified: parts invariants already covered in 1.0, still green).
- [x] Integration tests — `__tests__/shop-list-integration.test.tsx` (extend: conjunto round-trip through store → row → header), `__tests__/shop-summary-integration.test.tsx` (extend: conjunto contributes its sum to total/breakdown/top items).
- [x] E2E tests — `e2e/shop.test.js`: three specs added (compose via `edit-parts-enable` → two part prices → save → `2 itens · …`; reopen → `edit-parts-disable` → save → plain subtitle, same total; swipe-to-delete cleanup) — authored only, not executed (no simulator in this environment).

## Relevant files

- `src/features/shop/components/edit-item-sheet/use-edit-item-form.ts`
- `src/features/shop/components/edit-item-sheet/components/edit-item-form.tsx`
- `src/features/shop/components/edit-item-sheet/components/price-parts-editor.tsx` (new)
- `src/features/shop/components/edit-item-sheet/components/price-part-row.tsx` (new)
- `src/features/shop/components/edit-item-sheet/components/unit-toggle.tsx` (disabled state)
- `src/features/shop/components/item-row/helpers/index.ts`
- `src/features/shop/list-item.ts` (`getPartsTotalInCents`, `getPartsCount`, `MAX_PRICE_PARTS`)
- `src/components/ui/bottom-sheet.tsx`, `src/lib/use-keyboard-height.ts` (verify scroll)
- `src/features/shop/AGENTS.md`, `ROADMAP.md`
- `__tests__/price-parts-editor.test.tsx`, `__tests__/price-part-row.test.tsx`, `__tests__/use-edit-item-form.test.ts`, `__tests__/edit-item-sheet.test.tsx`, `__tests__/item-row.test.tsx`, `__tests__/shop-list-integration.test.tsx`, `__tests__/shop-summary-integration.test.tsx`
- `e2e/shop.test.js`
