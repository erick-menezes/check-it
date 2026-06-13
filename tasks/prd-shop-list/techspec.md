# Technical specification

## Executive summary

The Shop List feature replaces the `/shop` stub with the real Passo 2 de 2 screen, adds a `/summary` route, and makes receipt scanning functional. Architecturally it is an extension of the existing persisted zustand store: the `ActiveList` model grows an `items` array (with nullable category and price), and every mutation flows through new store actions that recompute the denormalized `totalInCents` (checked items) and `itemCount` before persisting — so Home's active-list card and the budget-alerts subscription keep working with zero changes. All money stays in integer cents through the existing `src/lib/currency.ts` formatters.

Receipt scanning composes `expo-camera`'s `CameraView` (preview + capture inside the Receipt sheet) with `@react-native-ml-kit/text-recognition` for fully on-device OCR, followed by a pure-TypeScript cupom-fiscal line parser that converts recognized text into list items. Bottom sheets (Edit Item, Sort, Receipt) and the confirm dialog are built in-house on React Native `Modal` + `react-native-reanimated` (both already installed); swipe-to-delete uses `ReanimatedSwipeable` from `react-native-gesture-handler`. No new state libraries, no network dependency.

## System architecture

### Component overview

**Modified:**

- `src/features/home/active-list.ts` — `ActiveList` gains `readonly items: readonly ListItem[]`; new pure functions: `addItem`, `toggleItem`, `setAllChecked`, `updateItem`, `removeItem`, `renameList`, plus selectors `getCheckedTotalInCents`, `getPendingSummary`, `getCategoryBreakdown`, `getTopItems`. `getBudgetStatus`/`getBudgetRatio` unchanged.
- `src/features/home/active-list-store.ts` — gains item-level actions that wrap the pure functions and persist recomputed totals; persistence `version` bumps 0 → 1 with a `migrate` that adds `items: []` to a stored v0 list.
- `src/app/shop.tsx` — stub replaced by the real Shop List screen.
- `tailwind.config.js` — category palette added with English `[category]-label-color` tokens under `checkit` (`grocery-label-color` `#F2B807`, `produce-label-color` `#58AB6A`, `butcher-label-color` `#E13E3E`, `hygiene-label-color` `#5180F9`, `cleaning-label-color` `#7A5AE0`, `drinks-label-color` `#3DA9C7`, `other-label-color` `#8A8A8A`) plus 18% tint variants.

**New — shared UI (`src/components/ui/`):**

- `bottom-sheet.tsx` — reusable sheet: RN `Modal`, 24 px top corners, drag handle, `rgba(0,0,0,.45)` backdrop (dismiss on press), 280 ms reanimated translate-up.
- `confirm-dialog.tsx` — centered dialog with tinted icon tile, ghost cancel + filled confirm (danger/primary tones). Used by item removal and list deletion.

**New — shop feature (`src/features/shop/`):**

- `list-item.ts` — `ListItem` model, `Category` union (English values), category metadata map carrying the pt-BR display label ("Mercearia", "Hortifruti", …), hex token and icon per category.
- `suggestions.ts` — static curated suggestion list behind a `getSuggestions(): readonly string[]` function so a history-based source can replace it post-auth.
- `use-visible-items.ts` — derives the rendered list: search filter (case-insensitive substring) + sort (`SortOption` union of the five options; never mutates stored order).
- `use-price-input.ts` — cents-fill digit input for the edit sheet (same pattern as `use-limit-input`).
- `receipt-parser.ts` — pure function from OCR lines to parsed items (see Integration points).
- `use-receipt-scan.ts` — scan state machine (discriminated union: `idle → capturing → processing → success(count) | error`) orchestrating permission, capture, OCR call and parser.
- `components/` — `shop-header` (editable title + translucent budget chip + progress + status line), `add-product-input` (+ `suggestions-box`), `action-row` (sort label button + camera shortcut), `search-field`, `mark-all-row`, `item-row` (card row wrapped in `ReanimatedSwipeable` with crimson "Excluir" underlay), `edit-item-sheet`, `sort-sheet`, `receipt-sheet` (hosts `CameraView`), `empty-state`, `summary-preview-card`, `delete-list-button`.

**New — summary feature (`src/features/summary/`):**

- `src/app/summary.tsx` route; `components/summary-total-tile`, `stacked-category-bar` (single bar + legend, ordered by amount desc, "Sem categoria" in Slate Gray), `top-items-list`.

