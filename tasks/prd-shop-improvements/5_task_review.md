# Review: Task 5.0 - Conjunto (price composition) in the edit sheet and item row

**Reviewer**: AI Code Reviewer
**Date**: 2026-09-15
**Task file**: 5_task.md
**Status**: APPROVED WITH OBSERVATIONS

## Summary

This is the final task of the "shop-improvements" PRD. It adds the opt-in "Somar vários" parts editor to the Edit Item sheet and the `N itens · R$ X` subtitle to the item row, closing Block 1. `use-edit-item-form.ts` gains a `PricePartDraft` list plus `enableParts`/`disableParts`/`addPart`/`removePart`/`updatePart`/`incrementPartQuantity`/`decrementPartQuantity`, with every rule (pre-fill, cap, blank-drop, label-only-blocks-save, live sum, `canSelectUnit`) implemented as small `resolve*`/`create*`/`build*` module-level helpers rather than inline in the hook body — `useEditItemForm` itself is still exactly the 41 lines it was set at in Task 4.0's fix, despite the parts surface roughly tripling the file. Two new presentational components (`price-part-row.tsx`, `price-parts-editor.tsx`) are wired into `price-quantity-card.tsx`, which now swaps its entire body between `SimplePriceContent` and `PricePartsEditor` depending on `parts`. `item-row/helpers/index.ts` checks `hasParts` ahead of the `kg` branch. `BottomSheet` gained a `max-h-[86%]` cap and an internal `ScrollView`, benefiting both this sheet and `sort-sheet.tsx`.

Every functional requirement and success criterion in `5_task.md` is implemented correctly and is backed by a passing test that exercises the actual behavior, not just an assertion of intent: the pre-fill/empty-row pair, the `MAX_PRICE_PARTS` cap, the blank-row-silently-dropped vs. label-only-blocks-save distinction, "Voltar a preço único" restoring the sum as a plain price and re-enabling the unit toggle, and `buildChanges` emitting `parts` with derivation of `unit`/`quantity` left to `applyItemChanges` (per the techspec's key decision) rather than duplicated in the sheet. The "no ripple" claim is grep-verified: the only reference to `.parts`/`parts:` outside `list-item.ts`, `use-edit-item-form.ts`, the sheet component tree, `item-row/helpers` and tests is `active-list-store.ts:79`, which is pre-existing Task 1.0 migration code (`git log` confirms it was last touched in `bde1a38`, not in this diff) that only ever *writes* `parts: null` and never reads it — legitimate, not scope creep. `canSelectUnit` is now genuinely reactive to the live parts draft, and `edit-item-sheet.test.tsx` proves the toggle disappears within the same render as the "Somar vários" tap, not on a subsequent reopen. The two Task 4.0 regressions this task was asked to re-check are both still fixed: `PRICE_LABEL.unit` is `'Preço'` (and the price input's `accessibilityLabel` now tracks `PRICE_LABEL[unit]` too), and `useEditItemForm` is at 41 lines. `PricePartRow` calls no hooks — it is purely presentational, computing `priceInCents`/`atMinimum` inline from props — satisfying the "React Compiler + per-row hooks" risk. The `BottomSheet` change is behavior-preserving for short content (`bottom-sheet.test.tsx` and `sort-sheet.test.tsx`, both unchanged, still pass) and adds scrolling for tall content.

