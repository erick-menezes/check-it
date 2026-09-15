# Task 1.0: Domain model and store migration v2 (unit, parts, kg line total)

## Overview

Extend the pure item model with `unit` and `parts`, encode every new invariant in `applyItemChanges` and `getLineTotalInCents`, add the framework-agnostic weight helpers, and bump the persisted active-list store to version 2 with a version-aware migration. After this task the app runs against existing data with no visible change, and every later task is a consumer of these functions.

<skills>
### Skills compliance

- `execute-task` — implement following the techspec and project rules.
- `execute-review` — code review before marking complete.
- `create-github-commit` — Conventional Commits, English, title only.
</skills>

<requirements>
- `ListItem` gains `unit: ItemUnit` (`'unit' | 'kg'`, default `'unit'`) and `parts: readonly PricePart[] | null` (default `null`); `UpdateItemChanges` gains `unit?` and `parts?`.
- When `unit === 'kg'`, `quantity` holds integer grams (techspec *Key decisions*).
- Invariants live only in `applyItemChanges`: kg default weight and clamping, unit-switch defaults, `parts` forcing `unit: 'unit'`, `quantity: 1` and `unitPriceInCents = getPartsTotalInCents(parts)`.
- Kg line total uses integer half-up rounding: `floor((price × grams + HALF_KG_IN_GRAMS) / GRAMS_PER_KG)`; no float division anywhere.
- All magic numbers are named constants (`GRAMS_PER_KG`, `HALF_KG_IN_GRAMS`, `MIN_WEIGHT_IN_GRAMS`, `MAX_WEIGHT_IN_GRAMS`, `DEFAULT_WEIGHT_IN_GRAMS`, `MAX_PRICE_PARTS`, `MIN_PART_QUANTITY`).
- `PERSIST_VERSION = 2`; `migrateActiveList(persisted, version)` branches on `version` (v0 → v1 → v2 chain); malformed payloads still degrade to `{ activeList: null }` with a `console.warn` that includes the stored version.
- Migrated lists keep the same `totalInCents`.
- No `as` casts in the migration; use type guards. `readonly` everywhere; explicit return types on exports.
</requirements>

## Subtasks

- [x] 1.1 Add `ItemUnit`, `PricePart`, the new `ListItem`/`NewItemInput`/`UpdateItemChanges` fields and the named constants to `src/features/shop/list-item.ts`.
- [x] 1.2 Update `createListItem` (defaults) and `applyItemChanges` (unit-aware quantity normalization, unit-switch defaults, parts derivation) — split normalization into helpers so each function stays ≤ 50 lines.
- [x] 1.3 Implement the kg branch of `getLineTotalInCents`, plus `getPartsTotalInCents`, `getPartsCount`, `isKgItem`, `hasParts`.
- [x] 1.4 Create `src/lib/weight.ts` with `formatWeight(grams)` (`0,830 kg`) and `formatWeightForSpeech(grams)` (`0,830 quilos`).
- [x] 1.5 Bump `src/features/home/active-list-store.ts` to version 2 with the version-aware migration chain.
- [x] 1.6 Update `src/features/shop/AGENTS.md` ("What lives here" and "Invariants") and `src/features/home/AGENTS.md` (store version) to describe `unit`, grams-in-`quantity` and `parts`.
- [x] 1.7 Write the unit tests listed under *Task tests*; run `pnpm typecheck`, `pnpm lint`, `pnpm test`.

## Implementation design

See `techspec.md` → *Implementation design › Main interfaces*, *Data models* (constants, migration shape) and *Key decisions* (reinterpreting `quantity`, parts as `| null`, integer rounding).

## Success criteria

- Every existing test stays green; the app cold-starts against a v1 payload with identical Home/Shop totals.
- `getLineTotalInCents` rounding table passes: `2990 × 830 g → 2482`, `1000 × 500 g → 500`, `1 × 1 g → 0`, priceless → `0`.
- `applyItemChanges` with `parts` yields `unit === 'unit'`, `quantity === 1`, price equal to the sum, regardless of a conflicting `unitPriceInCents` in the same change.
- Switching to `kg` without a quantity yields `DEFAULT_WEIGHT_IN_GRAMS`; switching to `unit` yields `MIN_QUANTITY`; price preserved across switches.
- No floating-point value appears in any persisted item (`Number.isInteger` on `quantity`, `unitPriceInCents`, part fields).

## Task tests

- [x] Unit tests — `__tests__/list-item.test.ts` (new: defaults, normalization, unit switch, parts derivation, rounding table, helpers), `__tests__/weight.test.ts` (new), `__tests__/active-list-store.test.ts` (extend: v1 → v2 fills `unit`/`parts` on every item with unchanged `totalInCents`; v0 → v2 still works; malformed → `null`; `updateItem` with `parts` persists the derived price), `__tests__/active-list.test.ts` (existing suite stays green — fixture updated to carry `unit`/`parts`).
- [x] Integration tests — `__tests__/home-tabs-integration.test.tsx` (verified: passes unmodified after the migration).
- [x] E2E tests — not applicable (no UI change).

## Relevant files

- `src/features/shop/list-item.ts`
- `src/lib/weight.ts` (new)
- `src/lib/currency.ts` (reference pattern)
- `src/features/home/active-list.ts` (consumer; no change expected)
- `src/features/home/active-list-store.ts`
- `src/features/shop/AGENTS.md`, `src/features/home/AGENTS.md`
- `__tests__/list-item.test.ts` (new), `__tests__/weight.test.ts` (new), `__tests__/active-list-store.test.ts`, `__tests__/active-list.test.ts`
