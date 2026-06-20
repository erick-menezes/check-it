import { ArrowDownUp, ChevronDown } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import {
  getSortLabel,
  type SortOption,
} from '@/features/shop/use-visible-items';

interface ActionRowProps {
  sort: SortOption;
  onOpenSort: () => void;
}

export function ActionRow({ sort, onOpenSort }: ActionRowProps) {
  const label = getSortLabel(sort);
  return (
    <View className="mt-3.5 flex-row gap-2">
      <Pressable
        onPress={onOpenSort}
        accessibilityRole="button"
        accessibilityLabel={`Ordenar lista, ${label}`}
        testID="shop-sort-button"
        className="h-[38px] flex-1 flex-row items-center gap-2 rounded-[10px] bg-checkit-fog-gray px-3"
      >
        <ArrowDownUp size={16} color="#1B1B1B" strokeWidth={2} />
        <Text
          numberOfLines={1}
          className="flex-1 text-xs font-semibold text-checkit-charcoal-ink"
        >
          {label}
        </Text>
        <ChevronDown size={14} color="#8A8A8A" strokeWidth={2} />
      </Pressable>
    </View>
  );
}
