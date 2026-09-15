# Review: Task 4.0 - Unidade por kg in the edit sheet and item row

**Reviewer**: AI Code Reviewer
**Date**: 2026-09-15
**Task file**: 4_task.md
**Status**: APPROVED WITH OBSERVATIONS

## Summary

The task wires the kg unit through the edit sheet and the item row on top of the domain model landed in Task 1.0. `use-edit-item-form.ts` gains `unit` state, a `weight` draft via `useWeightInput`, `selectUnit` (defaulting the weight to `1,000 kg` only when none was typed yet, always resetting quantity to `1` on switch-back, always preserving price), a unit-aware `totalInCents` computed through the same `getLineTotalInCents` the row uses, and `buildChanges()` emitting `unit` plus grams-as-`quantity`. Two new presentational components (`unit-toggle.tsx`, `weight-field.tsx`) are wired into `price-quantity-card.tsx`, which swaps the stepper for the weight field and the "Quantidade"/"Peso" label in kg mode. `item-row/helpers/index.ts` branches `formatSubtitle` on `item.unit` using `formatWeight`, and `formatLineTotal` is untouched — both the sheet and the row funnel through `getLineTotalInCents`, so there is exactly one rounding formula, matching the techspec's key "no ripple" risk mitigation.

Summary, sort, search and the header needed zero code changes, and the new integration tests genuinely prove this by running a kg item through the full store → UI stack (`shop-list-integration.test.tsx`, `shop-summary-integration.test.tsx`), not just the domain layer already covered in Task 1.0. `canSelectUnit` is correctly wired to `item.parts === null` even though nothing creates parts yet. `pnpm typecheck` is clean, `rtk proxy npx biome check .` reports 0 issues, and `pnpm test` passes at the expected 79 suites / 500 tests. The React-state-batching pitfall called out in the task brief was investigated specifically and the production code path is safe (see Issue discussion below) — the one test that needed separate `act()` calls is a test-only artifact of calling the same intent function twice inside one synchronous block, which never happens from a real button press.

Two non-blocking issues keep this from a clean APPROVED: the unit-mode price label text does not match the PRD's literal copy, and `useEditItemForm` has grown past the project's 50-line method-size rule.

## Files Reviewed

| File | Status | Issues |
| --- | --- | --- |
| `src/features/shop/components/edit-item-sheet/use-edit-item-form.ts` | ⚠️ Issues | 1 |
| `src/features/shop/components/edit-item-sheet/components/unit-toggle.tsx` (new) | ✅ OK | 0 |
| `src/features/shop/components/edit-item-sheet/components/weight-field.tsx` (new) | ✅ OK | 0 |
| `src/features/shop/components/edit-item-sheet/components/price-quantity-card.tsx` | ⚠️ Issues | 2 |
| `src/features/shop/components/edit-item-sheet/components/edit-item-form.tsx` | ✅ OK | 0 |
| `src/features/shop/components/item-row/helpers/index.ts` | ✅ OK | 0 |
| `src/features/shop/AGENTS.md` | ✅ OK (one wording nit) | 1 |
| `__tests__/unit-toggle.test.tsx`, `__tests__/weight-field.test.tsx` (new) | ✅ OK | 0 |
| `__tests__/use-edit-item-form.test.ts`, `__tests__/edit-item-sheet.test.tsx`, `__tests__/item-row.test.tsx`, `__tests__/use-visible-items.test.ts` (extended) | ✅ OK | 0 |
| `__tests__/shop-list-integration.test.tsx`, `__tests__/shop-summary-integration.test.tsx` (extended) | ✅ OK | 0 |
| `e2e/shop.test.js` | ✅ OK (static read-through) | 0 |

## Issues Found

### 🔴 Critical Issues

No critical issues found.

### 🟡 Major Issues

1. **`src/features/shop/components/edit-item-sheet/components/price-quantity-card.tsx:11-13`** — the PRD (FR 2.2) and the task's own requirements bullet ("price label `'Preço'` ↔ `'Preço por kg'` (PRD FR 2.2)") specify the unit-mode price label as `"Preço"`, but `PRICE_LABEL.unit` was left at the pre-existing `"Preço unitário"`; only the kg branch (`"Preço por kg"`) was implemented per spec. The new test even pins the deviation (`expect(screen.getByText('Preço unitário')).toBeOnTheScreen();` in `__tests__/edit-item-sheet.test.tsx`). This is purely a copy mismatch — no functional break — but it is an explicit, testable requirement that was not met. Fix: change `PRICE_LABEL.unit` to `'Preço'` (and update the one test assertion and the `accessibilityLabel` on the same input, see Minor #1).

