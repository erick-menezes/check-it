# Technical specification

## Executive summary

The Settings ("Ajustes") screen replaces the current `src/app/(tabs)/settings.tsx` placeholder with a real, fully offline screen built on the project's established stack: Expo Router (the route already exists as the second tab), NativeWind for styling, `lucide-react-native` for icons, `react-native-reanimated` for the toggle animation, and `react-native-safe-area-context` for the header inset. The screen has exactly two sections — **NOTIFICAÇÕES** (the budget-alert preference) and **SOBRE** (help, terms, version) — and contains no authentication branches.

The single piece of persistent state, the budget-alert preference, lives in a new `useSettingsStore` (Zustand + `persist` + AsyncStorage), mirroring the proven `onboarding-store.ts` / `active-list-store.ts` pattern with a `hasHydrated` flag wired into the root `_layout.tsx` readiness gate, so the toggle never flashes the wrong state on launch. A new reusable `Toggle` component implements the exact 38×22 px pill from DESIGN.md with a Reanimated knob slide, exposing `accessibilityRole: "switch"`. Settings rows are composed from small, testable presentational components under a new `src/features/settings/` feature folder. The "Central de ajuda" row navigates to the existing `/help` route, and "Termos e privacidade" navigates to a new lightweight `/terms` placeholder built with the existing `StubScreen`. Every file stays well under the 300-line / 50-line standards.

## System architecture

### Component overview

New files under `src/features/settings/`:

- **`settings-store.ts`** — Zustand store, `persist` + AsyncStorage. Holds `budgetAlertsEnabled: boolean` (default `true`, PRD 2.3) and `hasHydrated: boolean`, plus `setBudgetAlertsEnabled` and `setHasHydrated`. `partialize` persists only `budgetAlertsEnabled`. Single source of truth other features will later read to gate alert delivery (PRD 2.6).
- **`settings-content.ts`** — Static, `readonly` PT-BR data describing the SOBRE rows (label, leading `LucideIcon`, tint color, destination route, type), so row copy/order is a typed constant (PRD §3) — mirrors `onboarding-steps.ts`.
- **`components/settings-header.tsx`** — Minimal header variant: Pure Snow background, hairline bottom border, "Ajustes" title in H1 scale, safe-area top inset (PRD §1).
- **`components/settings-section.tsx`** — Wraps a `SectionLabel` eyebrow + a soft surface card grouping its rows with hairline dividers (PRD UX spec).
- **`components/setting-icon-tile.tsx`** — ~38–40 px tinted icon tile (18% color wash background via `color-mix`, pure-color glyph), reused by every row (DESIGN §7).
- **`components/notification-row.tsx`** — Bell tile + "Alertas de orçamento" title + "Quando ultrapassar 80% do limite" caption + trailing `Toggle`. Reads/writes `useSettingsStore` (PRD §2).
- **`components/navigation-row.tsx`** — Tinted tile + label + trailing chevron; full row is the touch target; `onPress` navigates (PRD 3.2–3.4).
- **`components/version-row.tsx`** — Bookmark tile + "Versão" label + trailing version value; not pressable, no chevron (PRD 3.5).

New shared UI:

- **`src/components/ui/toggle.tsx`** — Reusable controlled `Toggle` (custom Reanimated pill, see Key decisions).

Modified / new route files:

- **`src/app/(tabs)/settings.tsx`** — Route entry. Replaces the placeholder with the composed screen.
- **`src/app/terms.tsx`** — New placeholder route using `StubScreen` (the "Termos e privacidade" destination).
- **`src/app/_layout.tsx`** — Add `useSettingsStore` `hasHydrated` to the `isReady` gate.

**Data flow:** `settings-store.ts` (persisted) → `NotificationRow` reads `budgetAlertsEnabled` and calls `setBudgetAlertsEnabled` on toggle → AsyncStorage write via `persist`. `settings-content.ts` (static) → `SettingsScreen` maps SOBRE rows → `NavigationRow`/`VersionRow`. Navigation rows fire `router.push('/help')` / `router.push('/terms')` side effects with no shared state.

## Implementation design

