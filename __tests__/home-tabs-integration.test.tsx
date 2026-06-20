import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';
import type { ActiveList } from '@/features/home/active-list';

jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);

jest.mock('react-native-safe-area-context', () =>
  require('../test-utils/mocks').createSafeAreaContextMock(),
);

jest.mock('expo-router/ui', () => {
  const React = require('react');
  const ROUTES: Record<string, () => React.ComponentType> = {
    home: () => require('@/app/(tabs)/home').default,
    settings: () => require('@/app/(tabs)/settings').default,
  };
  const tabState = { focused: 'home' };
  const subscribers = new Set<() => void>();
  const notify = (): void => {
    for (const subscriber of subscribers) subscriber();
  };
  const useFocusedTab = (): string => {
    const [, forceRender] = React.useReducer((value: number) => value + 1, 0);
    React.useEffect(() => {
      subscribers.add(forceRender);
      return () => {
        subscribers.delete(forceRender);
      };
    }, []);
    return tabState.focused;
  };
  return {
    __resetTabs: () => {
      tabState.focused = 'home';
    },
    Tabs: ({ children }: { children: ReactNode }) => <>{children}</>,
    TabList: () => null,
    TabSlot: () => {
      const focused = useFocusedTab();
      const Screen = ROUTES[focused]();
      return <Screen />;
    },
    TabTrigger: ({
      name,
      asChild,
      children,
    }: {
      name: string;
      asChild?: boolean;
      children?: ReactElement<{ isFocused?: boolean; onPress?: () => void }>;
    }) => {
      const focused = useFocusedTab();
      if (!asChild || !React.isValidElement(children)) return null;
      return React.cloneElement(children, {
        isFocused: name === focused,
        onPress: () => {
          tabState.focused = name;
          notify();
        },
      });
    },
  };
});

import { router } from 'expo-router';
import TabsLayout from '@/app/(tabs)/_layout';
import { createActiveList } from '@/features/home/active-list';
import { useActiveListStore } from '@/features/home/active-list-store';

const tabsMock = jest.requireMock('expo-router/ui') as {
  __resetTabs: () => void;
};

const SAMPLE_LIST: ActiveList = {
  id: '1',
  name: 'Compras da semana',
  itemCount: 8,
  createdAt: '2026-06-07T10:00:00.000Z',
  totalInCents: 7350,
  limitInCents: 20000,
  items: [],
};

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
  tabsMock.__resetTabs();
  act(() => {
    useActiveListStore.setState({ activeList: null, hasHydrated: true });
  });
});

describe('Home tabs integration', () => {
  it('renders Home with the empty state when the store has no active list', () => {
    render(<TabsLayout />);
    expect(screen.getByTestId('home-screen')).toBeOnTheScreen();
    expect(screen.getByTestId('home-empty-state')).toBeOnTheScreen();
    expect(screen.queryByText('Lista atual')).toBeNull();
  });

  it('renders the Lista atual card when the store has an active list', () => {
    act(() => {
      useActiveListStore.setState({ activeList: SAMPLE_LIST });
    });
    render(<TabsLayout />);
    expect(screen.getByText('Lista atual')).toBeOnTheScreen();
    expect(screen.getByTestId('active-list-card')).toBeOnTheScreen();
    expect(screen.getByText('Compras da semana')).toBeOnTheScreen();
    expect(screen.queryByTestId('home-empty-state')).toBeNull();
  });

  it('routes the CTA to the limit screen in the empty state', () => {
    render(<TabsLayout />);
    expect(screen.getByTestId('home-empty-state')).toBeOnTheScreen();
    fireEvent.press(screen.getByTestId('create-list-cta'));
    expect(router.push).toHaveBeenCalledWith('/limit');
  });

  it('routes the card to the shop screen', () => {
    act(() => {
      useActiveListStore.setState({ activeList: SAMPLE_LIST });
    });
    render(<TabsLayout />);
    fireEvent.press(screen.getByTestId('active-list-card'));
    expect(router.push).toHaveBeenCalledWith('/shop');
  });

  it('routes the header help and notifications actions to their screens', () => {
    render(<TabsLayout />);
    fireEvent.press(screen.getByTestId('header-help'));
    fireEvent.press(screen.getByTestId('header-notifications'));
    expect(router.push).toHaveBeenCalledWith('/help');
    expect(router.push).toHaveBeenCalledWith('/notifications');
  });

  it('reflects store item mutations in the active-list card count and total', () => {
    act(() => {
      useActiveListStore.getState().setActiveList(createActiveList(20000));
      useActiveListStore.getState().addItems([
        { name: 'Arroz', quantity: 1, unitPriceInCents: 1000 },
        { name: 'Feijão', quantity: 1, unitPriceInCents: 2000 },
      ]);
      useActiveListStore.getState().setAllChecked(true);
    });
    render(<TabsLayout />);
    expect(screen.getByTestId('active-list-card')).toBeOnTheScreen();
    expect(screen.getByText(/2 itens/)).toBeOnTheScreen();
    expect(screen.getByText('R$ 30,00')).toBeOnTheScreen();
  });

  it('switches the TabSlot between Home and Settings on tab press', () => {
    render(<TabsLayout />);
    expect(screen.getByTestId('home-screen')).toBeOnTheScreen();
    expect(screen.queryByTestId('settings-screen')).toBeNull();
    fireEvent.press(screen.getByRole('tab', { name: 'Ajustes' }));
    expect(screen.getByTestId('settings-screen')).toBeOnTheScreen();
    expect(screen.queryByTestId('home-screen')).toBeNull();
    fireEvent.press(screen.getByRole('tab', { name: 'Início' }));
    expect(screen.getByTestId('home-screen')).toBeOnTheScreen();
    expect(screen.queryByTestId('settings-screen')).toBeNull();
  });
});
