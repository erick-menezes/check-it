import Constants from 'expo-constants';
import type { LucideIcon } from 'lucide-react-native';
import type { JSX } from 'react';
import { Text, View } from 'react-native';
import { SettingIconTile } from './setting-icon-tile';

const VERSION_FALLBACK = '—';

interface VersionRowProps {
  Icon: LucideIcon;
  label: string;
}

export function VersionRow({ Icon, label }: VersionRowProps): JSX.Element {
  const version = Constants.expoConfig?.version ?? VERSION_FALLBACK;
  return (
    <View className="min-h-[44px] flex-row items-center gap-3 px-4 py-3">
      <SettingIconTile Icon={Icon} />
      <Text className="flex-1 text-[14px] font-bold text-checkit-charcoal-ink">
        {label}
      </Text>
      <Text className="text-[13px] font-semibold text-checkit-pebble-gray">
        {version}
      </Text>
    </View>
  );
}
