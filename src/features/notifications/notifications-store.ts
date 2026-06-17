import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { BudgetStatus } from '@/features/home/active-list';
import { createId } from '@/lib/id';
import type { AppNotification } from './notification';

export const MAX_STORED_NOTIFICATIONS = 50;

export type AddNotificationInput = Pick<
  AppNotification,
  'type' | 'title' | 'body'
>;

interface NotificationsStoreState {
  notifications: AppNotification[];
  budgetThresholdLatch: Record<string, BudgetStatus>;
  hasHydrated: boolean;
  addNotification: (input: AddNotificationInput) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setBudgetThresholdLatch: (listId: string, status: BudgetStatus) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useNotificationsStore = create<NotificationsStoreState>()(
  persist(
    (set) => ({
      notifications: [],
      budgetThresholdLatch: {},
      hasHydrated: false,
      addNotification: (input) =>
        set((state) => {
          const notification: AppNotification = {
            id: createId(),
            type: input.type,
            title: input.title,
            body: input.body,
            createdAt: new Date().toISOString(),
            read: false,
          };
          return {
            notifications: [notification, ...state.notifications].slice(
              0,
              MAX_STORED_NOTIFICATIONS,
            ),
          };
        }),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification,
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.read ? notification : { ...notification, read: true },
          ),
        })),
      setBudgetThresholdLatch: (listId, status) =>
        set((state) => ({
          budgetThresholdLatch: {
            ...state.budgetThresholdLatch,
            [listId]: status,
          },
        })),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'checkit:notifications',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        budgetThresholdLatch: state.budgetThresholdLatch,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Failed to rehydrate notifications store:', error);
        }
        state?.setHasHydrated(true);
      },
      version: 0,
    },
  ),
);
