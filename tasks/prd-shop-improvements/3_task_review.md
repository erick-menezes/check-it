# Review: Task 3.0 - Generic digits hook and edit sheet refactor (no behavior change)

**Reviewer**: AI Code Reviewer
**Date**: 2026-09-15
**Task file**: 3_task.md
**Status**: APPROVED

## Summary

This is a pure refactor task and it delivers exactly that: `src/lib/digits-input.ts` extracts the cents-fill mechanic (`sanitizeDigits`, `digitsToInteger`, `integerToDigits`, `useDigitsInput`) that used to live only inside `use-price-input.ts`; `usePriceInput` becomes a five-line wrapper over it with an unchanged public shape (`cents`, `digits`, `hasPrice`, `setDigits`, max 9 digits); a new `useWeightInput` reuses the same primitive and formats through `formatWeight`. The Edit Item sheet's draft state and intent functions move into `use-edit-item-form.ts`, and `edit-item-form.tsx` is decomposed into `quantity-stepper.tsx`, `price-quantity-card.tsx` and `category-picker.tsx`, landing at 108 lines (well under the 150-line success criterion), with every extracted JSX fragment, test ID and accessibility label copied verbatim from the original inline markup.

The zero-behavior-change constraint is verified, not just claimed: `git diff` confirms `__tests__/use-price-input.test.ts`, `__tests__/edit-item-sheet.test.tsx`, `__tests__/shop-list-integration.test.tsx` and `e2e/shop.test.js` have no changes for this task, and the full suite passes at exactly the expected 77 suites / 475 tests. `pnpm typecheck` is clean and `rtk proxy npx biome check .` reports zero issues across 228 files. This is a clean, faithful, well-tested implementation with no critical or major issues.

## Files Reviewed

| File | Status | Issues |
| --- | --- | --- |
| `src/lib/digits-input.ts` (new) | ✅ OK | 0 |
| `src/features/shop/use-price-input.ts` | ✅ OK | 0 |
| `src/features/shop/use-weight-input.ts` (new) | ✅ OK | 0 |
| `src/features/shop/components/edit-item-sheet/use-edit-item-form.ts` (new) | ✅ OK | 0 |
| `src/features/shop/components/edit-item-sheet/components/edit-item-form.tsx` | ✅ OK | 0 |
| `src/features/shop/components/edit-item-sheet/components/quantity-stepper.tsx` (new) | ✅ OK | 0 |
| `src/features/shop/components/edit-item-sheet/components/price-quantity-card.tsx` (new) | ✅ OK | 0 |
| `src/features/shop/components/edit-item-sheet/components/category-picker.tsx` (new) | ✅ OK | 0 |
| `__tests__/digits-input.test.ts`, `__tests__/use-weight-input.test.ts`, `__tests__/use-edit-item-form.test.ts`, `__tests__/quantity-stepper.test.tsx` (all new) | ✅ OK | 0 |
| `__tests__/use-price-input.test.ts`, `__tests__/edit-item-sheet.test.tsx`, `__tests__/shop-list-integration.test.tsx`, `e2e/shop.test.js` (verify-only, confirmed unmodified) | ✅ OK | 0 |
| `tasks/prd-shop-improvements/3_task.md`, `tasks.md` | ✅ OK | 0 |

## Issues Found

### 🔴 Critical Issues

No critical issues found.

### 🟡 Major Issues

No major issues found.

### 🟢 Minor Issues

1. **`use-edit-item-form.ts` draft shape is narrower than subtask 3.2's literal wording, but matches the task's own requirements/success-criteria.** Subtask 3.2 says the draft should hold "the current draft fields (`name`, `quantity`, `priceDigits`, `category`) plus the placeholders the next tasks fill (`unit`, `grams`, `parts`)". The actual `EditItemDraft` only has `name`, `quantity`, `category` (price lives in the separate `usePriceInput` result, as before). No dead `unit`/`grams`/`parts` fields were added. This is the right call — it satisfies the task's own **Requirements** line 17 ("no stray unit/parts keys since nothing edits them yet" per the Success Criteria) and avoids unused placeholder state that Tasks 4.0/5.0 will introduce anyway — but the subtask checklist text and the implementation now disagree on this detail. Worth a one-line note in the task file for the next reader, though not worth reopening the subtask.
2. **`price-quantity-card.tsx` and `category-picker.tsx` extractions go beyond subtask 3.3's literal list** (only `quantity-stepper.tsx` was named). This is already called out transparently in `3_task.md`'s own subtask note (188 lines with only the stepper extracted vs. the 150-line success criterion), so it is a justified, disclosed deviation rather than scope creep — flagging only so it's visible in this review's record.

