import { Minus, Plus, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  CATEGORIES,
  CATEGORY_META,
  type Category,
  getCategoryBackgroundClass,
  type ListItem,
  MIN_QUANTITY,
  type UpdateItemChanges,
} from '@/features/shop/list-item';
import { usePriceInput } from '@/features/shop/use-price-input';
import { formatBRL, formatBRLAmount } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface EditItemFormProps {
  item: ListItem;
  onClose: () => void;
  onSave: (itemId: string, changes: UpdateItemChanges) => void;
  onRemove: (itemId: string) => void;
}

export function EditItemForm({
  item,
  onClose,
  onSave,
  onRemove,
}: EditItemFormProps) {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [category, setCategory] = useState<Category | null>(item.category);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const price = usePriceInput(item.unitPriceInCents);
  function decrement(): void {
    setQuantity((current) => Math.max(MIN_QUANTITY, current - 1));
  }
  function increment(): void {
    setQuantity((current) => current + 1);
  }
  function toggleCategory(next: Category): void {
    setCategory((current) => (current === next ? null : next));
  }
  function save(): void {
    const trimmed = name.trim();
    onSave(item.id, {
      name: trimmed.length > 0 ? trimmed : item.name,
      unitPriceInCents: price.hasPrice ? price.cents : null,
      quantity,
      category,
    });
    onClose();
  }
  function remove(): void {
    setConfirmRemove(false);
    onRemove(item.id);
    onClose();
  }
  return (
    <View>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-[11px] font-semibold uppercase tracking-[0.06em] text-checkit-pebble-gray">
            Editando item
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            testID="edit-name-input"
            accessibilityLabel="Nome do item"
            className="mt-1 text-[22px] font-bold tracking-tight text-checkit-charcoal-ink"
          />
        </View>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          testID="edit-close"
          className="-mr-2 h-11 w-11 items-center justify-center"
        >
          <X size={22} color="#1B1B1B" strokeWidth={2} />
        </Pressable>
      </View>
      <View className="mt-[18px] rounded-[14px] bg-checkit-linen-cream p-4">
        <Text className="text-[11px] font-semibold uppercase tracking-[0.06em] text-checkit-pebble-gray">
          Preço unitário
        </Text>
        <View className="mt-2.5 flex-row items-baseline gap-1.5">
          <Text className="text-lg font-semibold text-checkit-pebble-gray">
            R$
          </Text>
          <TextInput
            value={price.hasPrice ? formatBRLAmount(price.cents) : ''}
            onChangeText={price.setDigits}
            keyboardType="number-pad"
            placeholder="0,00"
            placeholderTextColor="#8A8A8A"
            testID="edit-price-input"
            accessibilityLabel="Preço unitário"
            className="flex-1 text-[32px] font-bold tabular-nums tracking-tight text-checkit-charcoal-ink"
          />
        </View>
        <View className="my-3.5 h-px bg-checkit-mist-border" />
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[11px] font-semibold uppercase tracking-[0.06em] text-checkit-pebble-gray">
              Quantidade
            </Text>
            {price.hasPrice && (
              <Text
                testID="edit-total"
                className="mt-1 text-xs text-checkit-pebble-gray"
              >
                Total:{' '}
                <Text className="font-bold tabular-nums text-checkit-charcoal-ink">
                  {formatBRL(price.cents * quantity)}
                </Text>
              </Text>
            )}
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={decrement}
              disabled={quantity <= MIN_QUANTITY}
              accessibilityRole="button"
              accessibilityLabel="Diminuir quantidade"
              accessibilityState={{ disabled: quantity <= MIN_QUANTITY }}
              testID="edit-qty-decrement"
              className="h-9 w-9 items-center justify-center rounded-[10px] border-hairline border-checkit-mist-border bg-white"
            >
              <Minus size={16} color="#1B1B1B" strokeWidth={2} />
            </Pressable>
            <Text
              testID="edit-qty-value"
              className="w-10 text-center text-lg font-bold tabular-nums text-checkit-charcoal-ink"
            >
              {quantity}
            </Text>
            <Pressable
              onPress={increment}
              accessibilityRole="button"
              accessibilityLabel="Aumentar quantidade"
              testID="edit-qty-increment"
              className="h-9 w-9 items-center justify-center rounded-[10px] border-hairline border-checkit-mist-border bg-white"
            >
              <Plus size={16} color="#1B1B1B" strokeWidth={2} />
            </Pressable>
          </View>
        </View>
      </View>
      <Text className="mb-2.5 mt-[18px] text-[11px] font-semibold uppercase tracking-[0.06em] text-checkit-pebble-gray">
        Categoria
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {CATEGORIES.map((option) => {
          const meta = CATEGORY_META[option];
          const selected = category === option;
          return (
            <Pressable
              key={option}
              onPress={() => toggleCategory(option)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={meta.label}
              testID={`edit-category-${option}`}
              className={cn(
                'h-[30px] flex-row items-center gap-2 rounded-full px-3',
                selected
                  ? getCategoryBackgroundClass(option)
                  : 'border-hairline border-checkit-mist-border bg-checkit-linen-cream',
              )}
            >
              <View
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  selected ? 'bg-white' : getCategoryBackgroundClass(option),
                )}
              />
              <Text
                className={cn(
                  'text-xs font-semibold',
                  selected ? 'text-white' : 'text-checkit-pebble-gray',
                )}
              >
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable
        onPress={save}
        accessibilityRole="button"
        accessibilityLabel="Salvar alterações"
        testID="edit-save"
        className="mt-[22px] h-[52px] items-center justify-center rounded-xl bg-checkit-primary"
      >
        <Text className="text-[15px] font-bold text-white">
          Salvar alterações
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setConfirmRemove(true)}
        accessibilityRole="button"
        accessibilityLabel="Remover item"
        testID="edit-remove"
        className="mt-2.5 h-11 flex-row items-center justify-center gap-2 rounded-xl"
      >
        <Trash2 size={16} color="#E13E3E" strokeWidth={2} />
        <Text className="text-[13px] font-bold text-checkit-danger">
          Remover item
        </Text>
      </Pressable>
      <ConfirmDialog
        visible={confirmRemove}
        icon={Trash2}
        tone="danger"
        title={`Remover “${item.name}”?`}
        message="Esse item será retirado da lista. Você pode adicioná-lo novamente depois."
        confirmLabel="Sim, remover"
        cancelLabel="Cancelar"
        onConfirm={remove}
        onCancel={() => setConfirmRemove(false)}
        testID="edit-remove-dialog"
      />
    </View>
  );
}
