# Product Requirements Document (PRD)

## Overview

Check.it is a Brazilian-Portuguese grocery-list app built around per-list budget control: the user sets a limit, adds products, checks them off in the store and watches the cart total against that limit. This feature — **Block 1 of the offline roadmap** — improves the Shop List screen (Passo 2 de 2) with three independent capabilities used *during* the shop:

1. **Total previsto** — the header shows the projected total ("if I take everything that is left, where do I land?") next to the cart total.
2. **Unidade por kg** — a product can be sold by weight: kilograms with three decimals, price per kg, line total computed by the app.
3. **Conjunto** (price composition) — one list line whose price is the sum of several parts (e.g. "Biscoitos" = three packs), without summing by hand.

It is for the pt-BR shopper in the aisle, one hand free. The app already holds the numbers behind (1) but never shows them; (2) and (3) are computed today in the user's head. All three make the shop faster or its ending clearer, and they shape the item model the upcoming history and price-memory blocks will snapshot. Visual reference: `DESIGN.md` and the Claude Design prototype.

## Objectives

Success is defined by behavioral, testable outcomes plus qualitative feedback from the Google Play closed-testing track; there is no analytics backend.

- The projected total is visible in the Shop header **without scrolling** whenever an unchecked priced item exists, and updates within the same interaction as any change.
- A by-weight item is entered end-to-end inside the Edit Item sheet; a weight such as `0,830 kg` takes **at most 3 digit keystrokes** after choosing "/kg".
- A conjunto of three parts is saved **without typing any sum**; the resulting price appears everywhere the item's price appears today.
- **Zero floating-point values persisted:** money is integer cents, weight is integer grams, line totals are rounded to the cent by one rule.
- **Backward compatible:** existing lists keep working — every item reads as "por unidade" with a single price, and no total changes.
- **No ripple:** only the edit sheet and the item row know a price is composed or a product is sold by kg.
- Closed testers report they can estimate a hortifruti/açougue shop from home; all flows are covered by automated tests.

## User Stories

**Primary persona — Budget-conscious shopper (pt-BR):** builds the list at home, checks items off in the store, and wants to know before the checkout whether the budget holds.

- As a shopper mid-aisle, I want to see the projected total next to the cart total, so that I know whether taking everything that is left blows the limit.
- As a shopper, I want the header to warn me when the *projection* passes 85% or 100% of the limit — visually, not as notification cards — so that I drop items before the checkout while notifications keep reflecting money actually in the cart.
- As a shopper buying alcatra, I want to mark the product as sold by kg and type the weight and the price per kg, so that the app computes the line total — at home as an estimate, at the scale as the sticker value.
- As a shopper buying several kinds of biscuits, I want one line "Biscoitos" whose price is the sum of the packs, typing only prices and skipping labels, so that the list stays short and the total right.
- As a shopper who changed their mind, I want to turn a conjunto back into a single price, so that a mistake is not a dead end.

**Edge cases**

- A kg item without a price shows the weight and "sem preço", contributes R$ 0,00 and counts toward the item count.
- Switching an item with quantity 3 to "/kg" must not silently produce "3 kg"; the weight starts at a default the user confirms.
- A conjunto with an unpriced part cannot be saved until that part is priced or removed; a conjunto is always "por unidade".
- When every item is checked, no projection is shown (it would equal the cart total).

## Core features

### 1. Total previsto in the Shop header

**What:** The budget chip shows, next to "No carrinho", a "Previsto" value: cart total plus the line totals of unchecked priced items.
**Why:** The question in the aisle is "if I take everything, do I pass the limit?". The app has the number and never shows it.
**How (high level):** Derived from the active list on demand, never stored. Budget status and notifications stay driven by the checked total.

**Functional requirements:**

1. The header must display "Previsto" as *cart total + line totals of unchecked priced items*, in pt-BR currency format, whenever at least one unchecked priced item exists; otherwise it is omitted.
2. The projection must update within the same interaction as any check/uncheck, mark-all, price, quantity, weight, unit or removal change.
3. The projection must receive a visual warning treatment plus a textual cue at ≥ 85% of the limit, and a distinct over-limit treatment when it exceeds the limit while the cart total is still within it; never conveyed by color alone.
4. The status line must gain the case "Previsto estoura em R$ X" with this precedence: cart over the limit, then projection over the limit, then pending items, then remaining budget.
5. The progress bar, the `onTrack / warning / overBudget` budget status and every budget notification must remain based on the **checked** total only; the projection must never emit a notification.
6. Priceless items must count toward the item count only, as today.

### 2. Unidade por kg

**What:** Every item has a unit: "por unidade" (default) or "por kg". A kg item stores its weight in integer grams and its price per kg.
**Why:** Hortifruti and açougue sell by weight; today a quantity is an integer ≥ 1, so `0,830 kg` cannot be expressed. Kg mode enables estimating at home and gives future price memory a meaningful "R$/kg".
**How (high level):** A `/un · /kg` toggle on the price field; in kg mode the quantity stepper becomes a weight input reusing the cents-fill typing mechanic with three decimals.

**Functional requirements:**

