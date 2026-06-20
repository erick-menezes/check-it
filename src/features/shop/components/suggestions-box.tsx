import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getSuggestions } from '@/features/shop/suggestions';

const APPEAR_DURATION = 180;

interface SuggestionsBoxProps {
  onSelect: (name: string) => void;
}

export function SuggestionsBox({ onSelect }: SuggestionsBoxProps) {
  const suggestions = useMemo(() => getSuggestions(), []);
  return (
    <Animated.View
      entering={FadeInDown.duration(APPEAR_DURATION)}
      testID="shop-suggestions"
      className="mt-2 rounded-xl bg-checkit-linen-cream p-3"
    >
      <Text className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-checkit-pebble-gray">
        Sugestões
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Pressable
            key={suggestion}
            onPress={() => onSelect(suggestion)}
            accessibilityRole="button"
            accessibilityLabel={`Adicionar ${suggestion}`}
            className="rounded-full border-hairline border-checkit-mist-border bg-white px-2.5 py-1.5"
          >
            <Text className="text-[11px] font-semibold text-checkit-charcoal-ink">
              {suggestion}
            </Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}
