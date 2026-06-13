# Product Requirements Document (PRD)

## Overview

Check.it users define a budget limit per shopping list, but today nothing proactively tells them when something relevant happens — they must open the app and inspect their lists to notice that spending is close to the limit or that a goal was met. The Notifications screen solves this by giving users a single, always-available place inside the app where relevant events are surfaced as readable alerts.

This feature replaces the existing stub screen ("Notificações") with the real screen: a chronological list of notification cards, each describing an app event (budget warnings, goals achieved, price changes, collaboration updates), with read/unread state and a clear empty state. Notifications are generated locally by the app itself based on events that happen while the user uses it — there is no backend or push infrastructure.

The primary audience is the app's existing user: a Brazilian-Portuguese speaker managing grocery budgets on a mobile phone. The screen is reached from the bell icon in the Home header, which already exists and shows an unread badge dot.

## Objectives

- Replace the notifications stub with a fully functional screen that is visually faithful to the design reference (handoff bundle `_rUS5O-nXvXNzakdJt40Vw` and DESIGN.md).
- Give users awareness of budget-relevant events without requiring them to inspect lists manually.
- Make unread state trustworthy: the Home header badge dot must reflect real unread notifications instead of being always visible (current behavior).
- Success means:
  - The screen renders the notification list, read/unread state, and empty state correctly in all states.
  - Budget-threshold events (85% warning and limit exceeded) generate notifications automatically from the active list's existing budget status.
  - Notifications and their read state persist across app restarts.
  - All flows are covered by automated tests, consistent with the rest of the project.

## User Stories

- As a user, I want to open the notifications screen from the bell icon on Home so that I can see everything the app wants to tell me in one place.
- As a user, I want to see my notifications ordered from newest to oldest, each with a title, a short description, and when it happened, so that I can scan recent events quickly.
- As a user, I want unread notifications to be visually distinct so that I know what is new since my last visit.
- As a user, I want a notification to be marked as read when I tap it so that the unread indicator goes away for items I have seen.
- As a user, I want a "Marcar todas" action so that I can clear all unread indicators at once.
- As a user, I want the bell icon on Home to show a badge dot only when I have unread notifications so that the badge is meaningful.
- As a user, I want to be notified when my active list's spending reaches 85% of the limit so that I can be careful with the next items.
- As a user, I want to be notified when my active list's spending exceeds the limit so that I know I went over budget.
- As a user with no notifications, I want a friendly empty state so that I understand the screen is working and what it will be used for.

## Core features

### 1. Notification list

A flat, vertically scrollable list of notification cards, ordered by date with the most recent at the top. There is no grouping by day or by category.

Each card shows:

- A tinted icon tile identifying the notification type (square tile with the type color at low opacity as background and the pure type color for the icon glyph).
- A bold title (single concept, e.g., "Compra de Maio chegou a 90% do limite").
- A short body line with detail (e.g., "Você gastou R$ 540 dos R$ 600 definidos. Cuidado nos próximos itens!").
- A relative date/time label aligned to the right of the title (e.g., "agora", "2h", "há 3 dias", "há 1 sem").
- An unread indicator distinguishing unread cards from read ones.

Functional requirements:

1. The list MUST be ordered by notification creation date, descending (newest first).
2. The list MUST NOT group notifications into sections; it is a single flat list.
3. Each card MUST display: type icon tile, title, body, and relative time label on the right.
4. Relative time MUST be derived from the notification's creation timestamp (e.g., "agora", "2h", "há 3 dias", "há 1 sem").
5. Unread notifications MUST be visually distinguishable from read ones.
6. Currency values inside notification text MUST follow the app's currency formatting (R$, tabular numerals).

### 2. Notification types

Notifications are categorized, and each category has a fixed icon and color tone per the design system:

| Type                                    | Tone                          | Example                                 |
| --------------------------------------- | ----------------------------- | --------------------------------------- |
| Budget alert (limit threshold/exceeded) | Danger (Alert Crimson)        | "Compra de Maio chegou a 90% do limite" |
| Price change                            | Accent (Honey Mustard Yellow) | "Pão de forma está mais caro"           |
| Goal achieved                           | Primary (Herbal Leaf Green)   | "Meta de Abril concluída 🎉"            |
| Collaboration                           | Info (Cobalt Sky Blue)        | "Marina entrou na sua lista"            |

Functional requirements: 7. Each notification MUST belong to exactly one type, and each type MUST render with its designated tone color and icon. 8. The type catalog MUST support the four types above, even though only budget-alert events can currently be generated by the app (see feature 3).

### 3. Local event-driven generation

