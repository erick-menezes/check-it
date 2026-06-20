import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

const CHECK_ICON_SIZE = 14;
const HIT_SLOP = 8;

interface MarkAllRowProps {
  checkedCount: number;
  totalCount: number;
  onToggle: (checked: boolean) => void;
}

export function MarkAllRow({
  checkedCount,
  totalCount,
  onToggle,
}: MarkAllRowProps) {
  const allChecked = totalCount > 0 && checkedCount === totalCount;
  return (
    <View className="flex-row items-center gap-3 px-[22px] pb-2 pt-5">
      <Pressable
        onPress={() => onToggle(!allChecked)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: allChecked }}
        accessibilityLabel="Marcar todos"
        hitSlop={HIT_SLOP}
        testID="shop-mark-all"
        className={`h-[22px] w-[22px] items-center justify-center rounded-md border-2 ${allChecked ? 'border-checkit-primary bg-checkit-primary' : 'border-checkit-mist-border'}`}
      >
        {allChecked && (
          <Check size={CHECK_ICON_SIZE} color="#ffffff" strokeWidth={3} />
        )}
      </Pressable>
      <Text className="text-xs font-semibold text-checkit-pebble-gray">
        Marcar todos ({checkedCount}/{totalCount})
      </Text>
    </View>
  );
}
