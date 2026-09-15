import { type Dispatch, type SetStateAction, useState } from 'react';
import {
  type Category,
  DEFAULT_WEIGHT_IN_GRAMS,
  getLineTotalInCents,
  type ItemUnit,
  type ListItem,
  MAX_PRICE_PARTS,
  MIN_PART_QUANTITY,
  MIN_QUANTITY,
  type PricePart,
  type UpdateItemChanges,
} from '@/features/shop/list-item';
import {
  MAX_PRICE_DIGITS,
  type PriceInput,
  usePriceInput,
} from '@/features/shop/use-price-input';
import {
  useWeightInput,
  type WeightInput,
} from '@/features/shop/use-weight-input';
import {
  digitsToInteger,
  integerToDigits,
  sanitizeDigits,
} from '@/lib/digits-input';
import { createId } from '@/lib/id';

interface EditItemDraft {
  readonly name: string;
  readonly quantity: number;
  readonly category: Category | null;
}

interface EditItemComputedValues {
  readonly quantity: number;
  readonly unitPriceInCents: number | null;
}

export interface PricePartDraft {
  readonly id: string;
  readonly label: string;
  readonly priceDigits: string;
  readonly quantity: number;
}

export interface PricePartDraftChanges {
  readonly label?: string;
  readonly priceDigits?: string;
  readonly quantity?: number;
}

export interface EditItemFormState {
  readonly name: string;
  readonly unit: ItemUnit;
  readonly canSelectUnit: boolean;
  readonly quantity: number;
  readonly category: Category | null;
  readonly price: PriceInput;
  readonly weight: WeightInput;
  readonly parts: readonly PricePartDraft[] | null;
  readonly canAddPart: boolean;
  readonly totalInCents: number;
  readonly canSave: boolean;
  readonly saveHint: string | null;
  setName: (name: string) => void;
  selectUnit: (unit: ItemUnit) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  selectCategory: (category: Category) => void;
  enableParts: () => void;
  disableParts: () => void;
  addPart: () => void;
  removePart: (partId: string) => void;
  updatePart: (partId: string, changes: PricePartDraftChanges) => void;
  incrementPartQuantity: (partId: string) => void;
  decrementPartQuantity: (partId: string) => void;
  buildChanges: () => UpdateItemChanges;
}

type SetDraft = Dispatch<SetStateAction<EditItemDraft>>;
type SetParts = Dispatch<SetStateAction<readonly PricePartDraft[] | null>>;

const SAVE_HINT_MISSING_PRICE = 'Adicione o preço de cada parte para salvar.';

function buildInitialDraft(item: ListItem): EditItemDraft {
  return {
    name: item.name,
    quantity: item.quantity,
    category: item.category,
  };
}

function buildInitialWeightInGrams(item: ListItem): number | null {
  return item.unit === 'kg' ? item.quantity : null;
}

function buildPartDraft(part: PricePart): PricePartDraft {
  return {
    id: part.id,
    label: part.label ?? '',
    priceDigits: integerToDigits(part.unitPriceInCents),
    quantity: part.quantity,
  };
}

function buildInitialPartsDraft(
  item: ListItem,
): readonly PricePartDraft[] | null {
  return item.parts === null ? null : item.parts.map(buildPartDraft);
}

function isBlankPartDraft(part: PricePartDraft): boolean {
  return part.label.trim().length === 0 && part.priceDigits.length === 0;
}

function partDraftHasPrice(part: PricePartDraft): boolean {
  return digitsToInteger(part.priceDigits) > 0;
}

function getDraftPartsTotalInCents(parts: readonly PricePartDraft[]): number {
  return parts.reduce(
    (total, part) => total + digitsToInteger(part.priceDigits) * part.quantity,
    0,
  );
}

function toPricePart(draft: PricePartDraft): PricePart {
  const label = draft.label.trim();
  return {
    id: draft.id,
    label: label.length > 0 ? label : null,
    unitPriceInCents: digitsToInteger(draft.priceDigits),
    quantity: draft.quantity,
  };
}

function buildFinalParts(
  parts: readonly PricePartDraft[],
): readonly PricePart[] {
  return parts.filter((part) => !isBlankPartDraft(part)).map(toPricePart);
}

function resolveCanSave(parts: readonly PricePartDraft[] | null): boolean {
  if (parts === null) return true;
  const meaningfulParts = parts.filter((part) => !isBlankPartDraft(part));
  return meaningfulParts.length > 0 && meaningfulParts.every(partDraftHasPrice);
}

function resolveSaveHint(
  parts: readonly PricePartDraft[] | null,
): string | null {
  return resolveCanSave(parts) ? null : SAVE_HINT_MISSING_PRICE;
}

function resolveComputedValues(
  unit: ItemUnit,
  draft: EditItemDraft,
  price: PriceInput,
  weight: WeightInput,
): EditItemComputedValues {
  return {
    quantity: unit === 'kg' ? weight.grams : draft.quantity,
    unitPriceInCents: price.hasPrice ? price.cents : null,
  };
}

function resolveTotalInCents(
  item: ListItem,
  unit: ItemUnit,
  computed: EditItemComputedValues,
  parts: readonly PricePartDraft[] | null,
): number {
  if (parts !== null) return getDraftPartsTotalInCents(parts);
  return getLineTotalInCents({ ...item, unit, ...computed });
}

function buildChangesFromDraft(
  item: ListItem,
  unit: ItemUnit,
  draft: EditItemDraft,
  computed: EditItemComputedValues,
  parts: readonly PricePartDraft[] | null,
): UpdateItemChanges {
  const trimmed = draft.name.trim();
  const name = trimmed.length > 0 ? trimmed : item.name;
  if (parts !== null) {
    return { name, parts: buildFinalParts(parts), category: draft.category };
  }
  return {
    name,
    unit,
    unitPriceInCents: computed.unitPriceInCents,
    quantity: computed.quantity,
    category: draft.category,
  };
}