2. **`src/features/shop/components/edit-item-sheet/use-edit-item-form.ts:57-123`** — `useEditItemForm` is now ~72 lines from signature to closing brace (measured `sed -n '57,128p' | wc -l` minus the trailing wrapper lines), over the project's 50-line method-size rule (`.claude/rules/code-standards.md`). The growth comes from `selectUnit`, `draftQuantityForUnit`, and the recomputed `totalInCents`/`weight` wiring all being nested function declarations inside the hook body — the same pattern Task 3.0 used at ~40 lines (then under the limit, not flagged). Task 1.0's `list-item.ts` set the precedent for handling exactly this kind of growth: extract small, named, verb-first helper functions (e.g. `resolveQuantityForUnitSwitch`) instead of letting one function keep absorbing logic. Suggest pulling `draftQuantityForUnit`/the default-weight-on-switch logic into standalone module-level helpers to bring the hook back under 50 lines before Task 5.0 adds the parts editor on top of it (which will grow this file further).

### 🟢 Minor Issues

1. **`price-quantity-card.tsx:67`** — the price `TextInput`'s `accessibilityLabel="Preço unitário"` is a static string that never switches to reflect kg mode, unlike the adjacent visible `Text` label which correctly reads `PRICE_LABEL[unit]`. A screen-reader user focusing the price field itself never hears "por kg" context. Fix: use `PRICE_LABEL[unit]` for the `accessibilityLabel` too.

2. **`use-edit-item-form.ts:91`** — `draftQuantityForUnit` does not start with a verb, per code-standards.md ("Functions must start with a verb, perform a single clear action"). Rename to e.g. `resolveDraftQuantity` or `getQuantityForUnit`.

3. **`src/features/shop/AGENTS.md:58-63`** — the sentence describing the sheet decomposition ("composed by `edit-item-form.tsx` into three sub-components: `price-quantity-card.tsx` (price field + `unit-toggle.tsx`, swapping `quantity-stepper.tsx` for `weight-field.tsx` in kg mode), and `category-picker.tsx`.") reads awkwardly — it names "three sub-components" but lists two at the top level with two more nested inside the parenthetical. Purely a documentation clarity nit, no code impact.

## ✅ Positive Highlights

