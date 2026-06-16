import type { JSX } from 'react';
import { Text, View } from 'react-native';
import type { FaqItem } from '../help-content';

interface FaqTileProps {
  item: FaqItem;
}

export function FaqTile({ item }: FaqTileProps): JSX.Element {
  return (
    <View className="rounded-[10px] bg-white/[0.16] p-3">
      <Text className="text-[12px] font-bold text-white">{item.question}</Text>
      <Text className="mt-1 text-[12px] leading-[18px] text-white/90">
        {item.answer}
      </Text>
    </View>
  );
}
