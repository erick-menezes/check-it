import { render, screen } from '@testing-library/react-native';
import { StepIndicator } from '@/features/onboarding/components/step-indicator';
import { TOTAL_STEPS } from '@/features/onboarding/onboarding-steps';

describe('StepIndicator', () => {
  it('announces Passo 1 de 3 when on step 0', () => {
    render(<StepIndicator currentStep={0} />);
    expect(screen.getByLabelText('Passo 1 de 3')).toBeOnTheScreen();
  });

  it('announces Passo 2 de 3 when on step 1', () => {
    render(<StepIndicator currentStep={1} />);
    expect(screen.getByLabelText('Passo 2 de 3')).toBeOnTheScreen();
  });

  it('announces Passo 3 de 3 when on step 2', () => {
    render(<StepIndicator currentStep={2} />);
    expect(
      screen.getByLabelText(`Passo ${TOTAL_STEPS} de ${TOTAL_STEPS}`),
    ).toBeOnTheScreen();
  });

  it('has a progressbar accessibility role', () => {
    render(<StepIndicator currentStep={0} />);
    const indicator = screen.getByLabelText('Passo 1 de 3');
    expect(indicator.props.accessibilityRole).toBe('progressbar');
  });
});