### Main interfaces

```typescript
interface SettingsState {
  budgetAlertsEnabled: boolean;
  hasHydrated: boolean;
  setBudgetAlertsEnabled: (enabled: boolean) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useSettingsStore: UseBoundStore<StoreApi<SettingsState>>;

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  testID?: string;
}

export function Toggle(props: ToggleProps): React.JSX.Element;
```

Row props stay explicit (no spreading), per the React Native standard:

```typescript
interface NavigationRowProps {
  Icon: LucideIcon;
  tint: string;
  label: string;
  onPress: () => void;
  testID: string;
}
```

### Data models

No request/response or DB schema — fully on-device.

- **Persisted preference:** only `{ budgetAlertsEnabled: boolean }` under the AsyncStorage key `checkit:settings` (matching the `checkit:*` namespace of existing stores), `version: 0`.
- **SOBRE rows constant:** `SETTINGS_ABOUT_ROWS: readonly AboutRow[]` carries the three rows in order — `Central de ajuda` (`CircleHelp`, route `/help`), `Termos e privacidade` (`Info`, route `/terms`), `Versão` (`Tag`/`Bookmark`, value row). A union `type AboutRowKind = 'navigation' | 'version'` (no enum, per TS standard) discriminates pressable rows from the static version row.
- **App version:** rendered from `Constants.expoConfig?.version` (`expo-constants`, already installed), read as-is from `app.json`. A `??` fallback (e.g. `'—'`) guards the optional value, per the nullish-coalescing standard.

### API endpoints

Not applicable — no backend and no network calls. All state is local AsyncStorage.

## Integration points

- **Expo Router** — `settings.tsx` is already the `/settings` tab destination wired in `(tabs)/_layout.tsx` and `bottom-tab-bar.tsx`; the Ajustes tab is shown active while on screen (PRD 4.1) with no code change to the tab bar. Navigation rows call `router.push('/help')` (existing route) and `router.push('/terms')` (new route); both inherit the root `Stack` slide-from-right with `headerShown: false`.
- **`expo-constants` (existing dependency)** — `Constants.expoConfig?.version` supplies the "Versão" value. No native change.
- **`@react-native-async-storage/async-storage` + `zustand/middleware` `persist`** — preference persistence, identical wiring to the two existing stores (`createJSONStorage(() => AsyncStorage)`, `onRehydrateStorage` setting `hasHydrated`).
- **`react-native-safe-area-context`** — `useSafeAreaInsets()` for the header top padding, consistent with `home-header.tsx` / `help-header.tsx`; no hardcoded offsets (PRD 1.3).

## Testing approach

### Unit tests

Using `@testing-library/react-native` (project standard), one spec per unit under `__tests__/`:

- **`settings-store.test.ts`** — defaults to `budgetAlertsEnabled: true` (PRD 2.3); `setBudgetAlertsEnabled(false)` updates state; persisted state restores after a simulated rehydrate (AsyncStorage mocked).
- **`toggle.test.tsx`** — renders with `accessibilityRole: "switch"` and `accessibilityState.checked` reflecting `value`; pressing calls `onValueChange` with the negated value; honors `accessibilityLabel`; touch target ≥ 44 px.
- **`notification-row.test.tsx`** — renders title, caption and bell tile; toggle reflects store value; toggling writes the new value to the store (store mocked/reset).
- **`navigation-row.test.tsx`** — renders label + chevron; full row press fires `onPress`; PT-BR `accessibilityLabel`, `accessibilityRole: "button"`.
- **`version-row.test.tsx`** — renders "Versão" + the version value; is not pressable (no `onPress`, no chevron/role button).
- **`settings-content.test.ts`** — exactly three SOBRE rows in order Central de ajuda → Termos e privacidade → Versão with the verbatim PT-BR labels and correct routes (guards copy/route drift).
- **`settings-screen.test.tsx`** — integration (below).

### Integration tests

