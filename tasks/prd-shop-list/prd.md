# Product Requirements Document (PRD)

## Overview

Check.it is a Brazilian-Portuguese mobile shopping-list app whose core promise is per-list budget control. Today, after creating a list on the Limit screen (Passo 1 de 2), the user lands on a placeholder stub. This feature replaces that stub with the real **Shop List screen (Passo 2 de 2)** — the heart of the product — where the user adds products, checks them off while shopping, edits price/quantity/category per item, and watches the cart total against the budget in real time. It also delivers the **Summary screen** the shop list links to, with a per-category breakdown and most-expensive items, and **functional receipt scanning**: photographing a cupom fiscal extracts its items and prices into the list via OCR.

It is designed for budget-conscious shoppers (pt-BR) who want live feedback on how much of their planned budget is already in the cart. The visual reference is the "Shop List (active list)", "Item Edit Sheet", "Receipt Sheet", "Sort Sheet" and "Summary" surfaces in the design handoff (`design-handoff/`) and `DESIGN.md`. Dark mode is dropped entirely by product decision.

## Objectives

- Complete the app's central loop: create list (limit) → add/check/edit items → see summary, with no stub left on the path.
- Every list mutation (add, check, edit, remove, rename) is auto-persisted locally and survives app restart — the user never presses "save".
- The budget chip reflects any change to checked items within the same interaction (no manual refresh), including the green → yellow (≥85%) → red (over) threshold shifts.
- Adding a product takes at most 2 interactions (type + confirm, or 1 tap on a suggestion).
- A legible cupom fiscal photo populates the list with its items, quantities and prices without any manual typing; a failed scan never corrupts the list.
- Visual fidelity to the design handoff (layout, palette, type scale, motion), with the agreed deviations: search available from the first item, and the Summary's "Por categoria" rendered as a single stacked bar.
- All flows covered by automated tests, consistent with the project's existing per-screen suites.

## User Stories

**Primary persona — Budget-conscious shopper (pt-BR):** builds the list at home, then checks items off in the store while watching the budget.

- As a shopper, I want to type a product name and confirm to add it to my list, so that building the list is fast.
- As a shopper, I want suggestions to appear when I focus the empty add field, so that common products are one tap away.
- As a shopper, I want to check items off as I put them in the cart, so that "No carrinho" reflects what I'm actually buying.
- As a shopper, I want to see cart total, limit, a progress bar and a status message in the header, so that I always know how much I can still spend.
- As a shopper, I want to edit an item's name, unit price, quantity and category, so that totals are accurate.
- As a shopper, I want to remove an item (with confirmation), so that mistakes don't pollute the list.
- As a shopper, I want to search my list by product name as soon as it has items, so that I find things quickly in long lists.
- As a shopper, I want to sort by addition order, price, name or category, so that the list matches how I shop.
- As a shopper, I want to mark/unmark all items at once, so that resetting or finishing a trip is one tap.
- As a shopper, I want to rename the auto-filled list title, so that the list reflects its purpose.
- As a shopper, I want a full summary (by category and most expensive items), so that I understand where the money goes.
- As a shopper, I want to delete the list (with confirmation), so that I can start over.
- As a shopper, I want to swipe an item to reveal a quick delete action, so that cleaning the list is fast.
- As a shopper, I want to photograph my cupom fiscal and have the items and prices extracted into the list, so that I skip typing an entire purchase.
- As a new user with an empty list, I want a friendly empty state with a "scan receipt" option, so that I know how to begin.

**Edge cases:**

- An item without a price shows "—" as total and "Nx sem preço" as subtitle; it contributes R$ 0,00 to totals.
- When checked items exceed the limit, the header shows "Excedeu em R$ X" and the bar/total turn crimson; the Summary tile does the same.
- A search with no matches shows an empty result area without losing the list data.
- Quantity can never go below 1; add is disabled while the input is blank.
- An item without a category shows a neutral (Slate Gray) icon tile/dot and groups under "Sem categoria" in the Summary; items are created without a category until the user picks one.
- A scanned receipt that cannot be read (bad photo, unreadable text) produces a clear error and a retry path, never partial garbage silently added to the list.

## Core features

### 1. Header — editable title and budget chip

