import {
  ArrowDown,
  ArrowDownAZ,
  ArrowUp,
  Check,
  Clock,
  History,
  type LucideIcon,
  Tag,
} from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import {
  SORT_OPTIONS,
  type SortOption,
} from '@/features/shop/use-visible-items';
import { cn } from '@/lib/utils';

const OPTION_ICON_SIZE = 18;
const CHECK_ICON_SIZE = 18;

const SORT_ICONS: Readonly<Record<SortOption, LucideIcon>> = {
  recent: Clock,
  oldest: History,
  'price-desc': ArrowDown,
  'price-asc': ArrowUp,
  name: ArrowDownAZ,
  category: Tag,
};

interface SortSheetProps {
  visible: boolean;
  current: SortOption;
  onSelect: (sort: SortOption) => void;
  onClose: () => void;
}

export function SortSheet({
  visible,
  current,
  onSelect,
  onClose,
}: SortSheetProps) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      testID="sort-sheet"
      accessibilityLabel="Ordenar lista"
    >
      <Text className="mb-3.5 text-lg font-bold tracking-tight text-checkit-charcoal-ink">
        Ordenar lista
      </Text>
      <View className="gap-2">
        {SORT_OPTIONS.map((option) => {
          const selected = option.id === current;
          const OptionIcon = SORT_ICONS[option.id];
          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              testID={`sort-option-${option.id}`}
              className={cn(
                'flex-row items-center gap-3 rounded-xl border px-3.5 py-3',
                selected
                  ? 'border-checkit-primary bg-checkit-linen-cream'
                  : 'border-transparent',
              )}
            >
              <OptionIcon
                size={OPTION_ICON_SIZE}
                color={selected ? '#58AB6A' : '#8A8A8A'}
                strokeWidth={2}
              />
              <Text className="flex-1 text-[13px] font-semibold text-checkit-charcoal-ink">
                {option.label}
              </Text>
              {selected && (
                <Check
                  size={CHECK_ICON_SIZE}
                  color="#58AB6A"
                  strokeWidth={2.5}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}
