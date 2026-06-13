# Product Requirements Document (PRD)

## Overview

Check.it is a Brazilian-Portuguese mobile shopping-list app whose core promise is per-list budget control. Today, tapping the "Criar lista" call to action on Home opens a placeholder stub. This feature replaces that stub with the real **list creation screen — "Limit" (Passo 1 de 2)** — where the user defines the spending limit (R$) for a new shopping list before adding items.

The screen solves the first step of the app's central loop: before a list exists, the user commits to a budget. It is designed for budget-conscious shoppers who want to be alerted when a purchase approaches or exceeds what they planned to spend. Without this screen, no list can be created and the rest of the product (shop list, summary, alerts) has no entry point.

The visual reference is the "Limit (Step 1 of 2)" screen in the design handoff (`design-handoff/`) and `DESIGN.md`: a full-bleed Herbal Leaf Green ground, a giant 56 px tabular-numeric currency hero with Nubank-style cents-fill typing, translucent preset value pills, and an accent-yellow "Criar lista" finisher button.

## Objectives

- Enable the end-to-end "create a list" entry flow: Home CTA → limit screen → active list created → shop screen route.
- A user can set a limit and confirm in under 15 seconds (typing a value or tapping a preset requires at most 2 interactions before confirming).
- 100% of confirmations result in a persisted active list with the chosen limit, surviving app restarts.
- Zero invalid lists: it must be impossible to confirm with a value of R$ 0,00.
- Visual fidelity to the design handoff (layout, palette, type scale, motion) with dark mode explicitly dropped.
- All flows covered by automated tests, consistent with the project's existing per-screen test suites.

## User Stories

**Primary persona — Budget-conscious shopper (pt-BR):** plans grocery trips with a fixed amount in mind and wants the app to hold them accountable.

- As a shopper, I want to tap "Criar lista" on Home and immediately type my budget, so that starting a list takes seconds.
- As a shopper, I want the value to fill from the cents as I type (e.g., typing `1`, `5`, `0`, `0` shows R$ 15,00), so that entering currency feels natural and error-proof.
- As a shopper, I want one-tap preset values (R$ 200, R$ 500, R$ 1000), so that I can skip typing for common budgets.
- As a shopper, I want the confirm button disabled while the value is R$ 0,00, so that I cannot create a meaningless list.
- As a shopper, I want to close the screen with the X if I change my mind, so that I return to where I was with nothing created.
- As a shopper, I want my new list (with its limit) to exist as my active list after confirming, so that Home and future screens reflect it even if I restart the app.

**Edge cases:**

- As a shopper who types more than 9 digits, I want extra input ignored, so the value stays within R$ 9.999.999,99.
- As a shopper who taps a preset after typing, I want the preset to replace my typed value, so the displayed amount is unambiguous.
- As a shopper who already has an active list, creating a new one replaces it as the current active list.

## Core features

### 1. Cents-fill currency input

**What:** A giant currency display (R$ prefix + 56 px tabular numerals) that fills digit-by-digit from the cents as the user types on the native numeric keyboard. There is no visible text field; the hero number itself is the input.
**Why:** It is the signature interaction of the screen — fast, familiar (Nubank-style) and impossible to mis-format.
**How (high level):** The screen opens with the keyboard already up and the value at R$ 0,00 (rendered muted). Each typed digit appends to the cents; backspace removes the last digit. Tapping the hero (or its "Toque para editar" hint) re-summons the keyboard if dismissed.

**Functional requirements:**

1. The screen must auto-focus the value input on mount so the native numeric keyboard opens immediately.
2. Input must accept digits only; any non-digit input is ignored.
3. Typed digits must fill from the cents leftward (cents-fill), e.g. `4`, `0`, `5`, `0` → R$ 40,50.
4. Backspace must remove the rightmost digit, shifting the value down (R$ 40,50 → R$ 4,05).
5. The value must be capped at 9 digits (R$ 9.999.999,99); further digits are ignored.
6. The value must render in pt-BR currency format: thousands separated by `.`, cents by `,`, prefixed by a smaller, muted `R$`.
7. While the value is R$ 0,00, the number renders in a muted/placeholder treatment; once non-zero, full-strength white.
8. Tapping the value area (including the pencil + "Toque para editar" hint) must focus the input and reopen the keyboard.

### 2. Preset value pills

**What:** Three translucent frosted pills — R$ 200, R$ 500, R$ 1000 — below the currency hero.
**Why:** Common budgets become a single tap, reducing time-to-confirm.
**How (high level):** Tapping a pill sets the value to exactly that amount.

**Functional requirements:**

9. Tapping a preset pill must set the value to that exact amount (e.g., R$ 500,00), replacing any current value.
10. After tapping a preset, the user must still be able to edit the value by typing.

### 3. Confirm — "Criar lista"

