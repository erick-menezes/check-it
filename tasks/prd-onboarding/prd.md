# Product Requirements Document (PRD)

## Overview

The Onboarding feature is the first experience a new user has when opening
Check.it — a Brazilian-Portuguese mobile shopping-list app with per-list budget
control. It is a lightweight, three-step intro presented as a single screen that
advances through "slides" (steps), letting the user either move forward step by
step or skip straight into the app at any moment.

The problem it solves: a brand-new user opens the app with no context about what
Check.it is or why it is different from a plain notes app. Onboarding briefly
communicates the product's value proposition — listas de compras com controle de
orçamento — in a warm, friendly way, then gets out of the way fast.

It is for **first-time users only**. After being seen once, it never appears
again. The value is a confident, on-brand first impression that orients the user
without creating friction.

## Objectives

- **Communicate the value proposition** in under ~15 seconds of reading: the user
  understands Check.it helps create shopping lists with budget control and
  spending awareness.
- **Provide a pleasant, on-brand visual intro** that reflects the Check.it design
  language (leaf-green ground, frosted-halo icon, stretchy-pill step indicator).
- **Stay frictionless:** the user can reach the app in a single tap (Skip) from
  the very first step.
- **Show only once:** the flow is reliably suppressed on every subsequent app
  open after being completed or skipped.

Success criteria:

- 100% of first-time users see the onboarding; 0% of returning users see it again.
- A user can exit to the app from any step (skip or finish) without errors.
- Visual output matches the DESIGN.md onboarding specification.

## User Stories

- **As a first-time user**, I want a quick intro to what Check.it does, so that I
  understand the app's purpose before I start using it.
- **As a first-time user in a hurry**, I want to skip the intro at any moment, so
  that I can start using the app immediately without reading every slide.
- **As a first-time user**, I want to move forward (and optionally back) through
  the steps at my own pace, so that I control how much I read.
- **As a returning user**, I do not want to see the onboarding again, so that the
  app opens directly into my normal experience.
- **As a user**, I want to clearly see how many steps exist and where I am, so
  that I know how long the intro is.

## Core features

### 1. Stepped single-screen flow (3 steps)

One screen renders three sequential steps; advancing replaces the on-screen
content rather than navigating to separate routes. Content per step:

- **Step 1 — Welcome / value proposition:** friendly greeting introducing
  Check.it as a shopping-list helper.
- **Step 2 — Budget control:** explains setting a spending limit (limite) per
  list to stay in control.
- **Step 3 — Lists & spending awareness:** the "list metaphor" — organizing
  items and tracking expenses over time.

Functional requirements:

1.1. The screen MUST display exactly three steps, shown one at a time.
1.2. Each step MUST present a hero icon (frosted halo), a title, and a short
descriptive text, per DESIGN.md.
1.3. PT-BR copy MUST be provided for all three steps (welcome → limite → listas).
1.4. Only one step MUST be visible at a time; advancing replaces the current step
content within the same screen.

### 2. Step navigation

A primary action advances to the next step; on the final step it completes the
flow.

Functional requirements:

2.1. A "next" action ("Próximo") MUST advance from step 1→2 and 2→3.
2.2. On the final step, the primary action MUST change to a finish action
("Vamos lá!") that completes onboarding and exits to the app.
2.3. The user SHOULD be able to navigate back to the previous step from steps 2
and 3.
2.4. The system MUST prevent advancing beyond the last step or back before the
first step.

### 3. Skip

The user can leave onboarding at any step.

Functional requirements:

3.1. A "skip" action ("Pular") MUST be available on every step, including the
first.
3.2. Activating skip MUST exit onboarding immediately and treat onboarding as
completed (same persistence effect as finishing).

### 4. Step indicator

A visual indicator communicates progress.

Functional requirements:

4.1. The screen MUST show a step indicator with one marker per step (3 dots).
4.2. The active step's marker MUST be visually emphasized (the stretchy-pill
active dot from DESIGN.md), and the indicator MUST update as the step changes.

### 5. Show-once persistence

Onboarding is a first-run-only experience.

Functional requirements:

