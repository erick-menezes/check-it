# Design System: Check.it

**Source:** Claude Design handoff bundle (`api.anthropic.com/v1/design/h/4hjQwuvRqupwrdPD7Ep0Lw`)
**Product:** Brazilian-Portuguese mobile shopping-list app with per-list budget control, expense history and price tracking.
**Form factor:** Mobile-first, 360 × 780 px phone frame, iOS-style status bar.

---

## 1. Visual Theme & Atmosphere

Check.it feels **fresh, friendly and quietly utilitarian** — the visual personality of a personal-finance helper that wants to feel like a notebook, not a bank. The palette pivots around a confident, slightly herbal **leaf green** as the brand anchor, balanced by a warm **mustard-honey yellow** that signals accents, money and "do this next."

The overall mood is:

- **Airy yet grounded:** generous outer padding (22 px gutters) but compact, content-dense rows inside each card. Information density wins over decoration.
- **Soft-modern:** subtly rounded everything (cards 14–16 px, modals 20–24 px, pills 999 px). No sharp 90° corners exist anywhere — every element has at least a gentle curve.
- **Whisper-light depth:** shadows are present but barely visible (`0 4px 14px rgba(0,0,0,.06)`). Cards "rest" on the page rather than "float."
- **Inviting but disciplined:** the green takes over big surfaces (onboarding, hero headers, primary buttons) without ever feeling shouty — it's a low-saturation, slightly cool green, more "matcha" than "neon."
- **Bilingual visual voice:** capital-letter labels (`MARCAR TODOS`, `PASSO 1 DE 2`) and tabular-numeric currency give the app a small, deliberate clerical/receipt flavor — appropriate for an app about totals.

---

## 2. Color Palette & Roles

### Brand & Action

| Descriptive Name | Hex | Role |
| --- | --- | --- |
| **Herbal Leaf Green** | `#58AB6A` | Primary brand color. Used on the wordmark mark, primary buttons, hero header backgrounds, active tab icons, "in-progress" progress bars, brand badges and onboarding background. |
| **Deep Forest Green** | `#479A59` | Pressed/confirm state of the primary. Also used as the second stop in the gradient header (`primary → primary-dark`). |
| **Honey Mustard Yellow** | `#F2B807` | Brand accent. Drives the wordmark's "." separator, the secondary call-to-action button ("Vamos lá!", "Criar lista"), the notification badge dot, and warning thresholds (85%+ of budget). Also the `mercearia` (grocery) category. |

### Feedback / Status

| Descriptive Name | Hex | Role |
| --- | --- | --- |
| **Alert Crimson** | `#E13E3E` | Danger / over-budget. Used on destructive buttons, "exceeded limit" totals, the `açougue` (butcher) category, and the swipe-to-delete underlay. |
| **Cobalt Sky Blue** | `#5180F9` | Informational. Used on the "Salvar" (save) button, dashboard/info icons, the `higiene` (hygiene) category and price-history insights. |

### Category Hues (semantic accent palette)

| Category (PT-BR) | Descriptive Name | Hex |
| --- | --- | --- |
| Mercearia (Grocery) | Honey Mustard Yellow | `#F2B807` |
| Hortifruti (Produce) | Herbal Leaf Green | `#58AB6A` |
| Açougue (Butcher) | Alert Crimson | `#E13E3E` |
| Higiene (Hygiene) | Cobalt Sky Blue | `#5180F9` |
| Limpeza (Cleaning) | Royal Lavender | `#7A5AE0` |
| Bebidas (Drinks) | Lagoon Teal | `#3DA9C7` |
| Outros (Other) | Neutral Slate Gray | `#8A8A8A` |

### Surfaces

| Descriptive Name | Hex | Role |
| --- | --- | --- |
| **Warm Oat (page bg)** | `#ECEAE3` | The phone's surrounding stage background — a paper-like off-white with a touch of warmth. |
| **Pure Snow (surface)** | `#FFFFFF` | Card and screen backgrounds. The primary content surface. |
| **Linen Cream (surface-2)** | `#F7F6F2` | Subtle secondary surface — used inside cards, for "soft" buttons, segmented control track, suggestion chips. |
| **Fog Gray (surface-3)** | `#EBEBEB` | Tertiary surface — progress-bar tracks, switch off-state, divider fills. |
| **Mist Border** | `#E3E3E3` | Hairline borders on cards, dividers, dashed empty states. |

