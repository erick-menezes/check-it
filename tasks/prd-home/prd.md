# Product Requirements Document (PRD)

## Overview

The Home screen is the main entry point of Check.it — a Brazilian-Portuguese
mobile shopping-list app with per-list budget control. It is the first screen a
user lands on after onboarding, and it sets the tone for the whole product: a
warm greeting, a single obvious way to start a new shopping list, and quick
access to the list the user is currently working on.

This release delivers the **logged-out (anonymous) Home only**. Authentication
and every feature that depends on an account (saved-list history, monthly goal,
dashboard) are planned for a future release and are intentionally absent here so
the screen never offers an action that leads nowhere.

The problem it solves: after onboarding, the user needs an immediate, friction-
free place to begin controlling grocery spending. Today the app has only a
placeholder Home. This feature replaces it with the real, on-brand Home that lets
an anonymous user create a budgeted list and resume their active one, all stored
locally on the device.

It is for **any user who has not signed in** (the default state for now). The
value is a confident, on-brand first impression and a working "start a list /
continue my list" loop with zero account friction.

## Objectives

- **Provide a working anonymous entry point:** a user can start a new shopping
  list and resume their active list directly from Home, with no sign-in required.
- **Persist the active list locally:** the user's current list survives app
  restarts on the same device, so progress is never lost.
- **Faithfully reproduce the design:** the Home matches the Check.it design
  language and the referenced design source for the logged-out state.
- **Never expose dead ends:** no control on Home leads to an unimplemented or
  empty destination (login section omitted; gated tabs hidden).

Success criteria:

- A user can reach the create-list flow and re-open their active list from Home
  without errors.
- The active list shown on Home reflects the locally stored list and is identical
  after closing and reopening the app.
- When no active list exists, Home shows a clear empty state inviting list
  creation.
- The logged-out Home and its tab bar visually match the design source.

## User Stories

- **As an anonymous user**, I want a friendly, time-aware greeting when I open the
  app, so that Home feels personal and oriented to "what's next."
- **As an anonymous user**, I want one obvious way to create a shopping list, so
  that I can start controlling my spending immediately.
- **As an anonymous user with a list in progress**, I want to see and re-open my
  current list from Home, so that I can continue where I left off.
- **As an anonymous user with my list's budget visible**, I want to see how much I
  have spent against my limit at a glance, so that I stay aware of overspending.
- **As a first-time anonymous user with no list yet**, I want Home to clearly
  prompt me to create my first list, so that I am never left on a blank screen.
- **As an anonymous user**, I want to move between the available app areas via a
  bottom tab bar, so that navigation feels like a normal mobile app.

## Core features

### 1. Home header & greeting

A hero header anchors the screen with a time-aware greeting and quick actions.

Functional requirements:

1.1. The header MUST show a PT-BR greeting that varies by time of day
("Bom dia" before noon, "Boa tarde" until 18h, "Boa noite" after).
1.2. Because the user is anonymous, the greeting MUST NOT include a user name and
MUST show the supporting subtitle "Pronto pra próxima compra?".
1.3. The header MUST present two quick actions — help and notifications — each
routing to a placeholder destination (see Feature 5).
1.4. The notifications action MUST display an accent indicator dot, per the
design.
1.5. The header MUST follow the Check.it hero styling (leaf-green ground, status-
bar spacing, brand voice) defined in DESIGN.md.

### 2. Create-list call to action

A prominent CTA is the primary action on Home.

Functional requirements:

2.1. Home MUST display a "Criar lista de compras" CTA card with the supporting
text "Defina um limite e comece", styled as the accent-tile card from the design.
2.2. Activating the CTA MUST start the create-list flow.
2.3. Because the create-list (limit) screen is not part of this release, the CTA
MUST route to a placeholder/stub destination without errors (see Feature 5).

### 3. Active list display

Home surfaces the user's single current list when one exists.

Functional requirements:

3.1. When an active list exists, Home MUST show a "Lista atual" section
containing a list card and an "Abrir" affordance.
3.2. The list card MUST display the list name, item count, a date label, the
current total and the configured limit, all in the design's currency styling.
3.3. The card MUST show a budget progress bar whose fill color reflects status:
on-track under 85%, warning at 85–100%, and over-budget above the limit, per
DESIGN.md.
3.4. Activating the card or "Abrir" MUST open the list; because the list (shop)
screen is not part of this release, it MUST route to a placeholder/stub
destination without errors.

### 4. Empty state

Home must never appear blank for a user with no list.

Functional requirements:

4.1. When no active list exists, Home MUST NOT render the "Lista atual" section.
4.2. In that case, Home MUST present a clear empty state inviting the user to
create their first list, consistent with the design's empty-state pattern.
4.3. The create-list CTA (Feature 2) MUST remain available in the empty state.

### 5. Bottom tab bar shell

A bottom tab bar provides app-level navigation.

