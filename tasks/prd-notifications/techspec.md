# Technical specification

## Executive summary

The Notifications feature is implemented as a new self-contained feature module (`src/features/notifications/`) following the project's established architecture: a zustand store persisted to AsyncStorage for state, pure domain functions for logic, presentational components composed into an Expo Router screen, and a thin integration layer wiring it to existing surfaces (Home header badge, root layout).

The core architectural decision is to separate **notification storage** from **notification generation**. The store knows nothing about budget rules; it only holds a capped, ordered list of typed notifications plus read state, and exposes generic actions (`addNotification`, `markAsRead`, `markAllAsRead`). Generation is an event-driven engine that subscribes to the existing active-list store outside React (vanilla zustand `subscribe`, started once from the root layout after hydration), derives threshold-crossing events from the existing `getBudgetStatus` logic, and emits notifications through the store's public API. This keeps the screen and store fully extensible for future event sources (price tracking, goals, collaboration) — they only need to call `addNotification` with their own type.

## System architecture

### Component overview

**New components (all under `src/features/notifications/` unless noted):**

- `notification.ts` — domain model. Defines the `AppNotification` entity, the `NotificationType` union (`'budgetAlert' | 'priceChange' | 'goalAchieved' | 'collaboration'`), and the type catalog mapping each type to its tone color token and lucide icon (danger / accent / primary / info per DESIGN.md). Pure types and constants, no I/O.
- `relative-time.ts` — pure function `formatRelativeTime(createdAt, now)` producing the PT-BR compact labels ("agora", "12min", "2h", "há 3 dias", "há 1 sem"). Deterministic via an injected `now` parameter.
- `notifications-store.ts` — persisted zustand store (`checkit:notifications`), mirroring the structure of `active-list-store.ts`: `persist` + `createJSONStorage(() => AsyncStorage)`, `hasHydrated` flag, `partialize` excluding hydration state, `version: 0`. Holds the notification array (newest first, capped at 50), and the per-list budget threshold latch used for dedup/re-arm.
- `budget-alerts.ts` — generation engine. `startBudgetAlertTracking()` subscribes to `useActiveListStore`, detects threshold crossings against the persisted latch, checks `useSettingsStore.getState().budgetAlertsEnabled`, and emits budget-alert notifications. Returns the unsubscribe function.
- `components/notifications-header.tsx` — minimal white header (pattern of `help-header.tsx`): safe-area padding, hairline Mist Border bottom, close affordance, title "Notificações", and the "Marcar todas" text action (primary green, bold), hidden when nothing is unread.
- `components/notification-card.tsx` — one card: tinted icon tile (18% opacity wash + pure tone glyph), bold title, body, right-aligned relative time, unread indicator (visual + accessibility state). Pressable; marks itself read.
- `components/notifications-empty-state.tsx` — centered circular muted halo with bell icon and "Tudo em dia" title (pattern of `home-empty-state.tsx`).
- `use-unread-notifications.ts` — selector hook exposing whether unread notifications exist, consumed by the Home header badge and the "Marcar todas" visibility.

**Modified components:**

