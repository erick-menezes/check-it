import { Text, View } from 'react-native';
import type { OnboardingStepContent } from '../onboarding-steps';
import { HaloIcon } from './halo-icon';

interface OnboardingStepProps {
  step: OnboardingStepContent;
}

export function OnboardingStep({ step }: OnboardingStepProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="mb-[38px]">
        <HaloIcon Icon={step.Icon} />
      </View>
      <Text className="mb-3.5 text-center text-xs font-bold uppercase tracking-[1.92px] text-white/75">
        {step.kicker}
      </Text>
      <Text className="mb-4 text-center text-3xl font-extrabold leading-[33px] tracking-[-0.6px] text-white">
        {step.title}
      </Text>
      <Text className="max-w-[290px] text-center text-[15px] font-medium leading-[21.75px] text-white/90">
        {step.body}
      </Text>
    </View>
  );
}
