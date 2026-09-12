# Feature: Limit ("Passo 1 de 2")

**Route:** `/limit` · **Entry:** `src/app/limit.tsx`

## What it means

The list-creation screen, and the moment the product's promise is made: **the
user commits to a budget before the list exists**. Reached from the Home CTA;
confirming creates the active list and routes to `/shop`.

This is why every later screen can talk about "quanto ainda dá pra gastar" —
there is no path to a list without a limit.

## How it works

- `use-limit-input.ts` implements **Nubank-style cents-fill typing**: the input
  keeps a raw digit string, not a number. Typing `1 5 0 0` yields `R$ 15,00`.
  Digits are sanitized (`\D` stripped) and capped at 9. `cents` is simply
  `parseInt(digits)`.
- `components/preset-pills.tsx` — one-tap R$ 200 / 500 / 1000 presets, which
  just write the digit string.
- `components/currency-hero.tsx` — the 56px tabular-numeric display.
- Confirming calls `createActiveList(cents)` and puts it in the active-list
  store, then navigates to `/shop`.

## Invariants

- **`isValid` is `cents > 0`** and the "Criar lista" button must stay disabled
  while invalid — a zero-limit list is meaningless and is the one thing this
  screen must prevent.
- The limit is **fixed at creation**; nothing in the app edits `limitInCents`
  afterwards. Changing that would require a decision about the notification
  latch (see the notifications feature).
- Closing with the X creates nothing and returns the user where they were.
- The default list name is `Lista de DD/MM` (pt-BR formatter, built in
  `active-list.ts`); it is editable later from the Shop header.

## Tests

`__tests__/limit-screen.test.tsx`, `__tests__/use-limit-input.test.ts`,
`__tests__/preset-pills.test.tsx`, `__tests__/currency-hero.test.tsx`,
`e2e/limit.test.js`.