5.1. On completing or skipping onboarding, the system MUST record locally that
onboarding has been seen.
5.2. On every app launch, the system MUST check this record; if onboarding was
already seen, it MUST NOT be shown and the app MUST proceed directly to its
normal entry destination.
5.3. If the record is absent (first run), onboarding MUST be shown.

### 6. Exit destination

After finishing or skipping, the user is sent into the app.

Functional requirements:

6.1. Completing or skipping MUST navigate the user away from onboarding to the
app's post-onboarding destination.
6.2. Because Home and login flows do not yet exist, the exit MUST route to a
provisional placeholder destination (to be finalized when those screens exist),
without leaving the user stranded on the onboarding screen.

## User experience

**Persona & need:** A first-time Check.it user who wants to quickly grasp the
app's purpose, with the freedom to skip. Returning users must never be
re-interrupted.

**Main flow:**

1. App launches → first run detected → onboarding appears on Step 1.
2. User reads Step 1; taps "Próximo" (advance) or "Pular" (skip → app).
3. Steps 2 and 3 repeat the pattern; back navigation available.
4. On Step 3, the primary action becomes "Vamos lá!"; tapping it (or skipping
   earlier) marks onboarding seen and routes to the app.
5. Subsequent launches bypass onboarding entirely.

**UI/UX requirements (per DESIGN.md):**

- Full-bleed **Herbal Leaf Green** (`#58AB6A`) ground.
- A **168 × 168 px frosted-halo circle** (translucent white over green) hosting a
  ~92 px icon per step.
- **Display title** 30 px / 800 and supporting body copy in white/translucent
  white; optional ALL-CAPS kicker (12 px / 700, +0.16em tracking).
- **Step dots:** 6 px inactive dots; active dot stretches to ~22 px wide.
- **Buttons:** finish/skip use the **Accent (Honey Mustard Yellow)** "go!" button
  on completion; intermediate "Próximo" uses the translucent-white **OnPrimary**
  button over green. Tap feedback is a subtle `scale(0.97)` squeeze.
- Typography: `Plus Jakarta Sans`; tight tracking on headings.
- Motion: gentle fade/slide between steps consistent with the design's transition
  timings.

**Accessibility requirements:**

- All interactive controls MUST be reachable and operable by screen readers with
  meaningful labels (e.g., "Próximo", "Pular", "Vamos lá!").
- The step indicator's progress MUST be conveyed non-visually (e.g., an
  accessible "Passo X de 3" announcement).
- Text/contrast MUST remain legible over the green ground (white on green meets
  contrast expectations for the chosen weights/sizes).
- Touch targets MUST meet a comfortable minimum tap size.

## High-level technical constraints

- **Local-only persistence:** the "onboarding seen" state MUST persist on-device
  across launches; no backend or account is involved.
- **No dark mode:** dark mode is explicitly dropped; only the light/green visual
  is required.
- **Language:** all user-facing copy is **PT-BR**; all source code (identifiers,
  comments) follows the project's English-only standard.
- **Single-screen, stepped:** the three slides are steps within one screen, not
  three separate routed screens.
- **Design fidelity:** the implementation MUST follow DESIGN.md and the referenced
  design handoff for colors, typography, spacing, and the onboarding components.
- **Platform:** mobile-first (target phone frame 360 × 780 reference), consistent
  with the existing Expo app.

## Out of scope

- **Dark mode** — fully removed; not to be implemented anywhere in this feature.
- **Authentication / login** — Google sign-in and any auth flow are not part of
  onboarding.
- **Real Home / app destinations** — building the actual Home or other post-login
  screens; onboarding routes to a provisional placeholder only.
- **Analytics / instrumentation** — event tracking for completion/skip rates is
  not included (objectives are stated as outcomes, not built-in telemetry).
- **A/B testing or multiple onboarding variants.**
- **Internationalization** — only PT-BR copy is required; no multi-language
  switching.
- **Re-triggering onboarding** — no setting to replay onboarding after it has been
  seen.
- **Interactive/data-collecting steps** — onboarding is informational only; it
  does not capture user input (e.g., setting a real budget) during the intro.
