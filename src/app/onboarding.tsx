import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingFooter } from '@/features/onboarding/components/onboarding-footer';
import { OnboardingStep } from '@/features/onboarding/components/onboarding-step';
import { ONBOARDING_STEPS } from '@/features/onboarding/onboarding-steps';
import { useOnboardingFlow } from '@/features/onboarding/use-onboarding-flow';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OnboardingScreen() {
  const handleExit = useCallback(() => {
    router.replace('/home');
  }, []);

  const flow = useOnboardingFlow(handleExit);
  const scrollRef = useRef<ScrollView>(null);
  const userScrolling = useRef(false);
  const [pageHeight, setPageHeight] = useState(0);

  useEffect(() => {
    if (!userScrolling.current) {
      scrollRef.current?.scrollTo({
        x: flow.currentStep * SCREEN_WIDTH,
        animated: true,
      });
    }
  }, [flow.currentStep]);

  function handleScrollBeginDrag() {
    userScrolling.current = true;
  }

  function handleMomentumScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    userScrolling.current = false;
    flow.jumpToStep(newIndex);
  }

  return (
    <SafeAreaView className="flex-1 bg-checkit-primary">
      <View className="flex-1">
        {!flow.isLastStep && (
          <Pressable
            onPress={flow.finish}
            accessible
            accessibilityLabel="Pular"
            accessibilityRole="button"
            className="absolute right-[22px] top-14 z-10"
          >
            <Text className="text-[13px] font-semibold text-white opacity-80">
              Pular
            </Text>
          </Pressable>
        )}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScrollBeginDrag={handleScrollBeginDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          className="flex-1"
          onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}
        >
          {ONBOARDING_STEPS.map((step) => (
            <View
              key={step.id}
              className="px-7 pb-[30px] pt-[90px]"
              style={{ width: SCREEN_WIDTH, height: pageHeight || undefined }}
            >
              <OnboardingStep step={step} />
            </View>
          ))}
        </ScrollView>
        <OnboardingFooter flow={flow} />
      </View>
    </SafeAreaView>
  );
}
