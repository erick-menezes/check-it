import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

interface SettingIconTileProps {
  Icon: LucideIcon;
}

export function SettingIconTile({ Icon }: SettingIconTileProps) {
  return (
    <View className="h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#F0F0F0]">
      <Icon size={19} color="#5C5C5C" strokeWidth={2} />
    </View>
  );
}
