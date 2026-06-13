# Technical specification

## Executive summary

The anonymous Home replaces the provisional `/home` placeholder with the real,
on-brand screen and introduces the app's first **bottom tab bar**. Today the root
layout renders a flat `<Stack>`; this release adds an `app/(tabs)/` route group whose
layout uses Expo Router v56's **headless tab UI** (`Tabs`/`TabList`/`TabSlot`/
`TabTrigger` from `expo-router/ui`). Headless tabs are chosen over the default
`<Tabs>` navigator because DESIGN.md requires a fully custom 64 px bar (idle→active
icon swap, brand recolor, dynamic column count) that the default navigator cannot
express cleanly. Only "Início" and "Ajustes" exist in the group; account-gated tabs
are simply not declared (hidden, not disabled — FR 5.2).

The active list is owned by a new **Zustand store** mirroring the proven
`onboarding-store` pattern: `persist` + `AsyncStorage`, `partialize`, and a
`hasHydrated` gate so Home renders the correct state (card vs. empty) without a flash.
Per the scope decision, **no creation path exists this release** — create-list routes
to a stub — so in practice users see the empty state; the store and card are exercised
via pre-populated state in tests. Currency renders with `Intl.NumberFormat('pt-BR', {
style: 'currency', currency: 'BRL' })` (Hermes-safe) using `fontVariant:
['tabular-nums']`. Every non-implemented destination (Ajustes, Ajuda, Notificações,
criar-lista, abrir-lista) resolves to its **own stub route**, so no control dead-ends.

## System architecture

### Component overview

**Routing / layout**

- `app/_layout.tsx` (modify) — keeps the splash/font/hydration gate; the root
  `<Stack>` now registers the `(tabs)` group plus the standalone stub routes.
- `app/(tabs)/_layout.tsx` (new) — headless `Tabs` host: `TabSlot`, the custom
  `BottomTabBar`, and a hidden `TabList` declaring only `home` + `settings`.
- `app/(tabs)/home.tsx` (new) — the real Home screen (replaces `app/home.tsx`).
- `app/(tabs)/settings.tsx` (new) — "Ajustes" stub destination.
- `app/index.tsx` (modify) — decider now redirects to `/(tabs)/home`.
- `app/help.tsx`, `app/notifications.tsx`, `app/limit.tsx`, `app/shop.tsx` (new) —
  per-destination stub routes presented over the stack.

**Feature module — `src/features/home/`**

- `active-list-store.ts` — Zustand store (`activeList`, `hasHydrated`, setters) with
  `persist`/`AsyncStorage`.
- `active-list.ts` — `ActiveList` type, `BudgetStatus` union, and pure derivations
  (`getBudgetStatus`, `getBudgetRatio`).
- `components/home-header.tsx` — green hero: greeting + subtitle + help/notifications
  quick actions (accent dot on notifications).
- `components/create-list-cta.tsx` — accent-tile "Criar lista de compras" card.
- `components/active-list-card.tsx` — list card: name, item count, date, total/limit,
  budget progress bar, "Abrir".
- `components/budget-progress-bar.tsx` — contextual-color fill.
- `components/home-empty-state.tsx` — centered halo + title + caption (no card).
- `use-greeting.ts` — time-aware PT-BR greeting hook.

**Shared / cross-cutting**

- `src/components/ui/bottom-tab-bar.tsx` (new) — custom bar consuming `TabTrigger`
  `isFocused`; columns sized to visible tab count.
- `src/components/ui/section-label.tsx` (new) — ALL-CAPS eyebrow ("LISTA ATUAL").
- `src/lib/currency.ts` (new) — `formatBRL(cents)` helper.
- `src/lib/stub-screen.tsx` (new) — shared presentational stub used by each stub route.

**Data flow:** root layout gates on `fontsLoaded && onboarding.hasHydrated &&
activeList.hasHydrated`. `(tabs)/home` reads `activeList` from the store: present →
`ActiveListCard`; absent → `HomeEmptyState`. The CTA and card navigate via
`router.push` to the matching stub. Tab switches are handled by `TabTrigger` inside
the `(tabs)` group; header/stub destinations live on the parent stack.

