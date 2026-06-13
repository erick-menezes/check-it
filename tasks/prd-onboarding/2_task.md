# Task 2.0: Onboarding screen & components (store, routing gate, components, flow & assembly)

## Overview

Build the full onboarding experience on top of the Task 1.0 foundation: the
persistence store, the first-run routing gate, the presentational components and
PT-BR content, and the flow hook that drives the assembled screen. This task
delivers a working, navigable, show-once onboarding that exits to `/home`. It
groups techspec build-order steps 2–5 into one deliverable, each backed by the
unit tests defined in the techspec.

<skills>
### Skills compliance

- **execute-task** — implement following rules + Context7 / pinned Expo v56 docs (splash, font, router APIs).
- **execute-review** — `git diff` review; full test suite must pass.
- **execute-qa** — validate against PRD/spec, WCAG 2.2, visual fidelity to DESIGN.md.
- **create-github-commit** / **create-github-pull-request** — Conventional Commit + PR targeting `dev`.
</skills>

<requirements>
- **Store:** Zustand + `persist`/`AsyncStorage` (key `checkit:onboarding`) exposing `hasSeenOnboarding`, `hasHydrated`, `markOnboardingSeen`; `partialize` persists only `hasSeenOnboarding`; `hasHydrated` set in `onRehydrateStorage`; gate **fails open to onboarding** on a corrupted/absent record (FR 5.1–5.3).
- **Routing gate:** `_layout.tsx` hides splash only when `hasHydrated && fontsLoaded`, loads fonts, registers `onboarding`/`home` routes; `index.tsx` decider renders `null` until hydrated, then redirects to `/onboarding` (unseen) or `/home` (seen); new `/home` placeholder route exists (FR 5.2, 6.1, 6.2).
- **Components:** `halo-icon` (168 px `GlassView` frosted halo hosting a ~92 px Lucide icon, translucent-`View` fallback when glass unsupported); `step-indicator` (3 dots, active stretches to ~22 px, `Passo X de 3` accessible announcement); `onboarding-step` (halo + kicker + title + body); `onboarding-footer` (Skip on every step, Back on steps 2–3, `Próximo` → `Vamos lá!` primary) (FR 1.2, 2.1–2.3, 3.1, 4.1–4.2).
- **Content:** `onboarding-steps.ts` — `readonly OnboardingStepContent[]` of length 3 (welcome → limite → listas) in PT-BR; `TOTAL_STEPS` derives from length (FR 1.1, 1.3).
- **Flow + screen:** `use-onboarding-flow` owns 0-based `currentStep` clamped to `[0, lastStep]` with derived `isFirstStep`/`isLastStep` and `goNext`/`goBack`/`finish` (FR 2.4 boundaries); `onboarding.tsx` shows exactly one step at a time with Reanimated `FadeIn`/`SlideInRight` + `LinearTransition`, accessibility labels, full-bleed green ground via `react-native-safe-area-context`; Skip & Finish both call `markOnboardingSeen()` then `router.replace('/home')` (FR 1.4, 3.2, 6.1).
</requirements>

## Subtasks

- [x] 2.1 Build `onboarding-store.ts` (Zustand + persist/AsyncStorage, partialize, hydration flag, fail-open) and unit-test it.
- [x] 2.2 Wire the first-run gate: modify `_layout.tsx` (splash/hydration/font gating + route registration), `index.tsx` decider, add `/home` placeholder; unit-test the decider.
- [x] 2.3 Author `onboarding-steps.ts` PT-BR content (welcome → limite → listas) with `TOTAL_STEPS`.
- [x] 2.4 Build `halo-icon`, `step-indicator`, `onboarding-step`, `onboarding-footer`; unit-test the indicator (3 markers, active emphasis, `Passo X de 3`).
- [x] 2.5 Build `use-onboarding-flow` (advance/clamp/derive) and unit-test boundary protection.
- [x] 2.6 Assemble `onboarding.tsx` with Reanimated transitions + a11y labels; unit-test single-step display, `Próximo`→`Vamos lá!` switch, Skip on every step, Skip/Finish call `markOnboardingSeen`.

## Implementation details

See `techspec.md`:
- "System architecture → Component overview" and "Data flow" (store/decider/exit wiring).
- "Implementation design → Main interfaces" (`OnboardingState`, `OnboardingFlow`, `OnboardingStepContent`) and "Data models" (persisted shape, partialize, step content).
- "Integration points" (`AsyncStorage`, `expo-splash-screen`, `expo-font`, `expo-glass-effect` fallback).
- "Development sequencing → Build order" steps 2–5.
- "Technical considerations → Key decisions" (single screen/local step state, decider vs exit route, `router.replace`, Reanimated, Lucide, glass fallback) and "Known risks → Splash-gate race / Glass-effect support variance".
- "Monitoring and observability" (minimal `console.warn`, gate fails open).
- DESIGN.md + PRD for copy, layout, motion, and accessibility specifics.

## Success criteria

- First run shows onboarding on step 1; returning users go straight to `/home` with no onboarding flash.
- Exactly one step visible at a time; primary action is `Próximo` on steps 1–2 and `Vamos lá!` on step 3; Skip available on every step including the first; Back available on steps 2–3; cannot advance past the last or before the first step.
- Step indicator shows 3 markers with the active one emphasized and announces `Passo X de 3`.
- Skip and Finish both persist `hasSeenOnboarding` and `router.replace('/home')`.
- Halo renders via glass effect, falling back to a translucent view where unsupported; green ground is full-bleed and safe-area aware.
- `pnpm typecheck` passes; all unit tests for this task green.

## Task tests

- [x] Unit tests — store (`markOnboardingSeen` flips + writes, rehydration sets `hasHydrated`, partialize excludes `hasHydrated`); `use-onboarding-flow` (advance/clamp boundaries); onboarding screen (single step, label switch, Skip presence, Skip/Finish persistence); step-indicator (3 markers, active emphasis, `Passo X de 3`); index decider (null until hydrated, routes by flag). Per techspec "Unit tests".
- [ ] Integration tests — full walk + persistence consolidated in Task 3.0.
- [ ] E2E tests — consolidated in Task 3.0.

## Relevant files

- `src/app/_layout.tsx` (modify — gate, splash, fonts, route registration)
- `src/app/index.tsx` (modify — first-run decider)
- `src/app/onboarding.tsx` (new), `src/app/home.tsx` (new)
- `src/features/onboarding/onboarding-store.ts` (new)
- `src/features/onboarding/onboarding-steps.ts` (new)
- `src/features/onboarding/use-onboarding-flow.ts` (new)
- `src/features/onboarding/components/{onboarding-step,step-indicator,halo-icon,onboarding-footer}.tsx` (new)
- `__tests__/*` (new — store, flow, screen, indicator, decider unit tests)
- References: `DESIGN.md`, `tasks/prd-onboarding/prd.md`, `tasks/prd-onboarding/techspec.md`