### Text

| Descriptive Name | Hex | Role |
| --- | --- | --- |
| **Charcoal Ink** | `#1B1B1B` | Primary text and high-contrast headings. |
| **Slate Ink** | `#3D3D4D` | Secondary text, body copy on softer surfaces. |
| **Pebble Gray** | `#8A8A8A` | Muted text, captions, metadata, placeholder labels. |
| **Lavender Stone** | `#BAB7C5` | Tertiary muted text and disabled icon state. |

### Shadows

- **Card whisper:** `0 4px 14px rgba(0,0,0,.06)` — barely there, used on primary cards and the floating "create list" CTA.
- **Elevated hover:** `0 8px 24px rgba(0,0,0,.10)` — for modals, dialogs, toasts.
- **Phone frame:** `0 30px 60px -20px rgba(0,0,0,.35)` — the global stage drop shadow that makes the device float.
- **Sheet lift:** `0 -10px 30px rgba(0,0,0,.18)` — bottom sheet upward shadow.

---

## 3. Typography Rules

**Font family:** `Plus Jakarta Sans` (Google Fonts), with `system-ui, sans-serif` fallback. The same family is used across all UI — there is no serif, no monospace family. Numbers use the font's tabular-numeric variant (`font-variant-numeric: tabular-nums`) so currency totals align cleanly.

**Tone:** Modern geometric sans with a slight humanist warmth — assertive but never austere. Heavy weights (700/800) carry hierarchy; medium (500/600) carries body and metadata.

**Letter-spacing:** Headings are tracked tightly (`-0.02em` to `-0.03em`) for a confident, condensed display feel. Uppercase labels reverse this and use generous tracking (`+0.08em` to `+0.16em`) for a "small caps eyebrow" effect.

### Type Scale

| Token | Size / Weight | Tracking | Usage |
| --- | --- | --- | --- |
| **Display (onboarding title)** | 30 px / 800 | `-0.02em` | Onboarding hero, large currency totals. |
| **H1** | 28 px / 700 | `-0.02em` | Page-level titles. |
| **Currency Hero** | 56 px / 800 | `-0.04em` (tabular) | Limit-setting input on the green screen. |
| **Header Title** | 22 px / 700 | `-0.02em` | Inside `Header` component. |
| **H2 (sheet title)** | 20 px / 700 | normal | Sheets, modal headers. |
| **H3 / section** | 16 px / 700 | normal | Section labels in scroll content. |
| **Body Strong** | 13–14 px / 700 | `-0.01em` | List card titles, button labels. |
| **Body** | 13–14 px / 500–600 | normal | Inputs, item names. |
| **Small / Caption** | 11–12 px / 500–600 | normal | Metadata, dates, subtitle copy. |
| **Eyebrow Label** | 11 px / 600 | `+0.08em`, ALL CAPS | Section eyebrows ("CONTA", "APARÊNCIA", "NO CARRINHO"). |
| **Kicker (onboarding)** | 12 px / 700 | `+0.16em`, ALL CAPS | Step kickers ("Olá, sou seu ajudante!"). |
| **Mono Numeric** | inherit / 700 | `-0.01em`, tabular | All currency values — same font, but `font-variant-numeric: tabular-nums` for column alignment. |

### Wordmark

The brand wordmark `Check.it` ships in four variants — all use `Plus Jakarta Sans 800`, tracked at `-0.03em`:

- **Dot variant** (default): The "." between "Check" and "it" is rendered in **Honey Mustard Yellow** — the single splash of brand accent on otherwise dark or light text.
- **Stroke variant:** Hollow outline letterforms (1.5 px stroke), with the yellow dot remaining filled.
- **Stack variant:** Two-line layout, "Check." top, "it" indented below in lighter weight.
- **Mark variant:** A 1.1×size rounded-square (radius ≈ 32% of size) in Herbal Leaf Green with a white checkmark, paired with the dot wordmark.

---

## 4. Component Stylings

### Buttons (`Btn`)