Functional requirements:

5.1. The tab bar MUST be visible on Home and MUST show only the tabs available to
an anonymous user: "Início" (Home) and "Ajustes" (Settings).
5.2. Account-gated tabs ("Listas" and "Resumo") MUST be hidden while the user is
not signed in.
5.3. The active tab MUST be visually emphasized (filled icon + brand color) and
inactive tabs muted, per DESIGN.md.
5.4. Navigation targets that are not part of this release (Settings, Help,
Notifications, and the create-list/open-list flows) MUST resolve to placeholder/
stub screens so every action works without dead ends or errors.

### 6. Local persistence of the active list

The active list is the user's data and must not be lost.

Functional requirements:

6.1. The active list MUST be stored locally on the device (the default for
anonymous users) and MUST survive closing and reopening the app.
6.2. Home MUST always reflect the locally stored active list, showing it
(Feature 3) when present and the empty state (Feature 4) when absent.
6.3. No account or backend MUST be required for the active list to persist.

## User experience

**Persona & need:** An anonymous Check.it user, fresh from onboarding, who wants
to start or continue a budgeted shopping list with no sign-in friction.

**Main flow:**

1. App opens to Home; the user sees a time-aware greeting and the "Criar lista"
   CTA in the hero.
2. If a stored active list exists, "Lista atual" appears below with its budget
   card; otherwise an empty state invites list creation.
3. The user taps "Criar lista" to begin a new list, or the list card / "Abrir" to
   resume the current one (both route to placeholders this release).
4. The user can switch to "Ajustes" via the bottom tab bar, or open help /
   notifications from the header (placeholders this release).

**UI/UX requirements (per DESIGN.md):**

- **Hero header** in Herbal Leaf Green (`#58AB6A`) with status-bar top spacing and
  a nested white "summary" CTA card carrying a whisper shadow.
- **CTA card** uses an accent (Honey Mustard Yellow) leading tile with a plus
  glyph and a green confirm affordance.
- **List card** uses 16 px rounded corners, hairline Mist border, whisper shadow,
  tabular-numeric currency (weight 700), and the contextual progress-bar colors.
- **Typography:** `Plus Jakarta Sans`; tight tracking on headings; ALL-CAPS
  eyebrow labels for section headers.
- **Tab bar:** 64 px tall, hairline top border, icons swap idle→active with brand
  recolor; columns sized to the number of visible tabs.
- **Empty state:** centered icon halo above a short title and caption, with the
  create CTA, following the design's empty-state convention.
- **Motion & tap feedback:** subtle `scale(0.97)` press feedback and the design's
  standard fade/slide transitions.

**Accessibility requirements:**

- All interactive controls (CTA, list card, "Abrir", tabs, header actions) MUST
  be reachable and operable by screen readers with meaningful PT-BR labels.
- Budget status MUST be conveyed non-visually as well as by color (color alone
  must not be the only signal of over-budget).
- Text and icons MUST remain legible over the green hero (white-on-green at the
  specified weights/sizes).
- Touch targets MUST meet a comfortable minimum tap size, and safe areas
  (status bar, home indicator) MUST be respected.

## High-level technical constraints

- **Logged-out scope only:** only the anonymous Home state is built; no signed-in
  variant is rendered in this release.
- **No authentication:** no Google sign-in or login UI; any element that would
  depend on auth is omitted rather than shown disabled.
- **Local-only persistence:** the active list persists on-device with no backend
  or account involvement.
- **No dark mode:** dark mode is explicitly dropped; only the light/green visual
  is required.
- **Language:** all user-facing copy is **PT-BR**; all source code (identifiers,
  comments) follows the project's English-only standard.
- **Design fidelity:** the implementation MUST follow DESIGN.md and the referenced
  design source for colors, typography, spacing, and components.
- **Platform:** mobile-first within the existing Expo (v56) app, consistent with
  the 360 × 780 reference frame.

## Out of scope

- **Authentication / login** — Google sign-in, the login bottom sheet, and the
  logged-out "Continuar com Google" / "Histórico ativado" section are excluded;
  they are a future release.
- **Logged-in Home state** — the personalized greeting with name, and all signed-
  in-only content, are not built in this release.
- **Recent saved lists** — the "Recentes" / "Ver todas" history section is a
  future feature.
- **Monthly goal & dashboard cards** — the "Meta" goal card and the "Acompanhe
  também" dashboard entry (and their spent/goal data) are excluded.
- **Real adjacent screens** — Limit/create-list, Shop list, Lists, Dashboard,
  Settings, Notifications, Help, and all sheets are NOT built here; Home links to
  placeholder/stub destinations only.
- **Gated tabs when logged out** — "Listas" and "Resumo" are hidden, not shown as
  locked states.
- **Analytics / instrumentation**, **A/B variants**, and **internationalization**
  beyond PT-BR are not included.
