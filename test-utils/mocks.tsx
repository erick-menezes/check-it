export const glassEffectMock = {
  GlassView: 'GlassView',
  isGlassEffectAPIAvailable: () => false,
};

export function createSafeAreaContextMock() {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    SafeAreaProvider: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
}

export function createExpoRouterMock() {
  const { Text } = require('react-native');
  return {
    router: {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      navigate: jest.fn(),
      setParams: jest.fn(),
      canGoBack: jest.fn(() => true),
    },
    Stack: Object.assign(() => null, { Screen: () => null }),
    Redirect: ({ href }: { href: string }) => (
      <Text testID={`redirect-${href}`}>{href}</Text>
    ),
  };
}