## Implementation design

### Main interfaces

```typescript
interface ActiveListStoreState {
  activeList: ActiveList | null;
  hasHydrated: boolean;
  setActiveList: (list: ActiveList | null) => void;
  setHasHydrated: (value: boolean) => void;
}

interface ActiveList {
  readonly id: string;
  readonly name: string;
  readonly itemCount: number;
  readonly createdAt: string;   // ISO; rendered as the date label
  readonly totalInCents: number;
  readonly limitInCents: number;
}

type BudgetStatus = 'onTrack' | 'warning' | 'overBudget';

function getBudgetStatus(list: ActiveList): BudgetStatus;  // <85% | 85–100% | >100%
function getBudgetRatio(list: ActiveList): number;         // clamped 0..1 for the bar
function useGreeting(now?: Date): { greeting: string; subtitle: string };
function formatBRL(cents: number): string;                 // "R$ 1.234,56"
```

### Data models

- **`ActiveList`** — the single current list. Money is stored as integer **cents**
  (`totalInCents`, `limitInCents`) to avoid float drift; display divides at format
  time. Budget status is **derived** (`getBudgetStatus`), never persisted, so the
  card, bar color, and a11y label always agree (FR 3.3 / accessibility).
- **Persisted shape** (AsyncStorage key `checkit:active-list`):
  `{ "state": { "activeList": ActiveList | null }, "version": 0 }` via `partialize`;
  `hasHydrated` is runtime-only, set in `onRehydrateStorage`.
- **Greeting thresholds** — `NOON = 12`, `EVENING = 18` constants drive
  `Bom dia` / `Boa tarde` / `Boa noite`; subtitle fixed to "Pronto pra próxima
  compra?" (anonymous, no name — FR 1.2).
- **Budget thresholds** — `WARNING_RATIO = 0.85`, `OVER_RATIO = 1` constants.
- No request/response or DB schemas — local-only, no account (FR 6.3).

### API endpoints

