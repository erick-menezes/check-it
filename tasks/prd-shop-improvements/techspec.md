# Technical specification

## Executive summary

Block 1 is an evolution of the existing item model, not a new subsystem. `ListItem` gains two fields — `unit` (`'unit' | 'kg'`) and `parts` (`PricePart[] | null`) — and the pure domain layer (`list-item.ts`, `active-list.ts`) absorbs every rule: line totals for kg items (integer grams, half-up rounding in integer arithmetic), the sum-of-parts invariant, and the projected total. Everything else stays a consumer of `getLineTotalInCents` and `unitPriceInCents`, which is what keeps Summary, sort, search, notifications and the future history snapshot untouched. The persisted store bumps to version 2 with a version-aware migration that fills `unit: 'unit'` and `parts: null`.

On the UI side the work concentrates in two places. The Shop header gets a derived "Previsto" line with its own visual status, computed from the same 85%/100% thresholds but never written to the store or fed to the notification latch. The Edit Item sheet is decomposed — it is already near the 300-line component limit — into a draft-state hook plus small sub-components (unit toggle, weight field, parts editor) that share one generic cents-fill digits hook extracted from `usePriceInput`. No new native dependencies; no dev-client rebuild.

## System architecture

### Component overview

**Domain (pure, no React)**

- `src/features/shop/list-item.ts` — *modified.* Owns `ItemUnit`, `PricePart`, the extended `ListItem`, `createListItem`, `applyItemChanges` (now unit- and parts-aware), `getLineTotalInCents` (kg branch), and new helpers `getPartsTotalInCents`, `getPartsCount`, `isKgItem`, `hasParts`.
- `src/lib/weight.ts` — *new.* Framework-agnostic grams ↔ display helpers (`formatWeight(grams)` → `0,830 kg`, `formatWeightForSpeech`), mirroring `src/lib/currency.ts`.
- `src/lib/digits-input.ts` — *new.* Generic cents-fill mechanic: pure `sanitizeDigits`, `digitsToInteger`, `integerToDigits` plus `useDigitsInput({ initialValue, maxDigits })`. `usePriceInput` becomes a thin wrapper; a new `useWeightInput` is a second wrapper. `useLimitInput` is not touched.
- `src/features/home/active-list.ts` — *modified.* Gains `getProjectedTotalInCents`, `getPendingPricedTotalInCents` (moved here from the header helpers, it is a list-level derivation) and `getProjectedBudgetStatus`, reusing the existing ratio thresholds via a shared `getStatusForTotal(total, limit)`.
- `src/features/home/active-list-store.ts` — *modified.* `PERSIST_VERSION = 2`, version-aware `migrateActiveList(persisted, version)`.

**Shop header**

- `shop-header/index.tsx` — *modified.* Renders the projection line under "No carrinho", extends the chip's `accessibilityLabel`.
- `shop-header/helpers/index.ts` — *modified.* `buildStatusLine` gains the projected-over case; `getPendingPricedTotalInCents` is re-exported from `active-list` for backward compatibility of tests.

**Item row**

- `item-row/helpers/index.ts` — *modified.* `formatSubtitle` branches on parts → kg → default.

**Edit Item sheet** (folder `edit-item-sheet/`)

- `use-edit-item-form.ts` — *new.* Holds the draft (`name`, `unit`, `quantity`, `grams`, `priceDigits`, `parts`, `category`), exposes intent functions (`selectUnit`, `enableParts`, `disableParts`, `addPart`, `updatePart`, `removePart`, `buildChanges`) and derived values (`totalInCents`, `canSave`).
- `components/edit-item-form.tsx` — *modified.* Becomes composition only.
- `components/unit-toggle.tsx`, `components/quantity-stepper.tsx` (extracted from the current form), `components/weight-field.tsx`, `components/price-parts-editor.tsx`, `components/price-part-row.tsx` — *new.*

**Data flow.** Sheet draft → `buildChanges()` → `UpdateItemChanges` → store `updateItem` → `applyItemChanges` (normalizes unit/quantity, derives price from parts) → `recomputeTotals` → persisted. Header and row read the list and derive projection/labels on render; nothing about projection or parts is stored beyond the item itself.

## Implementation design

### Main interfaces

