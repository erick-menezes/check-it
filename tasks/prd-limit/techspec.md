# Technical specification

## Executive summary

The Limit screen replaces the stub at the existing `/limit` Expo Router route with a real screen composed from a new `src/features/limit/` feature module. The signature cents-fill interaction is implemented with the proven React Native pattern (the same one the design handoff uses on the web): a visually hidden, auto-focused `TextInput` with `keyboardType="number-pad"` captures digits, a custom hook reduces them to an integer `cents` value, and the 56 px hero renders that value with a new prefix-free pt-BR formatter added to `src/lib/currency.ts`.

List creation reuses the existing persistence path end to end: a new pure factory `createActiveList(limitInCents)` in `src/features/home/active-list.ts` builds a conformant `ActiveList` (date-based default name, zero items/total), and the screen passes it to the already-persisted `useActiveListStore.setActiveList`. No new store, no schema migration, no network. After confirming, the screen navigates with `router.replace('/shop')` so step 1 is consumed and never revisited via back. The bottom "Criar lista" CTA rides above the keyboard via `KeyboardAvoidingView`, and the shared `Button` component gains first-class `disabled` support (visual + accessibility semantics), which it currently lacks.

## System architecture

### Component overview

**New components**

- `src/features/limit/use-limit-input.ts` — hook owning the input state: `cents`, `digits` string (max 9), `setDigits` (sanitizes to digits-only via `onChangeText`), `setPreset(amountInCents)`, and `isValid` (`cents > 0`). Pure state logic, no JSX, unit-testable in isolation.
- `src/features/limit/components/currency-hero.tsx` — the tappable hero block: muted `R$` prefix, 56 px tabular value, pencil + "Toque para editar" hint, and the hidden `TextInput` (opacity 0, 1×1, `caretHidden`, `contextMenuHidden`, `autoFocus`, `keyboardType="number-pad"`, `maxLength={9}`). Tapping anywhere in the hero calls `ref.focus()` to re-summon the keyboard.
- `src/features/limit/components/preset-pills.tsx` — row of three translucent pills (R$ 200 / 500 / 1000); each tap calls `onSelect(amountInCents)`.

**Modified components**

- `src/app/limit.tsx` — stops rendering `StubScreen`; becomes the screen assembly: full-green `SafeAreaView`, X close (`router.back()`), kicker, title, `CurrencyHero`, `PresetPills`, helper copy, `KeyboardAvoidingView`-anchored `Button`, and a `Stack.Screen` options block (`animation: 'slide_from_right'`, `animationDuration: 320`).
- `src/components/ui/button.tsx` — gains `disabled` handling: pass-through to `Pressable`, `accessibilityState={{ disabled }}`, reduced-opacity container, and press-scale suppression while disabled.
- `src/features/home/active-list.ts` — gains the `createActiveList` factory (see Data models).
- `src/lib/currency.ts` — gains `formatBRLAmount(cents)` returning the pt-BR number without the `R$` prefix (the hero renders prefix and value at different sizes, so the existing `formatBRL` cannot be used for the hero; it remains the formatter everywhere a single string is fine, e.g. accessibility labels).

**Data flow**

Keystroke → hidden `TextInput.onChangeText` → `use-limit-input` sanitizes/caps digits → `cents` → hero re-renders via `formatBRLAmount`. Preset tap → `setPreset` overwrites `digits`. Confirm → `createActiveList(cents)` → `setActiveList(list)` → zustand `persist` writes to AsyncStorage (`checkit:active-list`) → `router.replace('/shop')`. Home already subscribes to the store, so it reflects the new list with no further wiring. The existing `startBudgetAlertTracking` subscription fires on creation but is a no-op (total 0 → `onTrack`, no upward transition), so no guard is needed.

## Implementation design

### Main interfaces

```typescript
// src/features/limit/use-limit-input.ts
interface LimitInput {
  readonly cents: number;
  readonly digits: string;
  readonly isValid: boolean;
  setDigits: (raw: string) => void; // strips non-digits, caps at 9
  setPreset: (amountInCents: number) => void;
}
export function useLimitInput(): LimitInput;

// src/features/home/active-list.ts
export function createActiveList(
  limitInCents: number,
  now?: Date, // injectable for deterministic tests
): ActiveList;

// src/lib/currency.ts
export function formatBRLAmount(cents: number): string; // "9.999.999,99" (no prefix)
```

### Data models

No new entities. `createActiveList` produces the existing `ActiveList` shape:

- `id`: `globalThis.crypto.randomUUID()` (same pattern as `notifications-store.ts`).
- `name`: date-based default, `"Lista de DD/MM"` via `Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' })` on `now`.
- `itemCount: 0`, `totalInCents: 0`, `createdAt: now.toISOString()`, `limitInCents` from the argument.

The factory throws no errors and does no clamping: the screen guarantees `0 < limitInCents ≤ 999_999_999` via the 9-digit cap and the disabled CTA. Persistence shape, store key and version are unchanged, so no migration.