- **Shape:** Always **softly rounded rectangles** (12 px corner radius), never pills. Heights 34 / 44 / 52 px (sm / md / lg).
- **Weight:** Label is `700`, tracking `-0.01em`.
- **Tap feedback:** `transform: scale(0.97)` on active — a subtle squeeze, no ripple.
- **Variants:**
  - **Primary** — Herbal Leaf Green fill, white label. Default CTA.
  - **Accent** — Honey Mustard Yellow fill, near-black label (`#1B1B1B`). The "wow, go!" button used on onboarding finish and final create-list confirmation.
  - **Confirm** — Deep Forest Green fill, white label. Slightly more committed than primary.
  - **Ghost** — Transparent fill, thin Mist Border, current text color. Used for secondary actions and Google sign-in.
  - **Danger** — Alert Crimson fill, white label. Destructive confirmation.
  - **Soft** — Linen Cream fill, primary text. The quietest filled button.
  - **Info** — Cobalt Sky Blue fill, white label. Used for "Salvar" save action.
  - **OnPrimary** — Translucent white (16% alpha) over the green hero. Used for "Próximo" on onboarding intermediate steps.

### Cards / Containers

- **List cards & content cards:** 16 px corner radius, Pure Snow background, 1 px Mist Border outline, plus the whisper-soft drop shadow. Internal padding 14–16 px.
- **Secondary "soft" cards:** 14–16 px radius, Linen Cream (`#F7F6F2`) background, same Mist Border outline. Used for nested groups (settings rows, suggestion areas).
- **Hero header:** Either **solid Leaf Green**, **gradient Leaf-to-Forest with a deep emerald terminus** (`linear-gradient(135deg, primary 0%, primary-dark 60%, mixed-emerald 100%)`), or a **minimal white** variant with a hairline bottom border. The hero is always a full-bleed top block with 50 px top padding (for the status bar) and a softly nested "summary chip" inside it.
- **Onboarding card:** A 168 × 168 px **glassy circle** — translucent white (12% alpha) on a green ground, with a 1 px translucent white border, hosting a large 92 px icon. The circle reads as a frosted halo.
- **Dialogs (centered alert):** 20 px corner radius, Pure Snow surface, 22 px padding, with the elevated shadow. Topped by a 52 × 52 px **tinted icon tile** — a colored square (14 px radius) holding the dialog's icon in the tone color, with a `color-mix` 16% wash background.

### Inputs / Forms

- **Add-item input:** A 14 px corner-radius pill-rectangle in Pure Snow with a hairline border and the card whisper shadow. Hosts a leading plus icon (Pebble Gray), the text field, and a trailing **38 × 38 px green-square confirm button** (10 px radius) — the only "two-tone" form control in the app.
- **Range slider (goal):** Native `<input type="range">` styled minimally — the value is shown above in giant 40 px tabular-numeric mono.
- **Currency input:** Reveals no styled form field. Instead, a giant 56 px tabular number is shown and a hidden `<input>` captures keystrokes (Nubank-style cents-fill behavior).
- **Editable title:** Looks like static heading text until tapped; reveals a 2 px bottom border underline (half-opacity white over green headers, Mist Border over white headers).
- **Toggle / Switch:** Pill-shaped (`38 × 22 px`, 11 px radius), Herbal Leaf Green when on / Fog Gray when off, with a pure-white circular knob carrying a tiny soft shadow. Knob slides on a 200 ms cubic-bezier.
- **Checkbox (`Check`):** A 22 × 22 px slightly-rounded square (radius ≈ 5.5 px = `size/4`), 2 px border. Empty state shows the Mist Border outline; checked state fills with primary green and shows a white checkmark.

### Chips / Pills

- **Standard chip:** 26 px tall, 999 px radius (true pill), 10 px horizontal padding, Linen Cream fill, Mist Border outline, 11 px / 600 weight label.
- **Solid chip:** Same shape, Herbal Leaf Green fill, white label. Used for the "Em aberto" badge on the active list.
- **Category chip (in editor):** When selected, fills with the category's hex color; when idle, falls back to the standard chip style with a colored dot prefix.
- **Preset value pills (limit screen):** Translucent white (14% alpha) over the green ground, white text, 999 px radius — feels like a small frosted-glass tag.

### Progress Indicators

