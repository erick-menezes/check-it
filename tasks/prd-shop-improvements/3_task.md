# Task 3.0: Generic digits hook and edit sheet refactor (no behavior change)

## Overview

Prepare the Edit Item sheet for the kg and conjunto work without changing what the user sees. Extract the cents-fill mechanic into a generic `useDigitsInput` in `src/lib`, make `usePriceInput` a thin wrapper and add `useWeightInput`; then move the sheet's draft state into `use-edit-item-form.ts` and extract `quantity-stepper.tsx`, so `edit-item-form.tsx` becomes composition only and stays well under the 300-line limit.

<skills>
### Skills compliance

- `execute-task`, `execute-review`, `create-github-commit`.
</skills>

<requirements>
- `src/lib/digits-input.ts` exports the pure helpers (`sanitizeDigits`, `digitsToInteger`, `integerToDigits`) and `useDigitsInput({ initialValue, maxDigits })` returning `{ value, digits, hasValue, setDigits }`.
- `usePriceInput` keeps its public shape (`cents`, `digits`, `hasPrice`, `setDigits`) and its existing tests; `useWeightInput` caps at `MAX_WEIGHT_DIGITS = 6` and exposes grams.
- `useLimitInput` is not modified.
- `use-edit-item-form.ts` owns the draft (`name`, `unit`, `quantity`, `grams`, `priceDigits`, `parts`, `category`) and exposes intent functions (no boolean flag parameters) plus `totalInCents`, `canSave`, `saveHint`, `buildChanges()`.
- `quantity-stepper.tsx` is extracted with the same test IDs (`edit-qty-decrement`, `edit-qty-value`, `edit-qty-increment`) and accessibility labels.
- Zero behavior change: every existing sheet, integration and Detox test passes unmodified.
- Hooks are never created conditionally (React Compiler); rows/fields are presentational.
</requirements>

## Subtasks

- [x] 3.1 Create `src/lib/digits-input.ts`; rewrite `use-price-input.ts` as a wrapper; add `src/features/shop/use-weight-input.ts` (formats through `formatWeight`).
- [x] 3.2 Create `use-edit-item-form.ts` holding today's draft fields (`name`, `quantity`, `category`, plus `price` composing `usePriceInput`), with `buildChanges()` producing today's exact `UpdateItemChanges` shape. Every existing item is already `unit: 'unit'`/`parts: null` (Task 1.0's invariant), so `unit`/`grams`/`parts` are deliberately *not* stubbed as inert draft keys here — Task 4.0 adds `selectUnit`/the weight draft and Task 5.0 adds the parts draft, each extending this hook's state and `buildChanges()` when they add real UI for them.
- [x] 3.3 Extract `components/quantity-stepper.tsx`; reduce `edit-item-form.tsx` to composition. Two further extractions — `price-quantity-card.tsx` and `category-picker.tsx` — were needed to hit the ≤150-line success criterion below (188 lines with only the stepper extracted; 108 with all three).
- [x] 3.4 Write the tests listed under *Task tests*; run `pnpm typecheck`, `pnpm lint`, `pnpm test`; confirm `__tests__/edit-item-sheet.test.tsx` and `__tests__/shop-list-integration.test.tsx` pass without edits.

## Implementation design

See `techspec.md` → *Component overview › Domain (digits-input)*, *Edit Item sheet*, *Main interfaces* (`DigitsInput`, `EditItemFormState`) and *Key decisions* ("Generic `useDigitsInput`", "Sheet decomposition").

## Success criteria

- `usePriceInput` behavior is byte-for-byte the same for its existing test cases (max 9 digits, `0` → no price, `690` → `R$ 6,90`).
- `useWeightInput`: `830` → `0,830 kg`, `1250` → `1,250 kg`, input beyond 6 digits is truncated, empty → `hasValue === false`.
- `edit-item-form.tsx` is ≤ 150 lines after extraction; no component exceeds 300 lines.
- No existing test file required a change to stay green.

## Task tests

- [x] Unit tests — `__tests__/digits-input.test.ts` (new: helpers + hook), `__tests__/use-price-input.test.ts` (unchanged, green), `__tests__/use-weight-input.test.ts` (new), `__tests__/use-edit-item-form.test.ts` (new: initial draft from an item, `buildChanges` output for name/price/quantity/category, `canSave` true for today's cases), `__tests__/quantity-stepper.test.tsx` (new: min 1, increments, disabled state), `__tests__/edit-item-sheet.test.tsx` (unchanged, green).
- [x] Integration tests — `__tests__/shop-list-integration.test.tsx` (unchanged, green).
- [x] E2E tests — `e2e/shop.test.js` existing edit-sheet spec left untouched by this task (unchanged file, static read-through only; not executed here — no simulator in this environment).

## Relevant files

- `src/lib/digits-input.ts` (new)
- `src/features/shop/use-price-input.ts`
- `src/features/shop/use-weight-input.ts` (new)
- `src/features/limit/use-limit-input.ts` (reference only, untouched)
- `src/features/shop/components/edit-item-sheet/use-edit-item-form.ts` (new)
- `src/features/shop/components/edit-item-sheet/components/edit-item-form.tsx`
- `src/features/shop/components/edit-item-sheet/components/quantity-stepper.tsx` (new)
- `src/lib/weight.ts`
- `__tests__/digits-input.test.ts`, `__tests__/use-weight-input.test.ts`, `__tests__/use-edit-item-form.test.ts`, `__tests__/quantity-stepper.test.tsx`, `__tests__/use-price-input.test.ts`, `__tests__/edit-item-sheet.test.tsx`