- **Single rounding formula, verified, not just claimed.** The sheet's live `totalInCents` is computed by calling the same `getLineTotalInCents(item)` the row's `formatLineTotal` calls — no second rounding formula was written anywhere. `__tests__/use-edit-item-form.test.ts` ("computes the kg line total with the same rounding as the domain") and `__tests__/item-row.test.tsx` ("renders the priced kg subtitle and its rounded line total") both assert the identical `2482` cents for `830g × 2990/kg`, closing the exact "no ripple"/duplicated-rounding risk the techspec calls out.
- **Zero-code-change consumers are proven, not assumed.** `__tests__/shop-list-integration.test.tsx` drives a real kg edit through the store and asserts the row/header text and `activeList.totalInCents`; `__tests__/shop-summary-integration.test.tsx` mutates a seeded item into a kg item via `updateItem` and asserts the Summary total tile, category legend and top-items list all reflect the rounded total — genuinely exercising Summary/category-breakdown/top-items through the UI, not just `getListTotalInCents` in isolation. `__tests__/use-visible-items.test.ts` adds a `price-desc` sort case with a real kg item mixed into unit items, exercising the actual sort comparator rather than re-testing `getLineTotalInCents` alone.
- **Unit-switch defaults/reset/price-preservation match every success criterion.** `selectUnit`'s three rules (`kg` with no prior weight → `1,000 kg`; switch back to `unit` → quantity `1`; price untouched either way) are each pinned by a dedicated `use-edit-item-form.test.ts` case, plus end-to-end through `edit-item-sheet.test.tsx` and the kg round-trip integration test.
- **State-batching pitfall confirmed safe in production.** `selectUnit` reads `weight.hasValue` once per call and only ever fires from a single discrete `Pressable.onPress`; React always commits/renders between two separate native touch events, so there is no code path where a stale `weight.hasValue` closure could leak across two real button presses. The one place a batching issue surfaced was test-only (`use-edit-item-form.test.ts`'s "keeps an already-typed weight when re-selecting kg" case correctly wraps each `selectUnit`/`setDigits` call in its own `act()` rather than chaining them — that discipline was already applied consistently across the new tests).
- **`canSelectUnit` is wired all the way through even though nothing creates parts yet.** `useEditItemForm` exposes `canSelectUnit: item.parts === null`; `EditItemForm` passes it to `PriceQuantityCard`, which passes `disabled={!canSelectUnit}` to `UnitToggle`. `item.parts` already exists on every `ListItem` (default `null`) since Task 1.0, so this is genuinely testable today and ready for Task 5.0 to flip.
- **Accessibility is solid for the two new controls.** `unit-toggle.tsx` uses `accessibilityRole="radiogroup"`/`"radio"` with `accessibilityState={{ selected, disabled }}`, distinct `accessibilityLabel`s ("Vender por unidade"/"Vender por quilo"), stable `edit-unit-{unit}` test IDs, and `h-11` (44px) touch targets. `weight-field.tsx` exposes `accessibilityValue={{ text: formatWeightForSpeech(weight.grams) }}`, verified by `__tests__/weight-field.test.tsx` to announce "0,830 quilos" exactly as the success criteria require.
- **No `as` casts, no `any`, explicit return types on every exported function**, `readonly` props/interfaces throughout, and no boolean-flag-toggles-behavior functions — `selectUnit(unit)` is an intent function, not a `setKgMode(enabled: boolean)`.
- **Clean gates.** `pnpm typecheck` (0 errors), `rtk proxy npx biome check .` (0 issues), and `pnpm test` (79/79 suites, 500/500 tests — exactly the counts named in the review request) all pass.
- **E2E specs are consistent with the existing sequential flow.** The kg round-trip spec is inserted right after the existing swipe-to-delete spec, uses `addProductByInput`/existing helpers, and the follow-up "removes the kg item" spec cleans up fully via the same swipe-to-delete pattern before the "persists the list across an app restart" spec runs — no leftover state that would break later specs (verified by static read-through; not executed, no simulator available here).

## Standards Compliance

| Standard | Status |
| --- | --- |
| Code Standards | ⚠️ (method-size rule exceeded in `use-edit-item-form.ts`; one non-verb function name) |
| TypeScript/Node.js | ✅ |
| React Native | ✅ |
| Tests | ✅ |

## Recommendations

1. Change `PRICE_LABEL.unit` from `'Preço unitário'` to `'Preço'` to match PRD FR 2.2 and the task's own requirements bullet; update the one affected test assertion and the price input's `accessibilityLabel` to use `PRICE_LABEL[unit]` at the same time (folds Minor #1 into the same fix).
2. Before Task 5.0 adds the parts editor on top of `use-edit-item-form.ts`, extract the unit-switch/default-weight logic out of the hook body into standalone helper functions to bring it back under the 50-line method limit — Task 5.0 will otherwise inherit an already-over-budget hook and grow it further.
3. Rename `draftQuantityForUnit` to a verb-first name (e.g. `resolveDraftQuantity`).
4. Optional: tidy the AGENTS.md sentence describing the three sub-components for clarity.

## Verdict

**APPROVED WITH OBSERVATIONS.** All subtasks and Task tests are complete; correctness against the PRD/techspec is verified for every functional success criterion (defaults, resets, price preservation, identical rounding, disabled-toggle wiring, kg-only subtitle formatting, zero-code-change consumers proven by real integration tests). `pnpm typecheck`, `rtk proxy npx biome check .`, and `pnpm test` (79/500) all pass cleanly. The two Major findings — a copy-text mismatch against the PRD's literal price-label wording, and `use-edit-item-form.ts` exceeding the 50-line method-size rule — are both non-blocking, easily fixed, and do not affect correctness, safety, or test coverage. Recommend fixing both before or alongside Task 5.0, which will otherwise compound the second issue.
