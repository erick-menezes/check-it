import { View } from 'react-native';
import { Text, TextInput } from '@/components/ui/text';
import type { PriceInput } from '@/features/shop/use-price-input';
import { formatBRL, formatBRLAmount } from '@/lib/currency';
import { QuantityStepper } from './quantity-stepper';

interface PriceQuantityCardProps {
  price: PriceInput;
  quantity: number;
  totalInCents: number;
  onDecrementQuantity: () => void;
  onIncrementQuantity: () => void;
}

export function PriceQuantityCard({
  price,
  quantity,
  totalInCents,
  onDecrementQuantity,
  onIncrementQuantity,
}: PriceQuantityCardProps) {
  return (
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
                {formatBRL(totalInCents)}
              </Text>
            </Text>
          )}
        </View>
        <QuantityStepper
          quantity={quantity}
          onDecrement={onDecrementQuantity}
          onIncrement={onIncrementQuantity}
        />
      </View>
    </View>
  );
}
