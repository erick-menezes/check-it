# Product Requirements Document (PRD)

## Overview

The Settings ("Ajustes") screen is the second primary tab of Check.it — a
Brazilian-Portuguese mobile shopping-list app with per-list budget control. It is
the place where users adjust app-wide preferences and reach informational
content. Today the tab renders a placeholder ("Em breve"); this feature replaces
that stub with the real screen.

The problem it solves: users need a single, predictable home for the app's
preferences and "about" content. Concretely, they need to control whether the app
warns them as they approach a list's budget limit, and they need quick access to
help, legal information, and the app version.

This release deliberately ships a **focused** Settings screen. Account
authentication (Google sign-in / sync) and dark mode are **out of scope** and
deferred, so the screen contains exactly two sections: **NOTIFICAÇÕES**, holding
the budget-alert preference, and **SOBRE**, holding help, terms, and version
rows. The notifications preference is genuinely functional and persists on-device
— no account or backend required.

## Objectives

- **Give users control over budget alerts:** a user can turn the "Alertas de
  orçamento" preference on or off, and that choice is respected across app
  restarts.
- **Replace the Settings placeholder:** the Ajustes tab renders the real screen
  with no dead ends or "Em breve" copy.
- **Provide reliable access to informational content:** "Central de ajuda"
  reaches the existing Help screen; terms and version are reachable/visible.
- **Match the Check.it design language:** the screen faithfully reproduces the
  Settings visual pattern from the design reference (DESIGN.md and the attached
  logged-out mockup).

Success criteria:

- A user landing on the Ajustes tab sees the NOTIFICAÇÕES and SOBRE sections,
  never the placeholder.
- Toggling "Alertas de orçamento" updates immediately, and the chosen state is
  still in effect after fully closing and reopening the app.
- Tapping "Central de ajuda" navigates to the already-built Help screen.
- The screen renders identically for every user (no authentication branches).

## User Stories

- **As a budget-conscious user**, I want to turn budget alerts on or off, so that
  I control whether the app warns me when I approach a list's limit.
- **As a returning user**, I want my notification choice to be remembered, so that
  I don't have to reconfigure it every time I open the app.
- **As any user**, I want to open the help content from Settings, so that I can
  learn how the app works without hunting for it.
- **As any user**, I want to reach the terms and privacy information, so that I
  understand the app's policies.
- **As a curious or support-seeking user**, I want to see the installed app
  version, so that I can reference it when reporting an issue.

## Core features

### 1. Screen header

A minimal header anchors the Settings screen.

Functional requirements:

1.1. The header MUST display the title **"Ajustes"** in the Check.it page-title
style (H1, Charcoal Ink).
1.2. The header MUST follow the Check.it **minimal** header variant (Pure Snow
background with a hairline bottom border), per DESIGN.md.
1.3. The header MUST sit below the device status bar / notch using safe-area
insets (no hardcoded offsets).

### 2. Notifications section

The screen's single functional preference lives here.

Functional requirements:

2.1. The screen MUST display a section with the eyebrow label **"NOTIFICAÇÕES"**.
2.2. The section MUST contain one setting row titled **"Alertas de orçamento"**
with the supporting line **"Quando ultrapassar 80% do limite"**, a leading bell
icon in a tinted icon tile, and a trailing toggle.
2.3. The toggle MUST default to **ON** for a user who has never changed it.
2.4. Tapping the toggle MUST immediately reflect the new state (on/off) with the
design's switch animation.
2.5. The chosen state MUST persist **locally on the device** and be restored when
the app is relaunched — without requiring any account, sign-in, or network.
2.6. The preference MUST be readable by other parts of the app so that, when
budget-alert delivery is later implemented, it governs whether alerts fire. (The
actual sending of alerts is out of scope here; this screen owns the preference.)

### 3. About ("SOBRE") section

A group of informational rows.

Functional requirements:

3.1. The screen MUST display a section with the eyebrow label **"SOBRE"**
containing three rows in this order: **"Central de ajuda"**, **"Termos e
privacidade"**, **"Versão"**.
3.2. Each navigational row MUST show a leading icon in a tinted icon tile, the row
label, and a trailing chevron (`>`) affordance. "Central de ajuda" uses a help
icon; "Termos e privacidade" uses an info icon.
3.3. Tapping **"Central de ajuda"** MUST navigate to the existing Help screen
(`/help` route).
3.4. Tapping **"Termos e privacidade"** MUST navigate to a Terms & Privacy
destination. For this release that destination MAY be a lightweight placeholder
screen; the row MUST NOT be a dead end (it always leads somewhere).
3.5. The **"Versão"** row MUST display the app version value (shown as `2.0.0`
per the design) on its trailing side, MUST use a bookmark/tag leading icon, and
MUST NOT be tappable (no chevron, no navigation).