**What:** Hero header with the list title (auto-filled at creation, e.g. "Compra mensal de Maio", tappable to edit inline) and a translucent budget chip: "NO CARRINHO" with the checked total, "LIMITE" with the list limit, a progress bar, and a contextual status line.
**Why:** It is the product's promise — permanent budget visibility while shopping.
**How (high level):** Totals derive from checked items (unit price × quantity). The status line switches between remaining budget, pending items, and over-budget messaging.

**Functional requirements:**

1. The title must show the list's auto-filled name and become editable on tap (underline affordance per design), persisting the new name on commit.
2. "No carrinho" must equal the sum of price × quantity of **checked** items, in pt-BR currency format, tabular numerals.
3. The progress bar fill must be (checked total ÷ limit), capped at 100%, with color thresholds: default below 85%, Honey Mustard at 85–100%, Alert Crimson when over.
4. The status line must show: "Excedeu em R$ X" when over; otherwise "Faltam N • R$ Y a comprar" while unchecked priced items exist; otherwise "Ainda dá pra gastar R$ Z".

### 2. Add-product input with suggestions

**What:** A card-style input (leading plus icon, trailing 38 px green confirm button) that adds products to the list; focusing it while empty reveals a suggestion box with product chips.
**Why:** Adding items is the most frequent action; suggestions remove typing for common products.
**How (high level):** Confirming adds an item with defaults (qty 1, no price, no category, unchecked). Suggestions are a static curated set for now, designed so a history-based source can replace it after authentication exists.

**Functional requirements:**

1. Confirming a non-empty input (button or keyboard submit) must append an item with name as typed, quantity 1, no price, no category, unchecked, and clear the input.
2. The confirm button must be visually disabled and inert while the input is empty/whitespace.
3. Focusing the input while it is empty must show the "Sugestões" box with the static suggestion chips; tapping a chip adds that product directly (same defaults) without extra confirmation.
4. The suggestion box must hide when the input has text or loses focus.

### 3. Search, sort and receipt shortcut row

**What:** Once the list has at least one item, an action row appears (sort selector + camera shortcut button) followed by a search field.
**Why:** Long in-store lists need fast retrieval and reordering.
**How (high level):** Search filters the visible list by name; sort opens a bottom sheet with five options.

**Functional requirements:**

