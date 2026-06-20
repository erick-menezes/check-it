import type { LucideIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

interface HeaderActionProps {
  Icon: LucideIcon;
  label: string;
  testID: string;
  onPress: () => void;
}

export function HeaderAction({
  Icon,
  label,
  testID,
  onPress,
}: HeaderActionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
      className="h-10 w-10 items-center justify-center rounded-full bg-white/[0.16]"
    >
      <Icon size={22} color="#ffffff" strokeWidth={2} />
    </Pressable>
  );
}