**Data flow:** UI event → store action → pure mutation + total recompute → zustand `persist` writes AsyncStorage → all subscribers (shop screen, Home card, budget-alerts) re-render/re-evaluate from the same state. Search/sort live in screen-local state and only shape the visible array. The Summary screen reads the same store and computes its breakdowns with the selectors.

## Implementation design

### Main interfaces

```typescript
interface ActiveListStoreState {
  activeList: ActiveList | null;
  hasHydrated: boolean;
  setActiveList: (list: ActiveList | null) => void;
  addItem: (name: string) => void;
  addItems: (items: readonly NewItemInput[]) => void; // receipt import
  toggleItem: (itemId: string) => void;
  setAllChecked: (checked: boolean) => void;
  updateItem: (itemId: string, changes: UpdateItemChanges) => void;
  removeItem: (itemId: string) => void;
  renameList: (name: string) => void;
  deleteList: () => void;
}

function parseReceiptLines(lines: readonly string[]): ParsedReceiptItem[];

interface ReceiptScanState {
  /* discriminated union: idle | capturing | processing | success | error */
}
```

### Data models

```typescript
type Category =
  | "grocery"
  | "produce"
  | "butcher"
  | "hygiene"
  | "cleaning"
  | "drinks"
  | "other";

interface ListItem {
  readonly id: string; // createId() from @/lib/id
  readonly name: string;
  readonly quantity: number; // integer ≥ 1
  readonly unitPriceInCents: number | null; // null = "sem preço", contributes 0
  readonly category: Category | null; // null = "Sem categoria"
  readonly checked: boolean;
  readonly createdAt: string; // ISO; "Ordem de adição" sort key
}

interface ActiveList {
  // existing fields unchanged; totalInCents now = Σ checked (price × qty)
  readonly items: readonly ListItem[];
}

interface ParsedReceiptItem {
  readonly name: string;
  readonly quantity: number;
  readonly unitPriceInCents: number;
}
```

Persisted schema: zustand `persist` key `checkit:active-list`, version 1. `migrate(persisted, 0)` returns the list with `items: []` (a v0 list is always empty — `itemCount` was never non-zero in production flows).

### API endpoints

Not applicable — the feature is fully local/offline; there is no backend.

## Integration points

- **Camera — `expo-camera` (SDK 56):** `CameraView` rendered inside the Receipt sheet's preview area; `useCameraPermissions` drives the permission flow. Denied state renders an in-sheet explanation with a button calling `Linking.openSettings()`. Capture via `takePictureAsync` after `onCameraReady` (never while preview is paused — Android throws). `app.json` gains the camera permission/plugin config with pt-BR `NSCameraUsageDescription`. Photos go to the app cache and are deleted after recognition.
- **OCR — `@react-native-ml-kit/text-recognition`:** on-device Google ML Kit Latin recognizer on both platforms (consistent pt-BR behavior, works offline). Called with the captured photo URI; returns blocks/lines consumed by the parser. Requires `expo prebuild` (already part of the e2e workflow). Failure modes: recognition throws or returns no lines → `use-receipt-scan` transitions to `error` with retry; nothing touches the store.
- **Parser contract:** `receipt-parser.ts` targets the common cupom fiscal/NFC-e item grammar — an item line (`001 7891234567890 ARROZ TIPO1 5KG`) followed by or combined with a quantity/price line (`1 UN x 6,90  6,90` and variants: `2,000 KG x 12,50/kg`). Heuristics: pt-BR decimal commas, `UN/KG/LT/PC` unit tokens, `x` separator; lines before the item section (CNPJ, address) and after (TOTAL, dinheiro, troco) are excluded by keyword fences. Fractional quantities (weighed goods) round up to the nearest integer with the unit price preserved, keeping line totals approximate but never silently wrong. Returns only lines with a confident name + price; an empty result is the "nothing recognized" signal. The parser is pure and exhaustively unit-testable with text fixtures from real receipts.

## Testing approach

### Unit tests

Follow the existing `__tests__/` per-surface pattern (RNTL + jest-expo, store reset in `beforeEach`, mocked `expo-router`):

