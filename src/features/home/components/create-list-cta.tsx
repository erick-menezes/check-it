import { router } from 'expo-router';
import { ArrowRight, Plus } from 'lucide-react-native';
import type { JSX } from 'react';
import { Pressable, Text, View } from 'react-native';

export function CreateListCta(): JSX.Element {
  return (
    <Pressable
      onPress={() => router.push('/limit')}
      accessibilityRole="button"
      accessibilityLabel="Criar lista de compras"
      testID="create-list-cta"
      style={({ pressed }) => [
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 14,
          elevation: 2,
        },
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
      className="flex-row items-center gap-3 rounded-2xl border-hairline border-checkit-mist-border bg-white p-4"
    >
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-checkit-accent">
        <Plus size={22} color="#1B1B1B" strokeWidth={2.5} />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-bold tracking-tight text-checkit-charcoal-ink">
          Criar lista de compras
        </Text>
        <Text className="mt-0.5 text-xs font-medium text-checkit-pebble-gray">
          Defina um limite e comece
        </Text>
      </View>
      <View className="h-9 w-9 items-center justify-center rounded-[10px] bg-checkit-primary">
        <ArrowRight size={18} color="#ffffff" strokeWidth={2.5} />
      </View>
    </Pressable>
  );
}
