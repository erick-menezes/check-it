# Task 2.0: Components & screen — FAQ UI, header, support block, and composition

## Overview

Build every UI piece and compose the screen. Depends on Task 1.0 (data + hook).
Delivers the FAQ tile and animated accordion section, the minimal header with the
close affordance, the support block with the `mailto:` helper, and the
`src/app/help.tsx` screen that wires `useHelpAccordion` and navigation together.
Each component ships with its own unit tests; the cross-component integration and
E2E flow are owned by Task 3.0.

<skills>
### Skills compliance

- **execute-task** — implement following the loaded rules/skills and Context7 docs
  (Expo v56 docs per CLAUDE.md before writing Expo code).
- **.claude/rules/react-native-standards.md** — functional components, core RN
  components only, NativeWind via `className` + `cn`, explicit props (no spreading
  except wrapper buttons), safe-area insets, `@testing-library/react-native`.
- **.claude/rules/code-standards.md** — verb-first functions (`openSupportEmail`),
  constants for magic numbers (animation duration, overlay alpha, ≥44 px touch
  target), early returns, functions ≤50 lines / files ≤300 lines, English
  identifiers (PT-BR only in copy).
- **.claude/rules/typescript-standards.md** — `interface` for component props,
  explicit return types on exports, no `any` / non-null assertions.
</skills>

<requirements>
- **Header (PRD §1):** minimal variant (Pure Snow bg, hairline bottom border,
  Charcoal Ink text); title "Sobre o que você quer saber?" and subtitle
  "Selecione uma seção pra ver as principais dúvidas."; leading close (X) that
  returns to Home via `router.back()`, falling back to `router.replace('/(tabs)/home')`
  when `canGoBack()` is false.
- **Section (PRD §2):** leading icon + label + trailing plus/minus indicator;
  active state = Herbal Leaf Green (`#58AB6A`) bg with white text/icons, inactive =
  Linen Cream (`#F7F6F2`) bg with Charcoal Ink; ~200 ms Reanimated `LinearTransition`
  on expand/collapse; 14 px card radius, `overflow: hidden`.
- **FAQ items (PRD §3):** when open, render ALL question/answer pairs at once (no
  per-item interaction); each tile on a 16% white translucent overlay
  (`rgba(255,255,255,.16)`), question emphasized above the full answer in white.
- **Support block (PRD §5):** "Não achou sua dúvida?" title + caption "Manda pra
  gente que respondemos assim que possível."; full-width ghost button with envelope
  icon and label "contact@erickmenezesdev.com"; press triggers `openSupportEmail()`.
- **`openSupportEmail`** builds `mailto:contact@erickmenezesdev.com`, guards with
  `Linking.canOpenURL`, opens only when supported, and swallows failures.
- **Accessibility (PRD):** PT-BR `accessibilityLabel` / `accessibilityRole` on
  section headers and support button; `accessibilityState.expanded` reflects state;
  touch targets ≥44 px.
- **Screen:** composes header + scrollable accordion (`ScrollView` + `.map`) +
  support block; resets to Listas open on entry via `useHelpAccordion`.
</requirements>

## Subtasks

- [x] 2.1 `src/features/help/components/faq-tile.tsx` — single Q/A tile on the
  translucent overlay.
- [x] 2.2 `src/features/help/components/faq-section.tsx` — accordion card composing
  `faq-tile`, with the `LinearTransition` header-color/height animation and a11y state.
- [x] 2.3 `src/features/help/components/help-header.tsx` — minimal header with close
  affordance.
- [x] 2.4 `src/features/help/open-support-email.ts` and
  `src/features/help/components/support-block.tsx` — ghost button + `mailto:` helper.
- [x] 2.5 Replace the `StubScreen` in `src/app/help.tsx` with the composed screen;
  wire `useHelpAccordion`, scroll container, and navigation.
- [x] 2.6 Write per-component unit tests.

## Implementation details

See `techspec.md` → "Component overview", "Integration points" (Expo Router close
behavior, `expo-linking` guard, safe-area insets), and "Technical considerations →
Key decisions / Known risks" (ScrollView over FlatList, Reanimated reveal, overlay
styling). Build order items 3–5 of techspec "Development sequencing". Style/press
references: `src/components/ui/button.tsx`, `src/features/home/components/home-header.tsx`,
`src/features/onboarding/components/step-indicator.tsx` (Reanimated pattern);
palette in `tailwind.config.js` (`checkit`), `src/lib/fonts.ts`, `DESIGN.md`.

## Success criteria

- Help screen renders header, three section cards, and the support block.
- Listas is expanded on mount showing all its tiles; switching sections collapses
  the prior one (driven by the hook, verified end-to-end in Task 3.0).
- Section header active/inactive colors, plus/minus indicator, overlay, radii, and
  spacing match DESIGN.md; section transition animates ~200 ms.
- Support button opens the mail composer; absence of a mail client never crashes.
- A11y labels/roles/state present; touch targets ≥44 px.
- `tsc` passes; all component unit tests pass.

## Task tests

- [x] Unit tests — `__tests__/faq-tile.test.tsx` (renders question + answer).
- [x] Unit tests — `__tests__/faq-section.test.tsx` (collapsed: label + plus, no
  tiles; open: all tiles + minus; `accessibilityState.expanded` reflects state;
  `onToggle` fires with section id; touch target ≥44 px).
- [x] Unit tests — `__tests__/help-header.test.tsx` (title/subtitle; close affordance
  PT-BR `accessibilityLabel`; triggers navigation — router mocked).
- [x] Unit tests — `__tests__/support-block.test.tsx` (title/caption/button; press
  calls `openSupportEmail` — `Linking` mocked).
- [ ] Integration tests — n/a (covered in Task 3.0).
- [ ] E2E tests — n/a (covered in Task 3.0).

## Relevant files

- `src/features/help/components/faq-tile.tsx`, `faq-section.tsx`, `help-header.tsx`,
  `support-block.tsx` (new)
- `src/features/help/open-support-email.ts` (new)
- `src/app/help.tsx` (modified — route entry, replaces `StubScreen`)
- `src/components/ui/button.tsx`, `src/features/home/components/home-header.tsx`,
  `src/features/onboarding/components/step-indicator.tsx` (references)
- `src/lib/utils.ts` (`cn`), `src/lib/fonts.ts`, `tailwind.config.js`, `DESIGN.md`
- `__tests__/faq-tile.test.tsx`, `faq-section.test.tsx`, `help-header.test.tsx`,
  `support-block.test.tsx` (new)
