# Product Requirements Document (PRD)

## Overview

The Help / FAQ screen is an informational screen inside Check.it — a
Brazilian-Portuguese mobile shopping-list app. It surfaces answers to the most
common questions users have about operating the app, organized into three
thematic accordion sections: **Listas**, **Limites**, and **Gastos**.

The problem it solves: new and returning users occasionally get confused about
how to create lists, how budget limits work, and how spending history is tracked.
Instead of requiring them to contact support or abandon the app, the Help screen
provides instant self-service answers at any point in the user journey.

The screen is accessible to **all users** — anonymous and authenticated alike —
and is reached from the **Help button in the Home screen header**. The Home
screen's PRD already specifies that button as routing to a placeholder; this
feature replaces that placeholder with the real Help screen. When users cannot
find their answer, a closing "Não achou sua dúvida?" block points them to a
support email.

## Objectives

- **Reduce friction for confused users:** a user who doesn't understand an app
  concept can find an answer in under 30 seconds without leaving the app.
- **Replace the Home-header Help placeholder:** the Help button on the Home header
  navigates to this screen with no dead ends.
- **Match the Check.it design language:** the screen faithfully reproduces the
  Help / FAQ visual pattern from the design reference (DESIGN.md).

Success criteria:

- A user arriving from the Home header Help button lands on the Help screen
  without errors.
- All three accordion sections (Listas, Limites, Gastos) are visible and
  individually expandable/collapsible.
- Only one section can be expanded at a time (single-open accordion); the open
  section can also be collapsed so that none is expanded.
- Expanding a section reveals all of its question/answer pairs in full.
- The screen works identically for anonymous and authenticated users.

## User Stories

- **As an anonymous user**, I want to open the Help screen from the Home header,
  so that I can understand how lists and budgets work before creating my first
  list.
- **As any user**, I want to browse common questions grouped by topic, so that I
  can quickly navigate to the area that is confusing me.
- **As any user**, I want to expand a topic section to read all of its questions
  and answers, so that I get clear explanations without leaving the app.
- **As any user**, I want to collapse the open section and expand a different one,
  so that I can browse at my own pace without the screen becoming cluttered.
- **As any user who didn't find an answer**, I want a way to reach support, so
  that I am never left without a next step.
- **As any user**, I want to close the Help screen with a clear affordance, so
  that the Help screen never feels like a dead end.

## Core features

### 1. Screen header

A minimal app header anchors the Help screen.

Functional requirements:

1.1. The header MUST display the title **"Sobre o que você quer saber?"** in the
Check.it header-title style.  
1.2. The header MUST display the subtitle **"Selecione uma seção pra ver as
principais dúvidas."** below the title.  
1.3. The header MUST include a **close (X) affordance** on the left that returns
the user to the Home screen.  
1.4. The header MUST follow the Check.it **minimal** header variant (Pure Snow
background with a hairline bottom border, Charcoal Ink text), per DESIGN.md.

### 2. Accordion sections

Three thematic sections organize the FAQ content.

Functional requirements:

2.1. The screen MUST display exactly three top-level accordion sections in this
order: **Listas**, **Limites**, **Gastos**.  
2.2. Each section header MUST show a leading topic icon, the section label, and a
trailing **plus / minus** indicator that communicates collapsed / expanded
state (plus when collapsed, minus when expanded).  
2.3. Only **one section may be expanded at a time**; expanding a section MUST
collapse the previously open one. Tapping the open section MUST collapse it,
leaving no section expanded.  
2.4. When a section is expanded, its header MUST visually switch to the active
state: **Herbal Leaf Green** background, white text, per the design reference.
Collapsed sections use the Linen Cream (surface-2) background with Charcoal Ink
text.  
2.5. The first section (Listas) MUST be expanded by default on screen entry.

### 3. FAQ items within sections

Each expanded section reveals all of its FAQ items at once.

Functional requirements:

3.1. When a section is expanded, it MUST render **all** of its question/answer
pairs simultaneously; there is no per-item expand/collapse interaction.  
3.2. Each FAQ tile MUST display the question text (emphasized) above its full
answer text.  
3.3. FAQ tiles MUST sit on a **16% white translucent overlay** over the section's
green active background, per DESIGN.md.  
3.4. All questions and answers MUST be **hard-coded PT-BR copy** — no network
request is required to render the screen.

### 4. Static content

The FAQ copy covers the three defined topic areas with the following verbatim
PT-BR questions and answers.

Functional requirements:

4.1. **Listas** section MUST contain these three items:
- "Como crio uma lista?" — "No início, toque em "Criar lista de compras" e defina
  um limite de gastos."
- "Posso editar uma lista salva?" — "Sim, abra a lista em "Listas" e edite cada
  item. Suas alterações ficam sincronizadas."
- "Como compartilhar com alguém?" — "Dentro da lista, toque no ícone de
  compartilhar para gerar um link ou convidar por e-mail."

4.2. **Limites** section MUST contain these two items:
- "Como definir um limite?" — "Ao criar uma lista, informe quanto pretende gastar
  no máximo. Te avisamos quando passar."
