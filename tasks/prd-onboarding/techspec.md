# Technical specification

## Executive summary

Onboarding is a single Expo Router screen that renders three informational steps
client-side, advancing by swapping in-memory state rather than navigating between
routes. A first-run gate in the root layout decides — before the splash screen is
hidden — whether to land the user on onboarding or on the app's provisional Home,
based on a persisted "seen" flag.

Persistence is handled by a dedicated **Zustand store** with the `persist`
middleware backed by `AsyncStorage` (both already installed). The store exposes a
hydration flag so the splash screen stays visible until the flag is read, avoiding
an onboarding "flash" for returning users. The visual layer is built with
NativeWind using newly-introduced **Check.it design tokens** (green/yellow palette
from DESIGN.md), **Plus Jakarta Sans** loaded via `@expo-google-fonts`, **Lucide**
hero icons, `expo-glass-effect` for the frosted halo, and `react-native-reanimated`
entering/exiting layout animations for the step transitions. The exit lands on a
new provisional `/home` route, decoupling the post-onboarding destination from the
first-run decider so it can be swapped for the real Home later.

## System architecture

### Component overview

**New routes / layout**

- `app/_layout.tsx` (modified) — hosts the first-run gate + splash control and
  registers the new routes on the existing `<Stack>`. Loads fonts.
- `app/onboarding.tsx` (new) — the onboarding screen route; orchestrates step
  state, navigation actions, and exit.
- `app/home.tsx` (new) — provisional post-onboarding placeholder route (`/home`).
- `app/index.tsx` (modified) — becomes the entry decider: redirects to
  `/onboarding` or `/home` based on store state once hydrated.

**Feature module — `src/features/onboarding/`**

- `onboarding-store.ts` — Zustand store (`hasSeenOnboarding`, `hasHydrated`,
  `markOnboardingSeen`) with `persist`/`AsyncStorage`.
- `onboarding-steps.ts` — static PT-BR step content (kicker, title, body, icon).
- `components/onboarding-step.tsx` — renders one step (frosted halo + icon +
  kicker + title + body).
- `components/step-indicator.tsx` — the 3-dot stretchy-pill progress indicator.
- `components/halo-icon.tsx` — the 168 px frosted-halo circle hosting a 92 px icon.
- `components/onboarding-footer.tsx` — Skip / Back / Próximo / Vamos lá! controls.
- `use-onboarding-flow.ts` — hook owning step index + derived navigation state.

**Shared / cross-cutting**

- `src/components/ui/button.tsx` (new) — reusable `Btn` with the DESIGN.md
  variants needed here (`accent`, `onPrimary`, `ghost`).
- `src/lib/fonts.ts` (new) — font map + `useAppFonts` wrapper.
- `global.css` / `tailwind.config.js` (modified) — Check.it color tokens.

**Data flow:** `index` (decider) reads `hasSeenOnboarding` from the store →
routes. `onboarding.tsx` drives `use-onboarding-flow` for step state; Skip/Finish
call `markOnboardingSeen()` (persists to AsyncStorage) then `router.replace('/home')`.
On next launch the persisted flag rehydrates and the decider bypasses onboarding.

## Implementation design

### Main interfaces

```typescript
interface OnboardingState {
  hasSeenOnboarding: boolean;
  hasHydrated: boolean;
  markOnboardingSeen: () => void;
}

interface OnboardingFlow {
  currentStep: number;        // 0-based index, clamped to [0, lastStep]
  isFirstStep: boolean;
  isLastStep: boolean;
  goNext: () => void;         // advances, or finishes on last step
  goBack: () => void;         // no-op on first step
  finish: () => void;         // mark seen + exit (shared by finish & skip)
}

interface OnboardingStepContent {
  readonly id: string;
  readonly kicker: string;    // ALL-CAPS PT-BR kicker
  readonly title: string;
  readonly body: string;
  readonly Icon: LucideIcon;  // 92 px hero glyph
}
```

### Data models

- **Persisted shape (AsyncStorage key `checkit:onboarding`):**
  `{ "state": { "hasSeenOnboarding": boolean }, "version": 0 }` — only
  `hasSeenOnboarding` is persisted via the `partialize` option; `hasHydrated` is
  runtime-only and set in `onRehydrateStorage`.
- **Step content:** a `readonly OnboardingStepContent[]` of length 3
  (`welcome → limite → listas`) declared as a `const` module export. A
  `TOTAL_STEPS` constant derives from its length (no magic numbers).
- No request/response or DB schemas — the feature is local-only and stateless
  beyond the single boolean.

### API endpoints

Not applicable — no backend, network, or account involvement (per PRD
"Local-only persistence").