### API endpoints

Not applicable — fully offline feature, no network calls.

## Integration points

No external services. Internal integration points:

- **`useActiveListStore`** — consumed read-free (the screen only writes via `setActiveList`); replacing an existing active list is the store's natural overwrite semantics, satisfying FR 13.
- **Expo Router** — `/limit` path is untouched (Home CTA keeps `router.push('/limit')`); exit is `router.back()`; confirm is `router.replace('/shop')`.
- **Budget alerts subscription** — passive; verified no-op on creation as described above.

## Testing approach

### Unit tests

Following the existing one-file-per-unit pattern in `__tests__/`:

- `__tests__/currency.test.ts` (extend) — `formatBRLAmount`: 0 → `"0,00"`, cents-fill sequence values (`1500` → `"15,00"`), thousands grouping, 9-digit max `"9.999.999,99"`.
- `__tests__/active-list.test.ts` (extend) — `createActiveList`: shape conformance, zeroed totals, date-based name from injected `now`, unique ids.
- `__tests__/use-limit-input.test.ts` (new, `renderHook`) — digit append, non-digit stripping, 9-digit cap, backspace-driven shrink (`"4050"` → `"405"`), preset overwrite, preset-then-type editing, `isValid` boundary at zero.
- `__tests__/currency-hero.test.tsx`, `__tests__/preset-pills.test.tsx` (new) — rendering states (muted zero vs filled), accessibility label announcing the formatted amount, tap-to-focus, preset `onSelect` payloads.
- `__tests__/button.test.tsx` (extend) — disabled: blocks `onPress`, exposes `accessibilityState.disabled`, distinct visual treatment.
- `__tests__/limit-screen.test.tsx` (new) — screen-level: copy in pt-BR exactly per FR 18, CTA disabled at R$ 0,00 and enabled after typing/preset, X calls `router.back()` without touching the store, confirm calls `setActiveList` with the chosen limit then `router.replace('/shop')`.

Mocks: only the established ones — `expo-router` (`router.back/replace` jest.fn), `react-native-safe-area-context`, AsyncStorage jest mock (already wired in `jest.config.js`). `globalThis.crypto.randomUUID` stubbed where determinism matters. No new mock infrastructure.

### Integration tests

- `__tests__/active-list-store.test.ts` (extend) — `setActiveList(createActiveList(n))` round-trips through the persisted store: value survives rehydration and replaces a pre-existing active list (FR 12/13/15).
- `__tests__/home-tabs-integration.test.tsx` already covers Home CTA → `/limit` push; only the assertion text stays valid since the route is unchanged.

### E2E tests

New `e2e/limit.test.js` mirroring the existing Detox suites (skip onboarding helper, `testID` queries): CTA → limit screen visible; type digits via the hidden input (`typeText` on `limit-hidden-input`, which holds focus from `autoFocus`); assert formatted hero; tap preset `limit-preset-500`; confirm → `stub-shop` visible; relaunch app (`newInstance: true`, no `delete`) → Home shows the active-list card (restart persistence, FR 15); X-close path leaves Home unchanged. **Update `e2e/home.test.js:34-35`**, which still asserts `stub-limit`/`stub-limit-back` — it must now assert the real screen (`limit-screen`) and exit via `limit-close`. (The PRD's `execute-qa` flow uses playwright-cli for web; this project's established E2E harness is Detox, so the spec follows the repo convention.)

## Development sequencing

### Build order

1. **`formatBRLAmount` + `createActiveList`** — pure, dependency-free foundations; everything renders or persists through them.
2. **`Button` disabled support** — shared-component change with its own tests, landed early so the screen consumes a finished API.
3. **`use-limit-input` hook** — the whole input behavior contract, fully testable before any UI exists.
4. **`CurrencyHero` + `PresetPills`** — presentational components over the hook's API.
5. **`limit.tsx` screen assembly** — chrome, `KeyboardAvoidingView`, navigation wiring, screen-level tests; the stub import disappears here.
6. **Integration + E2E** — store round-trip test, new `e2e/limit.test.js`, fix `e2e/home.test.js`.

### Technical dependencies

None external. Everything builds on packages already in `package.json` (Expo SDK 56, expo-router, zustand, NativeWind, lucide-react-native, Detox). Plus Jakarta Sans and the `checkit` color tokens are already loaded/configured.

## Monitoring and observability

No metrics/Grafana infrastructure exists or applies to this offline mobile app. Observability follows the established minimal convention: `console.warn` on store rehydration failure (already in `active-list-store.ts`) is the only runtime signal. No new logging is introduced; failures in this flow are synchronous and surfaced by tests rather than telemetry.

## Technical considerations

### Key decisions

