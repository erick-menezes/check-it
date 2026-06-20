import Animated, { LinearTransition } from 'react-native-reanimated';
import { cn } from '@/lib/utils';
import { ONBOARDING_STEPS, TOTAL_STEPS } from '../onboarding-steps';

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <Animated.View
      className="flex-row items-center gap-2"
      accessibilityRole="progressbar"
      accessibilityLabel={`Passo ${currentStep + 1} de ${TOTAL_STEPS}`}
      accessibilityValue={{ now: currentStep + 1, min: 1, max: TOTAL_STEPS }}
    >
      {ONBOARDING_STEPS.map((step, index) => {
        const isActive = index === currentStep;
        return (
          <Animated.View
            key={step.id}
            layout={LinearTransition.duration(200)}
            className={cn(
              'h-1.5 rounded-full',
              isActive ? 'w-[22px] bg-white' : 'w-1.5 bg-white/45',
            )}
          />
        );
      })}
    </Animated.View>
  );
}
