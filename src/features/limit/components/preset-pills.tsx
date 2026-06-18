import type { JSX } from 'react';
import { Pressable, Text, View } from 'react-native';

const CENTS_PER_UNIT = 100;

interface Preset {
  readonly label: string;
  readonly amountInReais: number;
}

const PRESETS: readonly Preset[] = [
  { label: 'R$ 200', amountInReais: 200 },
  { label: 'R$ 500', amountInReais: 500 },
  { label: 'R$ 1000', amountInReais: 1000 },
];

interface PresetPillsProps {
  onSelect: (amountInCents: number) => void;
}

export function PresetPills({ onSelect }: PresetPillsProps): JSX.Element {
  return (
    <View className="mt-[22px] flex-row flex-wrap gap-2">
      {PRESETS.map((preset) => (
        <Pressable
          key={preset.label}
          onPress={() => onSelect(preset.amountInReais * CENTS_PER_UNIT)}
          accessibilityRole="button"
          accessibilityLabel={preset.label}
          testID={`limit-preset-${preset.amountInReais}`}
          className="rounded-full border border-white/25 bg-white/[0.14] px-3.5 py-2"
        >
          <Text className="text-xs font-semibold text-white">
            {preset.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
