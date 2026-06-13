# Task 3.0: Shared `SegmentedControl` primitive

## Overview

Build the generic, controlled `SegmentedControl` design-system component at `src/components/ui/segmented-control.tsx` — Terms is its first consumer, but DESIGN.md defines it as a system-level pattern.

<skills>
### Skills compliance

- `execute-task` — drives the implementation of this task from the techspec.
- `execute-review` — code review of the diff after completion.
</skills>

<requirements>
- Public interface exactly per techspec.md "Main interfaces": `SegmentedControl<T extends string>` with `options`, `selectedId`, `onChange`, `testID`.
- Visual tokens per PRD UI requirements / DESIGN.md: Linen Cream track (12 px radius, 4 px inner padding), 34 px segments (9 px radius, 12 px / 700 labels), selected segment Pure Snow with card whisper shadow, unselected transparent with Pebble Gray text, ~200 ms transitions (PRD 2.3).
- Accessibility: each segment exposes `accessibilityRole="tab"` and `accessibilityState={{ selected }}` with PT-BR labels; ≥44 px effective touch target via `hitSlop` on the 34 px segments (PRD accessibility requirements; techspec known risk).
- NativeWind `className` with `cn()` for conditionals; `StyleSheet`/inline only for dynamic or hairline values (rules compliance section of the techspec).
</requirements>

## Subtasks

- [x] 3.1 Implement the component with the typed generic interface and design tokens.
- [x] 3.2 Wire accessibility roles, selected state, and `hitSlop` touch targets.
- [x] 3.3 Write `__tests__/segmented-control.test.tsx`.

## Subtask notes

Magic numbers (radii, heights, durations) declared as named constants per code-standards.

## Success criteria

- Renders any N string-id options; fires `onChange` with the tapped id; never manages its own selection state (fully controlled).
- Selected/unselected styling verifiable via testIDs.
- Screen readers announce each segment as a tab with the correct selected state.

## Task tests

- [x] Unit tests: `segmented-control.test.tsx` — renders all options; selected/unselected styling hooks; fires `onChange` with tapped id; `accessibilityRole="tab"` + `accessibilityState.selected` correct.
- [x] Integration tests: covered later by `terms-screen.test.tsx` (task 5.0).
- [x] E2E tests: not applicable at component level.

## Relevant files

- `src/components/ui/segmented-control.tsx` (new)
- `__tests__/segmented-control.test.tsx` (new)
- `DESIGN.md` (segmented-control pattern tokens)
- `src/components/ui/button.tsx`, `src/components/ui/toggle.tsx` (ui-primitive conventions)
