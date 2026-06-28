# Technical specification

## Executive summary

The Help / FAQ screen replaces the existing `src/app/help.tsx` stub with a real, fully offline screen built on the project's established stack: Expo Router (file-based route), NativeWind for styling, `lucide-react-native` for icons, and `react-native-reanimated` layout animations for the accordion motion. All FAQ copy is bundled statically as a typed, `readonly` data module, mirroring the existing `onboarding-steps.ts` pattern; no store, network call, or auth state is involved.

The screen is a standard pushed Stack route (slide-from-right), reached from the already-wired `router.push('/help')` in the Home header. Its single piece of runtime state is "which section is open", held in local `useState` inside a `useHelpAccordion` hook implementing single-open / collapsible behavior. The accordion reveals all FAQ tiles of the open section at once (no per-item interaction) and animates both header background color and content height via `LinearTransition`. A closing support block opens the device mail composer through `expo-linking` (`mailto:`), guarded by `canOpenURL`. Work is organized under a new `src/features/help/` feature folder with small, testable components, keeping every file well under the 300-line and 50-line standards.

## System architecture

### Component overview

New files under `src/features/help/`:

- **`help-content.ts`** — Static, `readonly` PT-BR data: the three sections (Listas, Limites, Gastos), each with an `id`, `label`, leading `Icon` (`LucideIcon`), and its `items` (`question` / `answer` pairs). Single source of truth for all copy (PRD §4).
- **`use-help-accordion.ts`** — Custom hook owning the single-open accordion state (`openSectionId`, `toggleSection`). Initializes to the first section (`listas`) per PRD 2.5; toggling the open section collapses it (none open).
- **`components/help-header.tsx`** — Minimal header variant: Pure Snow background, hairline bottom border, leading close (X) affordance, title + subtitle (PRD §1).
- **`components/faq-section.tsx`** — One accordion card: pressable header (icon + label + plus/minus indicator, color/background per expanded state) and an animated content region that renders the section's FAQ tiles when open.
- **`components/faq-tile.tsx`** — A single question/answer tile on the 16% white translucent overlay.
- **`components/support-block.tsx`** — "Não achou sua dúvida?" block with title, caption, and a full-width ghost button that triggers the mail composer.
- **`open-support-email.ts`** — Thin helper wrapping `Linking.canOpenURL` + `Linking.openURL` for the `mailto:` address (isolated for testability).

Modified files:

- **`src/app/help.tsx`** — Route entry. Replaces `StubScreen` with the composed Help screen (header + scrollable accordion + support block).

**Data flow:** `help-content.ts` (static) → `HelpScreen` maps sections → `FaqSection` (receives `isOpen` + `onToggle` from `useHelpAccordion`) → `FaqTile`. The close affordance and support button are pure navigation/linking side effects with no shared state.

## Implementation design

### Main interfaces

```typescript
export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface HelpSection {
  readonly id: HelpSectionId; // 'listas' | 'limites' | 'gastos'
  readonly label: string; // PT-BR section label
  readonly Icon: LucideIcon; // leading topic icon
  readonly items: readonly FaqItem[];
}

export interface HelpAccordion {
  readonly openSectionId: HelpSectionId | null;
  toggleSection: (id: HelpSectionId) => void;
}

export function useHelpAccordion(): HelpAccordion;

export function openSupportEmail(): Promise<void>; // mailto, guarded by canOpenURL
```

Component props stay explicit (no spreading), per the React Native standard:

```typescript
interface FaqSectionProps {
  section: HelpSection;
  isOpen: boolean;
  onToggle: (id: HelpSectionId) => void;
}
```

### Data models

No persistence and no request/response types — the screen is fully static. The only domain model is the `HelpSection[]` constant exported from `help-content.ts`:

- `HelpSectionId = 'listas' | 'limites' | 'gastos'` (union type, not enum, per TS standard).
- `HELP_SECTIONS: readonly HelpSection[]` carries the verbatim copy from PRD §4 (3 Listas items, 2 Limites items, 2 Gastos items).
- Icon choices reuse `lucide-react-native` glyphs already in the dependency set (e.g. `ListChecks` for Listas, `Wallet` for Limites, `Receipt`/`TrendingUp` for Gastos), echoing the icons used in onboarding.

### API endpoints

Not applicable — no backend, no network calls. The only external interaction is the platform `mailto:` handler via `expo-linking`.

## Integration points

