import { Camera, PlusCircle } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

interface EmptyStateProps {
  onScanReceipt: () => void;
}

export function EmptyState({ onScanReceipt }: EmptyStateProps) {
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
        Adicione um produto acima ou tire foto do seu cupom fiscal.
      </Text>
      <Pressable
        onPress={onScanReceipt}
        accessibilityRole="button"
        accessibilityLabel="Escanear cupom"
        testID="shop-scan-receipt"
        className="mt-5 h-[34px] flex-row items-center justify-center gap-2 rounded-xl border-hairline border-checkit-mist-border px-4"
      >
        <Camera size={16} color="#1B1B1B" strokeWidth={2} />
        <Text className="text-xs font-bold text-checkit-charcoal-ink">
          Escanear cupom
        </Text>
      </Pressable>
    </View>
  );
}