`settings-screen.test.tsx` exercises `SettingsScreen` + `useSettingsStore` + rows together with real static data: both eyebrows ("NOTIFICAÇÕES", "SOBRE") render; toggling the switch updates the on/off accessibility state and the store; "Central de ajuda" press calls `router.push('/help')` and "Termos e privacidade" calls `router.push('/terms')` (router mocked); the placeholder copy "Em breve" is never present.

### E2E tests

The project uses **Detox** (`detox`, `@config-plugins/detox`, `e2e/home.test.js`), not Playwright — the Playwright path in the template does not apply to this native Expo app. Add `e2e/settings.test.js`: from Home tap `tab-settings`, assert NOTIFICAÇÕES/SOBRE are visible and the placeholder is gone; tap the toggle and assert its accessibility state flips; tap "Central de ajuda" and assert the Help screen appears, then return and assert the toggle state is preserved; tap "Termos e privacidade" and assert the placeholder screen appears. Persistence-across-relaunch is asserted in the store unit test (Detox app-relaunch assertions are optional/secondary).

## Development sequencing

### Build order

1. **`settings-store.ts`** — foundational state with no UI dependencies; unit-test defaults and persistence first. Wire `hasHydrated` into `_layout.tsx`.
2. **`src/components/ui/toggle.tsx`** — reusable, independently testable control; needed by the notification row.
3. **`settings-content.ts` + types** — the typed contract the SOBRE rows consume; lock verbatim copy and routes.
4. **`setting-icon-tile.tsx`**, then leaf rows (`notification-row.tsx`, `navigation-row.tsx`, `version-row.tsx`) and `settings-section.tsx` / `settings-header.tsx`.
5. **`src/app/terms.tsx`** — trivial `StubScreen` route so "Termos e privacidade" is never a dead end.
6. **`settings.tsx` screen** — compose header + both sections inside a `ScrollView` with bottom padding clearing the 64 px tab bar (PRD 4.2).
7. **Tests + `e2e/settings.test.js`** — finalize integration spec and E2E flow.

### Technical dependencies

No new runtime packages: `zustand`, `@react-native-async-storage/async-storage`, `react-native-reanimated`, `lucide-react-native`, `expo-constants`, `react-native-safe-area-context`, and NativeWind are all already installed. No backend, infra, or environment prerequisites — the feature is self-contained and offline.

## Monitoring and observability

Not applicable. The PRD explicitly excludes analytics/instrumentation, and the app has no metrics/logging backend (no Prometheus/Grafana). The only diagnostic is the existing `console.warn` in `onRehydrateStorage` if preference rehydration fails — informational, not a metric.

## Technical considerations

### Key decisions

- **Custom Reanimated `Toggle`, not RN core `Switch`** — DESIGN.md fixes the exact geometry (38×22 px, 11 px radius, white knob with soft shadow), colors (Herbal Leaf Green on / Fog Gray off) and motion (~200 ms cubic-bezier knob slide). RN's `Switch` cannot match this cross-platform. A controlled component animating knob `translateX` and track color via `useSharedValue` + `withTiming` gives pixel-faithful, 60 fps behavior and is reusable beyond Settings. Confirmed with the user.
- **Version read as-is from `app.json` via `expo-constants`** — `Constants.expoConfig?.version` is the dynamic single source of truth and needs no hardcoded constant. Confirmed with the user. **Note:** `app.json` currently declares `1.0.0` while DESIGN.md shows `2.0.0`; reconciling that number is a separate `app.json` change outside this feature's scope and not performed here.
- **Zustand `persist` store gated by `hasHydrated`** — matches both existing stores exactly and, because the default is ON (PRD 2.3), gating in `_layout.tsx` prevents a brief flash of ON for a user who saved OFF. Confirmed with the user.
- **New `/terms` route via `StubScreen`** — reuses the existing placeholder component (as `notifications.tsx` / `limit.tsx` do), guaranteeing the row leads somewhere (PRD 3.4) with minimal surface area; full legal content is explicitly out of scope.
- **`ScrollView` + composition, not `FlatList`** — the screen is a fixed, tiny set of rows (one preference + three about rows); virtualization adds complexity for no benefit and matches `home.tsx` / `help.tsx`. **Justified deviation** from the `FlatList`-preference guidance.
- **Tinted icon tile as a shared component** — every row uses the same 18% wash + pure glyph treatment; extracting `setting-icon-tile.tsx` avoids repetition and keeps each row well under 50 lines.