- **Expo Router** — `src/app/help.tsx` is already a registered route; the Home header already calls `router.push('/help')`. The screen inherits the root `Stack` (`headerShown: false`, slide-from-right default). The close (X) calls `router.back()`, falling back to `router.replace('/(tabs)/home')` when `router.canGoBack()` is false (defensive; deep-linking is out of scope).
- **`expo-linking` (existing dependency)** — `openSupportEmail()` builds `mailto:contact@erickmenezesdev.com`, calls `Linking.canOpenURL(url)` and, only when supported, `Linking.openURL(url)`. Failures are caught and swallowed (optionally `console.warn`) so a device without a configured mail client never crashes the screen. No `ios.infoPlist` scheme allow-list change is needed for the `mailto:` scheme.
- **`react-native-safe-area-context`** — `useSafeAreaInsets()` for the header top padding, consistent with `home-header.tsx`; no hardcoded status-bar offsets.

## Testing approach

### Unit tests

Using `@testing-library/react-native` (project standard), one spec per unit under `__tests__/`:

- **`use-help-accordion.test.ts`** — first section open by default (PRD 2.5); selecting another section closes the previous and opens the new one (single-open, 2.3); toggling the open section collapses to none.
- **`help-content.test.ts`** — exactly three sections in order Listas → Limites → Gastos; each section contains the exact item counts (3 / 2 / 2) and verbatim PT-BR strings from PRD §4 (guards against copy drift).
- **`faq-section.test.tsx`** — renders label and plus indicator when collapsed and all its FAQ tiles + minus indicator when open; `accessibilityState.expanded` reflects state; `onToggle` fires with the section id; touch target ≥ 44 px.
- **`faq-tile.test.tsx`** — renders question and answer text.
- **`support-block.test.tsx`** — renders title/caption/button; pressing the button calls `openSupportEmail` (Linking mocked).
- **`help-header.test.tsx`** — renders title/subtitle; close affordance has the PT-BR `accessibilityLabel` and triggers navigation (router mocked).
- **`help-screen.test.tsx`** — integration: three section headers present; Listas content visible on mount; tapping Limites hides Listas content and shows Limites content.

**Mocking:** only the genuine externals — `expo-router` (`router`) and `react-native`'s `Linking`. No mocks for internal components.

### Integration tests

`help-screen.test.tsx` (above) doubles as the component-integration test, exercising `HelpScreen` + `useHelpAccordion` + `FaqSection` together with the real static data. No test data fixtures are required beyond `HELP_SECTIONS`.

### E2E tests

The project uses **Detox** (`detox`, `@config-plugins/detox`, `e2e/home.test.js`), not Playwright — the Playwright path in the template does not apply to a native Expo app. Add `e2e/help.test.js`: from Home, tap the `header-help` control, assert the Help screen and the default-open Listas content are visible, tap the Limites header and assert its content appears while Listas collapses, then tap the close (X) and assert return to Home. The support `mailto:` action is not asserted in E2E (it leaves the app); it is covered by the unit test.

## Development sequencing

### Build order

1. **`help-content.ts` + types** — no dependencies; the contract every component consumes. Lock the verbatim copy first.
2. **`use-help-accordion.ts`** — pure state logic, independently unit-tested before any UI.
3. **Leaf components** — `faq-tile.tsx`, then `help-header.tsx` and `support-block.tsx` (+ `open-support-email.ts`). Independent and simple.
4. **`faq-section.tsx`** — composes `faq-tile` and adds the Reanimated `LinearTransition` header-color/height animation.
5. **`help.tsx` screen** — composes header + accordion sections + support block inside a `ScrollView`; wires `useHelpAccordion` and navigation.
6. **Tests + E2E** — finalize the integration spec and `e2e/help.test.js`.

### Technical dependencies

No new runtime packages: `react-native-reanimated`, `expo-linking`, `lucide-react-native`, `react-native-safe-area-context`, and NativeWind are all already installed. No infrastructure, backend, or environment prerequisites — the feature is self-contained and offline.

## Monitoring and observability

Not applicable. The PRD explicitly excludes analytics/instrumentation, and the app has no metrics/logging backend (no Prometheus/Grafana). The only diagnostic is an optional `console.warn` if `openSupportEmail()` cannot open a mail client — informational, not a metric.

## Technical considerations

### Key decisions

