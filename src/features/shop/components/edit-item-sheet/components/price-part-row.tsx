import { Minus, Plus, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text, TextInput } from '@/components/ui/text';
import { MIN_PART_QUANTITY } from '@/features/shop/list-item';
import { formatBRLAmount } from '@/lib/currency';
import { digitsToInteger } from '@/lib/digits-input';
import type { PricePartDraft } from '../use-edit-item-form';

interface PricePartRowProps {
  part: PricePartDraft;
  onChangeLabel: (label: string) => void;
  onChangePriceDigits: (digits: string) => void;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
  onRemove: () => void;
}

export function PricePartRow({
  part,
  onChangeLabel,
  onChangePriceDigits,
  onIncrementQuantity,
  onDecrementQuantity,
  onRemove,
}: PricePartRowProps) {
  const priceInCents = digitsToInteger(part.priceDigits);
  const atMinimum = part.quantity <= MIN_PART_QUANTITY;
  return (
    <View
      testID={`edit-part-row-${part.id}`}
      className="mt-2.5 flex-row items-center gap-2 rounded-[10px] border-hairline border-checkit-mist-border bg-white p-2.5"
    >
      <View className="flex-1">
        <TextInput
          value={part.label}
          onChangeText={onChangeLabel}
          placeholder="Nome (opcional)"
          placeholderTextColor="#8A8A8A"
          testID={`edit-part-label-${part.id}`}
          accessibilityLabel="Nome da parte"
          className="text-sm font-semibold text-checkit-charcoal-ink"
        />
        <View className="mt-1 flex-row items-baseline gap-1">
          <Text className="text-xs font-semibold text-checkit-pebble-gray">
            R$
          </Text>
          <TextInput
            value={priceInCents > 0 ? formatBRLAmount(priceInCents) : ''}
            onChangeText={onChangePriceDigits}
            keyboardType="number-pad"
            placeholder="0,00"
            placeholderTextColor="#8A8A8A"
            testID={`edit-part-price-${part.id}`}
            accessibilityLabel="Preço da parte"
            className="text-base font-bold tabular-nums text-checkit-charcoal-ink"
          />
        </View>
      </View>
      <View className="flex-row items-center gap-1.5">
        <Pressable
          onPress={onDecrementQuantity}
          disabled={atMinimum}
          accessibilityRole="button"
          accessibilityLabel="Diminuir quantidade da parte"
          accessibilityState={{ disabled: atMinimum }}
          testID={`edit-part-qty-decrement-${part.id}`}
          className="h-11 w-11 items-center justify-center rounded-[10px] border-hairline border-checkit-mist-border bg-white"
        >
          <Minus size={14} color="#1B1B1B" strokeWidth={2} />
        </Pressable>
        <Text className="w-6 text-center text-sm font-bold tabular-nums text-checkit-charcoal-ink">
          {part.quantity}
        </Text>
        <Pressable
          onPress={onIncrementQuantity}
          accessibilityRole="button"
          accessibilityLabel="Aumentar quantidade da parte"
          testID={`edit-part-qty-increment-${part.id}`}
          className="h-11 w-11 items-center justify-center rounded-[10px] border-hairline border-checkit-mist-border bg-white"
        >
          <Plus size={14} color="#1B1B1B" strokeWidth={2} />
        </Pressable>
      </View>
      <Pressable
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel="Remover parte"
        testID={`edit-part-remove-${part.id}`}
        className="h-11 w-11 items-center justify-center"
      >
        <X size={16} color="#8A8A8A" strokeWidth={2} />
      </Pressable>
    </View>
  );
}
