import { Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Text, TextInput } from '@/components/ui/text';
import type { ListItem, UpdateItemChanges } from '@/features/shop/list-item';
import { useEditItemForm } from '../use-edit-item-form';
import { CategoryPicker } from './category-picker';
import { PriceQuantityCard } from './price-quantity-card';

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
  const form = useEditItemForm(item);
  const [confirmRemove, setConfirmRemove] = useState(false);
  function save(): void {
    onSave(item.id, form.buildChanges());
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
            value={form.name}
            onChangeText={form.setName}
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
      <PriceQuantityCard
        price={form.price}
        quantity={form.quantity}
        totalInCents={form.totalInCents}
        onDecrementQuantity={form.decrementQuantity}
        onIncrementQuantity={form.incrementQuantity}
      />
      <CategoryPicker
        category={form.category}
        onSelectCategory={form.selectCategory}
      />
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