## ✅ Positive Highlights

- **`usePriceInput` is verifiably byte-for-byte compatible.** The diff shows `sanitizeDigits`/`digitsToCents`/`centsToDigits` logic moved to `digits-input.ts` unchanged in behavior (same regex, same `MAX_PRICE_DIGITS = 9`, same `0`/negative → empty-string semantics), and the untouched `use-price-input.test.ts` passes without edits — the strongest possible proof of "byte-for-byte identical" from the task's success criteria.
- **`useWeightInput` correctness matches every stated criterion**: `830` → `grams: 830`, `formatted: '0,830 kg'`; `1250` → `'1,250 kg'`; 7 digits truncated to 6 (`MAX_WEIGHT_DIGITS`); emptied → `hasValue === false`. All verified both by reading `use-weight-input.ts` + `weight.ts` together and by the passing `__tests__/use-weight-input.test.ts`.
- **No conditional hooks anywhere in the new code.** `useDigitsInput`, `usePriceInput`, `useWeightInput`, and `useEditItemForm` all call their hooks unconditionally at the top of the function body; the extracted components (`QuantityStepper`, `PriceQuantityCard`, `CategoryPicker`) are purely presentational with no hooks at all — satisfying the React Compiler constraint called out in both the task requirements and the techspec's "Known risks" section.
- **Intent functions, not flags.** `useEditItemForm` exposes `setName`, `incrementQuantity`, `decrementQuantity`, `selectCategory` — no boolean toggles anywhere, consistent with the code-standards "Flag Parameters" rule and the pattern already established in Tasks 1.0/2.0.
- **Test IDs and accessibility labels preserved exactly.** `quantity-stepper.tsx` keeps `edit-qty-decrement`/`edit-qty-value`/`edit-qty-increment` and the `"Diminuir quantidade"`/`"Aumentar quantidade"` labels; `price-quantity-card.tsx` keeps `edit-price-input`/`edit-total`; `category-picker.tsx` keeps `edit-category-{option}` — all verified against the pre-refactor markup via `git diff`, and all Detox-relevant per `AGENTS.md`'s stable-test-ID rule.
- **Component sizes are comfortably within limits**: `edit-item-form.tsx` 108 lines (≤150 target), `price-quantity-card.tsx` 68, `category-picker.tsx` 64, `quantity-stepper.tsx` 48 — all far under the 300-line class/component ceiling.
- **`buildChanges()` output is exactly today's `UpdateItemChanges` shape** (`name`/`unitPriceInCents`/`quantity`/`category`), confirmed both by reading the function and by the new `use-edit-item-form.test.ts` (`toEqual` assertions with no extra keys), plus the name-blank-falls-back-to-original and price-cleared-to-null edge cases.
- **Zero-behavior-change proven, not assumed.** `git diff` on the four test files listed in the task's verification requirement shows no diff, and the full suite (77/77 suites, 475/475 tests) matches the exact counts named in the task instructions.
- **Clean gates.** `pnpm typecheck` and `rtk proxy npx biome check .` both pass with zero findings on this change.

## Standards Compliance

| Standard | Status |
| --- | --- |
| Code Standards | ✅ |
| TypeScript/Node.js | ✅ |
| React (hooks/components) | ✅ |
| Tests | ✅ |

## Recommendations

1. When Task 4.0/5.0 extend `use-edit-item-form.ts` with `unit`/`grams`/`parts`, revisit whether `EditItemDraft` should absorb `priceDigits` directly or continue delegating to the separate `usePriceInput`/`useWeightInput` results — the current split (draft object + sibling `PriceInput`) works today but will grow another sibling (`WeightInput`) in Task 4.0, so it's worth deciding once, explicitly, rather than accreting parallel hook results.
2. Optionally reconcile subtask 3.2's checklist wording with what was actually built (no placeholder keys), the way subtask 3.3 already documents its own deviation — purely a documentation nit, no code change needed.

## Verdict

**APPROVED.** The refactor is faithful to the no-behavior-change mandate, every success criterion is met and independently verified (byte-for-byte `usePriceInput` behavior, correct `useWeightInput` formatting/truncation, ≤150-line `edit-item-form.tsx`, preserved test IDs/labels, no conditional hooks), and all gates (`pnpm typecheck`, `pnpm test` at 77/475, `biome check`) pass cleanly. The two minor notes above are documentation nits, not defects, and do not block merging Task 3.0.
