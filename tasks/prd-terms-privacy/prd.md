# Product Requirements Document (PRD)

## Overview

The Terms & Privacy screen ("Termos e privacidade") is an informational, legal
screen inside Check.it — a Brazilian-Portuguese mobile shopping-list app. It
presents the app's Terms of Use and Privacy Policy as two tabs behind a
segmented control, written in plain, friendly PT-BR ("Sem letras miúdas").

The problem it solves: users deciding whether to trust the app with their
shopping and spending data need transparent, accessible answers about what they
agree to and how their data is handled. Burying this in an external webpage or
omitting it erodes trust and blocks store-compliance expectations. The screen
gives every user — anonymous or authenticated — instant, offline access to both
documents from Settings.

A stub currently occupies the `terms` route; this feature replaces it with the
real screen, faithful to the design reference (DESIGN.md and the design
handoff bundle).

## Objectives

- **Build user trust:** any user can read what they accept and how their data
  is treated in under a minute, in plain language, without leaving the app.
- **Replace the Terms stub:** the "Termos e privacidade" row in Settings
  navigates to the real screen with no dead ends.
- **Match the Check.it design language:** the screen faithfully reproduces the
  Terms & Privacy visual pattern from the design reference.

Success criteria:

- A user arriving from the Settings row lands on the Terms & Privacy screen
  without errors.
- Both tabs (Termos de uso, Privacidade) are reachable via the segmented
  control and each renders its full content.
- All legal copy is readable offline, with no network request.
- The screen works identically for anonymous and authenticated users.

## User Stories

- **As a new user**, I want to read the Terms of Use before relying on the
  app, so that I know what I'm agreeing to by using Check.it.
- **As a privacy-conscious user**, I want to see what data is collected, how
  it is used and shared, so that I can decide whether to sign in with Google.
- **As any user**, I want to switch between Terms and Privacy with one tap,
  so that I can compare both documents without navigating away.
- **As any user**, I want a plain-language summary at the top of each tab, so
  that I get the gist without reading every section.
- **As any user with a question the documents don't answer**, I want a way to
  contact support, so that I am never left without a next step.
- **As any user**, I want to close the screen with a clear affordance, so that
  it never feels like a dead end.

## Core features

### 1. Screen header

A minimal app header anchors the screen.

Functional requirements:

1.1. The header MUST display the title **"Termos e privacidade"** in the
Check.it header-title style.
1.2. The header MUST display the subtitle **"Sem letras miúdas: o que você
aceita ao usar o Check.it e como cuidamos dos seus dados."** below the title.
1.3. The header MUST include a **close (X) affordance** on the left that
returns the user to the previous screen (Settings).
1.4. The header MUST follow the Check.it **minimal** header variant (Pure Snow
background with a hairline bottom border, Charcoal Ink text), per DESIGN.md.

### 2. Segmented control (tabs)

A two-option segmented control switches between the documents.

Functional requirements:

2.1. The screen MUST present exactly two tabs in this order: **"Termos de
uso"** and **"Privacidade"**, rendered as a segmented control directly below
the header.
2.2. The **"Termos de uso"** tab MUST be selected by default on screen entry.
2.3. The selected segment MUST appear as a white pill (Pure Snow) with the
card whisper shadow on a Linen Cream track; the unselected segment is
transparent with muted text, per DESIGN.md.
2.4. Switching tabs MUST replace the scrollable content below with the
selected document and reset the scroll position to the top, with a subtle fade
transition.
2.5. The segmented control MUST remain fixed below the header; only the
document content scrolls.

### 3. Document metadata and summary card

Each tab opens with a last-updated line and a plain-language summary.

Functional requirements:

3.1. Both tabs MUST display the last-updated line **"Atualizado em 14 de maio
de 2026"** with a leading clock icon, above the summary card.
3.2. Each tab MUST display a summary card with a green icon tile, a bold
heading, and one-sentence summary copy:
- **Termos de uso:** heading **"Resumo em uma frase"**, copy **"O Check.it
  organiza suas listas e gastos; seus dados continuam seus e você pode sair
  quando quiser."**, file-text icon.
- **Privacidade:** heading **"O essencial sobre privacidade"**, copy
  **"Coletamos o mínimo, não vendemos seus dados e você pode apagá-los a
  qualquer momento."**, shield-check icon.

### 4. Terms of Use content

The "Termos de uso" tab renders eight numbered sections.

Functional requirements:

4.1. The tab MUST render exactly these eight sections, in order, each with a
numbered leading tile (1–8), a section title, and body copy (verbatim per the
design handoff):
1. **Aceite dos termos** — acceptance by downloading/installing/using the app.
2. **Descrição do serviço** — what Check.it does (lists, limits, totals).
3. **Cadastro e conta** — Google login and account responsibility.
4. **Conteúdo do usuário** — user-entered data responsibility; no receipts or
   banking data stored.
5. **Uso aceitável** — no illegal use, no accessing others' data, no
   interfering with the service.
6. **Limitações** — spending math is a reference only; no liability for
   financial decisions.
7. **Mudanças** — terms may change; users notified in-app or by e-mail.
8. **Encerramento** — account deletion by the user; suspension for violations.

4.2. Section body copy MUST be the exact PT-BR text from the design handoff,
hard-coded in the app — no network request is required to render the screen.

### 5. Privacy Policy content

The "Privacidade" tab renders six icon-led sections.

Functional requirements:

5.1. The tab MUST render exactly these six sections, in order, each with a
leading icon tile, a section title, and body copy (verbatim per the design
handoff):
1. **Dados que coletamos** (tray icon) — minimal collection: Google e-mail,
   lists, products, prices, categories.
2. **Como usamos seus dados** (chart-bar icon) — sync, personal spending
   charts, price comparisons across the user's own lists.