```ts
// src/features/shop/list-item.ts
export type ItemUnit = 'unit' | 'kg';

export function getLineTotalInCents(item: ListItem): number;
export function getPartsTotalInCents(parts: readonly PricePart[]): number;
export function getPartsCount(parts: readonly PricePart[]): number;
export function applyItemChanges(item: ListItem, changes: UpdateItemChanges): ListItem;

// src/features/home/active-list.ts
export function getProjectedTotalInCents(list: ActiveList): number;
export function getPendingPricedTotalInCents(list: ActiveList): number;
export function getProjectedBudgetStatus(list: ActiveList): BudgetStatus;

// src/lib/digits-input.ts
export interface DigitsInput {
  readonly value: number;      // integer (cents or grams)
  readonly digits: string;
  readonly hasValue: boolean;
  setDigits: (raw: string) => void;
}
export function useDigitsInput(options: DigitsInputOptions): DigitsInput;

// src/features/shop/components/edit-item-sheet/use-edit-item-form.ts
export interface EditItemFormState {
  readonly draft: EditItemDraft;
  readonly totalInCents: number;
  readonly canSave: boolean;
  readonly saveHint: string | null;
  selectUnit: (unit: ItemUnit) => void;
  enableParts: () => void;
  disableParts: () => void;
  addPart: () => void;
  updatePart: (partId: string, changes: PricePartDraftChanges) => void;
  removePart: (partId: string) => void;
  buildChanges: () => UpdateItemChanges;
}
```

Rules encoded in `applyItemChanges` (the single place the invariants live):

- `unit` switching to `'kg'` without an explicit `quantity` sets `DEFAULT_WEIGHT_IN_GRAMS`; switching to `'unit'` sets `MIN_QUANTITY`.
- `quantity` is normalized per unit: units → `≥ MIN_QUANTITY`, kg → clamped to `[MIN_WEIGHT_IN_GRAMS, MAX_WEIGHT_IN_GRAMS]`, always truncated to an integer.
- A non-null `parts` forces `unit: 'unit'`, `quantity: 1` and `unitPriceInCents = getPartsTotalInCents(parts)`, ignoring any `unitPriceInCents` in the same change. `parts: null` keeps whatever `unitPriceInCents` the change carries (the sheet passes the sum for "Voltar a preço único").
- Line total: `unit` → `price × quantity`; `kg` → `floor((price × grams + HALF_KG_IN_GRAMS) / GRAMS_PER_KG)` — half-up in pure integer arithmetic, no float division.

### Data models

```ts
export interface PricePart {
  readonly id: string;               // createId(); stable key for rows
  readonly label: string | null;
  readonly unitPriceInCents: number; // > 0
  readonly quantity: number;         // ≥ 1
}

export interface ListItem {
  readonly id: string;
  readonly name: string;
  readonly unit: ItemUnit;           // NEW, default 'unit'
  readonly quantity: number;         // units, or integer grams when unit === 'kg'
  readonly unitPriceInCents: number | null; // price per unit or per kg; sum of parts when parts !== null
  readonly parts: readonly PricePart[] | null; // NEW, default null
  readonly category: Category | null;
  readonly checked: boolean;
  readonly createdAt: string;
}

export interface UpdateItemChanges {
  readonly name?: string;
  readonly unit?: ItemUnit;
  readonly quantity?: number;
  readonly unitPriceInCents?: number | null;
  readonly parts?: readonly PricePart[] | null;
  readonly category?: Category | null;
}
```

Named constants (in `list-item.ts` unless noted): `GRAMS_PER_KG = 1000`, `HALF_KG_IN_GRAMS = 500`, `MIN_WEIGHT_IN_GRAMS = 1`, `MAX_WEIGHT_IN_GRAMS = 999_999`, `DEFAULT_WEIGHT_IN_GRAMS = 1000`, `MAX_PRICE_PARTS = 12`, `MIN_PART_QUANTITY = 1`; `MAX_WEIGHT_DIGITS = 6` and `WEIGHT_DECIMALS = 3` in `weight.ts`/`useWeightInput`.

