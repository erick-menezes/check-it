import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  CATEGORIES,
  CATEGORY_META,
  type Category,
  getCategoryBackgroundClass,
} from '@/features/shop/list-item';
import { cn } from '@/lib/utils';

interface CategoryPickerProps {
  category: Category | null;
  onSelectCategory: (category: Category) => void;
}

export function CategoryPicker({
  category,
  onSelectCategory,
}: CategoryPickerProps) {
  return (
    <View>
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
              onPress={() => onSelectCategory(option)}
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
    </View>
  );
}
