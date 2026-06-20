import { Button } from '@/components/ui/button';
import { createActiveList } from '@/features/home/active-list';
import { useActiveListStore } from '@/features/home/active-list-store';
import { CurrencyHero } from '@/features/limit/components/currency-hero';
import { PresetPills } from '@/features/limit/components/preset-pills';
import { useLimitInput } from '@/features/limit/use-limit-input';
import { useKeyboardHeight } from '@/lib/use-keyboard-height';
import { router, Stack } from 'expo-router';
import { X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const SCREEN_ANIMATION_DURATION = 320;

export default function LimitScreen() {
  const input = useLimitInput();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const liftStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -Math.max(keyboardHeight.value - insets.bottom, 0) },
    ],
  }));
  const setActiveList = useActiveListStore((state) => state.setActiveList);

  function handleClose(): void {
    router.back();
  }

  function handleConfirm(): void {
    setActiveList(createActiveList(input.cents));
    router.replace('/shop');
  }

  return (
    <View testID="limit-screen" className="flex-1 bg-checkit-primary">
      <Stack.Screen
        options={{
          animation: 'slide_from_right',
          animationDuration: SCREEN_ANIMATION_DURATION,
        }}
      />
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-[22px] pt-1">
          <Pressable
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
            testID="limit-close"
            className="-ml-1 h-11 w-11 items-center justify-center rounded-full"
          >
            <X size={24} color="#ffffff" strokeWidth={2} />
          </Pressable>
          <Text className="mt-[18px] text-xs font-bold uppercase tracking-[0.16em] text-white/80">
            Passo 1 de 2
          </Text>
          <Text className="mt-2.5 text-[26px] font-extrabold leading-[30px] tracking-tight text-white">
            Qual será o seu valor limite?
          </Text>
          <View className="mt-6">
            <CurrencyHero
              cents={input.cents}
              digits={input.digits}
              onChangeDigits={input.setDigits}
            />
          </View>
          <PresetPills onSelect={input.setPreset} />
          <Text className="mt-7 max-w-[290px] text-sm leading-5 text-white/85">
            Te alertamos se a compra ultrapassar esse valor.
          </Text>
          <View className="flex-1" />
          <Animated.View className="pb-[30px] pt-3.5" style={liftStyle}>
            <Button
              variant="accent"
              size="lg"
              label="Criar lista"
              iconRight
              disabled={!input.isValid}
              onPress={handleConfirm}
              testID="limit-confirm"
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}
