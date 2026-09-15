import { type Dispatch, type SetStateAction, useState } from 'react';
import {
  type Category,
  DEFAULT_WEIGHT_IN_GRAMS,
  getLineTotalInCents,
  type ItemUnit,
  type ListItem,
  MIN_QUANTITY,
  type UpdateItemChanges,
} from '@/features/shop/list-item';
import {
  type PriceInput,
  usePriceInput,
} from '@/features/shop/use-price-input';
import {
  useWeightInput,
  type WeightInput,
} from '@/features/shop/use-weight-input';

interface EditItemDraft {
  readonly name: string;
  readonly quantity: number;
  readonly category: Category | null;
}

interface EditItemComputedValues {
  readonly quantity: number;
  readonly unitPriceInCents: number | null;
}

export interface EditItemFormState {
  readonly name: string;
  readonly unit: ItemUnit;
  readonly canSelectUnit: boolean;
  readonly quantity: number;
  readonly category: Category | null;
  readonly price: PriceInput;
  readonly weight: WeightInput;
  readonly totalInCents: number;
  readonly canSave: boolean;
  readonly saveHint: string | null;
  setName: (name: string) => void;
  selectUnit: (unit: ItemUnit) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  selectCategory: (category: Category) => void;
  buildChanges: () => UpdateItemChanges;
}

type SetDraft = Dispatch<SetStateAction<EditItemDraft>>;

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

function buildChangesFromDraft(
  item: ListItem,
  unit: ItemUnit,
  draft: EditItemDraft,
  computed: EditItemComputedValues,
): UpdateItemChanges {
  const trimmed = draft.name.trim();
  return {
    name: trimmed.length > 0 ? trimmed : item.name,
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

export function useEditItemForm(item: ListItem): EditItemFormState {
  const [draft, setDraft] = useState<EditItemDraft>(() =>
    buildInitialDraft(item),
  );
  const [unit, setUnit] = useState<ItemUnit>(item.unit);
  const price = usePriceInput(item.unitPriceInCents);
  const weight = useWeightInput(buildInitialWeightInGrams(item));
  const computed = resolveComputedValues(unit, draft, price, weight);
  return {
    name: draft.name,
    unit,
    canSelectUnit: item.parts === null,
    quantity: draft.quantity,
    category: draft.category,
    price,
    weight,
    totalInCents: getLineTotalInCents({ ...item, unit, ...computed }),
    canSave: true,
    saveHint: null,
    setName: createSetName(setDraft),
    selectUnit: createSelectUnit(weight, setDraft, setUnit),
    incrementQuantity: createIncrementQuantity(setDraft),
    decrementQuantity: createDecrementQuantity(setDraft),
    selectCategory: createSelectCategory(setDraft),
    buildChanges: () => buildChangesFromDraft(item, unit, draft, computed),
  };
}
