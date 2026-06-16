import { useCallback, useState } from 'react';
import { TOTAL_STEPS } from './onboarding-steps';
import { useOnboardingStore } from './onboarding-store';

const FIRST_STEP = 0;
const LAST_STEP = TOTAL_STEPS - 1;

export interface OnboardingFlow {
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goNext: () => void;
  goBack: () => void;
  jumpToStep: (index: number) => void;
  finish: () => void;
}

export function useOnboardingFlow(onExit: () => void): OnboardingFlow {
  const [currentStep, setCurrentStep] = useState(FIRST_STEP);
  const markOnboardingSeen = useOnboardingStore((s) => s.markOnboardingSeen);

  const isFirstStep = currentStep === FIRST_STEP;
  const isLastStep = currentStep === LAST_STEP;

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, LAST_STEP));
  }, []);

  const goBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, FIRST_STEP));
  }, []);

  const jumpToStep = useCallback((index: number) => {
    setCurrentStep(Math.max(FIRST_STEP, Math.min(LAST_STEP, index)));
  }, []);

  const finish = useCallback(() => {
    markOnboardingSeen();
    onExit();
  }, [markOnboardingSeen, onExit]);

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    goNext,
    goBack,
    jumpToStep,
    finish,
  };
}