- **`ScrollView` + `.map`, not `FlatList`** — the React Native standard prefers `FlatList` for "large or dynamic collections". This dataset is fixed at three sections with ≤3 items each; virtualization adds complexity and breaks the "render all items of the open section at once" requirement. A `ScrollView` matches the existing `home.tsx`/onboarding screens. **Justified deviation.**
- **Local state via a hook, not Zustand** — accordion open-state is ephemeral, screen-scoped, and must reset to Listas on every entry (PRD 2.5). A `useState`-based `useHelpAccordion` keeps state closest to use (RN standard) and avoids needless global state.
- **Reanimated `LinearTransition` for the reveal** — reuses the exact mechanism already proven in `step-indicator.tsx`, animating header color and content height (~200 ms) per DESIGN.md, without adding the `@animatereactnative/accordion` dependency.
- **`mailto:` via `expo-linking` with `canOpenURL` guard** — the documented safe pattern for non-`http(s)` schemes; degrades gracefully where no mail app exists.
- **Static typed data module** — mirrors `onboarding-steps.ts`; a `help-content.test.ts` pins the verbatim PT-BR copy so wording can't silently regress.

### Known risks

- **Reanimated height animation jank** — animating an auto-height content region can flicker if child layout isn't also transition-aware. Mitigation: drive the open/collapse by conditionally rendering content within an `Animated.View` carrying `layout={LinearTransition.duration(200)}`, and validate on a device build; fall back to color-only transition if a regression appears.
- **`canOpenURL` returning false** — on some iOS configurations `mailto:` queries can be restricted. Mitigation: attempt `openURL` regardless when `canOpenURL` is false would block a legitimate action is out of scope; current approach logs and no-ops, which satisfies the SHOULD-level requirement.
- **Copy fidelity** — answers contain nested quotes (e.g. "Criar lista de compras"); risk of escaping errors. Mitigation: the copy snapshot test plus careful string escaping in `help-content.ts`.
- **NativeWind translucent overlay** — the 16% white overlay and active-green states may be cleaner as inline `style` values (like `home-header.tsx`'s `ACTION_BG`) than utility classes; decided per component during build.

### Rules compliance

- **`.claude/rules/code-standards.md`** — English identifiers (PT-BR only in user-facing copy strings); verb-first function names (`toggleSection`, `openSupportEmail`); constants for magic numbers (animation duration, overlay alpha, min touch height); early returns; ≤3 params (objects/props otherwise); functions ≤50 lines, files ≤300 lines.
- **`.claude/rules/react-native-standards.md`** — functional components; core RN components only; NativeWind via `className` + `cn`; local state; explicit props (no spreading except wrapper buttons); `use`-prefixed hook; safe-area insets; `@testing-library/react-native` tests. `FlatList` preference is consciously waived (see Key decisions).
- **`.claude/rules/typescript-standards.md`** — `strict` mode; `interface` for shapes, union `type` for `HelpSectionId` (no enum); explicit return types on exports; `readonly` data; named imports; no `any`/non-null assertions.

### Skills compliance

- **`execute-task`** — implement each task following loaded rules/skills and Context7 docs.

### Relevant and dependent files

- `src/app/help.tsx` (modified — route entry)
- `src/app/(tabs)/home.tsx`, `src/features/home/components/home-header.tsx` (existing caller — `router.push('/help')`, `header-help`)
- `src/app/_layout.tsx` (root `Stack`, slide-from-right default)
- `src/features/onboarding/onboarding-steps.ts` (pattern for static data module)
- `src/features/onboarding/components/step-indicator.tsx` (Reanimated `LinearTransition` pattern)
- `src/components/ui/button.tsx`, `src/components/ui/section-label.tsx` (style/press patterns; ghost button reference)
- `src/lib/utils.ts` (`cn`), `src/lib/fonts.ts`, `tailwind.config.js` (`checkit` palette), `src/global.css`
- `DESIGN.md` (visual source of truth)
- New: `src/features/help/help-content.ts`, `use-help-accordion.ts`, `open-support-email.ts`, `components/help-header.tsx`, `components/faq-section.tsx`, `components/faq-tile.tsx`, `components/support-block.tsx`
- New tests: `__tests__/use-help-accordion.test.ts`, `help-content.test.ts`, `faq-section.test.tsx`, `faq-tile.test.tsx`, `support-block.test.tsx`, `help-header.test.tsx`, `help-screen.test.tsx`, `e2e/help.test.js`