**What:** A full-width accent-yellow (Honey Mustard) large button with a right arrow icon, anchored at the bottom of the screen.
**Why:** It is the moment the list is born; the accent variant marks it as the celebratory "go" action per the design system.
**How (high level):** On tap, a new active shopping list is created with the chosen limit and persisted, then the app navigates to the shop list screen (step 2 — currently a stub, out of this feature's scope).

**Functional requirements:**

11. The button must be disabled while the value is R$ 0,00 and enabled for any value > R$ 0,00.
12. Confirming must create and persist a new active list carrying the chosen limit, using the app's existing active-list state so Home reflects it.
13. Confirming must replace any previously active list as the current one.
14. After confirming, the app must navigate to the shop list route (step 2 screen, existing stub).
15. The persisted list must survive app restart (same persistence guarantees as the existing active-list behavior).

### 4. Screen chrome and exit

**What:** Full-green screen with a white X close affordance top-left, the "PASSO 1 DE 2" kicker, the title "Qual será o seu valor limite?", and the helper copy "Te alertamos se a compra ultrapassar esse valor."
**Why:** Sets context (step 1 of a 2-step flow) and provides a safe exit.
**How (high level):** The X dismisses the screen and returns to the previous screen.

**Functional requirements:**

16. Tapping X must dismiss the screen and return to the originating screen (Home), discarding any typed value with no confirmation prompt.
17. The screen must replace the existing stub at the current `/limit` route, keeping the Home CTA entry point working unchanged.
18. All copy must be in pt-BR exactly as in the handoff: "Passo 1 de 2", "Qual será o seu valor limite?", "Toque para editar", preset labels "R$ 200 / R$ 500 / R$ 1000", "Te alertamos se a compra ultrapassar esse valor.", button "Criar lista".

## User experience

**Entry:** Home → "Criar lista" CTA card → this screen slides in (320 ms slide-from-right per the design system's screen-in motion).

**Flow:** keyboard opens automatically → user types a value or taps a preset → "Criar lista" enables → tap → shop list route. Exit at any point via X.

**Visual requirements (per `DESIGN.md` and handoff):**

- Full-bleed Herbal Leaf Green (`#58AB6A`) background; all text white. Light status-bar content.
- 22 px horizontal gutters; content starts below the safe area.
- Kicker "PASSO 1 DE 2": 12 px / 700, +0.16em tracking, uppercase, ~80% opacity.
- Title: 26 px / 800, tight tracking, white.
- Currency hero: `R$` at 28 px / 700 (muted ~55% when zero, ~90% when filled); value at 56 px / 800, −0.04em tracking, tabular numerals; placeholder state at 45% white.
- "Toque para editar" hint with pencil icon, 12 px, ~70% opacity.
- Preset pills: 999 px radius, translucent white 14% fill, 25% white border, white 12 px / 600 labels.
- Helper copy: 14 px, ~85% opacity, max width ~290 px.
- CTA: accent (Honey Mustard `#F2B807`) large (52 px) full-width button, near-black label, arrow-right icon, 0.97 scale tap feedback; visually distinct disabled state; bottom padding clears the home indicator.
- Typography: Plus Jakarta Sans throughout (already loaded in the app).
- Dark mode: none — this feature ships light-only by product decision.

**Accessibility:**

- The X close control, currency input area, preset pills and CTA must have accessible labels/roles; disabled CTA must expose its disabled state.
- Touch targets at least 44 px in the smaller dimension (the X icon gets padded hit area).
- The value display must announce the formatted currency amount to screen readers.
- Color contrast: white on brand green and near-black on accent yellow follow the established system; the disabled CTA state must remain distinguishable by more than color alone (e.g., reduced opacity plus disabled semantics).

## High-level technical constraints

- **Platform:** Expo (SDK 56) / React Native with Expo Router file-based navigation; the screen must replace the existing stub route without changing the route path used by the Home CTA.
- **State:** must integrate with the existing persisted active-list state (zustand + AsyncStorage) rather than introducing a parallel store; the created list shape must conform to the existing `ActiveList` model.
- **Styling:** NativeWind utility classes per project rules; design tokens already defined in the Tailwind config / `DESIGN.md`.
- **Locale:** all user-facing copy and currency formatting in pt-BR; currency handling must reuse the project's existing currency utilities where applicable.
- **Input:** native numeric keyboard only — no custom keypad.
- **Offline-first:** the flow has no network dependency; everything works fully offline.
- **Testing:** unit/component tests with Jest + React Native Testing Library following the existing `__tests__/` patterns; an e2e spec consistent with the existing `e2e/` suites.

## Out of scope

- **Shop list screen (Passo 2 de 2):** adding/checking items remains a stub; this feature only navigates to it.
- **Dark mode:** dropped entirely by product decision — no dark variants anywhere.
- **List naming:** the list name is defined later (editable title on the shop screen, per handoff), not here.
- **Editing the limit of an existing list:** changing a limit after creation is a future concern.
- **Budget alert wiring:** the helper copy promises alerts, but connecting the limit to notification/alert logic is out of scope.
- **Multiple simultaneous lists / list history:** only the single active list concept is touched.
- **Authentication/sync:** no login, cloud sync or sharing behavior.
- **Currency configuration:** BRL only; no locale or currency switching.