- **Hidden `TextInput` over a visible field or custom keypad** — matches the handoff's own implementation and the de-facto RN pattern for cents-fill ("FakeCurrencyInput" approach); the PRD mandates the native keyboard, and a hidden input is the only way to get native keystrokes without a visible field. A library (`react-native-currency-input`) was considered and rejected: our format is fixed (BRL, 9 digits, cents-fill) and the hook is ~30 lines, so a dependency buys nothing.
- **State as a digit string, cents derived** — backspace then becomes plain `onChangeText` (the OS edits the string; we re-parse), avoiding fragile `onKeyPress` handling which is unreliable on Android soft keyboards.
- **Factory + existing `setActiveList`** instead of a new store action — keeps the store API untouched and creation logic pure/injectable (user-confirmed decision).
- **`router.replace('/shop')` after confirm** — step 1 is consumed; back/close from shop returns Home, never a stale limit screen (user-confirmed decision).
- **Date-based default name** (`"Lista de DD/MM"`) — user-confirmed; naming proper stays out of scope on the shop screen.
- **`KeyboardAvoidingView` (`behavior: 'padding'` on iOS, default on Android)** keeps the CTA one tap away with the keyboard up (user-confirmed), using only built-ins — `react-native-keyboard-controller` is not added unless the risk below materializes.

### Known risks

- **iOS `autoFocus` + push-transition jank** — a documented issue when a screen with `KeyboardAvoidingView` and an auto-focused input is pushed (keyboard/layout can mis-animate). Mitigation: if visible on device, defer focus until the navigation transition settles (e.g. focus in an effect after interactions complete) instead of the `autoFocus` prop; the hook/components are agnostic to which trigger is used. Escalation path: adopt `react-native-keyboard-controller` (Expo-blessed alternative).
- **Detox typing into a hidden input** — `typeText` requires focus, not visibility, and the input is auto-focused; but if flaky, the e2e spec can drive value via preset pills plus a reduced typing assertion. Flag during step 6.
- **`Intl` on Hermes** — `Intl.NumberFormat`/`DateTimeFormat` with pt-BR are already relied on in `currency.ts` and proven in production code paths, so risk is considered retired.
- **`animationDuration` honor** — per-screen `animation` options are supported on the regular `Stack` (the root layout does not use the experimental stack, which ignores them); iOS may ignore exact 320 ms on the default native transition — acceptable, the design intent is "slide from right".

### Rules compliance

- **`.claude/rules/code-standards.md`** — English-only identifiers (pt-BR appears only in user-facing strings/content); kebab-case files (`use-limit-input.ts`, `currency-hero.tsx`); constants for magic numbers (`MAX_LIMIT_DIGITS = 9`, preset amounts, cap value); verb-first function names (`createActiveList`, `formatBRLAmount`, `setPreset`); early returns, ≤3 params (factory takes two, second optional/injectable), no flag parameters, no blank lines inside functions.
- **`.claude/rules/typescript-standards.md`** — strict mode untouched; `interface` for object shapes (`LimitInput`), explicit return types on all exports, `readonly` fields, no `any`/`as`/non-null assertions; named imports.
- **`.claude/rules/react-native-standards.md`** — functional components only; core components (`Pressable`, `TextInput`, `View`); NativeWind `className` with `cn` for conditionals (translucent fills needing rgba alpha follow the existing `Button` `VARIANT_INLINE_STYLE` precedent); state kept local to the screen via the hook; `SafeAreaView` from `react-native-safe-area-context` (no hardcoded offsets); component tests with `@testing-library/react-native`; reuse of `Button` rather than a bespoke CTA.

### Skills compliance

- **`create-tasks`** — next step: break this spec into sequenced tasks under `tasks/prd-limit/`.

### Relevant and dependent files

**New:** `src/features/limit/use-limit-input.ts` · `src/features/limit/components/currency-hero.tsx` · `src/features/limit/components/preset-pills.tsx` · `__tests__/use-limit-input.test.ts` · `__tests__/currency-hero.test.tsx` · `__tests__/preset-pills.test.tsx` · `__tests__/limit-screen.test.tsx` · `e2e/limit.test.js`

**Modified:** `src/app/limit.tsx` (stub → real screen) · `src/components/ui/button.tsx` (disabled support) · `src/features/home/active-list.ts` (factory) · `src/lib/currency.ts` (`formatBRLAmount`) · `__tests__/button.test.tsx` · `__tests__/currency.test.ts` · `__tests__/active-list.test.ts` · `__tests__/active-list-store.test.ts` · `e2e/home.test.js:34-35` (stub assertions)

**Referenced (unchanged):** `src/features/home/active-list-store.ts` · `src/app/(tabs)/home.tsx` · `src/features/home/components/create-list-cta.tsx` · `src/features/notifications/budget-alerts.ts` · `src/app/shop.tsx` · `src/lib/utils.ts` (`cn`) · `tailwind.config.js` · `DESIGN.md` · `design-handoff/project/screens.jsx:351-459`