Persisted shape (`checkit:active-list`, version 2): identical to v1 plus the two item fields. Migration branches on the `version` argument: `0` → run the existing v0 path then the v1→v2 fill; `1` → map every item to `{ ...item, unit: 'unit', parts: null }`. Any malformed payload still degrades to `{ activeList: null }` with a `console.warn`, as today. `recomputeTotals` runs on the next mutation, and since every migrated item is a unit item with the same price, `totalInCents` is unchanged.

Sheet draft (in-memory only):

```ts
interface PricePartDraft {
  readonly id: string;
  readonly label: string;
  readonly priceDigits: string;   // parsed with digitsToInteger on save
  readonly quantity: number;
}
```

### API endpoints

Not applicable — the app is fully local with no network layer.

## Integration points

None. No external services; the feature does not add native modules, permissions or storage keys.

## Testing approach

### Unit tests

All in the flat root `__tests__/` folder, following the existing naming.

- `list-item.test.ts` (new): `createListItem` defaults; `applyItemChanges` unit switch defaults and clamping; parts force unit/quantity/price; `getLineTotalInCents` kg rounding table (`2990 × 830 → 2482`, exact half `1000 × 500 → 500`, `1 × 1 → 0`, priceless → 0); `getPartsTotalInCents` / `getPartsCount`.
- `active-list.test.ts` (extend): projection equals checked + pending priced; equals `getListTotalInCents`; `getProjectedBudgetStatus` at 84.9/85/100/100.01 %; `limitInCents <= 0` → `onTrack`.
- `active-list-store.test.ts` (extend): v1 payload migrates to v2 with `unit`/`parts` on every item and identical `totalInCents`; v0 payload still migrates; malformed payload → `null`; `updateItem` with `parts` persists the derived price.
- `digits-input.test.ts` (new) + `use-price-input.test.ts` (keep green): pure helpers and the hook; `useWeightInput` caps at 6 digits and formats `830 → 0,830 kg`.
- `weight.test.ts` (new): `formatWeight`, `formatWeightForSpeech`.
- `shop-header.test.tsx` (extend): projection hidden when no pending priced item; shown with `shop-projection-warning` / `shop-projection-overBudget`; status line precedence; progress bar and chip label unchanged for checked total.
- `item-row.test.tsx` (extend): subtitle for kg, parts and default items.
- `edit-item-sheet.test.tsx` (extend) and new `unit-toggle.test.tsx`, `weight-field.test.tsx`, `price-parts-editor.test.tsx`, `use-edit-item-form.test.ts`: toggle hides stepper/shows weight; default `1,000 kg`; "Somar vários" pre-fills first part with the current price; save disabled with hint while a part lacks a price; empty rows dropped; "Voltar a preço único" keeps the sum; toggle unavailable while parts exist.
- `budget-alerts.test.ts` (extend with one guard): a list whose projection crosses 85% but whose checked total does not emits nothing.

No mocks beyond the shared `test-utils/mocks.tsx`; nothing external is exercised.

### Integration tests

- `shop-list-integration.test.tsx` (extend): add "Alcatra" → edit → kg → weight → price → row and header reflect the rounded line total and the projection; check the item → projection disappears, cart total updates.
- `shop-summary-integration.test.tsx` (extend): a kg item and a conjunto flow into Summary's total, category breakdown and top items through `getLineTotalInCents` only.
- `home-tabs-integration.test.tsx` (verify only): Home's active-list card unchanged after a v2 migration.

### E2E tests

Detox (`e2e/shop.test.js`, iOS simulator via `pnpm e2e:build && pnpm e2e:test`) — this is a React Native app, so the template's `playwright-cli` step does not apply. Three new specs, all using existing IDs plus the new ones listed under *Key decisions*:

1. Projection: add two priced items, check one → `shop-projection` visible; check the other → hidden.
2. Kg round-trip: `edit-unit-kg` → `edit-weight-input` types `830` → `edit-price-input` types `2990` → save → row subtitle `0,830 kg × R$ 29,90/kg`, total `R$ 24,82`.
3. Conjunto round-trip: `edit-parts-enable` → two part prices → save → subtitle `2 itens · …`; reopen → `edit-parts-disable` → save → plain subtitle with the same price.

## Development sequencing

### Build order

