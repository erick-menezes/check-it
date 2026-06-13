# Task 4.0: Search, sort and Summary

## Overview

Add the view-layer retrieval tools (action row with sort selector + camera shortcut, search field, Sort sheet with five options) and the spending insight surfaces: the "Resumo" preview card and the dedicated `/summary` route with the hero total tile, the over/remaining banner, the single stacked "Por categoria" bar with legend, and the "Mais caros" top-5 list.

<skills>
### Skills compliance

- `execute-task` — implementation workflow for this task.
- `design-md` — `DESIGN.md` is the styling authority (stacked bar deviation, tile treatments).
- `execute-review` — code review after implementation.
- `create-github-commit` — Conventional Commits for the resulting changes.
</skills>

<requirements>
- Action row + search field appear as soon as the list has ≥ 1 item (agreed deviation) and disappear when it empties; the camera shortcut opens the Receipt sheet.
- Search filters by case-insensitive name substring, view-only (stored data untouched); clearing restores the full list; no-match shows an empty result area without losing data.
- Sort button shows the current label and opens the Sort sheet: "Ordem de adição" (default), "Maior preço primeiro", "Menor preço primeiro", "Nome (A-Z)", "Por categoria" (nulls last); selecting applies and closes; stored order never mutates.
- Preview card: "X de Y" checked count, subtotal, limit, "Disponível"/"Excedeu" with absolute difference (primary/danger); renders only with items; "Ver completo" navigates to `/summary`, back returns to the shop list.
- Summary screen: total tile with list total + limit and banner "Você ainda tem R$ X" (primary) / "Estourou em R$ X" (danger, crimson-tinted tile); "Por categoria" as one stacked bar (segments by percentage in category color, "Sem categoria" in Slate Gray) with legend name + R$ ordered by amount desc; "Mais caros" top 5 by line total with category dot.
- Stacked bar remains understandable via the textual legend (accessibility).
</requirements>

## Subtasks

- [x] 4.1 Create `src/features/shop/use-visible-items.ts` (`SortOption` union, search filter + sorts).
- [x] 4.2 Create `src/features/shop/components/action-row.tsx`, `search-field.tsx` and `sort-sheet.tsx`; wire into `src/app/shop.tsx`.
- [x] 4.3 Create `src/features/shop/components/summary-preview-card.tsx` and wire below the items.
- [x] 4.4 Create `src/app/summary.tsx` with `src/features/summary/components/summary-total-tile.tsx`, `stacked-category-bar.tsx`, `top-items-list.tsx` (consuming `getCategoryBreakdown`/`getTopItems` from task 1.0).
- [x] 4.5 Unit tests: `use-visible-items` (search + each sort option, nulls last on category sort), action-row/search visibility rules, sort sheet selection, preview card states (available/exceeded/hidden), total tile branches, stacked bar legend ordering and "Sem categoria" segment, top-items list, `summary.tsx` screen test.
- [x] 4.6 Integration tests: search/sort never mutate stored order; Summary recomputes from the persisted list after mutations.

## Implementation details

See techspec.md — "Component overview (shop feature / summary feature)", "Data flow" (search/sort are screen-local state) and PRD features 3 and 7 (including the single-stacked-bar agreed deviation).

## Success criteria

- Sorting and searching shape only the visible array; persisted item order survives restart.
- Per-category amounts in the legend sum to the list total; segments' widths match each category's percentage.
- Over-budget is conveyed by text ("Estourou em R$ X"), not color alone.
- Navigation: shop → "Ver completo" → Summary → back → shop, with state intact.

## Task tests

- [x] Unit tests (hook, action row, search, sort sheet, preview card, summary components, screen)
- [x] Integration tests (view-only filtering/sorting, summary recompute)
- [ ] E2E tests — not applicable (covered in task 6.0)

## Relevant files

- `src/features/shop/use-visible-items.ts`, `src/features/shop/components/action-row.tsx`, `search-field.tsx`, `sort-sheet.tsx`, `summary-preview-card.tsx` (new)
- `src/app/summary.tsx`, `src/features/summary/components/summary-total-tile.tsx`, `stacked-category-bar.tsx`, `top-items-list.tsx` (new)
- `src/app/shop.tsx`, `src/app/_layout.tsx` (Stack auto-registers; no change expected)
- `__tests__/use-visible-items.test.ts`, `__tests__/action-row.test.tsx`, `__tests__/search-field.test.tsx`, `__tests__/sort-sheet.test.tsx`, `__tests__/summary-preview-card.test.tsx`, `__tests__/summary-total-tile.test.tsx`, `__tests__/stacked-category-bar.test.tsx`, `__tests__/top-items-list.test.tsx`, `__tests__/summary-screen.test.tsx` (new)