3. **Compartilhamento** (users icon) — no selling of data; sharing only with
   technical service providers.
4. **Armazenamento** (lock icon) — servers in Brazil; encryption in transit
   and at rest.
5. **Seus direitos** (check-circle icon) — access, correction and deletion on
   request via support.
6. **Cookies e identificadores** (eye icon) — anonymous identifiers, not
   linked to identity.

5.2. Section body copy MUST be the exact PT-BR text from the design handoff,
hard-coded in the app.

### 6. Contact footer

A closing block gives users a next step for questions.

Functional requirements:

6.1. Below the sections on **both tabs**, the screen MUST display a
dashed-border block titled **"Ficou com alguma dúvida?"** with the supporting
line **"Nosso time responde assim que possível."**
6.2. The block MUST present a small **soft button** with an envelope icon and
the label **"Falar com o suporte"**.
6.3. Activating the support button SHOULD initiate contacting support via the
app's support email channel.

## User experience

**Persona & need:** Any Check.it user (anonymous or signed-in) who wants to
understand the app's terms or how their data is handled, arriving from the
"Termos e privacidade" row in Settings.

**Main flow:**

1. User taps "Termos e privacidade" in Settings.
2. The screen opens on the **Termos de uso** tab: last-updated line, summary
   card, then the eight numbered sections.
3. The user scrolls and reads; the contact footer closes the document.
4. The user taps **Privacidade** in the segmented control — content fades to
   the privacy document, scrolled to the top.
5. If a question remains, the "Ficou com alguma dúvida?" block offers support.
6. The user taps the close (X) affordance to return to Settings.

**UI/UX requirements (per DESIGN.md and the design handoff):**

- **Header:** minimal variant — Pure Snow background, hairline bottom border;
  title in `Header Title` scale (22 px / 700); subtitle in small muted text;
  close (X) icon on the left.
- **Segmented control:** Linen Cream (`#F7F6F2`) track, 12 px radius, 4 px
  inner padding; segments 34 px tall, 9 px radius, 12 px / 700 labels;
  selected segment Pure Snow with the card whisper shadow, unselected
  transparent with Pebble Gray text; ~200 ms background/color transitions.
- **Body copy:** 13 px, ~1.55 line height, Slate Ink (`#3D3D4D`).
- **Last-updated line:** small caption with a 14 px clock icon in muted gray.
- **Summary card:** 14 px radius, Linen Cream background, Mist Border; 36 px
  green (Herbal Leaf, `#58AB6A`) icon tile with 10 px radius and a white icon.
- **Section rows:** 28 px leading tile (8 px radius, Linen Cream background,
  Mist Border) holding the section number (terms) or a 14 px icon (privacy);
  title 14 px / 700 Charcoal Ink; ~20 px between sections.
- **Contact footer:** 14 px radius, 1 px dashed Mist Border, center-aligned,
  with a small soft-variant button.
- **Spacing:** 22 px left/right page gutters; content bottom padding so the
  last block clears the screen edge comfortably.
- **Typography:** `Plus Jakarta Sans` throughout; screen content on a white
  (Pure Snow) background.
- **Motion:** content fade (~250 ms) on tab switch, consistent with the
  design's fade-in transition.

**Accessibility requirements:**

- The segmented control MUST expose each tab to assistive technology with a
  meaningful PT-BR label and selected state (`accessibilityRole`,
  `accessibilityState: { selected }`).
- The close affordance and support button MUST be reachable and operable by
  screen readers with meaningful PT-BR labels.
- Touch targets (tabs, close, support button) MUST meet a comfortable minimum
  (≥ 44 px effective target).
- Body text MUST maintain sufficient contrast on the white surface, and the
  reading order MUST follow the visual order (metadata → summary → sections →
  footer).

## High-level technical constraints

- **No authentication required:** the screen renders identically for anonymous
  and signed-in users; no auth state is consumed.
- **No network dependency:** all legal copy is bundled statically in the app;
  the screen is fully functional offline.
- **No dark mode:** dark mode is explicitly excluded from this app.
- **Language:** all user-facing copy is **PT-BR**; all source code identifiers
  and comments follow the project's English-only standard.
- **Design fidelity:** implementation MUST follow DESIGN.md and the referenced
  design source for colors, typography, spacing, and animation.
- **Platform:** mobile-first within the existing Expo (v56) React Native app,
  consistent with the 360 × 780 reference frame.
- **Navigation:** the screen replaces the existing `terms` stub route and
  integrates with the existing Expo Router navigation, reachable from the
  Settings "Termos e privacidade" row.
- **Content sensitivity:** the privacy copy makes commitments (data in Brazil,
  encryption, LGPD-style rights) that are presented as-is from the design; the
  screen displays this copy verbatim and does not implement those guarantees.

## Out of scope

- **Acceptance flow:** no "accept terms" button, checkbox, or persisted
  consent state — the screen is read-only.
- **Remote / dynamic content:** legal copy is not fetched from any API or CMS
  in this release; updating it requires an app release.
- **Additional entry points:** no links from onboarding, login, or other
  surfaces — Settings is the only entry point.
- **Document versioning / changelog:** beyond the static "Atualizado em" line,
  no version history or diff view.
- **In-document search or anchors:** no search bar, table of contents, or
  deep-linking to a specific section or tab.
- **Live chat / ticketing:** beyond the support button, no in-app chat or
  ticket form.
- **Dark mode:** explicitly excluded project-wide.
- **Analytics / instrumentation:** no tracking of tab switches or reads.
- **Localization beyond PT-BR:** no multi-language support.
- **Legal review of the copy itself:** the PT-BR text is taken verbatim from
  the design handoff; validating its legal adequacy is a separate concern.
