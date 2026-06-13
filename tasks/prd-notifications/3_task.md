# Task 3.0: Notification UI components

## Overview

Build the presentational pieces of the screen: the notification card with tinted icon tile and unread indicator, the minimal white header with the "Marcar todas" action, the "Tudo em dia" empty state, and the unread selector hook shared with the Home badge.

<skills>
### Skills compliance

- `execute-task` — use to implement this task with the proper context loading and completion flow.
- `execute-review` — use to review the diff before marking the task complete.
- `create-github-commit` — use for the Conventional Commits commit once the task passes review.
</skills>

<requirements>
- Card: tinted icon tile (~18% opacity wash of the type color behind a pure-color glyph), bold title, body line, right-aligned relative time, unread indicator; pressable, marking itself read via `markAsRead`.
- Card renders all four catalog types with their designated tone and icon (FR7/FR8).
- Unread state is announced to assistive tech and not carried by color alone; cards expose role, and a label including title, body, time, and read/unread state.
- Header: minimal white style (pattern of `help-header.tsx`), safe-area padding, hairline Mist Border bottom, close affordance, title "Notificações", "Marcar todas" text action (primary green, bold) hidden when nothing is unread (FR15/FR16).
- Empty state: centered circular muted halo with bell icon and title "Tudo em dia" (pattern of `home-empty-state.tsx`) (FR18).
- `use-unread-notifications.ts` exposes whether any unread notification exists.
- Touch targets ≥ 44 px; NativeWind classes with `cn`; visual tokens per DESIGN.md (14 px radius, Mist Border, whisper shadow, Plus Jakarta Sans, 13 px/700 titles, 12 px body, 11 px captions).
- `testID`s per techspec.md: `notification-card-<id>`, `notifications-mark-all`.
</requirements>

## Subtasks

- [x] 3.1 Create `src/features/notifications/use-unread-notifications.ts`.
- [x] 3.2 Create `src/features/notifications/components/notification-card.tsx`.
- [x] 3.3 Create `src/features/notifications/components/notifications-header.tsx`.
- [x] 3.4 Create `src/features/notifications/components/notifications-empty-state.tsx`.
- [x] 3.5 Write component tests for the card, header, and empty state.

## Implementation details

See techspec.md "Component overview" (the three `components/` entries and `use-unread-notifications.ts`) and the PRD "UI/UX considerations" and "Accessibility" sections. Mirror `src/features/help/components/help-header.tsx` and `src/features/home/components/home-empty-state.tsx` for structure and styling; use the type catalog from task 1.0 for tones/icons and `formatRelativeTime` for the time label.

## Success criteria

- Each catalog type renders with the correct tone color and icon; unread and read cards are visually and programmatically distinguishable.
- "Marcar todas" appears only with unread items and marks all as read when pressed.
- Empty state matches the design (halo, bell, "Tudo em dia").
- Currency in card text renders via the app's formatting (R$, tabular numerals) when present.
- All component tests pass; typecheck and lint pass.

## Task tests

- [x] Unit tests: `__tests__/notification-card.test.tsx` — renders title/body/relative time; all four type tiles; press calls `markAsRead` with the id; accessibility role and label including read/unread state.
- [x] Unit tests: `__tests__/notifications-header.test.tsx` — title "Notificações"; close affordance navigates back (router mock, help-tests pattern); "Marcar todas" visible only with unread items; pressing it calls `markAllAsRead`.
- [x] Unit tests: `__tests__/notifications-empty-state.test.tsx` — halo, bell icon, "Tudo em dia" title.
- [ ] Integration tests: covered at screen level in task 4.0.
- [ ] E2E tests: covered in task 4.0.

## Relevant files

- `src/features/notifications/use-unread-notifications.ts` (new)
- `src/features/notifications/components/notification-card.tsx` (new)
- `src/features/notifications/components/notifications-header.tsx` (new)
- `src/features/notifications/components/notifications-empty-state.tsx` (new)
- `__tests__/notification-card.test.tsx`, `__tests__/notifications-header.test.tsx`, `__tests__/notifications-empty-state.test.tsx` (new)
- `src/features/help/components/help-header.tsx`, `src/features/home/components/home-empty-state.tsx` — visual patterns to mirror
- `DESIGN.md`, `tailwind.config.js` — tokens
- `src/features/notifications/notification.ts`, `relative-time.ts`, `notifications-store.ts` — from task 1.0