- **Primary progress bar:** 4–8 px tall track in Fog Gray, with a 4 px-radius fill. Fill color shifts contextually: Herbal Leaf Green under 85%, Honey Mustard Yellow at 85–100%, Alert Crimson when over.
- **Onboarding step dots:** 6 px height, 6 px radius for inactive dots, **stretches to 22 px wide** for the active dot — a stretchy pill indicator.

### Bottom Tab Bar

- 64 px tall, full-width grid of equal columns (3 cols logged out, 4 cols logged in), Pure Snow background with a hairline top border. Icons swap from Phosphor `regular` (idle) to Phosphor `fill` (active) and recolor from Pebble Gray to Herbal Leaf Green. Labels are 10 px / 600.

### Status Bar

- iOS-style mock at the top of every screen: time on the left, signal-bars + Wi-Fi + battery glyphs on the right. Inherits white text on hero green headers, Charcoal Ink on minimal headers.

### Bottom Sheets

- Rounded **24 px top corners** only (squared at the bottom). Pure Snow surface, 22–28 px internal padding, animated up with a 280 ms cubic-bezier translate. A 38 × 4 px Mist Border "drag handle" sits centered at the top.
- Dimmed by a `rgba(0,0,0,.45)` backdrop.

### Toast

- Floats 88 px above the tab bar. Dark pill (12 px radius) — uses the page's text color as background and surface color as foreground (inverse). 13 px / 500 label.

### Icons

- **Phosphor Icons** web font, four weights in active use: `regular` (idle), `bold` (alert emphasis), `fill` (active tab), `duotone` (occasional).
- Default sizes: 14 px (small), 16–18 px (inline), 22 px (header & tab), 32–42 px (empty states), 92 px (onboarding hero).
- Google icon is the one exception — bespoke multi-color SVG.

---

## 5. Layout Principles

### Phone Frame

- All screens render inside a fixed **360 × 780 px** "phone" with **36 px corner radius**, sitting on the Warm Oat stage. A faint inner highlight (`inset 0 1px 0 rgba(255,255,255,.6)`) sells the bezel.
- The phone auto-scales to fit the viewport via a CSS `--phone-scale` custom property (set by JS).

### Page Structure

Every screen follows the same three-part skeleton:

1. **Header block** (`Header` component) — solid, gradient or minimal — pinned at the top, always carries the status bar, a back/close affordance, the title, and optional right actions.
2. **Scrollable content** (`.screen-scroll`) — flex-grows, no visible scrollbar (`scrollbar-width: none`).
3. **Bottom anchor** — either nothing, or the tab bar (64 px). Scroll content always reserves `~100 px` bottom padding to clear the tab bar.

### Spacing System

The codebase uses an **8-pixel rhythmic spacing scale**, but with intentional half-steps:

- **Gutters:** 22 px left/right page margins.
- **Card padding:** 14–16 px internal.
- **Vertical rhythm:** 8 / 10 / 12 / 14 / 16 / 18 / 22 / 26 / 38 px — favoring 10–14 px between siblings and 22–26 px between sections.
- **Section labels** sit 26 px below the previous section, 10 px above their content.

### Density Modes

A `data-density` attribute on the phone toggles three preset rhythms — `compact` (`--rh: .92`), default (`1`), `comfy` (`1.1`). Item rows tighten from 12 px padding (default) to 8 px (compact).

### Alignment

- Currency and quantitative data is **right-aligned**, in tabular-numeric weight 700 — readable as a column.
- Labels and titles are **left-aligned**, with right-side actions in a separate flex row.
- Empty states are **center-aligned**, with a 72–80 px circular icon halo above an H3 + small caption + ghost CTA.

### Transitions & Motion

- **Screen-in:** 320 ms slide from right (`cubic-bezier(.2,.7,.2,1)`), with a slight fade.
- **Screen-back:** 320 ms slide from left at 30% offset.
- **Fade-in:** 250 ms for non-spatial appearances.
- **Sheet rise:** 280 ms, same cubic-bezier.
- **Dialog pop:** 220 ms scale-up from 0.92 to 1.0.
- **Tap feedback:** 120 ms scale-down to 0.97 on `:active`.
- **Progress bar:** 300–500 ms width transition.

### Whitespace Strategy

