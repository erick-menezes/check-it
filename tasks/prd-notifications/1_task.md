# Task 1.0: Notifications foundation: domain model and persisted store

## Overview

Create the dependency-free foundation of the feature: the notification domain model with the four-type catalog, the PT-BR compact relative-time formatter, and the persisted zustand store that holds the capped notification list, read state, and the per-list budget threshold latch.

<skills>
### Skills compliance

- `execute-task` — use to implement this task with the proper context loading and completion flow.
- `execute-review` — use to review the diff before marking the task complete.
- `create-github-commit` — use for the Conventional Commits commit once the task passes review.
</skills>

<requirements>
- `NotificationType` is a union of `'budgetAlert' | 'priceChange' | 'goalAchieved' | 'collaboration'` (no enum).
- The type catalog maps each type to its tone token and lucide icon exactly as the table in techspec.md (`checkit-danger`/`TriangleAlert`, `checkit-accent`/`Tag`, `checkit-primary`/`Trophy`, `checkit-info`/`Users`).
- `AppNotification` fields are `readonly`: `id`, `type`, `title`, `body`, `createdAt` (ISO 8601), `read`.
- `formatRelativeTime(createdAt, now)` is pure and deterministic, producing the bands defined in techspec.md ("agora", "<n>min", "<n>h", "há <n> dia(s)", "há <n> sem").
- Store persists to AsyncStorage under `checkit:notifications`, mirroring `active-list-store.ts` (`persist` + `createJSONStorage`, `hasHydrated`, `partialize` excluding hydration state, `version: 0`).
- `addNotification` assigns `id` (`crypto.randomUUID`), `createdAt`, `read: false`, prepends newest-first, and prunes past `MAX_STORED_NOTIFICATIONS = 50`.
- `markAsRead` and `markAllAsRead` are separate actions (no flag parameter); `setBudgetThresholdLatch` stores the band per list id.
</requirements>

## Subtasks

- [x] 1.1 Create `src/features/notifications/notification.ts` with `NotificationType`, `AppNotification`, and the type catalog constant.
- [x] 1.2 Create `src/features/notifications/relative-time.ts` with `formatRelativeTime`.
- [x] 1.3 Create `src/features/notifications/notifications-store.ts` with the persisted store (notifications array, threshold latch, actions, hydration flag).
- [x] 1.4 Write `__tests__/relative-time.test.ts` covering all bands, boundaries, and singular/plural.
- [x] 1.5 Write `__tests__/notifications-store.test.ts` mirroring `active-list-store.test.ts`.

## Implementation details

See techspec.md sections "Main interfaces", "Data models" (persisted shape, relative time bands, type catalog), and the key decision "Custom relative-time formatter over `Intl.RelativeTimeFormat`". Mirror the structure of `src/features/home/active-list-store.ts`, including `console.warn` in `onRehydrateStorage`.

## Success criteria

- All four catalog types resolve to the correct tone token and icon.
- `formatRelativeTime` is deterministic for an injected `now` and matches every band boundary in the spec.
- Notifications survive a simulated rehydration (write-through to AsyncStorage verified in tests) and `hasHydrated` is excluded from persistence.
- Insertion keeps newest-first order and never exceeds 50 stored items.
- Typecheck and lint pass; code follows `.claude/rules/code-standards.md` and `typescript-standards.md`.

## Task tests

- [x] Unit tests: `__tests__/relative-time.test.ts` — "agora" (< 60 s), minutes, hours, days with singular/plural ("há 1 dia" / "há 3 dias"), weeks; boundary values 59 s, 60 s, 23 h 59 min, 6 d 23 h, 7 d.
- [x] Unit tests: `__tests__/notifications-store.test.ts` — add prepends newest-first; cap at 50 prunes oldest; `markAsRead` flips one item; `markAllAsRead` flips all; latch set/read per list id; persistence envelope and `partialize`; rehydration restores state.
- [x] Integration tests: none at this layer (covered in tasks 2.0 and 4.0).
- [x] E2E tests: not applicable.

## Relevant files

- `src/features/notifications/notification.ts` (new)
- `src/features/notifications/relative-time.ts` (new)
- `src/features/notifications/notifications-store.ts` (new)
- `__tests__/relative-time.test.ts` (new)
- `__tests__/notifications-store.test.ts` (new)
- `src/features/home/active-list-store.ts` — pattern to mirror
- `__tests__/active-list-store.test.ts` — test pattern to mirror
- `src/features/home/active-list.ts` — `BudgetStatus` type reused by the latch