1. The action row and the search field must appear as soon as the list has ≥ 1 item (deviation from the prototype's > 4 rule) and disappear when it empties.
2. Search must filter items by case-insensitive name substring, affecting only the visible list (never the stored data); clearing it restores the full list.
3. The sort button must display the current sort label and open the Sort sheet: "Ordem de adição" (default), "Maior preço primeiro", "Menor preço primeiro", "Nome (A-Z)", "Por categoria"; selecting one applies it and closes the sheet. Under "Por categoria", items without a category sort last.
4. The camera shortcut must open the Receipt sheet (feature 6).

### 4. Item list with mark-all and swipe-to-delete

**What:** Card rows — checkbox, category icon tile (category color at 18% tint; neutral Slate Gray when the item has no category), product name (strikethrough + dimmed when checked), "qty× unit price" subtitle, right-aligned line total, and an edit button — preceded by a "Marcar todos (x/y)" master checkbox. Swiping a row left reveals a crimson "Excluir" underlay for quick removal.
**Why:** This is the in-store working surface: check off, glance at totals, jump into editing, swipe away mistakes.
**How (high level):** Toggling a row updates totals immediately; the master checkbox sets all items at once; the swipe gesture combines with the card visuals (the prototype's swipe variant underlay applied to the default card row).

**Functional requirements:**

1. Toggling an item's checkbox must flip its checked state and update header/summary totals immediately.
2. Each row must show the category icon tile (neutral Slate Gray treatment when category is null), name, "N× R$ U" subtitle ("N× sem preço" when priceless), and line total ("—" when priceless).
3. The master checkbox must show "Marcar todos (checked/total)", be checked only when all items are checked, and set every item's checked state on toggle.
4. Tapping a row's body or its edit button must open the Edit Item sheet for that item.
5. Swiping a row left must reveal the crimson "Excluir" underlay; tapping it removes the item immediately and updates totals. Swiping back (or tapping elsewhere) hides the underlay without removing.
6. Item removal must remain available through the Edit Item sheet as a non-gesture alternative (accessibility).

### 5. Edit Item sheet

**What:** A bottom sheet with editable name, unit price (cents-fill currency input), quantity stepper, optional category chip picker (7 categories), "Salvar alterações" primary CTA, and "Remover item" with confirmation.
**Why:** Price, quantity and category accuracy is what makes the budget meaningful.
**How (high level):** Changes apply only on save; removal asks for confirmation via the standard dialog. Category is optional — items are born without one and may stay that way.

**Functional requirements:**

1. The sheet must open pre-filled with the item's current name, price, quantity and category; when the item has no category, no chip is selected.
2. The price input must accept digits only and fill from the cents (e.g. `6`,`9`,`0` → R$ 6,90), showing a live "Total: R$ X" (price × quantity) when a price exists.
3. The quantity stepper must increment/decrement with a minimum of 1.
4. The category picker must show all 7 categories (Mercearia, Hortifruti, Açougue, Higiene, Limpeza, Bebidas, Outros); the selected chip fills with its category color; tapping the selected chip again clears the selection back to no category. Saving with no selection is valid.
5. "Salvar alterações" must persist all edits to the item and close the sheet; dismissing via backdrop or X discards changes.
6. "Remover item" must show a confirmation dialog ("Remover “[name]”?"); confirming removes the item and closes the sheet, cancelling keeps everything.

### 6. Empty state and receipt scanning (OCR)

**What:** When the list is empty: a circular icon halo, "Sua lista está vazia", helper copy and a ghost "Escanear cupom" button. The Receipt sheet is **functional**: a live camera preview in the sheet's preview area, a capture CTA, and OCR that reads the photographed cupom fiscal and adds its items to the list. No mocks or example data.
**Why:** Typing a whole purchase is the most expensive interaction in the app; scanning the receipt collapses it into one photo.
**How (high level):** The sheet keeps the design's layout (title, helper copy, preview area, full-width primary CTA), replacing the dashed placeholder with the camera feed. After capture, the receipt text is processed and each recognized line becomes a list item with extracted name, quantity and unit price.

**Functional requirements:**

1. The empty state must render exactly when the list has 0 items, with the copy and ghost camera CTA from the handoff.
2. "Escanear cupom" (empty state) and the camera shortcut (action row) must open the Receipt bottom sheet showing a live camera preview in the preview area; the backdrop dismisses without changes.
3. The sheet must request camera permission on first use; if denied, it must explain why the camera is needed and offer a path to the system settings instead of a dead end.
4. Capturing a photo must run text recognition on the receipt and extract, per purchased line: product name, quantity and unit price.
5. Each successfully extracted line must be added to the list as an item with the extracted name, quantity and unit price, no category, unchecked — and persist like any other mutation.
6. The user must receive feedback on the outcome (e.g., number of items added); while processing, the sheet must show a recognizable in-progress state.
7. If recognition fails or yields no purchasable lines, the sheet must show a clear error and allow retrying with a new photo; nothing is added to the list in that case.

### 7. Summary preview card and Summary screen

**What:** Below the items, a "Resumo" card (Itens marcados, Subtotal, Limite, and Disponível/Excedeu) with a "Ver completo" action that navigates to the dedicated Summary screen: a hero total tile, the remaining/over banner, "Por categoria" and "Mais caros" sections.
**Why:** The summary turns a checklist into spending insight.
**How (high level):** The screen recomputes from the persisted list. **Agreed deviation:** "Por categoria" is a **single horizontal stacked bar** — each category fills its percentage of the bar in its color — with a legend below listing category name + amount in R$ per category (replacing the prototype's one-bar-per-category layout).

**Functional requirements:**

1. The preview card must show checked count ("X de Y"), subtotal (checked total), limit, and "Disponível"/"Excedeu" with the absolute difference, colored primary/danger respectively; it appears only when the list has items.
2. "Ver completo" must navigate to the Summary screen; the screen's back affordance returns to the shop list.
3. The Summary total tile must show the list total, the defined limit, and the banner "Você ainda tem R$ X" (primary) or "Estourou em R$ X" (danger), with the tile shifting to the crimson-tinted treatment when over budget.
4. "Por categoria" must render one stacked bar where each present category occupies its percentage of the total in its category color, with a legend underneath showing each category's name and total in R$, ordered by amount descending. Items without a category group as a "Sem categoria" segment in neutral Slate Gray, ordered with the rest by amount.
5. "Mais caros" must list the top 5 items by line total (price × quantity) with category dot (neutral Slate Gray when uncategorized), name and value.

### 8. Delete list and persistence

**What:** An "Excluir" ghost-danger button at the bottom of the shop list opens a confirmation dialog; every list change is saved automatically to local storage.
**Why:** Auto-save removes the riskiest failure (losing the in-store list); deletion needs friction.
**How (high level):** The active list lives in the existing persisted local state. The prototype's "Salvar" button is intentionally dropped — saving to an account/database requires authentication, which does not exist yet.

**Functional requirements:**

1. Every mutation (add, toggle, mark all, edit, remove, rename, scanned items) must persist immediately to local storage and survive app restart.
2. "Excluir" must show the confirmation dialog ("Excluir esta lista?" with the list name); confirming deletes the active list and navigates back to Home, cancelling changes nothing.
3. Home's active-list card must stay consistent with the shop list state (item count, totals, limit) after any change.

## User experience

**Entry:** Limit screen confirmation lands here (320 ms slide-from-right), and the Home active-list card reopens it. **Exit:** header close affordance back to Home; "Ver completo" into Summary and back.

**Visual requirements (per `DESIGN.md` and handoff):** hero green header with white editable title and translucent budget chip (white 12% fill, 14 px radius); 22 px gutters; add-input as Pure Snow card (14 px radius, whisper shadow, 38 px green confirm square); suggestion box in Linen Cream with pill chips; item cards 14 px radius with Mist Border and 32 px tinted category tiles; checkboxes 22 px rounded squares filling primary green; bottom sheets with 24 px top corners, drag handle and dimmed backdrop; confirm dialogs with tinted icon tile; currency always tabular-numeric 700 with smaller muted "R$"; Plus Jakarta Sans throughout; light theme only.

**Accessibility:** all interactive elements (checkboxes, edit/sort/camera buttons, chips, steppers, sheet close) expose accessible labels, roles and states (checked, disabled, selected); touch targets ≥ 44 px in the smaller dimension (padded hit areas where visuals are smaller); checked state conveyed by strikethrough + dimming, not color alone; over-budget conveyed by text message, not color alone; the budget chip announces a meaningful summary ("No carrinho R$ X de R$ Y") to screen readers; stacked-bar categories remain understandable via the textual legend; swipe-to-delete always has the edit-sheet removal as a non-gesture equivalent; camera permission and scan outcomes are communicated in plain pt-BR copy.

## High-level technical constraints

- **Platform:** Expo (SDK 56) / React Native with Expo Router; replaces the existing `/shop` stub route without changing entry points (Limit confirmation, Home card). Summary becomes a new route reachable only from the shop list.
- **State:** must extend the existing persisted active-list state (zustand + AsyncStorage) as the single source of truth — the `ActiveList` model grows to hold items, with category as a nullable field; Home's consumption of it must keep working.
- **Money:** all amounts handled in integer cents, reusing the project's existing currency utilities; pt-BR formatting everywhere.
- **Styling:** NativeWind utility classes with the design tokens already in the Tailwind config; no dark mode.
- **Receipt scanning:** requires camera permission (with the standard permission flow on iOS/Android) and a text-recognition (OCR) capability able to parse Brazilian cupons fiscais; on-device recognition is preferred to preserve offline behavior. Captured photos are processed for extraction only — not stored beyond the scan, not uploaded anywhere beyond what recognition strictly requires.
- **Offline-first:** list management works with no network dependency; if the chosen OCR capability needs connectivity, only the scan degrades (with a clear message) — never the rest of the screen.
- **Testing:** Jest + React Native Testing Library following the existing `__tests__/` patterns, plus e2e specs consistent with the existing `e2e/` suites.

## Out of scope

- **Authentication and everything gated by it:** login, "Salvar" to a database (button dropped from shop list and Summary), list sharing, price history in the edit sheet, and history-based suggestions (the suggestion source ships static; the hybrid upgrade lands with auth).
- **Dark mode:** dropped entirely by product decision.
- **Lists history tab and Dashboard/Analytics:** browsing past lists, monthly goals and KPIs are separate features.
- **Multiple simultaneous lists:** only the single active list exists.
- **Budget push notifications:** the screen provides visual budget feedback only; generating notification entries is a separate concern.
- **Receipt extras:** category inference from receipt text, QR-code/NFC-e lookup against SEFAZ, and editing a scan before import are not included — scanned items land as regular items the user can edit normally.
- **Line item-row variant:** only the card variant (with the swipe-to-delete gesture) ships; the prototype's "line" variant is not implemented.
- **Density modes:** the prototype's compact/comfy density toggle is not implemented.