The product is not minimalist — it's **disciplined density**. Long lists are unapologetically long, and the layout privileges visible totals over breathing room. Whitespace is used where it provides hierarchy (above section labels, around CTAs) and reduced wherever the content earns presence (inside cards, inside the currency hero). The result is an app that feels efficient on a phone screen but never crowded.

---

## 6. Screen Inventory

The handoff bundles the following screens / surfaces, all visible in `screens.jsx`:

| Screen / Surface | Purpose | Notable visual signature |
| --- | --- | --- |
| **Onboarding** | Three-step intro (welcome → limit value → list metaphor) | Full-green ground, frosted-halo icon, stretchy-pill step indicator. |
| **Home** | Greeting + "Criar lista" CTA card + recent lists + dashboard/goal cards | Personalized greeting in hero, accent-yellow CTA tile, info & accent tinted icon tiles. |
| **Limit (Step 1 of 2)** | Set R$ budget for a new list | Full-green ground, 56 px currency hero, preset translucent pills, accent yellow "Criar lista" finisher. |
| **Shop List (active list)** | Add / check / edit items, see budget chip, sort & search | Editable title, in-header budget summary chip, two-tone add-item field. |
| **Item Edit Sheet** | Sheet to set name, unit price, qty, category, and view price history | Bottom sheet, big tabular price input, colored category chips, info-blue price-history tile. |
| **Summary** | Per-list breakdown by category, top-5 most expensive | Big total tile shifts to crimson background-mix when over budget. |
| **Lists Tab (history)** | All saved lists grouped by month, with year/this-month filter chips | Filter chips at top, repeated `ListCard` rows. |
| **Lists Tab (logged out)** | Locked empty state | Circular lock icon, ghost Google sign-in CTA. |
| **Dashboard / Analytics** | Month goal progress + KPI tiles + bar chart + price tracker rows | 28 px tabular total, 5-column bar chart with current month highlighted in green. |
| **Dashboard (logged out)** | Same locked empty state pattern as Lists | Circular chart icon, ghost Google CTA. |
| **Settings** | Account, notifications, about | "Conta" tile with gradient avatar, segmented SettingRow list, danger-outlined logout. |
| **Help / FAQ** | Sectioned accordion (Listas / Limites / Gastos) | Active section turns green; nested FAQ tiles use 16% white translucent overlay. |
| **Notifications** | Categorized alerts list | Tinted icon tiles per notification type (danger / accent / primary / info). |
| **Terms & Privacy** | Tabbed long-form legal copy | Segmented control track in Linen Cream with white selected pill. |
| **Login Sheet** | Google sign-in prompt | Bottom sheet, 64 px green-gradient check tile, ghost Google CTA. |
| **Share Sheet** | Copy share link, invite by name | Bottom sheet, mono link chip, primary copy CTA, contact rows with gradient avatars. |
| **Receipt Sheet** | Scan a paper receipt (placeholder camera area) | Bottom sheet, dashed-border preview area, primary "Usar exemplo" CTA. |
| **Goal Sheet** | Set monthly R$ goal via range slider | Bottom sheet, 40 px tabular value, native slider, primary save CTA. |
| **Confirm Dialog** | Generic destructive/affirmative confirmation | Centered modal, tinted icon tile (danger / primary / accent tone), ghost cancel + filled confirm. |
| **Sort Sheet** | List sort options | Bottom sheet, selectable rows with leading icon, check marker on active. |

---

## 7. Implementation Notes for Stitch / Future Generators

- **Always specify the corner radius** in descriptive form: cards "softly rounded (~14–16 px)," modals "generously rounded top corners (~24 px)," buttons "subtly rounded (~12 px)," toggles & chips "fully pill-shaped (999 px)."
- **Always pair the green with one of:** the accent yellow (for CTAs that need to feel celebratory), the cobalt blue (for save/info actions), or pure white text (for hero surfaces). Never green-on-green, never green-with-red except for over-budget state.
- **Currency is sacred:** always tabular-numeric weight 700, with the "R$" prefix in a smaller, slightly muted weight 600.
- **Default to soft elevation,** not flat. A card without the whisper-shadow looks broken in this system.
- **Use category color as a tint, not a fill,** when icons appear over cards (use `color-mix(in oklch, [color] 18%, transparent)` for the tile background and the pure color for the icon glyph itself).
