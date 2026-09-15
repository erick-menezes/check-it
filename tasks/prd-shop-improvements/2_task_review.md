# Review: Task 2.0 - Total previsto: projection derivations and Shop header line

**Reviewer**: AI Code Reviewer
**Date**: 2026-09-15
**Task file**: 2_task.md
**Status**: APPROVED

## Summary

The task adds `getPendingPricedTotalInCents`, `getProjectedTotalInCents` and `getProjectedBudgetStatus` to `src/features/home/active-list.ts`, refactoring the 85%/100% threshold logic into a single private `getStatusForTotal(total, limitInCents)` shared by `getBudgetStatus`, `getBudgetRatio` and the new projected variant. The Shop header renders a "Previsto" second line under "No carrinho" (test IDs `shop-projection` / `shop-projection-{status}`) only when a pending priced item exists, `buildStatusLine` gains the "Previsto estoura em R$X" case with the correct precedence, and the chip's `accessibilityLabel` is extended. `budget-alerts.ts` is untouched, and a dedicated test proves the projection never influences notifications. All Task tests (unit, integration, E2E) were added as specified, `pnpm typecheck` is clean, `rtk proxy npx biome check .` reports 0 issues, and `pnpm test` passes 73/73 suites, 444/444 tests — matching the expected counts exactly. This is a small, faithful, well-tested implementation with no critical or major issues.

## Files Reviewed

| File | Status | Issues |
| --- | --- | --- |
| `src/features/home/active-list.ts` | ✅ OK | 0 |
| `src/features/shop/components/shop-header/helpers/index.ts` | ✅ OK | 0 |
| `src/features/shop/components/shop-header/index.tsx` | ✅ OK | 0 |
| `src/features/notifications/budget-alerts.ts` (verify-only, unmodified) | ✅ OK | 0 |
| `src/features/home/AGENTS.md`, `src/features/shop/AGENTS.md` | ✅ OK | 0 |
| `__tests__/active-list.test.ts` | ✅ OK | 0 |
| `__tests__/shop-header.test.tsx` | ✅ OK | 0 |
| `__tests__/budget-alerts.test.ts` | ✅ OK | 0 |
| `__tests__/shop-list-integration.test.tsx` | ✅ OK | 0 |
| `e2e/shop.test.js` | ✅ OK (static read-through only) | 0 |
| `tasks/prd-shop-improvements/2_task.md`, `tasks.md` | ✅ OK | 0 |

## Issues Found

### 🔴 Critical Issues

No critical issues found.

### 🟡 Major Issues

No major issues found.

### 🟢 Minor Issues

1. **`src/features/shop/components/shop-header/helpers/index.ts:1-9`** — `getPendingPricedTotalInCents` is both named-imported from `@/features/home/active-list` (to be used inside `buildStatusLine`) and separately re-exported from the same module in the next statement. This is valid ESM (the import binding and the re-export are independent), Biome is silent on it, and it is exactly what subtask 2.1 asked for ("re-export ... to keep existing imports working"), but a one-line comment or combining the two into `export { getPendingPricedTotalInCents } from '...'` plus a local `import` alias would read slightly cleaner for the next person. Not a defect.
2. **`src/features/shop/components/shop-header/index.tsx:36-38`** — `getProjectedTotalInCents(list)` and `getProjectedBudgetStatus(list)` are computed unconditionally even when `showProjection` is `false` (their results are simply unused by the JSX in that case). Cost is a cheap array reduce over the list, so this is a non-issue performance-wise, but computing them only inside the `showProjection` branch (or destructuring lazily) would be marginally tidier.

## ✅ Positive Highlights