### 4. Tab integration

The screen is the destination of the existing Ajustes tab.

Functional requirements:

4.1. The screen MUST render within the existing bottom-tab navigation, with the
**Ajustes** tab shown as active while it is on screen.
4.2. Scrollable content MUST reserve bottom padding so the last row clears the
64 px tab bar, per DESIGN.md.

## User experience

**Persona & need:** Any Check.it user who wants to control budget alerts or reach
help/legal/version information. The screen is reached by tapping the **Ajustes**
tab in the bottom tab bar.

**Main flow:**

1. User taps the **Ajustes** tab.
2. The Settings screen appears showing **NOTIFICAÇÕES** then **SOBRE**.
3. The user toggles "Alertas de orçamento" on or off; the switch animates and the
   choice is saved.
4. The user taps "Central de ajuda" and lands on the Help screen; returning to
   Settings preserves the toggle state.
5. The user may tap "Termos e privacidade" to view the terms destination, and can
   read the app version inline on the "Versão" row.

**UI/UX requirements (per DESIGN.md and the logged-out mockup):**

- **Header:** minimal white variant with a hairline bottom border; "Ajustes" in
  H1 scale (28 px / 700, Charcoal Ink).
- **Section eyebrows:** "NOTIFICAÇÕES" and "SOBRE" in the Eyebrow Label style
  (11 px / 600, ALL CAPS, +0.08em tracking, Pebble Gray), 26 px above a section
  and 10 px above its content.
- **Setting rows:** Pure Snow / soft surface rows with a leading ~38–40 px tinted
  icon tile (category-style 18% color wash background, pure-color glyph), a title
  in Body Strong (13–14 px / 700) and a caption in Small (11–12 px / 500, Pebble
  Gray), with the control or chevron right-aligned. Rows are separated by hairline
  dividers as in the mockup.
- **Toggle / Switch:** pill-shaped (38 × 22 px), Herbal Leaf Green when on / Fog
  Gray when off, white knob with a soft shadow, sliding on a ~200 ms transition,
  per DESIGN.md.
- **Chevron rows:** trailing chevron in Pebble Gray; full row is the touch target.
- **Spacing:** 22 px left/right page gutters; vertical rhythm consistent with the
  8 px scale.
- **Typography:** `Plus Jakarta Sans` throughout.

**Accessibility requirements:**

- The toggle MUST expose its on/off state to assistive technology
  (`accessibilityRole: "switch"`, `accessibilityState: { checked }`) with a
  meaningful PT-BR label.
- Navigational rows MUST be operable by screen readers with PT-BR
  `accessibilityLabel` and `accessibilityRole: "button"`.
- Touch targets MUST meet a comfortable minimum (≥ 44 px height).
- Text and icons MUST meet WCAG 2.2 contrast against their surfaces.

## High-level technical constraints

- **No authentication:** there is no account, sign-in, sync, or logged-in/out
  branching in this screen. The "CONTA" / "Continuar com Google" block from the
  broader design is explicitly excluded this release.
- **Local-only persistence:** the notification preference persists on-device using
  the app's existing local-storage pattern; no database, server, or network call
  is involved.
- **No dark mode:** dark mode (the design's "APARÊNCIA / Modo escuro" row) is
  discarded project-wide and excluded from this screen.
- **No new push infrastructure:** this screen does not register, schedule, or send
  notifications; it only stores the user's preference.
- **Language:** all user-facing copy is **PT-BR**; all source code identifiers and
  comments follow the project's English-only standard.
- **Design fidelity:** implementation MUST follow DESIGN.md and the referenced
  design source for colors, typography, spacing, and animation.
- **Platform:** mobile-first within the existing Expo (v56) React Native app,
  consistent with the 360 × 780 reference frame, integrating with the existing
  Expo Router navigation and bottom-tab bar.

## Out of scope

- **Authentication & account:** Google sign-in, the "CONTA" connect card, sign-in/
  sign-out, sync, and logout are all deferred to a future feature.
- **Dark mode / appearance:** the "Modo escuro" toggle and the APARÊNCIA section
  are removed and not built.
- **Real notification delivery:** registering for, scheduling, or sending budget
  alerts (and any push-permission flow) is not built; only the preference is
  stored.
- **Full Terms & Privacy content:** a complete legal/long-form Terms & Privacy
  screen is not authored this release; the row leads to a placeholder destination.
- **Building or redesigning the Help screen:** Settings only navigates to the
  already-existing Help route; the Help screen itself is not part of this work.
- **Additional preferences:** language selection, density modes, currency, data
  export/clear, and any other settings not listed above.
- **Remote configuration / analytics:** no fetching of settings from a backend and
  no tracking/instrumentation of interactions.
- **Localization beyond PT-BR.**
