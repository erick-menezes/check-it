import {
  Beef,
  CupSoda,
  Leaf,
  type LucideIcon,
  ShoppingCart,
  Sparkles,
  SprayCan,
  Tag,
} from 'lucide-react-native';
import { createId } from '@/lib/id';

export type Category =
  | 'grocery'
  | 'produce'
  | 'butcher'
  | 'hygiene'
  | 'cleaning'
  | 'drinks'
  | 'other';

export interface ListItem {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly unitPriceInCents: number | null;
  readonly category: Category | null;
  readonly checked: boolean;
  readonly createdAt: string;
}

export interface NewItemInput {
  readonly name: string;
  readonly quantity?: number;
  readonly unitPriceInCents?: number | null;
  readonly category?: Category | null;
}

export interface UpdateItemChanges {
  readonly name?: string;
  readonly quantity?: number;
  readonly unitPriceInCents?: number | null;
  readonly category?: Category | null;
}

export interface CategoryMeta {
  readonly label: string;
  readonly colorHex: string;
  readonly icon: LucideIcon;
}

export interface CategoryTile {
  readonly colorHex: string;
  readonly tint: string;
  readonly icon: LucideIcon;
}

export const MIN_QUANTITY = 1;

export const CATEGORIES: readonly Category[] = [
  'grocery',
  'produce',
  'butcher',
  'hygiene',
  'cleaning',
  'drinks',
  'other',
];

export const CATEGORY_META: Readonly<Record<Category, CategoryMeta>> = {
  grocery: { label: 'Mercearia', colorHex: '#F2B807', icon: ShoppingCart },
  produce: { label: 'Hortifruti', colorHex: '#58AB6A', icon: Leaf },
  butcher: { label: 'Açougue', colorHex: '#E13E3E', icon: Beef },
  hygiene: { label: 'Higiene', colorHex: '#5180F9', icon: SprayCan },
  cleaning: { label: 'Limpeza', colorHex: '#7A5AE0', icon: Sparkles },
  drinks: { label: 'Bebidas', colorHex: '#3DA9C7', icon: CupSoda },
  other: { label: 'Outros', colorHex: '#8A8A8A', icon: Tag },
};

const UNCATEGORIZED_LABEL = 'Sem categoria';
const TILE_TINT_ALPHA = 0.18;
const HEX_RADIX = 16;
const HEX_RED_START = 0;
const HEX_GREEN_START = 2;
const HEX_BLUE_START = 4;
const HEX_CHANNEL_LENGTH = 2;

function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const red = parseInt(
    value.slice(HEX_RED_START, HEX_RED_START + HEX_CHANNEL_LENGTH),
    HEX_RADIX,
  );
  const green = parseInt(
    value.slice(HEX_GREEN_START, HEX_GREEN_START + HEX_CHANNEL_LENGTH),
    HEX_RADIX,
  );
  const blue = parseInt(
    value.slice(HEX_BLUE_START, HEX_BLUE_START + HEX_CHANNEL_LENGTH),
    HEX_RADIX,
  );
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function normalizeQuantity(quantity: number): number {
  return Math.max(MIN_QUANTITY, Math.trunc(quantity));
}

export function createListItem(
  input: NewItemInput,
  now: Date = new Date(),
): ListItem {
  return {
    id: createId(),
    name: input.name,
    quantity: normalizeQuantity(input.quantity ?? MIN_QUANTITY),
    unitPriceInCents: input.unitPriceInCents ?? null,
    category: input.category ?? null,
    checked: false,
    createdAt: now.toISOString(),
  };
}

export function applyItemChanges(
  item: ListItem,
  changes: UpdateItemChanges,
): ListItem {
  return {
    ...item,
    name: changes.name ?? item.name,
    quantity:
      changes.quantity === undefined
        ? item.quantity
        : normalizeQuantity(changes.quantity),
    unitPriceInCents:
      'unitPriceInCents' in changes
        ? (changes.unitPriceInCents ?? null)
        : item.unitPriceInCents,
    category:
      'category' in changes ? (changes.category ?? null) : item.category,
  };
}

export function getLineTotalInCents(item: ListItem): number {
  if (item.unitPriceInCents === null) return 0;
  return item.unitPriceInCents * item.quantity;
}

export function getCategoryMeta(
  category: Category | null,
): CategoryMeta | null {
  if (category === null) return null;
  return CATEGORY_META[category];
}

export function getCategoryLabel(category: Category | null): string {
  return getCategoryMeta(category)?.label ?? UNCATEGORIZED_LABEL;
}

const CATEGORY_BACKGROUND_CLASS: Readonly<Record<Category, string>> = {
  grocery: 'bg-checkit-grocery-label-color',
  produce: 'bg-checkit-produce-label-color',
  butcher: 'bg-checkit-butcher-label-color',
  hygiene: 'bg-checkit-hygiene-label-color',
  cleaning: 'bg-checkit-cleaning-label-color',
  drinks: 'bg-checkit-drinks-label-color',
  other: 'bg-checkit-other-label-color',
};

const CATEGORY_TINT_CLASS: Readonly<Record<Category, string>> = {
  grocery: 'bg-checkit-grocery-label-color/[0.18]',
  produce: 'bg-checkit-produce-label-color/[0.18]',
  butcher: 'bg-checkit-butcher-label-color/[0.18]',
  hygiene: 'bg-checkit-hygiene-label-color/[0.18]',
  cleaning: 'bg-checkit-cleaning-label-color/[0.18]',
  drinks: 'bg-checkit-drinks-label-color/[0.18]',
  other: 'bg-checkit-other-label-color/[0.18]',
};

export function getCategoryBackgroundClass(category: Category | null): string {
  if (category === null) return CATEGORY_BACKGROUND_CLASS.other;
  return CATEGORY_BACKGROUND_CLASS[category];
}

export function getCategoryTintClass(category: Category | null): string {
  if (category === null) return CATEGORY_TINT_CLASS.other;
  return CATEGORY_TINT_CLASS[category];
}

export function getCategoryTile(category: Category | null): CategoryTile {
  const meta = getCategoryMeta(category);
  if (meta === null) {
    return {
      colorHex: '#8A8A8A',
      tint: hexToRgba('#8A8A8A', TILE_TINT_ALPHA),
      icon: Tag,
    };
  }
  return {
    colorHex: meta.colorHex,
    tint: hexToRgba(meta.colorHex, TILE_TINT_ALPHA),
    icon: meta.icon,
  };
}