- "E se eu ultrapassar?" — "A barra fica vermelha e o app calcula quanto você
  passou do orçamento."

4.3. **Gastos** section MUST contain these two items:
- "Como ver gastos por mês?" — "Vá em "Resumo" para ver gráficos, médias e itens
  que mais subiram de preço."
- "O app guarda meus preços?" — "Sim. Comparamos preços entre listas, mostrando se
  um produto está mais caro."

### 5. Support fallback block

A closing block gives users a next step when the FAQ doesn't answer them.

Functional requirements:

5.1. Below the accordion, the screen MUST display a section titled **"Não achou
sua dúvida?"** with the supporting line **"Manda pra gente que respondemos assim
que possível."**  
5.2. The block MUST present a full-width **ghost button** carrying an envelope
icon and the label **"suporte@checkit.com"**, per DESIGN.md's ghost-button style.  
5.3. Activating the support button SHOULD initiate contacting support via the
displayed email address.

## User experience

**Persona & need:** Any Check.it user (anonymous or signed-in) who is confused
about a concept or wants to learn how the app works, reached the Help screen from
the Help button on the Home header.

**Main flow:**

1. User taps the Help icon on the Home header.
2. The Help screen appears with the "Listas" section already expanded, showing all
   of its question/answer pairs.
3. The user reads the visible answers.
4. The user taps a different section header (e.g., "Limites") — "Listas"
   collapses, "Limites" expands, showing all of its FAQ items.
5. If the user didn't find an answer, the "Não achou sua dúvida?" block offers the
   support email.
6. The user taps the close (X) affordance to return to Home.

**UI/UX requirements (per DESIGN.md):**

- **Header:** minimal variant — Pure Snow background with a hairline bottom border;
  title "Sobre o que você quer saber?" in `Header Title` scale (22 px / 700);
  subtitle "Selecione uma seção pra ver as principais dúvidas." (13 px, ~85%
  opacity); close (X) icon on the left.
- **Section headers (inactive):** Linen Cream (surface-2, `#F7F6F2`) background,
  leading topic icon, label in `Body Strong` scale (13 px / 700) Charcoal Ink, and
  a trailing plus icon.
- **Section headers (active):** Herbal Leaf Green (`#58AB6A`) fill, white text,
  leading icon and trailing minus icon in white.
- **FAQ tiles:** rendered inside the open green section over a 16% white
  translucent overlay (`rgba(255,255,255,.16)`), ~10 px radius; question in
  12 px / 700 and answer in 12 px / ~0.92 opacity, both white.
- **Section card corner radius:** 14 px, with content clipped (`overflow: hidden`).
- **Spacing:** 22 px left/right page gutters; ~8 px between section cards; ~12 px
  between FAQ tiles within a section.
- **Support block:** "Não achou sua dúvida?" in `H3` scale, supporting caption in
  small text, and a full-width ghost button with an envelope icon.
- **Typography:** `Plus Jakarta Sans` throughout.
- **Motion:** section background transitions (~200 ms) on expand/collapse,
  consistent with the design's transitions.

**Accessibility requirements:**

- Section headers and the support button MUST be reachable and operable by screen
  readers with meaningful PT-BR labels (`accessibilityLabel`, `accessibilityRole`).
- Each section header's expanded/collapsed state MUST be communicated to assistive
  technology (`accessibilityState: { expanded }`).
- Touch targets MUST meet a comfortable minimum (≥ 44 px height).
- Question and answer text MUST have sufficient contrast against the green section
  background (white-on-green at the specified weights/sizes).

## High-level technical constraints

- **No authentication required:** the screen renders identically for anonymous
  and signed-in users; no auth state is consumed.
- **No network dependency:** all FAQ content is bundled statically in the app;
  the screen is fully functional offline.
- **No dark mode:** dark mode is explicitly excluded from this app.
- **Language:** all user-facing copy is **PT-BR**; all source code identifiers and
  comments follow the project's English-only standard.
- **Design fidelity:** implementation MUST follow DESIGN.md and the referenced
  design source for colors, typography, spacing, and animation.
- **Platform:** mobile-first within the existing Expo (v56) React Native app,
  consistent with the 360 × 780 reference frame.
- **Navigation:** the screen integrates with the existing Expo Router navigation
  and is reachable from the Home header Help button.

## Out of scope

- **Search / filter:** no search bar or keyword filtering of FAQ content.
- **Remote / dynamic content:** FAQ questions and answers are not fetched from
  any API or CMS in this release.
- **User feedback or ratings on answers:** no thumbs-up / thumbs-down or "Was
  this helpful?" interaction.
- **Per-item expand/collapse:** FAQ items are not individually collapsible; a
  section reveals all of its items at once.
- **Live chat / ticketing:** beyond surfacing the support email, no in-app chat,
  ticket form, or external support integration is built.
- **Deep-linking into a specific section** from outside the Help screen.
- **Dark mode:** explicitly excluded project-wide.
- **Analytics / instrumentation:** no tracking of which sections are opened.
- **Localization beyond PT-BR:** no multi-language support.