### Known risks

- **Reanimated worklet config** — the app uses `react-native-reanimated` 4.x with `react-native-worklets`; the toggle's `withTiming` animation must run on the UI thread without a Babel/worklets misconfiguration. Mitigation: follow the existing `step-indicator.tsx` Reanimated usage and validate on a device build.
- **Hydration race on first toggle** — reading `budgetAlertsEnabled` before rehydration could momentarily show the default. Mitigation: the `_layout.tsx` `hasHydrated` gate blocks render until the store is hydrated, the same guarantee the other stores rely on.
- **AsyncStorage key collision / migration** — `checkit:settings` must be unique and `version: 0` set so a future shape change can migrate cleanly. Mitigation: namespace check against existing keys (`checkit:onboarding`, `checkit:active-list`).
- **Accessibility semantics** — the toggle must announce on/off and the version row must not be focusable as a button. Mitigation: explicit `accessibilityRole`/`accessibilityState` in the component, covered by unit tests.

### Rules compliance

- **`.claude/rules/code-standards.md`** — English identifiers (PT-BR only in user-facing copy); verb-first functions (`setBudgetAlertsEnabled`, `onValueChange`); constants for magic numbers (toggle size, radius, animation duration, tint alpha, min touch height); early returns; ≤3 params via prop objects; functions ≤50 lines, files ≤300 lines.
- **`.claude/rules/react-native-standards.md`** — functional components; core RN components only; NativeWind via `className` + `cn` (inline `style` only for dynamic Reanimated values); state via `zustand` for the cross-feature preference and local props elsewhere; explicit props (no spreading except the wrapper `Toggle`'s `Pressable`); `use`-prefixed store hook; safe-area insets; `@testing-library/react-native` tests. `FlatList` preference consciously waived (see Key decisions).
- **`.claude/rules/typescript-standards.md`** — `strict` mode; `interface` for object shapes, union `type` for `AboutRowKind` (no enum); explicit return types on exports; `readonly` static data; named imports; no `any`/non-null assertions; `??`/`?.` for the optional version value.

### Skills compliance

- **`execute-task`** — implement each task following loaded rules/skills and Context7 docs.

### Relevant and dependent files

- `src/app/(tabs)/settings.tsx` (modified — route entry, currently a placeholder)
- `src/app/_layout.tsx` (modified — add settings store to the hydration gate)
- `src/app/terms.tsx` (new — `/terms` placeholder destination)
- `src/app/(tabs)/_layout.tsx`, `src/components/ui/bottom-tab-bar.tsx` (existing tab wiring — Ajustes active)
- `src/app/help.tsx` (existing `/help` navigation target)
- `src/features/onboarding/onboarding-store.ts`, `src/features/home/active-list-store.ts` (persisted-store pattern)
- `src/features/onboarding/onboarding-steps.ts` (static typed data pattern)
- `src/features/onboarding/components/step-indicator.tsx` (Reanimated usage pattern)
- `src/components/ui/section-label.tsx` (eyebrow), `src/components/ui/button.tsx`, `src/lib/stub-screen.tsx`
- `src/lib/utils.ts` (`cn`), `src/lib/fonts.ts`, `tailwind.config.js` (`checkit` palette), `src/global.css`, `app.json` (version source)
- `DESIGN.md` (visual source of truth)
- New: `src/features/settings/settings-store.ts`, `settings-content.ts`, `components/settings-header.tsx`, `components/settings-section.tsx`, `components/setting-icon-tile.tsx`, `components/notification-row.tsx`, `components/navigation-row.tsx`, `components/version-row.tsx`; `src/components/ui/toggle.tsx`
- New tests: `__tests__/settings-store.test.ts`, `toggle.test.tsx`, `notification-row.test.tsx`, `navigation-row.test.tsx`, `version-row.test.tsx`, `settings-content.test.ts`, `settings-screen.test.tsx`, `e2e/settings.test.js`