function createSetName(setDraft: SetDraft): (name: string) => void {
  return (name) => setDraft((current) => ({ ...current, name }));
}

function createSelectUnit(
  weight: WeightInput,
  setDraft: SetDraft,
  setUnit: Dispatch<SetStateAction<ItemUnit>>,
): (nextUnit: ItemUnit) => void {
  return (nextUnit) => {
    if (nextUnit === 'kg' && !weight.hasValue) {
      weight.setDigits(String(DEFAULT_WEIGHT_IN_GRAMS));
    }
    if (nextUnit === 'unit') {
      setDraft((current) => ({ ...current, quantity: MIN_QUANTITY }));
    }
    setUnit(nextUnit);
  };
}

function createIncrementQuantity(setDraft: SetDraft): () => void {
  return () =>
    setDraft((current) => ({ ...current, quantity: current.quantity + 1 }));
}

function createDecrementQuantity(setDraft: SetDraft): () => void {
  return () =>
    setDraft((current) => ({
      ...current,
      quantity: Math.max(MIN_QUANTITY, current.quantity - 1),
    }));
}

function createSelectCategory(
  setDraft: SetDraft,
): (category: Category) => void {
  return (category) =>
    setDraft((current) => ({
      ...current,
      category: current.category === category ? null : category,
    }));
}

function createEmptyPartDraft(): PricePartDraft {
  return {
    id: createId(),
    label: '',
    priceDigits: '',
    quantity: MIN_PART_QUANTITY,
  };
}

function createEnableParts(price: PriceInput, setParts: SetParts): () => void {
  return () => {
    const firstPart: PricePartDraft = {
      ...createEmptyPartDraft(),
      priceDigits: price.hasPrice ? price.digits : '',
    };
    setParts([firstPart, createEmptyPartDraft()]);
  };
}

function createDisableParts(
  parts: readonly PricePartDraft[] | null,
  price: PriceInput,
  setParts: SetParts,
): () => void {
  return () => {
    if (parts !== null) {
      price.setDigits(String(getDraftPartsTotalInCents(parts)));
    }
    setParts(null);
  };
}

function createAddPart(
  parts: readonly PricePartDraft[] | null,
  setParts: SetParts,
): () => void {
  return () => {
    if (parts === null || parts.length >= MAX_PRICE_PARTS) return;
    setParts([...parts, createEmptyPartDraft()]);
  };
}

function createRemovePart(setParts: SetParts): (partId: string) => void {
  return (partId) =>
    setParts((current) =>
      current === null ? null : current.filter((part) => part.id !== partId),
    );
}

function applyPartDraftChanges(
  part: PricePartDraft,
  changes: PricePartDraftChanges,
): PricePartDraft {
  return {
    ...part,
    label: changes.label ?? part.label,
    priceDigits:
      changes.priceDigits === undefined
        ? part.priceDigits
        : sanitizeDigits(changes.priceDigits, MAX_PRICE_DIGITS),
    quantity:
      changes.quantity === undefined
        ? part.quantity
        : Math.max(MIN_PART_QUANTITY, Math.trunc(changes.quantity)),
  };
}

function createUpdatePart(
  setParts: SetParts,
): (partId: string, changes: PricePartDraftChanges) => void {
  return (partId, changes) =>
    setParts((current) =>
      current === null
        ? null
        : current.map((part) =>
            part.id === partId ? applyPartDraftChanges(part, changes) : part,
          ),
    );
}

function createShiftPartQuantity(
  parts: readonly PricePartDraft[] | null,
  updatePart: (partId: string, changes: PricePartDraftChanges) => void,
  delta: number,
): (partId: string) => void {
  return (partId) => {
    const part = parts?.find((candidate) => candidate.id === partId);
    if (part) updatePart(partId, { quantity: part.quantity + delta });
  };
}

export function useEditItemForm(item: ListItem): EditItemFormState {
  const [draft, setDraft] = useState<EditItemDraft>(() =>
    buildInitialDraft(item),
  );
  const [unit, setUnit] = useState<ItemUnit>(item.unit);
  const [parts, setParts] = useState<readonly PricePartDraft[] | null>(() =>
    buildInitialPartsDraft(item),
  );
  const price = usePriceInput(item.unitPriceInCents);
  const weight = useWeightInput(buildInitialWeightInGrams(item));
  const computed = resolveComputedValues(unit, draft, price, weight);
  const updatePart = createUpdatePart(setParts);
  return {
    name: draft.name,
    unit,
    canSelectUnit: parts === null,
    quantity: draft.quantity,
    category: draft.category,
    price,
    weight,
    parts,
    canAddPart: parts !== null && parts.length < MAX_PRICE_PARTS,
    totalInCents: resolveTotalInCents(item, unit, computed, parts),
    canSave: resolveCanSave(parts),
    saveHint: resolveSaveHint(parts),
    setName: createSetName(setDraft),
    selectUnit: createSelectUnit(weight, setDraft, setUnit),
    incrementQuantity: createIncrementQuantity(setDraft),
    decrementQuantity: createDecrementQuantity(setDraft),
    selectCategory: createSelectCategory(setDraft),
    enableParts: createEnableParts(price, setParts),
    disableParts: createDisableParts(parts, price, setParts),
    addPart: createAddPart(parts, setParts),
    removePart: createRemovePart(setParts),
    updatePart,
    incrementPartQuantity: createShiftPartQuantity(parts, updatePart, 1),
    decrementPartQuantity: createShiftPartQuantity(parts, updatePart, -1),
    buildChanges: () =>
      buildChangesFromDraft(item, unit, draft, computed, parts),
  };
}
