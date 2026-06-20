import { ClipboardList } from 'lucide-react-native';
import { Text, View } from 'react-native';

export function HomeEmptyState() {
  return (
    <View testID="home-empty-state" className="items-center px-6 py-10">
      <View className="h-[80px] w-[80px] items-center justify-center rounded-full bg-checkit-primary/[0.12]">
        <ClipboardList size={36} color="#58AB6A" strokeWidth={1.75} />
      </View>
      <Text className="mt-4 text-base font-bold tracking-tight text-checkit-charcoal-ink">
        Nenhuma lista por aqui
      </Text>
      <Text className="mt-1 text-center text-sm font-medium text-checkit-pebble-gray">
        Crie sua primeira lista de compras e comece a controlar seus gastos.
      </Text>
    </View>
  );
}
