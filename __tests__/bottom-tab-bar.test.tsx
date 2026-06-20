import { render, screen } from '@testing-library/react-native';
import type { ReactElement } from 'react';

jest.mock('expo-router/ui', () => {
  const { cloneElement } = require('react');
  const FOCUSED_TAB = 'home';
  return {
    TabTrigger: ({
      name,
      children,
    }: {
      name: string;
      children: ReactElement<{ isFocused?: boolean }>;
    }) => cloneElement(children, { isFocused: name === FOCUSED_TAB }),
  };
});
jest.mock('react-native-safe-area-context', () =>
  require('../test-utils/mocks').createSafeAreaContextMock(),
);

import { BottomTabBar } from '@/components/ui/bottom-tab-bar';

describe('BottomTabBar', () => {
  it('renders exactly the visible tabs', () => {
    render(<BottomTabBar />);
    expect(screen.getByText('Início')).toBeOnTheScreen();
    expect(screen.getByText('Ajustes')).toBeOnTheScreen();
  });

  it('never renders the account-gated tabs', () => {
    render(<BottomTabBar />);
    expect(screen.queryByText('Listas')).toBeNull();
    expect(screen.queryByText('Resumo')).toBeNull();
  });

  it('emphasizes the active tab with the brand color and mutes the inactive one', () => {
    render(<BottomTabBar />);
    expect(screen.getByText('Início').props.className).toContain(
      'text-checkit-primary',
    );
    expect(screen.getByText('Ajustes').props.className).toContain(
      'text-checkit-pebble-gray',
    );
  });

  it('marks the active tab as selected for accessibility', () => {
    render(<BottomTabBar />);
    expect(
      screen.getByRole('tab', { name: 'Início', selected: true }),
    ).toBeOnTheScreen();
  });
});
