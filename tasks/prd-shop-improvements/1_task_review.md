# Review: Task 1.0 - Domain model and store migration v2 (unit, parts, kg line total)

**Reviewer**: AI Code Reviewer
**Date**: 2026-09-15
**Task file**: 1_task.md
**Status**: APPROVED

## Summary

The task extends `ListItem` with `unit`/`parts`, encodes every new invariant inside `applyItemChanges`, adds the integer half-up kg rounding to `getLineTotalInCents`, introduces `src/lib/weight.ts`, and bumps the persisted active-list store to a version-aware v0→v1→v2 migration chain. The implementation matches the techspec's interfaces and key decisions closely, all named constants from the requirements are present, no `as` casts appear anywhere in the diff, and every consumer outside `list-item.ts`/`active-list.ts` (notifications, `getListTotalInCents`, `getCheckedTotalInCents`) is untouched and still only reads `getLineTotalInCents`/`totalInCents`. `pnpm typecheck`, `pnpm test` (428/428) and `rtk proxy npx biome check .` all pass cleanly.

## Files Reviewed

| File | Status | Issues |
| --- | --- | --- |
| `src/features/shop/list-item.ts` | ✅ OK | 0 |
| `src/lib/weight.ts` | ✅ OK | 0 |
| `src/features/home/active-list-store.ts` | ✅ OK | 0 |
| `src/features/home/active-list.ts` (verify-only) | ✅ OK | 0 |
| `src/features/notifications/budget-alerts.ts` (verify-only) | ✅ OK | 0 |
| `src/features/shop/AGENTS.md`, `src/features/home/AGENTS.md` | ✅ OK | 0 |
| `__tests__/list-item.test.ts` | ✅ OK | 0 |
| `__tests__/weight.test.ts` | ✅ OK | 0 |
| `__tests__/active-list-store.test.ts` | ✅ OK | 0 |
| `__tests__/active-list.test.ts` | ✅ OK | 0 |

## Issues Found

### 🔴 Critical Issues

No critical issues found.

### 🟡 Major Issues

No major issues found.

### 🟢 Minor Issues

1. **`src/features/shop/list-item.ts:77-78`** — `MAX_PRICE_PARTS` and `MIN_PART_QUANTITY` are exported but unused by any code in this task (no caller clamps a parts editor against them yet). This is expected forward-declaration for Task 5.0 (the parts editor UI) per the techspec's constant list, so it is not a defect, but worth flagging so the reviewer of Task 5.0 confirms these are actually wired in rather than re-declared.
2. **`src/features/shop/list-item.ts:232-234`** — the kg branch of `getLineTotalInCents` wraps across three lines inside a single return; purely stylistic, Biome is happy with it and it stays well under the 50-line function cap, so no action needed.

## ✅ Positive Highlights

- **Invariants centralized correctly.** `applyItemChanges` is the single place where unit-switch defaults, weight clamping, and parts-forces-unit/quantity/price all live, exactly as required. `resolveQuantityForUnitSwitch`, `resolveParts`, `resolvePrice`, `resolveCategory`, and `applyPartsChanges` keep every function small, single-purpose, and verb-named.
- **Rounding rule is pure integer math.** `Math.floor((item.unitPriceInCents * item.quantity + HALF_KG_IN_GRAMS) / GRAMS_PER_KG)` matches the spec's half-up rule exactly and the full rounding table from the task (`2990×830→2482`, `1000×500→500`, `1×1→0`, priceless→`0`) is pinned in `list-item.test.ts` and passes.
- **Migration chain is version-aware and type-guarded.** `migrateActiveList(persisted, version)` branches cleanly on `LEGACY_UNVERSIONED`, threading through `migrateListShapeV0ToV1` → `isStoredListV1` → `migrateItemsToV2`, with no `as` casts anywhere — every narrowing uses a proper `value is T` guard. Malformed payloads at any step degrade to `{ activeList: null }` via `failMigration`, which now also names the stored version in the `console.warn`, per the requirement.
- **No silent breakage of other consumers.** `getListTotalInCents`, `getCheckedTotalInCents`, `getCategoryBreakdown`, `getTopItems` and `budget-alerts.ts` all continue to read exclusively through `getLineTotalInCents`/`totalInCents`/`limitInCents` — none of them had to change, confirming the "no ripple" design goal from the PRD.
- **Test coverage matches the Task tests list precisely.** `list-item.test.ts` covers defaults, unit-switch defaults/clamping, price preservation, parts derivation (including the "ignores conflicting fields" case), the full rounding table, and the new helpers. `active-list-store.test.ts` adds the v1→v2 fill-with-unchanged-total case, the v0→v2 chain, the malformed-payload case, and `updateItem` with `parts` persisting the derived price. `active-list.test.ts`'s fixture update is minimal and correct. `home-tabs-integration.test.tsx` was correctly left unmodified (verify-only), as the task specifies.
- **Documentation kept current.** Both `AGENTS.md` updates accurately describe the reinterpreted `quantity`-as-grams field, the parts invariant, and the new migration chain, keeping institutional knowledge in sync with the code.

## Standards Compliance

| Standard | Status |
| --- | --- |
| Code Standards | ✅ |
| TypeScript/Node.js | ✅ |
| React | ✅ (not applicable — no React/UI changes in this task) |
| Tests | ✅ |

## Recommendations

1. When Task 5.0 (parts editor UI) lands, confirm it actually imports and uses `MAX_PRICE_PARTS`/`MIN_PART_QUANTITY` from `list-item.ts` rather than re-declaring equivalent constants locally.
2. No other changes required before merging this task.

## Verdict

APPROVED. All subtasks and Task tests are complete and verified against the PRD/techspec requirements. `pnpm typecheck`, `pnpm test` (428/428 passing) and Biome lint (0 issues) all pass. The implementation is a faithful, minimal, well-factored realization of the techspec's domain model and migration design, with no critical or major issues. Safe to proceed to Task 2.0.
