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

export type ItemUnit = 'unit' | 'kg';

export interface PricePart {
  readonly id: string;
  readonly label: string | null;
  readonly unitPriceInCents: number;
  readonly quantity: number;
}

export interface ListItem {
  readonly id: string;
  readonly name: string;
  readonly unit: ItemUnit;
  readonly quantity: number;
  readonly unitPriceInCents: number | null;
  readonly parts: readonly PricePart[] | null;
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
  readonly unit?: ItemUnit;
  readonly quantity?: number;
  readonly unitPriceInCents?: number | null;
  readonly parts?: readonly PricePart[] | null;
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
export const GRAMS_PER_KG = 1000;
export const HALF_KG_IN_GRAMS = 500;
export const MIN_WEIGHT_IN_GRAMS = 1;
export const MAX_WEIGHT_IN_GRAMS = 999_999;
export const DEFAULT_WEIGHT_IN_GRAMS = 1000;
export const MAX_PRICE_PARTS = 12;
export const MIN_PART_QUANTITY = 1;

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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeUnitQuantity(quantity: number): number {
  return Math.max(MIN_QUANTITY, Math.trunc(quantity));
}

function normalizeWeightInGrams(grams: number): number {
  return clamp(Math.trunc(grams), MIN_WEIGHT_IN_GRAMS, MAX_WEIGHT_IN_GRAMS);
}

function normalizeQuantityForUnit(unit: ItemUnit, quantity: number): number {
  if (unit === 'kg') return normalizeWeightInGrams(quantity);
  return normalizeUnitQuantity(quantity);
}

export function createListItem(
  input: NewItemInput,
  now: Date = new Date(),
): ListItem {
  return {
    id: createId(),
    name: input.name,
    unit: 'unit',
    quantity: normalizeUnitQuantity(input.quantity ?? MIN_QUANTITY),
    unitPriceInCents: input.unitPriceInCents ?? null,
    parts: null,
    category: input.category ?? null,
    checked: false,
    createdAt: now.toISOString(),
  };
}

function resolveParts(
  item: ListItem,
  changes: UpdateItemChanges,
): readonly PricePart[] | null {
  return 'parts' in changes ? (changes.parts ?? null) : item.parts;
}

function resolveQuantityForUnitSwitch(
  item: ListItem,
  nextUnit: ItemUnit,
  changes: UpdateItemChanges,
): number {
  if (changes.quantity !== undefined) {
    return normalizeQuantityForUnit(nextUnit, changes.quantity);
  }
  if (nextUnit === item.unit) return item.quantity;
  if (nextUnit === 'kg') return DEFAULT_WEIGHT_IN_GRAMS;
  return MIN_QUANTITY;
}

function resolvePrice(
  item: ListItem,
  changes: UpdateItemChanges,
): number | null {
  if (!('unitPriceInCents' in changes)) return item.unitPriceInCents;
  return changes.unitPriceInCents ?? null;
}

function resolveCategory(
  item: ListItem,
  changes: UpdateItemChanges,
): Category | null {
  if (!('category' in changes)) return item.category;
  return changes.category ?? null;
}

function applyPartsChanges(
  item: ListItem,
  changes: UpdateItemChanges,
  parts: readonly PricePart[],
): ListItem {
  return {
    ...item,
    name: changes.name ?? item.name,
    unit: 'unit',
    quantity: MIN_QUANTITY,
    unitPriceInCents: getPartsTotalInCents(parts),
    parts,
    category: resolveCategory(item, changes),
  };
}

export function applyItemChanges(
  item: ListItem,
  changes: UpdateItemChanges,
): ListItem {
  const parts = resolveParts(item, changes);
  if (parts !== null) return applyPartsChanges(item, changes, parts);
  const unit = changes.unit ?? item.unit;
  return {
    ...item,
    name: changes.name ?? item.name,
    unit,
    quantity: resolveQuantityForUnitSwitch(item, unit, changes),
    unitPriceInCents: resolvePrice(item, changes),
    parts: null,
    category: resolveCategory(item, changes),
  };
}

export function getLineTotalInCents(item: ListItem): number {
  if (item.unitPriceInCents === null) return 0;
  if (item.unit === 'kg') {
    return Math.floor(
      (item.unitPriceInCents * item.quantity + HALF_KG_IN_GRAMS) / GRAMS_PER_KG,
    );
  }
  return item.unitPriceInCents * item.quantity;
}

export function getPartsTotalInCents(parts: readonly PricePart[]): number {
  return parts.reduce(
    (total, part) => total + part.unitPriceInCents * part.quantity,
    0,
  );
}

export function getPartsCount(parts: readonly PricePart[]): number {
  return parts.reduce((total, part) => total + part.quantity, 0);
}

export function isKgItem(item: ListItem): boolean {
  return item.unit === 'kg';
}

export function hasParts(item: ListItem): boolean {
  return item.parts !== null;
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
