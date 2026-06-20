import { PlusCircle } from 'lucide-react-native';
import { Text, View } from 'react-native';

export function EmptyState() {
  return (
    <View
      testID="shop-empty-state"
      className="items-center px-5 pb-[30px] pt-[50px]"
    >
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-checkit-linen-cream">
        <PlusCircle size={42} color="#58AB6A" strokeWidth={2} />
      </View>
      <Text className="mb-1.5 text-lg font-bold tracking-tight text-checkit-charcoal-ink">
        Sua lista está vazia
      </Text>
      <Text className="max-w-[220px] text-center text-sm leading-5 text-checkit-pebble-gray">
        Adicione um produto acima para começar.
      </Text>
    </View>
  );
}
