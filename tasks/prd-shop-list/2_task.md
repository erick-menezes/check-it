# Task 2.0: Shared UI primitives and Shop List screen shell

## Overview

Build the reusable `bottom-sheet` and `confirm-dialog` primitives, then replace the `/shop` stub with the real screen shell: hero header (editable title + translucent budget chip with progress bar and status line), add-product input with the suggestions box, and the empty state. After this task the screen renders, accepts items and shows live budget feedback.

<skills>
### Skills compliance

- `execute-task` — implementation workflow for this task.
- `design-md` — `DESIGN.md` is the styling authority (palette, sheets, motion, type scale).
- `execute-review` — code review after implementation.
- `create-github-commit` — Conventional Commits for the resulting changes.
</skills>

<requirements>
- `bottom-sheet.tsx`: RN `Modal`, 24 px top corners, drag handle, `rgba(0,0,0,.45)` backdrop dismissing on press, 280 ms reanimated translate-up.
- `confirm-dialog.tsx`: centered dialog, tinted icon tile, ghost cancel + filled confirm with danger/primary tones.
- Header: auto-filled title editable on tap (underline affordance), persisted via `renameList`; chip shows "NO CARRINHO" (checked total) and "LIMITE" in pt-BR tabular numerals; progress bar = checked ÷ limit capped at 100% with default / Honey Mustard (≥85%) / Alert Crimson (over) thresholds; status line branches: "Excedeu em R$ X" / "Faltam N • R$ Y a comprar" / "Ainda dá pra gastar R$ Z".
- Add input: confirming non-empty text appends an item (qty 1, no price, no category, unchecked) and clears; confirm button disabled/inert while empty or whitespace; focusing the empty input shows the "Sugestões" box (static set behind `getSuggestions()`); a chip tap adds directly; box hides on text or blur.
- Empty state renders exactly at 0 items with the handoff copy and ghost "Escanear cupom" CTA (opens the Receipt sheet shell — functional scan lands in task 5.0).
- Accessibility: labels/roles/states on all interactive elements; chip announces "No carrinho R$ X de R$ Y"; touch targets ≥ 44 px.
</requirements>

## Subtasks

- [x] 2.1 Create `src/components/ui/bottom-sheet.tsx` and `src/components/ui/confirm-dialog.tsx`.
- [x] 2.2 Create `src/features/shop/suggestions.ts` with `getSuggestions(): readonly string[]`.
- [x] 2.3 Create `src/features/shop/components/shop-header.tsx` (editable title, budget chip, progress, status line).
- [x] 2.4 Create `src/features/shop/components/add-product-input.tsx` + `suggestions-box.tsx`.
- [x] 2.5 Create `src/features/shop/components/empty-state.tsx`.
- [x] 2.6 Replace `src/app/shop.tsx` stub: `FlatList` scaffold with header/input as list header, empty state, store wiring; keep Limit-confirmation and Home-card entry points untouched.
- [x] 2.7 Unit tests: bottom-sheet open/dismiss/backdrop, confirm-dialog confirm/cancel, header status-line branches (over / pending / remaining) and title editing, add-input disabled state and suggestion box visibility, empty state rendering, `shop.tsx` screen test.

## Implementation details

See techspec.md — "Component overview (New — shared UI / shop feature)", "Data flow", and the PRD features 1, 2 and 6 (empty state only). Visual specs per `DESIGN.md` and `design-handoff/project/screens.jsx`.

## Success criteria

- Creating a list on the Limit screen lands on the real shop screen (no stub anywhere on the path).
- Adding a product takes at most 2 interactions (type + confirm, or 1 suggestion tap).
- Status line and bar colors flip correctly at the 85% and 100% thresholds within the same interaction.
- All mutations persist immediately (verified via store tests from task 1.0 wiring).
- NativeWind classes with existing `checkit` tokens; light theme only; Plus Jakarta Sans.

## Task tests

- [x] Unit tests (primitives, header branches, add-input, suggestions, empty state, screen)
- [x] Integration tests (add via input/suggestion → header totals update)
- [ ] E2E tests — not applicable (covered in task 6.0)

## Relevant files

- `src/components/ui/bottom-sheet.tsx`, `src/components/ui/confirm-dialog.tsx` (new)
- `src/features/shop/suggestions.ts`, `src/features/shop/components/shop-header.tsx`, `add-product-input.tsx`, `suggestions-box.tsx`, `empty-state.tsx` (new)
- `src/app/shop.tsx`
- `src/lib/currency.ts`, `src/lib/utils.ts`, `src/components/ui/button.tsx`
- `__tests__/bottom-sheet.test.tsx`, `__tests__/confirm-dialog.test.tsx`, `__tests__/shop-header.test.tsx`, `__tests__/add-product-input.test.tsx`, `__tests__/shop-empty-state.test.tsx`, `__tests__/shop-screen.test.tsx` (new)
- `DESIGN.md`, `design-handoff/project/screens.jsx`
