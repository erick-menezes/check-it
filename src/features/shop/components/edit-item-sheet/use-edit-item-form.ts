import { useState } from 'react';
import {
  type Category,
  type ListItem,
  MIN_QUANTITY,
  type UpdateItemChanges,
} from '@/features/shop/list-item';
import {
  type PriceInput,
  usePriceInput,
} from '@/features/shop/use-price-input';

interface EditItemDraft {
  readonly name: string;
  readonly quantity: number;
  readonly category: Category | null;
}

export interface EditItemFormState {
  readonly name: string;
  readonly quantity: number;
  readonly category: Category | null;
  readonly price: PriceInput;
  readonly totalInCents: number;
  readonly canSave: boolean;
  readonly saveHint: string | null;
  setName: (name: string) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  selectCategory: (category: Category) => void;
  buildChanges: () => UpdateItemChanges;
}

function buildInitialDraft(item: ListItem): EditItemDraft {
  return {
    name: item.name,
    quantity: item.quantity,
    category: item.category,
  };
}

export function useEditItemForm(item: ListItem): EditItemFormState {
  const [draft, setDraft] = useState<EditItemDraft>(() =>
    buildInitialDraft(item),
  );
  const price = usePriceInput(item.unitPriceInCents);
  function setName(name: string): void {
    setDraft((current) => ({ ...current, name }));
  }
  function incrementQuantity(): void {
    setDraft((current) => ({ ...current, quantity: current.quantity + 1 }));
  }
  function decrementQuantity(): void {
    setDraft((current) => ({
      ...current,
      quantity: Math.max(MIN_QUANTITY, current.quantity - 1),
    }));
  }
  function selectCategory(category: Category): void {
    setDraft((current) => ({
      ...current,
      category: current.category === category ? null : category,
    }));
  }
  function buildChanges(): UpdateItemChanges {
    const trimmed = draft.name.trim();
    return {
      name: trimmed.length > 0 ? trimmed : item.name,
      unitPriceInCents: price.hasPrice ? price.cents : null,
      quantity: draft.quantity,
      category: draft.category,
    };
  }
  return {
    name: draft.name,
    quantity: draft.quantity,
    category: draft.category,
    price,
    totalInCents: price.hasPrice ? price.cents * draft.quantity : 0,
    canSave: true,
    saveHint: null,
    setName,
    incrementQuantity,
    decrementQuantity,
    selectCategory,
    buildChanges,
  };
}
