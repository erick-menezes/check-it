import { Text, View } from 'react-native';

interface PreviewRowProps {
  label: string;
  value: string;
}

export function PreviewRow({ label, value }: PreviewRowProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-xs text-checkit-pebble-gray">{label}</Text>
      <Text className="text-xs font-semibold tabular-nums text-checkit-charcoal-ink">
        {value}
      </Text>
    </View>
  );
}