Not applicable — no backend, network, or account involvement (PRD "Local-only
persistence", "No authentication").

## Integration points

No external services. On-device libraries only:

- `expo-router` / `expo-router/ui` — file routing, the `(tabs)` group, and the
  headless `Tabs`/`TabList`/`TabSlot`/`TabTrigger` for the custom bar.
- `@react-native-async-storage/async-storage` — persistence backend (already used).
- `expo-splash-screen` — `hideAsync()` extended to also await `activeList.hasHydrated`.
- `lucide-react-native` — header (`HelpCircle`, `Bell`), tab (`Home`, `Settings`),
  empty-state, and CTA glyphs (already installed).
- `Intl.NumberFormat` — built-in (Hermes); `currencyDisplay:'name'` avoided due to a
  known Hermes bug. **No new dependency.** Reuse `expo-glass-effect` (with the
  existing translucent-`View` fallback) for the empty-state halo.

## Testing approach

### Unit tests

`jest-expo` + `@testing-library/react-native`; mock only on-device boundaries
(`AsyncStorage`, `expo-glass-effect`, `expo-router`) per the existing `jest.setup.js`.

- **active-list-store**: `setActiveList` writes through to AsyncStorage; rehydration
  sets `hasHydrated`; `partialize` excludes `hasHydrated`.
- **active-list derivations**: `getBudgetStatus` returns `onTrack`/`warning`/
  `overBudget` at the 0.85 and 1.0 boundaries; `getBudgetRatio` clamps to `[0,1]`.
- **use-greeting**: returns `Bom dia` before 12h, `Boa tarde` until 18h, `Boa noite`
  after — injected `Date` (FR 1.1); subtitle never includes a name (FR 1.2).
- **currency**: `formatBRL` renders `R$` with comma decimals and dot thousands.
- **home screen**: with a populated store renders "Lista atual" + card + "Abrir";
  with `activeList: null` renders the empty state and **not** the section (FR 4.1);
  CTA present in both states (FR 4.3).
- **budget-progress-bar**: fill color matches status; over-budget exposes a non-color
  a11y signal (accessibility requirement).
- **bottom-tab-bar**: renders exactly the visible tabs ("Início", "Ajustes"), never
  the gated ones (FR 5.2); active trigger gets filled icon + brand color (FR 5.3).
- **stub-screen**: renders its title and a working back affordance (no dead end).

### Integration tests

- `(tabs)` layout + store + mocked AsyncStorage: pre-populated `activeList` →
  Home shows the card; tapping "Abrir"/card calls `router.push` to the shop stub;
  CTA pushes the limit stub (FR 2.2/2.3, 3.4). Empty store → empty state, CTA still
  routes. Tab press switches `TabSlot` between Home and Settings (FR 5.1).

### E2E tests

E2E uses **Detox** (the project's configured runner; no web target, so the
playwright-cli skill does not apply). Add `e2e/home.test.js`:

- Fresh launch past onboarding lands on Home; the empty state is visible and the
  tab bar shows only "Início" + "Ajustes" (FR 4.2, 5.2).
- Tap "Criar lista" → stub screen visible → back → Home (no dead end, FR 2.3/5.4).
- Tap "Ajustes" tab → Settings stub; tap "Início" → Home (FR 5.1).
- Header help/notifications open their stubs and return. Drive elements by `testID`.

## Development sequencing

### Build order

1. **Store + domain** (`active-list-store`, `active-list`, `lib/currency`) — pure and
   independently testable; everything else depends on the model and derivations.
2. **Tab shell** (`(tabs)/_layout`, `bottom-tab-bar`, move Home route, `settings`
   stub, update decider + `_layout` hydration gate) — establishes navigation before
   visuals; verifiable with placeholder content.
3. **Stub routes** (`help`, `notifications`, `limit`, `shop` + shared `stub-screen`) —
   unblocks every Home action so nothing dead-ends.
4. **Presentational pieces** (`section-label`, `home-header`, `create-list-cta`,
   `budget-progress-bar`, `active-list-card`, `home-empty-state`, `use-greeting`).
5. **Home assembly** — compose hero + CTA + conditional card/empty + a11y labels.
6. **Integration + Detox E2E**.

### Technical dependencies

- No new packages (all required libs already installed).
- Detox E2E requires a native prebuild (`pnpm e2e:prebuild`) and a simulator.
- Migrating `app/home.tsx` → `app/(tabs)/home.tsx` requires updating `index.tsx`,
  the onboarding exit (`router.replace`), and `home-screen.test.tsx` import paths.

## Monitoring and observability

No telemetry in scope (PRD "Analytics / instrumentation — out of scope"); there is no
Prometheus/Grafana surface in a client app. Keep diagnostics minimal: `console.warn`
on store-rehydration failure, and **fail open to the empty state** if the persisted
list cannot be read (corrupt/absent record treated as "no active list", FR 6.2). No
PII logged.

## Technical considerations

### Key decisions

- **Headless `expo-router/ui` tabs over the default `<Tabs>`:** the default navigator
  can hide tabs (`href:null`) but cannot fully restyle the bar to DESIGN.md (64 px,
  hairline top border, idle→active icon swap, dynamic columns). The headless API gives
  a real tab navigator with a 100%-custom bar — chosen for fidelity. Trade-off: a bit
  more wiring than `tabBar` prop, accepted for design accuracy.
- **`(tabs)` route group, Home migrated into it:** isolates tabbed screens from the
  full-screen stub/header destinations, which live on the parent stack so they cover
  the bar. Replacing the provisional `/home` placeholder this release is expected
  (onboarding techspec deliberately isolated that destination).
- **Money as integer cents + derived status:** avoids float rounding on currency and
  guarantees the bar color and the non-visual a11y status are computed from one source
  (no drift between visual and screen-reader signals).
- **Reuse the onboarding store pattern verbatim:** `persist` + `partialize` +
  `hasHydrated` + `onRehydrateStorage`; the splash gate simply ANDs the new hydration
  flag. Proven, consistent, low-risk.
- **No creation path this release (empty state in practice):** create-list routes to a
  stub and writes nothing, honoring the PRD scope; the card path is fully built and
  validated through pre-populated store state in tests, so it is ready when the real
  create flow lands.
- **Per-destination stub routes:** each unimplemented target gets its own route
  (closer to the final structure, clearer testIDs) sharing one `stub-screen`
  presentational component to avoid duplication.
- **`Intl.NumberFormat` over a currency lib:** built into Hermes, zero deps; avoid
  only `currencyDisplay:'name'` (known Hermes bug).

### Known risks

- **`expo-router/ui` API stability:** headless tabs are newer than the core navigator.
  Mitigation: pin to the SDK-56 `expo-router` already installed, follow the v56 custom-
  tabs doc, and cover the bar with unit + Detox tests.
- **Route-migration regressions:** moving Home can break the decider, the onboarding
  exit, and existing tests. Mitigation: update all three references in the same task and
  run `pnpm typecheck` + the full suite.
- **Hydration race / flash:** showing Home before the list hydrates could flash the
  empty state then the card. Mitigation: extend the splash gate to `activeList
  .hasHydrated` and render `null` until ready, exactly as onboarding does.
- **Currency/locale on device:** ICU data varies by platform. Mitigation: keep to plain
  `style:'currency'`, snapshot-test `formatBRL`, and confirm on a real device in QA.

### Rules compliance

- **`.claude/rules/code-standards.md`** — English identifiers, verb-first functions
  (`getBudgetStatus`, `formatBRL`, `setActiveList`), constants for magic numbers
  (`NOON`, `WARNING_RATIO`), early returns, ≤3 params, kebab-case files, functions
  <50 lines, components <300 lines, no flag params (separate empty/card components).
- **`.claude/rules/react-native-standards.md`** — functional components, core RN only,
  NativeWind `className` + `cn`, store via Zustand (frequent state), `use`-prefixed
  hooks, `react-native-safe-area-context` for the green hero (no hardcoded insets),
  RNTL tests. (Single active list → no `FlatList` needed.)
- **`.claude/rules/typescript-standards.md`** — strict, no `any`, `interface` for
  shapes / `type` for `BudgetStatus` union, `readonly` `ActiveList`, explicit return
  types on exports, named imports, no non-null assertions.
- **`CLAUDE.md`** — follow the pinned Expo v56 docs
  (`docs.expo.dev/versions/v56.0.0/`) for router/tabs/splash APIs before coding.

### Skills compliance

- **create-tasks** — break this spec into the sequenced deliverables above.
- **execute-task** — implement each task with rules + Context7/v56 docs.
- **execute-review** — `git diff` review; full suite must pass.
- **execute-qa** — validate against PRD/spec, WCAG 2.2, DESIGN.md fidelity (E2E is
  Detox, not playwright-cli).
- **create-github-commit** / **create-github-pull-request** — Conventional Commit + PR.

### Relevant and dependent files

- `src/app/_layout.tsx` (modify — register `(tabs)` + stubs, extend hydration gate)
- `src/app/index.tsx` (modify — redirect to `/(tabs)/home`)
- `src/app/(tabs)/_layout.tsx`, `src/app/(tabs)/home.tsx`, `src/app/(tabs)/settings.tsx` (new)
- `src/app/{help,notifications,limit,shop}.tsx` (new stubs)
- `src/app/home.tsx` (remove/migrate)
- `src/app/onboarding.tsx` (modify — exit `router.replace('/(tabs)/home')`)
- `src/features/home/active-list-store.ts`, `active-list.ts`, `use-greeting.ts` (new)
- `src/features/home/components/{home-header,create-list-cta,active-list-card,budget-progress-bar,home-empty-state}.tsx` (new)
- `src/components/ui/{bottom-tab-bar,section-label}.tsx`, `src/lib/{currency.ts,stub-screen.tsx}` (new)
- `__tests__/*` (new + update `home-screen.test.tsx`), `e2e/home.test.js` (new)
- References: `DESIGN.md`, `tasks/prd-home/prd.md`, `tasks/prd-onboarding/techspec.md`
