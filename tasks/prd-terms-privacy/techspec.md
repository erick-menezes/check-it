# Technical specification

## Executive summary

The Terms & Privacy screen is a fully static, offline-only React Native screen that replaces the existing `terms` stub route (`src/app/terms.tsx`). It follows the exact architecture already proven by the Help screen: a route file that composes a feature-local header, a fixed control strip, and a `ScrollView` of statically bundled PT-BR content, with no store, no network, and no auth dependency. All legal copy ships as readonly TypeScript constants in a `terms-content.ts` module (the verbatim text was recovered from the design handoff bundle `api.anthropic.com/v1/design/h/aP1kl1d35SGqT6UQdpcrKQ`, `screens.jsx` lines 1671–1790).

Two architecture decisions shape the work: (1) the segmented control is built as a **shared design-system primitive** at `src/components/ui/segmented-control.tsx` (per DESIGN.md it is a system-level pattern; Terms is its first consumer), and (2) the existing `open-support-email.ts` helper is **promoted from `src/features/help/` to `src/lib/`** so the Terms contact footer can reuse the mailto behavior without a cross-feature dependency. Tab switching is local `useState`; the fade-on-switch is a Reanimated `entering={FadeIn}` on a keyed content view, consistent with the project's existing Reanimated usage (`Toggle`, `FaqSection`).

## System architecture

### Component overview

**New components:**

- **`src/app/terms.tsx`** (modified — stub replaced): route entry. Composes `TermsHeader`, `SegmentedControl`, and the tab content scroll area; owns the single piece of state (`activeTab: 'terms' | 'privacy'`, default `'terms'`). Sets `Stack.Screen` options (`animation: 'simple_push'`, 240 ms, gesture enabled) exactly like `help.tsx`.
- **`src/components/ui/segmented-control.tsx`** (new, shared): generic N-segment control. Linen Cream track (12 px radius, 4 px inner padding), 34 px segments (9 px radius, 12 px / 700 labels); selected segment Pure Snow with the card whisper shadow, unselected transparent with Pebble Gray text. Exposes `accessibilityRole="tab"` + `accessibilityState={{ selected }}` per segment and ≥44 px effective touch targets via `hitSlop`.
- **`src/features/terms/terms-content.ts`** (new): all static content — `TERMS_SECTIONS` (8 entries), `PRIVACY_SECTIONS` (6 entries with lucide icons), the two summary-card definitions, the last-updated label, and the tab definitions. Verbatim PT-BR copy from the design handoff.
- **`src/features/terms/components/terms-header.tsx`** (new): minimal header variant — white background, hairline Mist Border bottom, close (X) on the left, 22 px / 700 title, 13 px muted subtitle. Mirrors `HelpHeader` (close → `router.back()` with `canGoBack()` fallback to home), plus the subtitle required by PRD 1.2.
- **`src/features/terms/components/document-content.tsx`** (new): the per-tab scrollable body — last-updated line, summary card, section list, and contact footer — wrapped in a Reanimated view with `entering={FadeIn.duration(250)}`. Receives the active document's content as props; remounted via `key={activeTab}` so the `ScrollView` scroll position resets natively on tab switch (PRD 2.4).
- **`src/features/terms/components/document-section.tsx`** (new): one section row — 28 px leading tile (8 px radius, Linen Cream, Mist Border) holding either the section number (terms) or a 14 px icon (privacy), 14 px / 700 title, 13 px Slate Ink body at ~1.55 line height, 20 px bottom margin. One component for both documents (number vs. icon discriminated by props), matching the handoff's single `TermSection`.
- **`src/features/terms/components/contact-footer.tsx`** (new): dashed Mist Border block (14 px radius, center-aligned) with the support copy and a small soft-variant button (envelope icon + "Falar com o suporte") that calls `openSupportEmail()`.
- **`src/lib/open-support-email.ts`** (moved from `src/features/help/open-support-email.ts`): unchanged mailto helper (`contact@erickmenezesdev.com` via `Linking`). `SupportBlock` (help) and `ContactFooter` (terms) both import from the new location.
- **`src/components/ui/button.tsx`** (modified): gains a **`soft` variant** (Linen Cream fill, Charcoal Ink label) and a leading-icon slot, needed by the contact footer (DESIGN.md "Soft" button; current variants are `accent | onPrimary | ghost` with only a trailing arrow icon). If extending the icon API proves invasive, the fallback is a bespoke `Pressable` inside `ContactFooter` styled per DESIGN.md (as `SupportBlock` already does); decide at implementation time, preferring the `Button` extension.