1. **Domain model + constants** (`list-item.ts`, `weight.ts`) with `list-item.test.ts` — everything else depends on the shape and the rounding rule.
2. **Store migration to v2** (`active-list-store.ts`) — unblocks running the app against existing data early.
3. **Projection derivations** in `active-list.ts` + header changes (`shop-header`, helpers) — independent of the sheet; ships the smallest visible win first.
4. **Generic digits hook** (`digits-input.ts`, `usePriceInput` wrapper, `useWeightInput`) — prerequisite for the sheet.
5. **Sheet decomposition**: extract `quantity-stepper` and `use-edit-item-form` with no behavior change (tests stay green), then add `unit-toggle` + `weight-field`, then `price-parts-editor`.
6. **Item row subtitle** — last, once both kg and parts exist.
7. **Integration + Detox specs**, `AGENTS.md` updates for `shop` and `home`.

### Technical dependencies

- None external. Requires the existing dev client (no native rebuild).
- Block 2 (history) should start after step 1 lands so snapshots carry `unit`/`parts`.

## Monitoring and observability

There is no backend, metrics pipeline or dashboards; observability is local and test-driven.

- Keep the existing `console.warn` on migration/rehydration failure and add the stored version to the message so a bug report can say which path failed.
- Invariant checks live in unit tests, not runtime asserts: `parts !== null ⇒ unit === 'unit' && quantity === 1 && price === sum`, `unit === 'kg' ⇒ 1 ≤ quantity ≤ MAX_WEIGHT_IN_GRAMS`.
- `pnpm typecheck`, `pnpm lint` and `pnpm test` are the gates; the Play alpha track provides qualitative feedback.

## Technical considerations

### Key decisions