`pnpm typecheck` is clean, `rtk proxy npx biome check .` reports 0 issues, and `pnpm test` passes at exactly the expected 81 suites / 531 tests. No `as` casts, no prop-spreading, and no inline `style` were introduced anywhere in the new/changed files (the sole `style={sheetStyle}` in `bottom-sheet.tsx` is the pre-existing Reanimated animated-value binding, untouched by this diff's `className` edits, and is the sanctioned exception for a runtime value no utility class can express). The three new Detox specs are sound: `Preço da parte` is a static `accessibilityLabel` shared by every part row, but since exactly two rows exist at the point the specs use `.atIndex(0)`/`.atIndex(1)` (one pre-filled, one empty from `enableParts`, with no `edit-part-add` tap in between), the targeting resolves to exactly two matches and is unambiguous — consistent with why dynamic per-id `testID`s can't be used from Detox, which has no way to know a `createId()`-generated id ahead of time.

Two purely cosmetic/dead-code observations keep this from a clean APPROVED, neither of which is a functional defect and neither of which blocks the PR.

## Files Reviewed

| File | Status | Issues |
| --- | --- | --- |
| `src/features/shop/components/edit-item-sheet/use-edit-item-form.ts` | ✅ OK | 0 |
| `src/features/shop/use-price-input.ts` | ✅ OK | 0 |
| `src/features/shop/components/edit-item-sheet/components/price-part-row.tsx` (new) | ✅ OK | 0 |
| `src/features/shop/components/edit-item-sheet/components/price-parts-editor.tsx` (new) | ✅ OK | 0 |
| `src/features/shop/components/edit-item-sheet/components/price-quantity-card.tsx` | ⚠️ Issues | 1 |
| `src/features/shop/components/edit-item-sheet/components/edit-item-form.tsx` | ✅ OK | 0 |
| `src/features/shop/components/item-row/helpers/index.ts` | ⚠️ Issues | 1 |
| `src/components/ui/bottom-sheet.tsx` | ✅ OK | 0 |
| `src/features/shop/AGENTS.md` | ✅ OK | 0 |
| `__tests__/price-part-row.test.tsx`, `__tests__/price-parts-editor.test.tsx` (new) | ✅ OK | 0 |
| `__tests__/use-edit-item-form.test.ts`, `__tests__/edit-item-sheet.test.tsx`, `__tests__/item-row.test.tsx` (extended) | ✅ OK | 0 |
| `__tests__/shop-list-integration.test.tsx`, `__tests__/shop-summary-integration.test.tsx` (extended) | ✅ OK | 0 |
| `__tests__/bottom-sheet.test.tsx`, `__tests__/sort-sheet.test.tsx` (unchanged) | ✅ OK (verified still passing) | 0 |
| `e2e/shop.test.js` | ✅ OK (static read-through) | 0 |

## Issues Found

### 🔴 Critical Issues

No critical issues found.

### 🟡 Major Issues

No major issues found.

### 🟢 Minor Issues

1. **`price-quantity-card.tsx:57-61` / `use-edit-item-form.ts:349`** — `canSelectUnit` (`parts === null`) is now vestigial where it is consumed. `PriceQuantityCard` only renders `SimplePriceContent` (and therefore `UnitToggle`) when `parts === null` (line 164); at that point `canSelectUnit` is by construction always `true`, so `disabled={!canSelectUnit}` on `UnitToggle` can never evaluate to `true` in production — the toggle is unmounted, not disabled, the instant parts exist, which already fully satisfies PRD FR 3.3. This is harmless (it does not change observable behavior; `unit-toggle.test.tsx` still separately verifies the disabled visual/accessibility state exists as a capability), but it is dead plumbing left over from Task 4.0's "disable while parts exist" design, superseded by Task 5.0's "unmount while parts exist" design. Consider either dropping the now-always-false `disabled` wiring at this call site or leaving a short note in `AGENTS.md` (it already documents the unmount behavior at line 75) explaining that `canSelectUnit`/`disabled` is kept only as defense-in-depth. No action required before merging.

2. **`item-row/helpers/index.ts:16-19`** — `formatPartsSubtitle` re-derives `item.parts === null ? 0 : getPartsCount(item.parts)` even though its only caller (`formatSubtitle`) already guarded with `hasParts(item)`, which guarantees `item.parts !== null`. TypeScript can't narrow `hasParts`'s boolean return across the function boundary, so this isn't a bug, but it duplicates a null-check the caller already performed. A minor simplification would be to have `formatSubtitle` pass `item.parts` (narrowed via an inline check) into `formatPartsSubtitle`, mirroring how `formatKgSubtitle` already receives the full `item`. Purely stylistic.

## ✅ Positive Highlights

- **The exact label-only-vs-blank distinction the task asked to verify is genuinely implemented, not just documented.** `isBlankPartDraft` (no label AND no price) is used both by `buildFinalParts` (silent drop) and to compute `meaningfulParts` for `resolveCanSave`; `partDraftHasPrice` then requires every meaningful (non-blank) part to have a price. A part with a label but no price is "meaningful" and fails `partDraftHasPrice`, correctly blocking save — pinned by the dedicated `use-edit-item-form.test.ts` case "cannot save while a part lacks a price, and shows a hint" using a label-only update, distinct from the separate "drops a blank row... silently" case.
- **Reactivity of `canSelectUnit` is proven same-render, not same-reopen.** `edit-item-sheet.test.tsx`'s "shows the parts editor after tapping Somar vários" asserts `edit-unit-kg` is absent from the screen in the very same `fireEvent.press` that enables parts, and the "composes a conjunto..." test asserts `edit-unit-unit` is enabled again immediately after `edit-parts-disable`, all within one render tree — not across a `rerender`/reopen boundary.
- **No second rounding/derivation formula anywhere.** `getDraftPartsTotalInCents` (draft-side live sum) and `getPartsTotalInCents` (domain-side, called from `applyItemChanges`) both do plain integer `price × quantity` summation with no division — the "float creep" risk from the techspec is a non-issue by construction, and `buildChangesFromDraft`'s parts branch deliberately omits `unit`/`quantity`/`unitPriceInCents`, leaving `applyItemChanges` as the single place that derives them, exactly matching the techspec's "Price derivation from parts happens in `applyItemChanges`" decision.
- **`useEditItemForm` held its line budget under real growth pressure.** Task 4.0's review flagged this hook at ~72 lines and asked that Task 5.0 not compound it. Task 5.0 added the entire parts feature (9 new intents, `PricePartDraft`/`PricePartDraftChanges` types, cap/blank/save-hint rules) while keeping the hook body itself at 41 lines by extracting every rule into a named, verb-first, module-level helper — the same discipline `list-item.ts` set as precedent in Task 1.0.
- **`PricePartRow` is honestly presentational.** It calls zero hooks, computing `priceInCents`/`atMinimum` inline from props each render — directly satisfying the "React Compiler + per-row hooks" risk called out in the techspec, and confirmed by reading the file rather than only trusting `AGENTS.md`'s claim.
- **The two Task 4.0 Major findings are both still fixed.** `PRICE_LABEL.unit` reads `'Preço'` (not `'Preço unitário'`), the price `TextInput`'s `accessibilityLabel` now also tracks `PRICE_LABEL[unit]` (folding in the Task 4.0 Minor #1 fix too), and no regression was introduced by this task's changes to the same file.
- **`BottomSheet`'s scroll fix is a real, verified shared-component improvement.** `bottom-sheet.test.tsx` and `sort-sheet.test.tsx` — both untouched by this diff — still pass unmodified, confirming the `max-h-[86%]` + `ScrollView` addition is behavior-preserving for short content while fixing the real overflow risk the task's own subtask 5.4 identified by inspection.
- **Clean gates.** `pnpm typecheck` (0 errors), `rtk proxy npx biome check .` (0 issues), and `pnpm test` (81/81 suites, 531/531 tests — exactly the counts named in the review request) all pass. No `as` casts, no `{...props}` spreading, no `any`, `readonly` on every new interface, explicit return types on every exported function, and intent functions (`enableParts`/`disableParts`, `incrementPartQuantity`/`decrementPartQuantity`) rather than boolean flag parameters throughout the new surface.
- **E2E targeting is sound where it had to improvise.** The three new specs use `by.label('Preço da parte').atIndex(n)` instead of dynamic `testID`s because Detox cannot predict a `createId()`-generated part id; at the point each spec uses this, exactly the expected number of rows exist (two, from one `enableParts()` call with no `edit-part-add`), so the targeting is unambiguous and consistent with the file's existing swipe-to-delete/kg-item spec patterns.

## Standards Compliance

| Standard | Status |
| --- | --- |
| Code Standards | ✅ |
| TypeScript/Node.js | ✅ |
| React Native | ✅ |
| Tests | ✅ |

## Recommendations

1. Optional cleanup (not blocking): remove or document the now-always-`false` `disabled={!canSelectUnit}` wiring on `UnitToggle` in `price-quantity-card.tsx`, since `PriceQuantityCard`'s own branching on `parts === null` already guarantees the toggle is unmounted, not merely disabled, whenever parts exist.
2. Optional cleanup (not blocking): have `formatSubtitle` pass the narrowed `item.parts` into `formatPartsSubtitle` instead of re-checking `item.parts === null` inside it, avoiding the duplicated null check across the `hasParts` boundary.
3. This was confirmed to be the final task of the PRD — proceed to open the PR for the whole "shop-improvements" (Block 1) feature.

## Verdict

**APPROVED WITH OBSERVATIONS.** All subtasks and Task tests are complete; every functional requirement and success criterion in `5_task.md` (pre-fill + empty row, `MAX_PRICE_PARTS` cap, blank-row-drop vs. label-only-blocks-save, "Voltar a preço único" restoring the sum, `buildChanges` deriving `unit`/`quantity` through `applyItemChanges`, no-ripple, same-render `canSelectUnit` reactivity) is verified against both the code and passing tests, not merely asserted in documentation. The two Task 4.0 regressions this task was specifically asked to re-check (hook line count, price label copy) are both still fixed. `pnpm typecheck`, `rtk proxy npx biome check .`, and `pnpm test` (81 suites / 531 tests) all pass cleanly, and the previously-unchanged `bottom-sheet`/`sort-sheet` tests confirm the shared `BottomSheet` scroll fix is behavior-preserving. The two Minor findings are dead-code/redundancy observations with zero effect on runtime behavior, correctness, or test coverage. This is the final task of the "shop-improvements" PRD — no further follow-up task will exist to catch anything, and none of the issues found here rise to a level that should hold up opening the PR for the whole feature.
