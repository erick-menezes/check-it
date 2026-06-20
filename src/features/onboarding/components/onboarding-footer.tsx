import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import type { OnboardingFlow } from '../use-onboarding-flow';
import { StepIndicator } from './step-indicator';
import { Wordmark } from './wordmark';

interface OnboardingFooterProps {
  flow: Pick<
    OnboardingFlow,
    'currentStep' | 'isLastStep' | 'goNext' | 'finish'
  >;
}

export function OnboardingFooter({ flow }: OnboardingFooterProps) {
  const { currentStep, isLastStep, goNext, finish } = flow;
  return (
    <View className="gap-[22px] px-7 pb-[38px]">
      <View className="items-center">
        <StepIndicator currentStep={currentStep} />
      </View>
      <View className="flex-row items-center justify-between">
        <View className="w-20">
          <Wordmark size={16} color="rgba(255,255,255,0.7)" />
        </View>
        {isLastStep ? (
          <Button
            variant="accent"
            size="md"
            label="Vamos lá!"
            iconRight
            onPress={finish}
          />
        ) : (
          <Button
            variant="onPrimary"
            size="md"
            label="Próximo"
            iconRight
            onPress={goNext}
          />
        )}
      </View>
    </View>
  );
}