## Integration points

No external services. Integrations are all on-device libraries:

- `@react-native-async-storage/async-storage` — persistence backend for the store.
- `expo-splash-screen` — `preventAutoHideAsync()` at module load; `hideAsync()`
  once both fonts are loaded and the store has hydrated.
- `expo-font` + `@expo-google-fonts/plus-jakarta-sans` — async font load; failure
  falls back to `system-ui` (non-blocking, logged).
- `expo-glass-effect` — `GlassView` for the frosted halo; on platforms/OS versions
  without glass support, fall back to a translucent `View` (white @ 12% alpha,
  hairline white border) so the halo always renders.

**New dependencies to add:** `@expo-google-fonts/plus-jakarta-sans`,
`lucide-react-native` (**pin `>= 1.14`** — only `1.14+` declares the
`react: ^19` peer; older releases are React-18-only), and its required peer
`react-native-svg` (each Lucide icon renders `react-native-svg` primitives — it is
not bundled). Install via `expo install` so `react-native-svg` resolves to the
SDK-56 pin (`~15.x`, within Lucide's `^12 || ^13 || ^14 || ^15` range).

## Testing approach

### Unit tests

Use `jest-expo` + `@testing-library/react-native`. Mock only the on-device
boundaries (`AsyncStorage`, `expo-splash-screen`, `expo-font`); render real
components otherwise.

- **onboarding-store**: `markOnboardingSeen` flips the flag and writes to
  AsyncStorage; rehydration sets `hasHydrated`; `partialize` excludes `hasHydrated`.
- **use-onboarding-flow**: `goNext` advances and clamps at the last step;
  `goBack` clamps at the first step; `isFirstStep`/`isLastStep` derive correctly
  (FR 2.4 boundary protection).
- **onboarding screen**: shows exactly one step at a time; primary label switches
  `Próximo` → `Vamos lá!` on the last step; Skip is present on every step
  including the first; Skip and Finish both call `markOnboardingSeen`.
- **step-indicator**: renders 3 markers, emphasizes the active one, and exposes the
  `Passo X de 3` accessibility announcement.
- **index decider**: renders nothing/splash until `hasHydrated`; redirects to
  `/onboarding` when unseen and `/home` when seen.
- **button**: renders `accent` / `onPrimary` / `ghost` variants with correct
  accessible labels.

### Integration tests

- Full onboarding screen + store + mocked AsyncStorage: walking 1→2→3 then
  "Vamos lá!" persists the flag; a fresh render of the decider now routes to
  `/home`. Repeat asserting the Skip path from step 1 has the same persistence
  effect (FR 3.2 / 5.x).

### E2E tests

E2E uses **Detox** (the project's configured runner; there is no web target, so the
playwright-cli skill does not apply). Add `e2e/onboarding.test.js`:

- Fresh install (`device.launchApp({ delete: true })`): onboarding visible on
  step 1 → tap `Próximo` twice → tap `Vamos lá!` → `/home` placeholder visible.
- Relaunch (`newInstance: true`, no delete): onboarding is bypassed, `/home`
  shown directly (FR 5.2). Drive elements by `testID`.

## Development sequencing

### Build order

1. **Design tokens + fonts** (`global.css`, `tailwind.config.js`, `lib/fonts.ts`) —
   foundational; every visual piece depends on the palette and `Btn`. Add the
   reusable `Btn` variants here.
2. **Onboarding store** — independent, testable in isolation; the gate depends on it.
3. **First-run gate + routes** (`_layout`, `index` decider, `home` placeholder) —
   wire splash/hydration gating and routing; verifiable before visuals are final.
4. **Presentational components** (`halo-icon`, `step-indicator`, `onboarding-step`,
   `onboarding-footer`) using tokens + Lucide + glass effect.
5. **Flow hook + screen assembly** (`use-onboarding-flow`, `onboarding.tsx`) with
   Reanimated entering/exiting transitions and accessibility labels.
6. **Integration + E2E** wiring and the Detox specs.

### Technical dependencies

- New packages installed via `expo install` (font, lucide, react-native-svg).
- Detox E2E requires a native prebuild (`pnpm e2e:prebuild`) and a simulator —
  no other infra.

## Monitoring and observability

No telemetry is in scope (PRD "Analytics / instrumentation — out of scope"). There
is no Prometheus/Grafana surface in a client app. Keep diagnostics minimal:
`console.warn` on font-load or storage-rehydration failure with a clear message,
and ensure the gate **fails open to onboarding** if the persisted value cannot be
read (a corrupted/absent record is treated as first run, FR 5.3). No PII is logged.

## Technical considerations

### Key decisions

- **Single screen, local step state (no nested routing):** step index lives in a
  hook; advancing swaps rendered content. Matches the PRD "stepped single-screen"
  constraint and keeps back-stack semantics simple (one onboarding entry).
- **Zustand + persist over a bare hook:** chosen for reactive hydration gating and
  future reuse; the `hasHydrated` flag lets the splash stay up until the flag is
  known, eliminating the returning-user flash. Trade-off: slightly more setup than
  a `useStoredValue` hook, accepted for correctness and scalability.
- **Decider route separate from exit route:** `index` only decides; the exit goes
  to a dedicated `/home` placeholder. This isolates the provisional destination
  (FR 6.2) so replacing it with the real Home later touches one file.
- **`router.replace` (not `push`) on exit:** prevents the user from swiping back
  into onboarding.
- **Reanimated layout animations** (`FadeIn`/`SlideInRight` + `LinearTransition`)
  for step transitions — declarative, runs on the UI thread, honors DESIGN.md
  motion timings. React Compiler is enabled, so manual `useMemo`/`useCallback` is
  used sparingly.
- **Lucide over Phosphor/SF Symbols:** cross-platform vector set with a clean
  outline style close to the design intent; SF Symbols (`expo-symbols`) is iOS-only
  and unsuitable for the Android target.
- **Glass with graceful fallback:** `expo-glass-effect` where available, else a
  translucent `View`, so the halo never disappears on unsupported devices.

### Known risks

- **Splash-gate race:** hiding the splash before hydration would flash onboarding
  to returning users. Mitigation: gate `hideAsync()` on `hasHydrated && fontsLoaded`
  and render `null` from the decider until then.
- **Glass-effect support variance:** `GlassView` behavior differs by OS version.
  Mitigation: capability check with the translucent-View fallback; visual parity
  validated against DESIGN.md in QA.
- **Token introduction regressions:** editing `global.css`/`tailwind.config.js`
  affects the existing placeholder screen. Mitigation: additive tokens, drop only
  the dark-mode variants the PRD removes, keep `cn` usage; verify with `pnpm
  typecheck` and existing tests.
- **Font load failure** blocking first paint. Mitigation: fall back to system font,
  never block beyond a bounded load.

### Rules compliance

- **`.claude/rules/code-standards.md`** — English identifiers, verb-first function
  names (`markOnboardingSeen`, `goNext`), constants for magic numbers
  (`TOTAL_STEPS`), early returns for clamping, ≤3 params (objects otherwise),
  files/dirs in kebab-case, functions <50 lines, components <300 lines.
- **`.claude/rules/react-native-standards.md`** — functional components, core RN
  components only (no DOM), NativeWind `className` with `cn`, local state via the
  flow hook, `react-native-safe-area-context` for the green full-bleed ground
  (no hardcoded status-bar offsets), custom hooks `use`-prefixed, RNTL tests.
- **`.claude/rules/typescript-standards.md`** — strict mode, no `any`, `interface`
  for object shapes / `type` for unions, `readonly` step content, explicit return
  types on exports, named imports, no non-null assertions.
- **`CLAUDE.md`** — follow the pinned Expo v56 docs
  (`docs.expo.dev/versions/v56.0.0/`) for splash, font, and router APIs before
  coding.

### Skills compliance

- **create-tasks** — break this spec into the sequenced deliverables above.
- **execute-task** — implement each task following rules + Context7 docs.
- **execute-review** — `git diff` review; full test suite must pass.
- **execute-qa** — validate against PRD/spec, WCAG 2.2 checks, visual fidelity to
  DESIGN.md. (E2E is Detox here, not playwright-cli.)
- **create-github-commit** / **create-github-pull-request** — Conventional Commit
  + PR targeting `dev`.

### Relevant and dependent files

- `src/app/_layout.tsx` (modify — gate, splash, fonts, route registration)
- `src/app/index.tsx` (modify — first-run decider)
- `src/app/onboarding.tsx` (new), `src/app/home.tsx` (new)
- `src/features/onboarding/onboarding-store.ts` (new)
- `src/features/onboarding/onboarding-steps.ts` (new)
- `src/features/onboarding/use-onboarding-flow.ts` (new)
- `src/features/onboarding/components/{onboarding-step,step-indicator,halo-icon,onboarding-footer}.tsx` (new)
- `src/components/ui/button.tsx` (new), `src/lib/fonts.ts` (new)
- `src/global.css`, `tailwind.config.js` (modify — Check.it tokens)
- `package.json` (add font / lucide / react-native-svg)
- `__tests__/*`, `e2e/onboarding.test.js` (new tests)
- References: `DESIGN.md`, `tasks/prd-onboarding/prd.md`