- **Model/store:** mutation functions and total recomputation (priceless items contribute 0, checked-only totals), migration v0→v1, persistence side effects via mocked AsyncStorage — extending `active-list-store.test.ts`.
- **Parser:** fixture-driven tests on real cupom text (well-formed lines, weighed items, noise lines, total/footer exclusion, garbage input → empty result). This is the highest-value suite for scan correctness.
- **Hooks:** `use-visible-items` (search + each sort option, "Por categoria" with nulls last), `use-price-input` (cents-fill), `use-receipt-scan` with mocked camera/OCR modules (success, OCR failure, empty parse, permission denied).
- **Components:** header status-line branches (over / pending / remaining), add-input disabled state and suggestion box visibility, item-row subtitle/total formats ("N× sem preço", "—"), mark-all counter, edit-sheet save/discard/category-toggle, confirm dialogs, empty state, summary preview, stacked bar legend ordering, screen tests for `shop.tsx` and `summary.tsx`. Mock `@react-native-ml-kit/text-recognition` and `expo-camera` in `__mocks__/` (the project already has a `__mocks__/` directory for native modules).

### Integration tests

Extend the `home-tabs-integration` style: drive the store through a full loop (create list → add → check → edit → remove → rename) and assert Home's `active-list-card` reflects item count/totals; budget-alerts emits warning/exceeded notifications when checked totals cross 85%/100%.

### E2E tests

New `e2e/shop.test.js` and `e2e/summary.test.js` (Detox, same `skipOnboarding`/`openLimit` helpers): create list → land on shop screen; add via input and suggestion; check item and assert chip/status text; edit price/quantity through the sheet; sort and search; mark all; swipe-to-delete; summary preview → Summary screen assertions; delete list → Home. Receipt flow e2e is UI-only: open sheet from empty state and action row, permission messaging, backdrop dismissal — capture/OCR/parse correctness stays in Jest (per agreed decision). Restart persistence is covered by relaunching the app (`device.launchApp({ newInstance: true })` without `delete`) and asserting items survive.

## Development sequencing

### Build order

1. **Model + store + migration** (`ListItem`, mutations, recomputed totals, v1 migrate) — everything else consumes it; Home regression tests prove back-compat.
2. **Shared UI primitives** (`bottom-sheet`, `confirm-dialog`) — three sheets and two dialogs depend on them.
3. **Shop screen core** (header with chip/status, add-input + suggestions, item rows with mark-all and swipe-to-delete, empty state, delete list) — the screen becomes usable end-to-end with manual data.
4. **Edit Item sheet** (price input, stepper, category picker) — depends on sheet primitive and store `updateItem`.
5. **Search/sort row + Sort sheet** — pure view-layer on top of the working list.
6. **Summary preview card + Summary screen** (selectors, stacked bar) — read-only over the store.
7. **Receipt scanning** (camera permission/preview in sheet, OCR wiring, parser, scan state machine, feedback states) — last because it is the only native-module work; the screen is fully functional without it.
8. **E2E suites + polish** (motion timings, accessibility audit).

### Technical dependencies

- `expo-camera` and `@react-native-ml-kit/text-recognition` added as dependencies; both require a new `expo prebuild` for dev clients and the Detox build (existing `e2e:prebuild` script covers it).
- No external services; OCR models ship in the app binary (Latin script only).

## Monitoring and observability

No remote telemetry exists in the project; observability stays local and test-facing. Persistence rehydration failures keep the existing `console.warn` pattern of `active-list-store.ts`; migration failures warn and fall back to `null` list rather than crashing hydration. The scan flow logs structured warnings on OCR/parse failure (`console.warn('Receipt scan failed:', reason)`) and surfaces every outcome in the UI (items-added count, error + retry), so failures are user-visible by design rather than silent.

## Technical considerations

### Key decisions

- **Extend `active-list-store` in place** (single source of truth, PRD constraint) instead of a new shop store: Home, budget-alerts, notifications keep their imports; the shop feature depends on `features/home` for the store, with shop-only logic kept in `features/shop`.
- **Denormalized `totalInCents`/`itemCount` recomputed inside actions** (user decision): zero churn in Home/budget-alerts; the invariant "totals always match items" lives in one mutation pipeline. Trade-off: every action must recompute — enforced by routing all mutations through one internal `commit(list)` helper. Derive-only selectors were discarded for the migration/refactor blast radius.
- **`@react-native-ml-kit/text-recognition`** (user decision) over `expo-text-extractor` (two engines → platform-divergent receipt quality) and Infinite Red's wrapper (heavier dependency family). On-device keeps the offline-first promise; only the scan needs nothing from the network either.
- **Custom bottom sheet** (user decision) over `@gorhom/bottom-sheet`: no snap points or scroll-aware gestures needed; reanimated is already installed; full fidelity to the 24 px/handle/backdrop design without fighting library styles.
- **`ReanimatedSwipeable`** (from `react-native-gesture-handler`, already installed) for swipe-to-delete instead of a hand-rolled gesture: maintained, accessible-friendly (removal also exists in the edit sheet), and consistent with the underlay design.
- **`FlatList` for items** with stable `keyExtractor` (item id) per the React Native rules; header/input/footer render as list header/footer components so the whole screen scrolls as one surface.
- **No category inference on scan** (PRD out-of-scope): parsed items land uncategorized.