**Data flow:** `terms.tsx` holds `activeTab` → passes segments + selected index to `SegmentedControl` (controlled component, fires `onChange(id)`) → selects the matching document model from `terms-content.ts` → renders `DocumentContent key={activeTab}` → static props flow down to `DocumentSection` rows and `ContactFooter`. No global state, no persistence, no I/O besides the mailto intent.

## Implementation design

### Main interfaces

```typescript
// src/components/ui/segmented-control.tsx
interface SegmentOption<T extends string> {
  readonly id: T;
  readonly label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[];
  selectedId: T;
  onChange: (id: T) => void;
  testID?: string;
}

export function SegmentedControl<T extends string>(
  props: SegmentedControlProps<T>,
): React.JSX.Element;
```

```typescript
// src/lib/open-support-email.ts (moved, unchanged contract)
export const SUPPORT_EMAIL = "contact@erickmenezesdev.com";
export async function openSupportEmail(): Promise<void>;
```

### Data models

```typescript
// src/features/terms/terms-content.ts
export type TermsTabId = "terms" | "privacy";

export interface DocumentSummary {
  readonly Icon: LucideIcon; // FileText | ShieldCheck
  readonly heading: string;
  readonly copy: string;
}

export interface TermsSection {
  readonly title: string;
  readonly body: string; // verbatim PT-BR, rendered with section number 1–8
}

export interface PrivacySection {
  readonly Icon: LucideIcon;
  readonly title: string;
  readonly body: string;
}
```

Exported constants: `TERMS_TABS` (two `SegmentOption<TermsTabId>` entries, "Termos de uso" first), `LAST_UPDATED_LABEL` (`'Atualizado em 14 de maio de 2026'`), `TERMS_SUMMARY` / `PRIVACY_SUMMARY`, `TERMS_SECTIONS: readonly TermsSection[]`, `PRIVACY_SECTIONS: readonly PrivacySection[]`.

The handoff uses Phosphor icon names; the app uses `lucide-react-native`. Icon mapping: `file-text → FileText`, `shield-check → ShieldCheck`, `clock-counter-clockwise → History`, `tray → Inbox`, `chart-bar → ChartColumn`, `users → Users`, `lock → Lock`, `check-circle → CircleCheck`, `eye → Eye`, `envelope → Mail` (verify exact exports against the installed `lucide-react-native@1.17` at implementation time).

### API endpoints

None. The screen is fully static and offline (PRD constraint: no network dependency).

## Integration points

- **Expo Router:** the screen occupies the existing `/terms` route; `src/features/settings/settings-content.ts` already targets `'/terms'` from the "Termos e privacidade" row — **no settings change required**.
- **Mail client via `Linking`:** the only external touchpoint. Reuses the existing guarded pattern (`canOpenURL` → `openURL`, `console.warn` on failure, silent no-op when no mail client exists). No auth, no timeouts beyond the helper's existing behavior.

## Testing approach

### Unit tests

Jest + `@testing-library/react-native`, mirroring the existing `__tests__/*` conventions (help screen tests are the closest references):

- **`__tests__/segmented-control.test.tsx`** — renders all options; selected/unselected styling hooks (testIDs); fires `onChange` with the tapped id; exposes `accessibilityRole="tab"` and `accessibilityState.selected` correctly.
- **`__tests__/terms-content.test.ts`** — exactly 8 terms sections and 6 privacy sections in PRD order; verbatim titles; last-updated label; tab order ("Termos de uso" first).
- **`__tests__/terms-header.test.tsx`** — title, subtitle, close button a11y label; `router.back()` when `canGoBack()`, `router.replace('/(tabs)/home')` otherwise (mock `expo-router` as in help-header tests).
- **`__tests__/document-section.test.tsx`** — numbered-tile mode vs icon-tile mode.
- **`__tests__/contact-footer.test.tsx`** — copy, button label/a11y, calls `openSupportEmail` on press (mock the lib module).
- **`__tests__/terms-screen.test.tsx`** — integration at screen level: opens on "Termos de uso" with all 8 sections; tapping "Privacidade" swaps to the 6 privacy sections and updates `accessibilityState.selected`; footer present on both tabs.

