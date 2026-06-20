import { render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);

type StoreShape = {
  hasSeenOnboarding: boolean;
  hasHydrated: boolean;
};

const mockStoreState: StoreShape = {
  hasSeenOnboarding: false,
  hasHydrated: false,
};

jest.mock('@/features/onboarding/onboarding-store', () => ({
  useOnboardingStore: (selector: (s: StoreShape) => unknown) =>
    selector(mockStoreState),
}));

import Index from '@/app/index';

describe('Index decider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoreState.hasSeenOnboarding = false;
    mockStoreState.hasHydrated = false;
  });

  it('redirects to /onboarding when not hydrated', () => {
    mockStoreState.hasHydrated = false;
    render(<Index />);
    expect(screen.getByTestId('redirect-/onboarding')).toBeOnTheScreen();
  });

  it('redirects to /onboarding when hydrated and onboarding not seen', () => {
    mockStoreState.hasHydrated = true;
    mockStoreState.hasSeenOnboarding = false;
    render(<Index />);
    expect(screen.getByTestId('redirect-/onboarding')).toBeOnTheScreen();
  });

  it('redirects to /home when hydrated and onboarding seen', () => {
    mockStoreState.hasHydrated = true;
    mockStoreState.hasSeenOnboarding = true;
    render(<Index />);
    expect(screen.getByTestId('redirect-/home')).toBeOnTheScreen();
  });
});
