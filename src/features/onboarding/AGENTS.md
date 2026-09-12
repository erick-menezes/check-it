# Feature: Onboarding

**Route:** `/onboarding` · **Entry:** `src/app/onboarding.tsx`

## What it means

The first-run intro. Three "slides" on a single full-bleed green screen that
explain what Check.it is — shopping lists **with budget control** — in under
~15 seconds, then get out of the way. It exists because a new user opening the
app has no idea why this is not just a notes app.

Shown **once ever**. Skippable from the very first step in a single tap.

## How it works

- `src/app/index.tsx` is the decider: it redirects to `/home` when
  `hasSeenOnboarding` is true, otherwise to `/onboarding`. While the store has
  not hydrated it redirects to `/onboarding` — safe because the root layout
  renders nothing until every store has hydrated.
- `onboarding-steps.ts` holds the three steps as data (kicker, title, body,
  Lucide icon). Copy changes happen here, not in components.
- `use-onboarding-flow.ts` owns step index + `finish()`, which marks the store
  and calls the caller-supplied `onExit`. Step navigation is clamped, never
  wrapping.
- `onboarding-store.ts` persists only `hasSeenOnboarding` under
  `checkit:onboarding`.

## Invariants

- Both "Pular" and finishing the last step must call `finish()` — reaching the
  app without marking the flag would re-show onboarding on the next launch.
- The screen is a single route with internal state, **not** three routes. Do not
  turn steps into navigation history.

## Visual notes

Leaf-green ground, frosted "halo" icon (`components/halo-icon.tsx`), stretchy
pill step indicator, `Wordmark` with the accent-yellow ".". See DESIGN.md.

## Tests

`__tests__/onboarding-screen.test.tsx`, `__tests__/onboarding-store.test.ts`,
`__tests__/use-onboarding-flow.test.ts`, `__tests__/index-decider.test.tsx`,
`e2e/smoke.test.js`.