Notifications are created by the app itself in response to events, persisted on-device. No backend, no push notifications.

With the app's current capabilities, the events that can fire are derived from the active list's budget status (the app already computes "warning" at ≥85% and "over budget" at >100%):

Functional requirements: 9. When the active list's spending crosses into the warning band (≥85% of the limit), the app MUST create one budget-alert notification informing how much was spent of the limit. 10. When the active list's spending exceeds the limit (>100%), the app MUST create one budget-alert notification informing the limit was exceeded. 11. Each threshold crossing MUST generate at most one notification per list per threshold — re-rendering or reopening the app MUST NOT duplicate notifications. 12. Notifications and their read/unread state MUST persist across app restarts. 13. The generation mechanism MUST be extensible so future features (price tracking, goals, collaboration) can emit notifications of the other catalog types without changing this screen.

### 4. Read state and "Marcar todas"

Functional requirements: 14. Tapping a notification card MUST mark that notification as read. 15. The header MUST offer a "Marcar todas" text action (primary green, bold) that marks all notifications as read. 16. The "Marcar todas" action MUST be inert or hidden when there are no unread notifications. 17. The Home header bell badge dot MUST be shown only when at least one unread notification exists, replacing the current always-on dot.

### 5. Empty state

Functional requirements: 18. When there are no notifications, the screen MUST show a centered empty state: a circular muted icon halo with a bell icon, the title "Tudo em dia"

### 6. Screen chrome and navigation

Functional requirements: 19. The screen MUST use the minimal (white) header style with the title "Notificações" and a back/close affordance returning to the previous screen. 20. The screen MUST replace the existing stub at the same route, preserving the existing entry point (Home header bell icon).

## User experience

**Persona:** the Check.it user — budget-conscious, PT-BR speaker, checks the app around grocery trips. They want glanceable awareness, not a message center.

**Main flow:**

1. User sees the badge dot on the Home bell icon → taps it.
2. Notifications screen slides in with the minimal header and the flat list, newest first.
3. User scans cards; unread ones stand out. Tapping a card marks it read.
4. Optionally taps "Marcar todas" to clear everything.
5. Returns to Home; the bell badge dot is gone if nothing is unread.

**Edge flows:**

- No notifications ever generated → empty state.
- All notifications read → list renders normally (no unread styling), badge dot hidden, "Marcar todas" inert/hidden.

**UI/UX considerations:**

- Visual language follows DESIGN.md: white screen background, cards with ~14 px radius, hairline Mist Border, whisper shadow, 22 px gutters, Plus Jakarta Sans, 13 px/700 titles, 12 px body, 11 px time captions.
- Icon tiles use the "tint, not fill" rule: ~18% opacity wash of the type color behind a pure-color glyph.
- Content bottom padding must clear the tab bar area, consistent with other screens.
- Dark mode is explicitly out of scope (feature discarded product-wide).

**Accessibility:**

- Notification cards must be reachable and actionable via screen reader, announcing title, body, time, and read/unread state.
- "Marcar todas" and the back affordance must have accessible labels and minimum touch target sizes (≥44 px).
- Color must not be the only carrier of unread state (pair with a non-color cue available to assistive tech).
- Text must respect dynamic font scaling without truncating titles into meaninglessness.

## High-level technical constraints

- React Native / Expo (SDK 56) app with Expo Router file-based navigation; the screen replaces the existing stub route.
- No backend, no authentication, no push-notification infrastructure — all generation, storage, and state are on-device.
- Persistence must use the app's existing local storage approach (the project persists stores on-device via AsyncStorage).
- Must integrate with the existing active-list budget status logic (85% warning / over-budget thresholds already defined) as the event source.
- Must integrate with the existing Home header bell (entry point and badge dot).
- PT-BR copy throughout, currency in BRL using the app's existing formatting utilities.
- All UI per DESIGN.md tokens; no dark mode.

## Out of scope

- Push notifications, OS-level notifications, or any delivery while the app is closed.
- Backend services, remote storage, or syncing notifications across devices.
- Generating price-change, goal-achieved, or collaboration notifications — those event sources (price tracking, monthly goals, shared lists, auth) do not exist yet; this feature only defines their types in the catalog so the screen can render them when they arrive.
- Logged-in vs. logged-out filtering of notification types (the design filters social/price types when logged out; the app has no auth yet, so all generated notifications are shown).
- Deleting or clearing notifications (no swipe-to-delete, no "clear all").
- Notification settings/preferences (mute, per-type toggles) — the Settings screen's notification toggles are a separate feature.
- Grouping, filtering, or searching notifications.
- Dark mode.
