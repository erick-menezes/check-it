import { Minus, Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { MIN_QUANTITY } from '@/features/shop/list-item';

interface QuantityStepperProps {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

export function QuantityStepper({
  quantity,
  onDecrement,
  onIncrement,
}: QuantityStepperProps) {
  const atMinimum = quantity <= MIN_QUANTITY;
  return (
    <View className="flex-row items-center gap-2">
      <Pressable
        onPress={onDecrement}
        disabled={atMinimum}
        accessibilityRole="button"
        accessibilityLabel="Diminuir quantidade"
        accessibilityState={{ disabled: atMinimum }}
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
        onPress={onIncrement}
        accessibilityRole="button"
        accessibilityLabel="Aumentar quantidade"
        testID="edit-qty-increment"
        className="h-9 w-9 items-center justify-center rounded-[10px] border-hairline border-checkit-mist-border bg-white"
      >
        <Plus size={16} color="#1B1B1B" strokeWidth={2} />
      </Pressable>
    </View>
  );
}
