import { View } from 'react-native';
import { cn } from '@/lib/utils';
import {
  type ActiveList,
  type BudgetStatus,
  getBudgetRatio,
  getBudgetStatus,
} from '../active-list';

const STATUS_FILL_CLASS: Record<BudgetStatus, string> = {
  onTrack: 'bg-checkit-primary',
  warning: 'bg-checkit-accent',
  overBudget: 'bg-checkit-danger',
};

const STATUS_LABEL: Record<BudgetStatus, string> = {
  onTrack: 'Dentro do limite',
  warning: 'Perto do limite',
  overBudget: 'Acima do limite',
};

interface BudgetProgressBarProps {
  list: ActiveList;
}

export function BudgetProgressBar({ list }: BudgetProgressBarProps) {
  const status = getBudgetStatus(list);
  const ratio = getBudgetRatio(list);
  const fillPercent = Math.round(ratio * 100);
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={STATUS_LABEL[status]}
      accessibilityValue={{ now: fillPercent, min: 0, max: 100 }}
      testID={`budget-progress-${status}`}
      className="h-2 w-full overflow-hidden rounded bg-checkit-fog-gray"
    >
      <View
        testID={`budget-fill-${status}`}
        style={{ width: `${fillPercent}%` }}
        className={cn('h-2 rounded', STATUS_FILL_CLASS[status])}
      />
    </View>
  );
}
