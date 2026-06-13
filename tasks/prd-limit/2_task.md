# Task 2.0: Input core: `use-limit-input` hook + `CurrencyHero` + `PresetPills`

## Overview

Build the signature cents-fill interaction: a hook owning the whole input behavior contract (digit string → derived `cents`), plus the two presentational components that consume it — the tappable currency hero with its hidden auto-focused `TextInput`, and the row of preset pills.

<skills>
### Skills compliance

- `execute-task` — drives the implementation flow for this task
- `execute-review` — code review after the task is finalized
- `create-github-commit` — Conventional Commits when committing the deliverable
</skills>

<requirements>
- `useLimitInput()` in `src/features/limit/use-limit-input.ts` exposes `cents`, `digits`, `isValid` (`cents > 0`), `setDigits` (strips non-digits, caps at 9 — `MAX_LIMIT_DIGITS` constant) and `setPreset(amountInCents)` overwriting `digits` (FR 2/3/4/5/9/10/11)
- Backspace handled by re-parsing `onChangeText` output — no `onKeyPress` (techspec key decision)
- `CurrencyHero` in `src/features/limit/components/currency-hero.tsx`: muted `R$` prefix, 56 px tabular value via `formatBRLAmount`, pencil + "Toque para editar" hint, hidden `TextInput` (opacity 0, 1×1, `caretHidden`, `contextMenuHidden`, `autoFocus`, `keyboardType="number-pad"`, `maxLength={9}`); tapping anywhere focuses the input (FR 1/7/8)
- Muted/placeholder treatment while value is zero; full-strength white once non-zero (FR 7)
- Accessibility: the hero announces the formatted currency amount (use `formatBRL` for the label); pills have accessible labels/roles
- `PresetPills` in `src/features/limit/components/preset-pills.tsx`: three translucent pills R$ 200 / R$ 500 / R$ 1000, each tap calls `onSelect(amountInCents)` (FR 9)
- Styling per DESIGN.md/handoff via NativeWind `className` + `cn`; rgba alpha fills follow the existing `Button` inline-style precedent
</requirements>

## Subtasks

- [x] 2.1 Implement `use-limit-input.ts` (pure state logic, no JSX)
- [x] 2.2 Implement `currency-hero.tsx` with the hidden-`TextInput` pattern and tap-to-focus
- [x] 2.3 Implement `preset-pills.tsx`
- [x] 2.4 New `__tests__/use-limit-input.test.ts` with `renderHook` (unit)
- [x] 2.5 New `__tests__/currency-hero.test.tsx` and `__tests__/preset-pills.test.tsx` (component)

## Implementation details

See techspec.md → "Component overview" (new components), "Main interfaces" (`LimitInput`), "Data flow" and "Key decisions" (hidden `TextInput` rationale, digit-string state). Visual specs in DESIGN.md and `design-handoff/project/screens.jsx:351-459`.

## Success criteria

- Typing `4`, `0`, `5`, `0` yields R$ 40,50; backspace shrinks `"4050"` → `"405"` (R$ 4,05); 10th digit ignored; non-digits stripped (FR 2–5)
- Preset tap sets the exact amount replacing any typed value; typing after a preset keeps editing from the new value (FR 9/10)
- `isValid` is `false` only at exactly zero
- Hero renders muted at R$ 0,00 and full-strength when filled; tap (including the hint) focuses the hidden input; accessibility label announces the formatted amount
- Full Jest suite passes; no TypeScript errors

## Task tests

- [x] Unit tests: `__tests__/use-limit-input.test.ts` (new)
- [x] Integration tests: component tests `__tests__/currency-hero.test.tsx`, `__tests__/preset-pills.test.tsx` (new)
- [x] E2E tests: not applicable (covered by task 4.0)

## Relevant files

- `src/features/limit/use-limit-input.ts` (new)
- `src/features/limit/components/currency-hero.tsx` (new)
- `src/features/limit/components/preset-pills.tsx` (new)
- `__tests__/use-limit-input.test.ts`, `__tests__/currency-hero.test.tsx`, `__tests__/preset-pills.test.tsx` (new)
- `src/lib/currency.ts` (dependency from task 1.0)
- `src/lib/utils.ts` (`cn`), `tailwind.config.js`, `DESIGN.md` (referenced, unchanged)
