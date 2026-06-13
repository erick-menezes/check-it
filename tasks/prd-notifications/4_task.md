# Task 4.0: Screen assembly, Home badge, and end-to-end verification

## Overview

Replace the notifications stub with the real screen composed from the task 3.0 components, make the Home header badge dot reflect real unread state, and close the feature with screen-level integration tests, the in-process flow test, the Detox E2E test, and a full-suite quality pass.

<skills>
### Skills compliance

- `execute-task` — use to implement this task with the proper context loading and completion flow.
- `execute-review` — use to review the diff before marking the task complete.
- `execute-qa` — use after completion to validate the implementation against PRD/techspec (note: E2E runs on Detox, not playwright-cli, per techspec deviation).
- `create-github-commit` / `create-github-pull-request` — use to commit and open the PR once everything passes.
</skills>

<requirements>
- `src/app/notifications.tsx` renders header + `FlatList` of cards (stable `keyExtractor`) or the empty state; white background; bottom padding clearing the tab bar (`TAB_BAR_CLEARANCE` ≈ 100, as in `home.tsx`); `testID="notifications-screen"` (FR1–FR5, FR18–FR20).
- The list is flat, newest first, no grouping (FR1/FR2).
- Tapping a card marks it read (FR14); "Marcar todas" clears all (FR15/FR16).
- Home header badge dot (`testID="notifications-dot"`, current visual kept) renders only when the unread selector is true (FR17).
- Existing entry point preserved: Home bell (`header-notifications`) navigates to the same route.
- Existing `home-header` / `home-screen` tests updated for the conditional badge.
- Full typecheck, lint, and test suite green at completion.
</requirements>

## Subtasks

- [x] 4.1 Replace the stub in `src/app/notifications.tsx` with the assembled screen.
- [x] 4.2 Make the badge conditional in `src/features/home/components/home-header.tsx` via `use-unread-notifications`.
- [x] 4.3 Update `__tests__/home-header.test.tsx` and `__tests__/home-screen.test.tsx` for the conditional badge.
- [x] 4.4 Write `__tests__/notifications-screen.test.tsx` (screen-level integration).
- [x] 4.5 Write `__tests__/notifications-flow.test.ts` (in-process end-to-end flow).
- [x] 4.6 Write `e2e/notifications.test.js` (Detox, following `e2e/help.test.js`).
- [x] 4.7 Run full typecheck, lint, and test suite; fix any fallout.

## Implementation details

See techspec.md "Component overview" (modified components), "Data flow" steps 5–6, "Testing approach" (integration and E2E), and "Monitoring and observability" for the `testID` contract. The E2E scope is intentionally limited to the empty-state journey while limit/shop screens remain stubs (techspec "Known risks").

## Success criteria

- Notifications screen replaces the stub at the same route with the existing Home bell entry point intact.
- All PRD states render correctly: populated list (ordered, unread styling), all-read list, and empty state.
- Home badge dot appears only with unread notifications and disappears after "Marcar todas" or reading everything.
- Entire project test suite, typecheck, and lint pass with no regressions.

## Task tests

- [x] Unit tests: updated `__tests__/home-header.test.tsx` — badge present with unread notifications, absent without.
- [x] Integration tests: `__tests__/notifications-screen.test.tsx` — seeded store renders ordered cards; tapping a card flips unread styling; "Marcar todas" clears all and hides itself; empty store renders the empty state.
- [x] Integration tests: `__tests__/notifications-flow.test.ts` — active list under 85% → pushed over 85% via `setActiveList` → notification exists, unread selector true, Home badge visible; mark all read → badge gone.
- [x] E2E tests: `e2e/notifications.test.js` — skip onboarding → tap `header-notifications` → empty state "Tudo em dia" visible → close → no `notifications-dot` on Home.

## Relevant files

- `src/app/notifications.tsx` (stub replaced)
- `src/features/home/components/home-header.tsx` (modified)
- `__tests__/home-header.test.tsx`, `__tests__/home-screen.test.tsx` (updated)
- `__tests__/notifications-screen.test.tsx`, `__tests__/notifications-flow.test.ts` (new)
- `e2e/notifications.test.js` (new)
- `e2e/help.test.js` — E2E pattern to follow
- `src/app/(tabs)/home.tsx` — `TAB_BAR_CLEARANCE` pattern
- All `src/features/notifications/*` modules from tasks 1.0–3.0