- **Threshold logic correctly unified.** `getStatusForTotal(total, limitInCents)` is the single private helper behind `getBudgetStatus`, `getBudgetRatio`'s underlying ratio, and the new `getProjectedBudgetStatus` — exactly the technique specified in the techspec's "Projection is derived, never stored" decision. The refactor of `computeRatio` to take `(total, limitInCents)` instead of `(list)` is a clean, minimal generalization that keeps every call site correct.
- **`budget-alerts.ts` is genuinely unmodified** and confirmed to read only `getBudgetStatus(list)` (which is checked-total-only). The new test in `budget-alerts.test.ts` ("emits nothing when only the projection crosses 85%, not the checked total") is a real proof, not a tautology: it sets a limit of 10000, checks an item worth 3000 (30%, `onTrack`) while a pending priced item of 6000 would push the *projection* to 90% (`warning`) if the code under test read it. The test passing demonstrates the notification latch is driven strictly by the checked total.
- **Status-line precedence is verified end-to-end.** `shop-header.test.tsx` adds one test per branch of the new precedence (cart-over-limit → projection-over-limit → pending items → remaining budget), each with hand-computed cent values that line up correctly with `buildStatusLine`'s early returns and the shared threshold logic. The "projection over but cart still onTrack" case is the one most likely to regress silently, and it has a dedicated assertion of both the `shop-progress-onTrack` bar and the `shop-projection-overBudget` text together.
- **No regression on existing behavior.** The progress bar (`shop-progress-{status}` / `shop-progress-fill-{status}`), `getBudgetStatus`, `getBudgetRatio` and the notification latch all still key off `list.totalInCents` only; the full suite (73/73 suites, 444/444 tests, matching the expected count) passes with zero changes needed to any pre-existing assertion.
- **Colors and copy match existing tokens.** `getProjectionTextClass` reuses `text-checkit-accent` / `text-checkit-danger`, matching `BudgetBarFill`'s `STATUS_FILL_COLOR` hex values (`#F2B807` / `#E13E3E`) exactly — no new arbitrary hex was introduced, and the warning/over states carry the textual "Previsto R$X" / status-line cue rather than relying on color alone, per PRD FR 1.3.
- **Accessibility label matches the required format.** `chipAccessibilityLabel` appends `"Previsto R$ X de R$ Y"` only `showProjection` is true, verified literally in the new "includes the projection in the chip accessibility label when shown" test.
- **E2E specs correctly adapted to the sequential flow.** The new "shows the projected total while the priced item is still pending" spec runs after Arroz is priced (R$5,00 × 2 = R$10,00) and before it is checked, correctly expecting `shop-projection-onTrack` (R$10,00 / R$50,00 = 20%); the existing "reflects the checked item..." spec is extended in place to assert `shop-projection` becomes invisible once Arroz is checked and Feijão preto (unpriced) is the only other item — consistent with `showProjection = getPendingPricedTotalInCents(list) > 0`. State carried from `beforeAll`/prior `it` blocks (limit 5000, Arroz priced+qty 2, Feijão preto unpriced) is read correctly by both new/modified specs.
- **Documentation kept current and accurate.** Both `AGENTS.md` updates correctly describe the derivation formula, the shared `getStatusForTotal` helper, and the purely-visual nature of the projection relative to notifications.
- **Task tracking accurately corrected.** While marking subtasks complete, `2_task.md` also fixed a pre-existing typo (`shop-header.test.ts x` → `shop-header.test.tsx`) and rewrote the E2E bullet to describe what was actually implemented (adapted to the existing sequential flow where the second product has no price) rather than leaving a stale, inaccurate plan description.

## Standards Compliance

| Standard | Status |
| --- | --- |
| Code Standards | ✅ |
| TypeScript/Node.js | ✅ |
| React Native | ✅ |
| Tests | ✅ |

## Recommendations

1. Optional polish only: consider computing `getProjectedTotalInCents`/`getProjectedBudgetStatus` lazily inside the `showProjection` branch in `shop-header/index.tsx` to avoid the unused computation when the projection is hidden. Not blocking.
2. No other changes required before merging this task.

## Verdict

APPROVED. All subtasks and Task tests are complete and verified against the PRD/techspec requirements: the projection formula, its equality with `getListTotalInCents`, the shared threshold helper's four boundary cases (84.9%/85%/100%/100.01%) plus the `limitInCents <= 0` guard, the status-line precedence, and the untouched notification path are all covered by passing tests. `pnpm typecheck`, `rtk proxy npx biome check .` (0 issues) and `pnpm test` (73/73 suites, 444/444 tests) all pass. Safe to proceed to Task 3.0.
