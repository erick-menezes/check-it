import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';
import { SettingIconTile } from './setting-icon-tile';

interface NavigationRowProps {
  Icon: LucideIcon;
  label: string;
  onPress: () => void;
  testID: string;
}

export function NavigationRow({
  Icon,
  label,
  onPress,
  testID,
}: NavigationRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
      className="min-h-[44px] flex-row items-center gap-3 px-4 py-3"
    >
      <SettingIconTile Icon={Icon} />
      <Text className="flex-1 text-[14px] font-bold text-checkit-charcoal-ink">
        {label}
      </Text>
      <ChevronRight size={20} color="#8A8A8A" strokeWidth={2} />
    </Pressable>
  );
}