1. Exactly two units exist: "por unidade" and "por kg". New and pre-existing items are "por unidade".
2. The Edit Item sheet must show a toggle `/un · /kg` attached to the price field; the price label reads "Preço" in unit mode and "Preço por kg" in kg mode.
3. In kg mode the quantity stepper must be replaced by a weight input that fills from the right with three decimals: typing `8`, `3`, `0` shows `0,830 kg`; `1`, `2`, `5`, `0` shows `1,250 kg`.
4. Weight must be stored as integer grams, greater than zero, below a named upper bound.
5. Switching to "/kg" must default the weight to `1,000 kg` unless a weight was already entered; switching to "/un" must set the quantity to 1. Price is preserved across switches.
6. The line total of a kg item must be `price per kg × grams ÷ 1000`, rounded to the nearest cent; without a price it contributes R$ 0,00.
7. The item row must read `0,830 kg × R$ 29,90/kg` (or `0,830 kg × sem preço`) with the line total on the right; the sheet's live "Total" follows the same rule.
8. The unit must never be inferred from the category; it comes from the user only, and no screen outside the row and the sheet may special-case kg items.

### 3. Conjunto (price composition)

**What:** An item may have **parts** — each with an optional label, a price and a quantity — whose sum becomes the item's price. The item remains a single line.
**Why:** Several kinds of biscuits under one line "Biscoitos"; today the user sums by hand in the aisle.
**How (high level):** Opt-in from inside the price field ("Somar vários"). The sum of the parts becomes the item's price on save and stays the single value every other screen consumes.

**Functional requirements:**

1. Every item is created simple. The parts editor must appear only after the user taps "Somar vários" inside the price field.
2. Entering composition mode must pre-fill the first part with the item's current price (if any) and present one additional empty part row.
3. Each part must offer an optional label, a price input with the cents-fill mechanic, and a quantity stepper with a minimum of 1. Parts are "por unidade" only, and the `/un · /kg` toggle must be unavailable while parts exist.
4. The user must be able to add parts (up to a named maximum) and remove any part; the sheet shows the live sum "Total: R$ X" as parts change.
5. On save, the item's price must equal the sum of `part price × part quantity`; the item's quantity must be 1 and its stepper hidden while parts exist.
6. "Salvar alterações" must be disabled with a hint while any part lacks a price; rows with neither label nor price are discarded silently on save.
7. "Voltar a preço único" must remove the parts and keep the sum as the item's single price.
8. The item row must show a subtitle such as "3 itens · R$ 11,97" (count = sum of part quantities).
9. Nothing outside the Edit Item sheet and the item row may depend on parts: Summary, sort, search, budget status, notifications and future history snapshots consume the item's single price.

## User experience

**Persona and needs:** the in-store shopper — one hand, moving, glancing. Every addition must be readable at a glance and reversible in one tap.

**Main flows**

- *Projection:* no new interaction. The header reads "No carrinho R$ 320,00 · Previsto R$ 470,00 / R$ 500,00" (layout per `DESIGN.md`).
- *Kg item:* add "Alcatra" → edit sheet → "/kg" → `1,000 kg` → type `830` → `0,830 kg` → price per kg → "Total: R$ 24,82" → save. Row: `0,830 kg × R$ 29,90/kg — R$ 24,82`.
- *Conjunto:* add "Biscoitos" → edit sheet → "Somar vários" → type each part's price, adjust quantities → "Total: R$ 11,97" → save. Row: "3 itens · R$ 11,97". "Voltar a preço único" collapses the parts.

**UI/UX requirements**

- Follow `DESIGN.md`: hero green header with the translucent budget chip, 14 px card radius, tabular-numeral currency, Plus Jakarta Sans, light theme only.
- The projection must not push the cart total or the limit off the chip on a ~360 px-wide phone; wrapping to a second line is acceptable.
- The `/un · /kg` toggle uses the existing chip styling; the weight input matches the price input visually and in typing behavior; the parts editor is a section inside the sheet, which stays scrollable with the keyboard open.
- Copy is pt-BR: "Previsto", "Preço por kg", "Somar vários", "Voltar a preço único", "Adicionar parte", "Total".

**Accessibility**

- Every new control exposes accessible labels, roles and states; touch targets ≥ 44 px in the smaller dimension.
- Projection warning and over-limit states are conveyed by text, not color alone; the chip's screen-reader summary includes "Previsto R$ X de R$ Y"; weights are announced in readable words ("0,830 quilos").

## High-level technical constraints

- **Platform:** Expo SDK 56 / React Native with Expo Router, NativeWind and the existing design tokens; no new native dependencies. Everything stays local and anonymous in the persisted active-list state.
- **Money and weight are integers:** cents and grams, never floats; kg line totals rounded to the nearest cent by a single documented rule.
- **Persisted shape changes must be versioned** with a migration so pre-existing lists keep opening, every item becoming "por unidade" with no parts and no stored total changing.
- **The checked total remains the single source of truth** for budget status and notifications; the projection is derived on demand, never stored.
- **Composition is invisible beyond the sheet and row:** the item's single price remains the only value consumed by Summary, sort, search, notifications and, later, history snapshots. Receipt-scanned items land as "por unidade", simple.
- **Testing:** Jest + React Native Testing Library following `__tests__/` patterns, plus Detox specs; existing test IDs stay stable.

## Out of scope

- **Notifications driven by the projected total** — visual warning only (product decision).
- **Other units** (liters, grams as a unit, dozens) and any **default unit by category**.
- **Parts sold by kg**, **nested or reusable conjuntos**, and parts as separate list items.
- **Memory features** (autocomplete, last price, "R$/kg" history) — Block 5; **history and Concluir compra** — Block 2.
- **Changes to the Summary screen layout** and **receipt OCR enhancements** (parsing weight or price per kg from a cupom fiscal).
- **Storage decision** for the weight (separate field vs. reinterpreting quantity) — settled in the Technical Specification.
