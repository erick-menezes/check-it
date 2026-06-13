# Task 3.0: Item list and Edit Item sheet

## Overview

Deliver the in-store working surface: item card rows (checkbox, tinted category tile, name with checked strikethrough, "qty× unit price" subtitle, line total, edit button) preceded by the "Marcar todos (x/y)" master checkbox, swipe-to-delete with the crimson "Excluir" underlay, the delete-list flow, and the Edit Item bottom sheet (name, cents-fill price, quantity stepper, category picker, save, remove with confirmation).

<skills>
### Skills compliance

- `execute-task` — implementation workflow for this task.
- `design-md` — `DESIGN.md` is the styling authority (card radii, category tints, checkbox spec).
- `execute-review` — code review after implementation.
- `create-github-commit` — Conventional Commits for the resulting changes.
</skills>

<requirements>
- Row: toggling flips checked state and updates header totals immediately; category tile uses the category color at 18% tint (neutral Slate Gray when `category` is null); subtitle "N× R$ U" or "N× sem preço"; line total "—" when priceless; tap on body or edit button opens the Edit Item sheet.
- Master checkbox shows "Marcar todos (checked/total)", is checked only when all are checked, and sets every item on toggle.
- Swipe left reveals the crimson "Excluir" underlay (`ReanimatedSwipeable`); tapping removes immediately; swiping back hides without removing; removal also exists in the edit sheet (non-gesture equivalent).
- Edit sheet opens pre-filled; price input is digits-only cents-fill (`6`,`9`,`0` → R$ 6,90) with live "Total: R$ X" when a price exists; stepper minimum 1; 7 category chips with selected fill and tap-again-to-clear (no selection is valid); "Salvar alterações" persists and closes; backdrop/X discards; "Remover item" confirms via dialog ("Remover “[name]”?").
- "Excluir" ghost-danger button at the bottom confirms ("Excluir esta lista?" with list name), deletes the list and navigates back to Home.
- `FlatList` with stable `keyExtractor` (item id); `useCallback`/`useMemo` for `renderItem`/derived arrays.
</requirements>

## Subtasks

- [x] 3.1 Create `src/features/shop/components/item-row.tsx` (card row wrapped in `ReanimatedSwipeable` with delete underlay).
- [x] 3.2 Create `src/features/shop/components/mark-all-row.tsx`.
- [x] 3.3 Create `src/features/shop/use-price-input.ts` (cents-fill, patterned on `use-limit-input`).
- [x] 3.4 Create `src/features/shop/components/edit-item-sheet.tsx` (name, price, stepper, category picker, save, remove + confirmation).
- [x] 3.5 Create `src/features/shop/components/delete-list-button.tsx` and wire deletion → confirm dialog → Home navigation.
- [x] 3.6 Wire rows, mark-all and delete button into `src/app/shop.tsx`.
- [x] 3.7 Unit tests: item-row subtitle/total formats and toggle, mark-all counter and toggle semantics, `use-price-input`, edit-sheet save/discard/category-toggle/remove confirmation, delete-list confirmation flow.
- [x] 3.8 Integration tests: full loop add → check → edit → remove → rename with Home card consistency (extends the `home-tabs-integration` style).

## Implementation details

See techspec.md — "Component overview (shop feature)", "Key decisions" (`ReanimatedSwipeable`, `FlatList`, custom sheet) and PRD features 4, 5 and 8. `updateItem`/`removeItem`/`setAllChecked`/`deleteList` come from task 1.0.

## Success criteria

- Quantity can never go below 1; saving without a category is valid; cancel paths never mutate the store.
- Totals (header chip + status line) react to every toggle/edit/removal within the same interaction.
- Confirming list deletion lands on Home with the active-list card cleared; cancelling changes nothing.
- Checked state conveyed by strikethrough + dimming (not color alone); all controls expose labels/roles/states; touch targets ≥ 44 px.

## Task tests

- [x] Unit tests (row, mark-all, price input, edit sheet, dialogs)
- [x] Integration tests (store loop + Home card consistency)
- [x] E2E tests — not applicable (covered in task 6.0)

## Relevant files

- `src/features/shop/components/item-row.tsx`, `mark-all-row.tsx`, `edit-item-sheet.tsx`, `delete-list-button.tsx` (new)
- `src/features/shop/use-price-input.ts` (new)
- `src/app/shop.tsx`
- `src/features/limit/use-limit-input.ts` (pattern source)
- `src/components/ui/bottom-sheet.tsx`, `src/components/ui/confirm-dialog.tsx` (from task 2.0)
- `__tests__/item-row.test.tsx`, `__tests__/mark-all-row.test.tsx`, `__tests__/use-price-input.test.ts`, `__tests__/edit-item-sheet.test.tsx`, `__tests__/delete-list-button.test.tsx`, `__tests__/shop-list-integration.test.tsx` (new)
