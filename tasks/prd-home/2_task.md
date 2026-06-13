# Task 2.0: Domain & store, presentational components & Home assembly

## Overview

Build the active-list domain model and persistence, the presentational pieces, and
the assembled anonymous Home screen. This delivers the real, on-brand Home that
shows the active-list card when a list exists and the empty state when it does not —
all stored locally and wired to the stubs from Task 1.0.

<skills>
### Skills compliance

- **execute-task** — implement following project rules and the pinned Expo v56 docs.
- **design-md** — apply DESIGN.md for the green hero, accent-tile CTA, list card
  (16 px corners, Mist border, whisper shadow, tabular-numeric currency), contextual
  progress-bar colors, ALL-CAPS eyebrow labels, empty-state halo, and tap feedback.
</skills>

<requirements>
- `ActiveList` type, `BudgetStatus` union, and pure derivations `getBudgetStatus`
  (<85% / 85–100% / >100%) and `getBudgetRatio` (clamped 0..1) — derived, never
  persisted (FR 3.3).
- `formatBRL(cents)` via `Intl.NumberFormat('pt-BR', { style: 'currency',
  currency: 'BRL' })`; money stored as integer cents.
- Zustand `active-list-store` mirroring the onboarding store: `persist` +
  AsyncStorage (key `checkit:active-list`), `partialize` excluding `hasHydrated`,
  `onRehydrateStorage` setting `hasHydrated`; fail open to empty state on corrupt
  read with `console.warn` (FR 6.1–6.3, monitoring section).
- `use-greeting` hook: `Bom dia` <12h, `Boa tarde` <18h, `Boa noite` after; subtitle
  fixed to "Pronto pra próxima compra?" with no name (FR 1.1, 1.2).
- Header with help/notifications quick actions; accent dot on notifications (FR 1.3,
  1.4); green hero styling with safe-area top spacing (FR 1.5).
- CTA card "Criar lista de compras" / "Defina um limite e comece" routing to the
  `limit` stub (FR 2.1–2.3).
- Active-list card: name, item count, date, total/limit, budget progress bar,
  "Abrir"; card/"Abrir" route to the `shop` stub (FR 3.1, 3.2, 3.4).
- Empty state (halo + title + caption, no card) when no list; "Lista atual" section
  NOT rendered; CTA still available (FR 4.1–4.3).
- Budget status conveyed non-visually as well as by color; meaningful PT-BR a11y
  labels on all interactive controls (accessibility requirements).
</requirements>

## Subtasks

- [x] 2.1 Create `src/features/home/active-list.ts` (type, `BudgetStatus`,
  `getBudgetStatus`, `getBudgetRatio`) and `src/lib/currency.ts` (`formatBRL`).
- [x] 2.2 Create `src/features/home/active-list-store.ts` (Zustand + persist +
  `hasHydrated`); wire the flag into the root `_layout` gate from Task 1.0.
- [x] 2.3 Create `src/features/home/use-greeting.ts`.
- [x] 2.4 Create `src/components/ui/section-label.tsx` (ALL-CAPS eyebrow).
- [x] 2.5 Create `home-header`, `create-list-cta`, `budget-progress-bar`,
  `active-list-card`, `home-empty-state` under `src/features/home/components/`.
- [x] 2.6 Assemble `app/(tabs)/home.tsx`: hero + CTA + conditional card/empty state
  + a11y labels + navigation wiring.
- [x] 2.7 Unit tests for domain, store, hook, currency, components, and the screen.

## Implementation details

See `techspec.md` — "Implementation design › Main interfaces / Data models"
(`ActiveList`, persisted shape, greeting & budget thresholds), "System architecture ›
Component overview" (feature module + shared files), and "Development sequencing ›
Build order" steps 1, 4, 5. Reuse the onboarding store pattern verbatim. Follow the
pinned Expo v56 docs per `CLAUDE.md`.

## Success criteria

- With a pre-populated store, Home renders "Lista atual" + card + "Abrir"; with
  `activeList: null`, Home renders the empty state and NOT the section (FR 4.1).
- CTA present in both states and routes without error (FR 4.3, 2.3).
- Active list survives app restart (local persistence; FR 6.1).
- Greeting varies by time of day and never includes a name (FR 1.1, 1.2).
- Budget bar color matches status and over-budget exposes a non-color a11y signal.
- DESIGN.md fidelity for hero, CTA, card, progress bar, and empty state.
- `pnpm typecheck` and the full suite pass.

## Task tests

- [x] Unit tests — `getBudgetStatus`/`getBudgetRatio` at the 0.85 and 1.0 boundaries
  and clamping; `active-list-store` writes through to AsyncStorage, rehydration sets
  `hasHydrated`, `partialize` excludes it; `use-greeting` thresholds + no name;
  `formatBRL` comma decimals / dot thousands; `home` screen card vs. empty + CTA in
  both states; `budget-progress-bar` color per status + non-color a11y signal.
- [ ] Integration tests — covered in Task 3.0.
- [ ] E2E tests — covered in Task 3.0.

## Relevant files

- `src/features/home/active-list.ts`, `active-list-store.ts`, `use-greeting.ts` (new)
- `src/features/home/components/{home-header,create-list-cta,active-list-card,budget-progress-bar,home-empty-state}.tsx` (new)
- `src/components/ui/section-label.tsx`, `src/lib/currency.ts` (new)
- `src/app/(tabs)/home.tsx` (assemble), `src/app/_layout.tsx` (wire hydration flag)
- `__tests__/*` (new unit tests for the above)
- References: `DESIGN.md`, `tasks/prd-home/prd.md`, `tasks/prd-home/techspec.md`