Mocks: only `expo-router` and `react-native-reanimated` (existing `__mocks__/` and `jest.setup.js` infrastructure already handles these for sibling screens — reuse it). Moving `open-support-email.ts` requires updating the existing help tests' mock paths.

### Integration tests

Covered by `terms-screen.test.tsx` above (screen + segmented control + content modules together). No store or API seams exist to justify a separate layer.

### E2E tests

`e2e/terms.test.js` (Detox, same skeleton as `e2e/settings.test.js`): launch fresh, skip onboarding, navigate Settings → "Termos e privacidade" row; assert the screen and default tab content are visible; tap "Privacidade" and assert privacy content; tap close and assert return to Settings. (The project's e2e runner is Detox, not Playwright — the playwright-cli skill does not apply to this native app.)

## Development sequencing

### Build order

1. **Move `open-support-email.ts` to `src/lib/`** + update help imports/tests — smallest isolated change, unblocks the footer.
2. **`terms-content.ts`** — pure data, no dependencies; lets every later component be built against real content.
3. **`SegmentedControl` (shared ui)** — self-contained primitive with its own tests.
4. **`Button` soft variant / icon slot** (or decide on the bespoke-Pressable fallback) — needed only by the footer.
5. **Feature components** — `TermsHeader`, `DocumentSection`, `ContactFooter`, then `DocumentContent` composing them.
6. **Route `terms.tsx`** — replace the stub, wire state + fade + scroll reset; delete the stub usage (keep `src/lib/stub-screen.tsx`, still used by other routes).
7. **Screen integration test + Detox e2e**, then full `pnpm typecheck`, `pnpm lint`, `pnpm test`.

### Technical dependencies

None external. Everything needed (expo-router ~56, reanimated 4.3.1, lucide-react-native, NativeWind, Detox) is already installed and patterned in the repo. No new packages.

## Monitoring and observability

No analytics or instrumentation (explicitly out of scope in the PRD). The only failure path — opening the mail client — keeps the existing `console.warn` on error. No metrics, no dashboards.

## Technical considerations

### Key decisions

- **Help-screen architecture as the template, not a new pattern.** The screen reuses the proven route-composes-feature-components shape (`help.tsx`), keeping navigation options, header behavior, and scroll layout consistent. Discarded: a generic "legal document" abstraction — only one screen needs it.
- **Static TS constants over JSON/CMS/remote fetch.** Copy is readonly typed constants (same as `help-content.ts`), giving offline guarantee, type safety, and testability for free. Updating copy requires an app release — accepted in the PRD.
- **`key`-remount + Reanimated `FadeIn` for tab switching.** Changing `key={activeTab}` on the content view remounts the `ScrollView` (scroll resets to top natively) and triggers `entering={FadeIn.duration(250)}` — both PRD 2.4 behaviors from one mechanism, using the library the project already animates with. Discarded: cross-fade of two mounted documents (needless complexity/memory) and `react-native-pager-view` (new dependency for two static pages).
- **Local `useState` over a zustand store.** Tab selection is ephemeral, single-screen UI state; the react-native-standards rule says to keep state where it is used. No persistence requirement exists.
- **Shared `SegmentedControl` in `components/ui`** (user decision): DESIGN.md defines it as a design-system pattern; building it generic (typed ids, controlled) costs nothing extra. Discarded: `@react-native-segmented-control/segmented-control` — native look can't match the Linen Cream/whisper-shadow design tokens.
- **Promote `open-support-email.ts` to `src/lib`** (user decision): avoids a terms → help cross-feature import; `src/lib` is the established home for shared non-UI helpers.
- **Footer copy conflict resolved in favor of the PRD.** The handoff says "Nosso time responde em até 2 dias úteis."; PRD 6.1 mandates "Nosso time responde assim que possível." The PRD is the authoritative, newer requirements document — use its copy.

### Known risks

- **Design-fidelity drift** (shadows, exact radii, segment transition timing) — mitigate by implementing directly from the handoff's extracted styles (segment: 34 px / radius 9 / ~200 ms; summary tile: 36 px / radius 10 / `#58AB6A`; section tile: 28 px / radius 8) and validating with the execute-qa visual pass.
- **Lucide icon-name mismatches** with the Phosphor names in the handoff (e.g., `ChartColumn` vs `BarChart3`, `CircleCheck` vs `CheckCircle2` across lucide versions) — verify exports against the installed package before wiring `terms-content.ts`.
- **Reanimated `entering` animations in Jest** can warn or no-op — the existing reanimated mock setup already handles this for `FaqSection`/`Toggle`; assert content, not animation, in tests.
- **44 px touch target vs 34 px segment height** — solved with `hitSlop` on each segment Pressable; confirm with the accessibility check in QA.
- **Moving `open-support-email.ts`** touches passing help tests — update import paths and mock targets in the same task to keep the suite green.

### Rules compliance

- **`.claude/rules/code-standards.md`** — English-only identifiers (PT-BR appears only in string content); kebab-case files; camelCase functions starting with verbs; constants for magic numbers (sizes, durations, gutters as named constants like `GUTTER = 22` per `help.tsx`); early returns; no flag params (`DocumentSection` discriminates by optional `Icon`/`number` props, not booleans); no blank lines inside functions; components well under length limits.
- **`.claude/rules/typescript-standards.md`** — strict mode; no `any`/`!`/`as`; `interface` for shapes, union type for `TermsTabId`; `readonly` content models; explicit return types on exported functions; named imports; generic constrained `SegmentedControl<T extends string>`.
- **`.claude/rules/react-native-standards.md`** — functional components in `.tsx`; RN core components only; NativeWind `className` with `cn()` for conditionals and `StyleSheet`/inline style only for dynamic or hairline values (as `HelpHeader` does); state local to the screen; explicit props (no spreading, except the `Button` wrapper's `...rest` which is the sanctioned exception); `SafeAreaView`/`useSafeAreaInsets` for the header; plain `.map` over a `FlatList` is acceptable here — 8/6 static rows inside a fixed-height document, matching the help screen's precedent; `@testing-library/react-native` tests for every component.

### Skills compliance

- **`execute-task`** — implementation will be driven task-by-task from this spec via the task files.

### Relevant and dependent files

- `src/app/terms.tsx` — stub to be replaced (route entry).
- `src/app/help.tsx`, `src/features/help/components/help-header.tsx`, `src/features/help/components/support-block.tsx` — architectural templates (screen shape, minimal header, support button).
- `src/features/help/open-support-email.ts` — moves to `src/lib/open-support-email.ts`; `support-block.tsx` and its tests update imports.
- `src/features/help/help-content.ts` — pattern for the static content module.
- `src/components/ui/button.tsx` — extended with the `soft` variant / leading icon.
- `src/components/ui/` — destination of `segmented-control.tsx`.
- `src/features/settings/settings-content.ts` — already routes `/terms`; no change, but validates the entry point.
- `tailwind.config.js` — `checkit-*` color tokens used throughout; no additions needed.
- `DESIGN.md`, `tasks/prd-terms-privacy/prd.md` — design and product sources; handoff bundle `screens.jsx` (lines 1671–1790) holds the verbatim copy and exact styles.
- `__tests__/help-*.test.tsx`, `e2e/settings.test.js`, `jest.setup.js`, `__mocks__/` — testing templates and shared mock infrastructure.
- New files: `src/features/terms/terms-content.ts`, `src/features/terms/components/{terms-header,document-content,document-section,contact-footer}.tsx`, `src/components/ui/segmented-control.tsx`, `__tests__/{segmented-control,terms-content,terms-header,document-section,contact-footer,terms-screen}.test.*`, `e2e/terms.test.js`.