### Known risks

- **OCR quality on real cupons** (thermal paper, crumpled, low light) is the main risk. Mitigation: parser only accepts confidently-parsed lines, clear error + retry path, fixture suite grown from real receipts; the PRD accepts "legible photo" as the bar.
- **Receipt format variance** (SAT CF-e vs NFC-e layouts, multi-line item names). Mitigation: keyword-fenced parsing and tolerant regexes; unparseable formats degrade to the explicit error path, never partial garbage (PRD edge case).
- **Camera inside a Modal-based sheet on Android** can have surface-lifecycle quirks. Mitigation: mount `CameraView` only while the sheet is fully open; verify on the Detox Android build early in step 7.
- **Swipeable + Pressable row conflicts** (tap vs horizontal drag). Mitigation: standard `ReanimatedSwipeable` activation offsets; covered by e2e.
- **Migration safety:** v0 persisted lists must hydrate under v1. Covered by dedicated migration tests before any release build.

### Rules compliance

- `.claude/rules/code-standards.md` — English-only source naming; kebab-case files; camelCase functions starting with verbs (`addItem`, `parseReceiptLines`); constants for magic numbers (thresholds `0.85`, sheet `280` ms, swipe widths); ≤3 params via objects (`UpdateItemChanges`); early returns in parser/status-line logic; no flag parameters (`setAllChecked` is a single explicit action, separate add vs addItems); methods ≤50 lines.
- `.claude/rules/typescript-standards.md` — strict mode preserved; union types over enums (`Category`, `SortOption`); discriminated union for scan state; `readonly` models; no `any`/`!`/blind `as` (OCR results narrowed via type guards); explicit return types on exported functions; named imports.
- `.claude/rules/react-native-standards.md` — functional components; NativeWind `className` with `cn` (StyleSheet only for shadows/dynamic values, matching existing components); `FlatList` for the item collection; `useCallback`/`useMemo` for `renderItem` and derived arrays; safe areas via `react-native-safe-area-context`; state local to components where possible (search text, sheet visibility), store only for shared list state; platform divergence isolated; RNTL tests for every component.

### Skills compliance

- `create-tasks` — next step: derive the task breakdown from this spec.
- `design-md` — `DESIGN.md` is the styling authority referenced throughout (palette, sheets, motion).

### Relevant and dependent files

- `src/features/home/active-list.ts`, `src/features/home/active-list-store.ts` — model/store extension (core).
- `src/features/home/components/active-list-card.tsx`, `budget-progress-bar.tsx`, `src/features/notifications/budget-alerts.ts` — downstream consumers that must keep working unchanged.
- `src/app/shop.tsx` (replaced), `src/app/summary.tsx` (new), `src/app/_layout.tsx` (no change expected; Stack auto-registers routes).
- `src/lib/currency.ts`, `src/lib/id.ts`, `src/lib/utils.ts` (`cn`), `src/lib/theme.ts`, `src/lib/fonts.ts` — reused utilities.
- `src/features/limit/use-limit-input.ts` — pattern source for `use-price-input`.
- `src/components/ui/button.tsx`, new `bottom-sheet.tsx`, `confirm-dialog.tsx` — shared UI.
- `tailwind.config.js` — category color tokens; `app.json` — camera permissions/plugins; `package.json` — `expo-camera`, `@react-native-ml-kit/text-recognition`.
- `__tests__/*` (new suites per component/hook/store), `__mocks__/` (camera + OCR mocks), `e2e/shop.test.js`, `e2e/summary.test.js`.
- `DESIGN.md`, `design-handoff/project/screens.jsx`, `tasks/prd-shop-list/prd.md` — design/product references.