- **Reinterpret `quantity` as grams under `unit: 'kg'`** instead of a second field or a discriminated union. One field means a trivial migration and an unchanged `SavedList` snapshot later; the semantics are guarded by domain helpers and by the row/sheet being the only readers of `quantity` outside `getLineTotalInCents`. A union was rejected because every `item.quantity` read (form, row, tests) would need narrowing for little safety gain in a model this small.
- **Parts as `readonly PricePart[] | null`** (not optional) to match how `category` and `unitPriceInCents` express absence and to keep the `'field' in changes` update pattern.
- **Price derivation from parts happens in `applyItemChanges`**, not in the sheet, so the invariant cannot be bypassed by a future caller (e.g. Block 5's autocomplete).
- **Integer half-up rounding** (`floor((p × g + 500) / 1000)`) avoids float division entirely; it is documented once in `list-item.ts`.
- **Projection is derived, never stored.** `getProjectedBudgetStatus` shares the threshold constants with `getBudgetStatus` through a private `getStatusForTotal`; `budget-alerts.ts` is untouched and keeps reading `totalInCents`.
- **Header layout:** "Previsto" is a second line under "No carrinho"; the top row and the progress bar keep their current semantics and test IDs.
- **Generic `useDigitsInput`** replaces duplicating the sanitize/parse logic a third time; `useLimitInput` is intentionally left alone (scope).
- **Sheet decomposition** into a hook + sub-components is required by the 300-line component rule; the extraction step is done first with zero behavior change to keep the existing sheet tests as the safety net.
- **Test IDs (new, kebab-case, stable):** `shop-projection`, `shop-projection-{status}`, `edit-unit-unit`, `edit-unit-kg`, `edit-weight-input`, `edit-parts-enable`, `edit-parts-disable`, `edit-part-add`, `edit-part-row-{id}`, `edit-part-label-{id}`, `edit-part-price-{id}`, `edit-part-qty-increment-{id}`, `edit-part-qty-decrement-{id}`, `edit-part-remove-{id}`, `edit-save-hint`. All existing IDs (`edit-price-input`, `edit-qty-*`, `shop-progress-*`, `shop-status-line`) are preserved.

### Known risks

- **Silent misuse of `quantity` for kg items** by future code (e.g. a "Nx" label in history). Mitigation: `formatSubtitle`/`formatWeight` are the only formatters, `AGENTS.md` documents the rule, and `list-item.test.ts` pins it.
- **Sheet keyboard/scroll behavior** with the parts editor growing inside `BottomSheet`. Mitigation: verify with the existing `use-keyboard-height` handling early in step 5; cap parts at `MAX_PRICE_PARTS`.
- **Migration ordering**: the current `migrate` ignores the `version` argument. Rewriting it as a v0→v1→v2 chain must keep the v0 test green.
- **React Compiler + per-row hooks**: part rows must not create hooks conditionally; the draft (including `priceDigits`) lives in `use-edit-item-form`, rows are presentational.
- **Float creep in sums of parts**: all sums are integer cents; `getPartsTotalInCents` must never divide.

### Rules compliance

- `.claude/rules/code-standards.md` — named constants for every magic number (`GRAMS_PER_KG`, `MAX_PRICE_PARTS`…); intent functions instead of flag parameters (`selectUnit('kg')`, `enableParts()`/`disableParts()` rather than `setParts(enabled: boolean)`); early returns in `applyItemChanges` and `buildStatusLine`; no blank lines inside function bodies; functions ≤ 50 lines (the parts normalization gets its own helper).
- `.claude/rules/typescript-standards.md` — `ItemUnit` as a union, not an enum; `readonly` on all models; explicit return types on exports; type guards (no `as`) in the migration; `null` for absence consistent with the existing model.
- `.claude/rules/react-native-standards.md` — components ≤ 300 lines (hence the sheet split); `className` only; `useCallback` for callbacks into the memoized `ItemRow`; stable keys from `PricePart.id`, never the index; RNTL tests for every new component.
- **Project conventions (`AGENTS.md`)** — `Text`/`TextInput` from `@/components/ui/text`; shared mocks from `test-utils/mocks.tsx`; kebab-case stable test IDs; persisted change ⇒ version bump + migration.
- **Deviation:** the template's E2E step names `playwright-cli`; this repo's E2E stack is Detox, so Detox specs are specified instead.

### Skills compliance

- `create-tasks` — next step: derive the task list from this spec following the build order above.
- `execute-task` / `execute-review` / `execute-qa` — per-task implementation, review and QA loop.
- `create-github-commit` / `create-github-pull-request` — Conventional Commits, English, PR template.

### Relevant and dependent files

```
src/features/shop/list-item.ts                                   (modify)
src/features/shop/AGENTS.md                                      (update)
src/features/shop/use-price-input.ts                             (thin wrapper)
src/features/shop/use-weight-input.ts                            (new)
src/features/shop/use-visible-items.ts                           (verify only)
src/features/shop/components/shop-header/index.tsx               (modify)
src/features/shop/components/shop-header/helpers/index.ts        (modify)
src/features/shop/components/item-row/helpers/index.ts           (modify)
src/features/shop/components/edit-item-sheet/index.tsx           (unchanged)
src/features/shop/components/edit-item-sheet/use-edit-item-form.ts            (new)
src/features/shop/components/edit-item-sheet/components/edit-item-form.tsx     (modify)
src/features/shop/components/edit-item-sheet/components/unit-toggle.tsx        (new)
src/features/shop/components/edit-item-sheet/components/quantity-stepper.tsx   (new, extracted)
src/features/shop/components/edit-item-sheet/components/weight-field.tsx       (new)
src/features/shop/components/edit-item-sheet/components/price-parts-editor.tsx (new)
src/features/shop/components/edit-item-sheet/components/price-part-row.tsx     (new)
src/features/home/active-list.ts                                 (modify)
src/features/home/active-list-store.ts                           (modify, v2)
src/features/home/AGENTS.md                                      (update)
src/features/notifications/budget-alerts.ts                      (unchanged, guard test)
src/lib/digits-input.ts                                          (new)
src/lib/weight.ts                                                (new)
src/lib/currency.ts                                              (reuse)
__tests__/list-item.test.ts, active-list.test.ts, active-list-store.test.ts,
__tests__/digits-input.test.ts, weight.test.ts, use-price-input.test.ts,
__tests__/shop-header.test.tsx, item-row.test.tsx, edit-item-sheet.test.tsx,
__tests__/unit-toggle.test.tsx, weight-field.test.tsx, price-parts-editor.test.tsx,
__tests__/use-edit-item-form.test.ts, shop-list-integration.test.tsx,
__tests__/shop-summary-integration.test.tsx, budget-alerts.test.ts
e2e/shop.test.js                                                 (extend)
DESIGN.md, ROADMAP.md, tasks/prd-shop-improvements/prd.md        (reference)
```