- `src/app/notifications.tsx` — stub replaced by the real screen: header + `FlatList` of cards or empty state, white background, bottom padding clearing the tab bar (`TAB_BAR_CLEARANCE` ≈ 100, as in `home.tsx`).
- `src/features/home/components/home-header.tsx` — the always-on badge `View` becomes conditional on the unread selector.
- `src/app/_layout.tsx` — after all stores hydrate (existing `isReady` gate, extended with the notifications store's `hasHydrated`), a `useEffect` starts `startBudgetAlertTracking()` and cleans it up on unmount.
- `__tests__/home-header.test.tsx` / `home-screen.test.tsx` — updated for the conditional badge.

**Data flow:**

1. Any writer mutates `useActiveListStore` (today: tests/future screens; the engine is writer-agnostic).
2. The subscription in `budget-alerts.ts` fires, computes `getBudgetStatus(activeList)`, compares it to the latched status for that list id in the notifications store.
3. On an upward band transition (and `budgetAlertsEnabled === true`), it calls `addNotification(...)` with PT-BR copy built with `formatBRL`.
4. The store prepends the notification, prunes past 50, persists via the middleware.
5. UI reacts through hooks: the screen re-renders the list; the Home badge dot appears/disappears via the unread selector.
6. Tapping a card → `markAsRead(id)`; header action → `markAllAsRead()`.

## Implementation design

### Main interfaces

```typescript
type NotificationType =
  | "budgetAlert"
  | "priceChange"
  | "goalAchieved"
  | "collaboration";

interface AppNotification {
  readonly id: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly body: string;
  readonly createdAt: string; // ISO 8601
  readonly read: boolean;
}

interface NotificationsStoreState {
  notifications: AppNotification[];
  budgetThresholdLatch: Record<string, BudgetStatus>; // listId -> last latched band
  hasHydrated: boolean;
  addNotification: (input: AddNotificationInput) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setBudgetThresholdLatch: (listId: string, status: BudgetStatus) => void;
  setHasHydrated: (value: boolean) => void;
}

function startBudgetAlertTracking(): () => void; // returns unsubscribe
function formatRelativeTime(createdAt: string, now: Date): string;
```

`AddNotificationInput` is `Pick<AppNotification, 'type' | 'title' | 'body'>`; the store assigns `id` (UUID via existing `expo` runtime `crypto.randomUUID`), `createdAt` (now), and `read: false`.

### Data models

**Persisted shape** (`checkit:notifications` in AsyncStorage, via zustand persist envelope `{ state, version }`):

- `notifications: AppNotification[]` — kept sorted newest-first at insert time; capped at `MAX_STORED_NOTIFICATIONS = 50` by dropping the tail on insert.
- `budgetThresholdLatch: Record<string, BudgetStatus>` — the dedup/re-arm mechanism. Persisting the latch alongside the notifications guarantees FR11 across restarts: rehydration restores the last known band, so re-running the subscription cannot re-fire an already-latched threshold.

**Threshold transition rules** (re-arm on downward crossing, per clarification):

- The bands are ordered `onTrack < warning < overBudget`, reusing `getBudgetStatus` from `active-list.ts` untouched.
- A notification fires only on an **upward** band transition, and only for the band **arrived at**: `onTrack → warning` fires the 85% warning; `warning → overBudget` and `onTrack → overBudget` fire the limit-exceeded alert (a direct jump fires only the exceeded alert, not both).
- Any transition (up or down) updates the latch to the new band. A downward move (`warning → onTrack`) therefore re-arms the warning: a later re-crossing fires again.
- A list id never seen before is latched as `onTrack` first, then evaluated — so a freshly created list already at 90% fires the warning once.
- `setActiveList(null)` leaves existing latch entries untouched; a future list reuses or creates its own entry by id.

**Type catalog** (constant in `notification.ts`):

| Type            | Tone token                  | Icon (lucide)   |
| --------------- | --------------------------- | --------------- |
| `budgetAlert`   | `checkit-danger` `#E13E3E`  | `TriangleAlert` |
| `priceChange`   | `checkit-accent` `#F2B807`  | `Tag`           |
| `goalAchieved`  | `checkit-primary` `#58AB6A` | `Trophy`        |
| `collaboration` | `checkit-info` `#5180F9`    | `Users`         |

Only `budgetAlert` is emitted today; the catalog and card render all four (FR8).

**Notification copy** (built in `budget-alerts.ts` with `formatBRL`):

- Warning — title: `"<list name> chegou a <percent>% do limite"`; body: `"Você gastou <formatBRL(total)> dos <formatBRL(limit)> definidos. Cuidado nos próximos itens!"`.
- Exceeded — title: `"<list name> passou do limite"`; body: `"Você gastou <formatBRL(total)> e o limite era <formatBRL(limit)>."`.

**Relative time bands** (`formatRelativeTime`): `< 60 s` → "agora"; `< 60 min` → "`<n>`min"; `< 24 h` → "`<n>`h"; `< 7 days` → "há `<n>` dia(s)" ("há 1 dia" / "há 3 dias"); `≥ 7 days` → "há `<n>` sem". Computed at render; no live ticker (re-entering the screen refreshes labels — acceptable for this granularity).

### API endpoints

Not applicable — fully on-device, no backend.

## Integration points

No external services. Internal integration points, all in-process:

- **Active-list store** (`src/features/home/active-list-store.ts`) — read-only event source via `subscribe`. No changes to it.
- **Settings store** (`src/features/settings/settings-store.ts`) — read at emission time (`getState()`, not a subscription): when `budgetAlertsEnabled` is `false`, the engine still updates the latch but suppresses the notification. Latching while muted prevents a burst of stale alerts when the user re-enables the toggle.
- **Home header** — consumes the unread selector; the badge keeps its current visual (accent dot, primary border) and `testID="notifications-dot"`.
- **Root layout** — gains the notifications store's `hasHydrated` in the `isReady` conjunction, and the tracking effect. Starting only after hydration prevents the subscription from comparing against a default (empty) latch and duplicating notifications on cold start.
- **Error handling** — rehydration failures follow the existing convention (`console.warn` in `onRehydrateStorage`); the engine wraps emission in defensive guards (no list, `limitInCents <= 0` → no-op, consistent with `computeRatio`).

## Testing approach

### Unit tests

Following the project layout (`__tests__/*.test.ts(x)`, jest-expo, Testing Library):

- `relative-time.test.ts` — all bands, boundary values (59 s, 60 s, 23 h 59 min, 6 d 23 h, 7 d), singular/plural, fixed injected `now`.
- `notifications-store.test.ts` — mirror of `active-list-store.test.ts`: add prepends and sorts newest-first, cap at 50 prunes oldest, `markAsRead` / `markAllAsRead`, write-through to AsyncStorage, `partialize` excludes `hasHydrated`, latch persistence.
- `budget-alerts.test.ts` — the transition matrix: onTrack→warning fires once, warning→warning re-render fires nothing (FR11), warning→onTrack→warning re-fires (re-arm), onTrack→overBudget fires only the exceeded alert, `budgetAlertsEnabled: false` suppresses but still latches, new list id starts fresh, restart simulation (rehydrated latch) does not duplicate, unsubscribe stops emission.
- `notification-card.test.tsx` — renders title/body/time, all four type tiles, press calls `markAsRead`, accessibility (role, label including read/unread state).
- `notifications-header.test.tsx` — title, close affordance (router mock, same pattern as help tests), "Marcar todas" visible only with unread items and marks all.
- `notifications-empty-state.test.tsx` — halo, bell, "Tudo em dia".
- `home-header.test.tsx` (updated) — badge dot present only with unread notifications.

Mocking: AsyncStorage (already provided by the library's jest mock), `expo-router` router — both patterns already exist in the suite. No new mocks needed.

### Integration tests

- `notifications-screen.test.tsx` — screen-level: seeded store renders ordered cards; tapping a card flips its unread styling; "Marcar todas" clears all and hides itself; empty store renders the empty state.
- `notifications-flow.test.ts` — end-to-end in-process: set an active list under 85% → push it over 85% via `setActiveList` → assert a notification exists, the unread selector is true, and the Home header shows the dot; mark all read → dot gone.

### E2E tests

The project's E2E stack is **Detox** (`e2e/*.test.js`, iOS sim/Android emu configs) — not playwright-cli, which targets web; this is a React Native app, so Detox is the compliant equivalent (deviation noted in Rules/skills compliance). New `e2e/notifications.test.js` following `e2e/help.test.js`: skip onboarding → tap `header-notifications` → assert empty state "Tudo em dia" → close → assert no `notifications-dot`. Threshold-generation E2E is limited until the limit/shop screens exist (both are still stubs), so generation coverage lives in the integration layer.

## Development sequencing

### Build order

1. **Domain + relative time** (`notification.ts`, `relative-time.ts`) — pure, dependency-free foundation everything else imports.
2. **Notifications store** — depends only on the domain model; unlocks both UI and engine work.
3. **Budget-alerts engine + root layout wiring** — depends on the store and the existing active-list/settings stores; delivers FR9–FR13 independently of UI.
4. **UI components** (card, header, empty state) — depend on store + relative time; parallelizable with step 3.
5. **Screen assembly + Home badge** — replaces the stub, wires the unread selector; depends on 2 and 4.
6. **Integration + E2E tests, typecheck/lint pass** — full-suite verification.

### Technical dependencies

- No new packages: zustand, AsyncStorage, lucide-react-native, NativeWind, and the `checkit-*` tailwind tokens already cover every need. `crypto.randomUUID` is available on Hermes in Expo SDK 56 (already the project runtime).
- No blocking infrastructure. The only soft dependency is the design handoff bundle (`_rUS5O-nXvXNzakdJt40Vw`) for pixel-level card details; DESIGN.md tokens are sufficient to proceed.

## Monitoring and observability

This is an offline mobile app with no telemetry infrastructure; Prometheus/Grafana do not apply. Observability follows the existing convention:

- `console.warn` on store rehydration failure (`onRehydrateStorage`), matching the other three stores.
- The engine is silent in production; misbehavior is guarded by the deterministic transition unit tests rather than runtime logging.
- `testID`s on screen, cards, badge, and actions (`notifications-screen`, `notification-card-<id>`, `notifications-dot`, `notifications-mark-all`) double as Detox observability hooks.

## Technical considerations

### Key decisions

- **Vanilla store subscription over a React hook for generation** — a `useEffect` in Home would miss mutations while Home is unmounted; a root-level `subscribe` observes every writer forever, is testable without rendering, and matches zustand's documented out-of-React usage. (Confirmed with user.)
- **Persisted latch instead of scanning existing notifications for dedup** — scanning breaks once notifications are pruned by the 50-item cap or (future) deleted; a dedicated latch record is O(1), survives restarts, and encodes the re-arm semantics explicitly. (Re-arm on downward crossing confirmed with user.)
- **Respecting `budgetAlertsEnabled`** — expands the PRD slightly, but the toggle already ships in Settings and ignoring it would make the existing UI a lie. Suppress-but-latch keeps re-enable behavior sane. (Confirmed with user.)
- **Custom relative-time formatter over `Intl.RelativeTimeFormat`** — the design's compact labels ("2h", "há 1 sem") don't match Intl output ("há 2 horas"), and a 15-line pure function is deterministic and trivially testable. Discarded: `date-fns`/`dayjs` (new dependency for one function).
- **One notification per arrival band on direct jumps** — a single edit that leaps onTrack→overBudget produces one "exceeded" alert, not warning+exceeded; two alerts for one user action is noise.
- **Storage cap of 50** — bounds the AsyncStorage payload and render cost with no user-visible effect at current volumes. (Confirmed with user.)

### Known risks

- **No real writer exists yet** — limit/shop screens are stubs, so today only tests mutate the active list. Mitigation: the engine is writer-agnostic by design; integration tests simulate writers through the store API, which is exactly the contract future screens will use.
- **Copy drift from the design bundle** — the PRD example uses "90%" copy from the mock; actual percentage is computed. Mitigation: copy lives in one place (`budget-alerts.ts`) and is asserted loosely (regex) in tests.
- **Relative-time staleness while the screen stays open** — labels don't tick. Accepted: granularity is coarse (minutes+), and re-entry recomputes. Revisit only if QA flags it.
- **Latch growth across many lists** — `budgetThresholdLatch` accumulates one tiny record per list id; negligible, but a future cleanup can prune ids when list history features land.

### Rules compliance

- `.claude/rules/code-standards.md` — kebab-case files, camelCase functions named with verbs, constants for magic numbers (`MAX_STORED_NOTIFICATIONS`, band durations), early returns in the transition logic, no flag parameters (separate `markAsRead`/`markAllAsRead`), English source with PT-BR only in user-facing strings.
- `.claude/rules/typescript-standards.md` — union type for `NotificationType` (no enum), `interface` for entities/store state, explicit return types on exports, `readonly` entity fields, no `any`/non-null assertions, discriminated access via the catalog map.
- `.claude/rules/react-native-standards.md` — functional components, `FlatList` with stable `keyExtractor` for the list, NativeWind classes with `cn`, safe-area insets in the header (no hardcoded offsets), zustand for cross-screen state, Testing Library coverage for every component, ≥44 px touch targets.

### Skills compliance

- `create-tasks` — next step: derive the task breakdown from this spec.

### Relevant and dependent files

- `src/features/home/active-list.ts` — `BudgetStatus`, `getBudgetStatus` (reused, unmodified)
- `src/features/home/active-list-store.ts` — event source (unmodified)
- `src/features/settings/settings-store.ts` — `budgetAlertsEnabled` gate (unmodified)
- `src/lib/currency.ts` — `formatBRL` for notification copy
- `src/features/home/components/home-header.tsx` — badge dot (modified)
- `src/app/notifications.tsx` — stub replaced
- `src/app/_layout.tsx` — hydration gate + engine start (modified)
- `src/features/help/components/help-header.tsx`, `src/features/home/components/home-empty-state.tsx` — visual patterns to mirror
- `DESIGN.md`, `tailwind.config.js` — tokens
- `__tests__/active-list-store.test.ts`, `__tests__/home-header.test.tsx`, `e2e/help.test.js` — test patterns to follow
