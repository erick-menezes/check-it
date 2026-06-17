import {
  type ActiveList,
  type BudgetStatus,
  getBudgetStatus,
} from '@/features/home/active-list';
import { useActiveListStore } from '@/features/home/active-list-store';
import { useSettingsStore } from '@/features/settings/settings-store';
import { formatBRL } from '@/lib/currency';
import type { AddNotificationInput } from './notifications-store';
import { useNotificationsStore } from './notifications-store';

const PERCENT_BASE = 100;

const BUDGET_STATUS_RANK: Readonly<Record<BudgetStatus, number>> = {
  onTrack: 0,
  warning: 1,
  overBudget: 2,
};

function buildWarningNotification(list: ActiveList): AddNotificationInput {
  const percent = Math.round(
    (list.totalInCents / list.limitInCents) * PERCENT_BASE,
  );
  return {
    type: 'budgetAlert',
    title: `${list.name} chegou a ${percent}% do limite`,
    body: `Você gastou ${formatBRL(list.totalInCents)} dos ${formatBRL(list.limitInCents)} definidos. Cuidado nos próximos itens!`,
  };
}

function buildExceededNotification(list: ActiveList): AddNotificationInput {
  return {
    type: 'budgetAlert',
    title: `${list.name} passou do limite`,
    body: `Você gastou ${formatBRL(list.totalInCents)} e o limite era ${formatBRL(list.limitInCents)}.`,
  };
}

function buildNotificationForBand(
  list: ActiveList,
  band: BudgetStatus,
): AddNotificationInput | null {
  if (band === 'warning') return buildWarningNotification(list);
  if (band === 'overBudget') return buildExceededNotification(list);
  return null;
}

function evaluateActiveList(list: ActiveList | null): void {
  if (!list) return;
  if (list.limitInCents <= 0) return;
  const store = useNotificationsStore.getState();
  const previousStatus = store.budgetThresholdLatch[list.id] ?? 'onTrack';
  const currentStatus = getBudgetStatus(list);
  store.setBudgetThresholdLatch(list.id, currentStatus);
  const isUpwardTransition =
    BUDGET_STATUS_RANK[currentStatus] > BUDGET_STATUS_RANK[previousStatus];
  if (!isUpwardTransition) return;
  if (!useSettingsStore.getState().budgetAlertsEnabled) return;
  const input = buildNotificationForBand(list, currentStatus);
  if (!input) return;
  store.addNotification(input);
}

export function startBudgetAlertTracking(): () => void {
  return useActiveListStore.subscribe((state) => {
    evaluateActiveList(state.activeList);
  });
}
