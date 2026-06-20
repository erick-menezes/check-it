import { useEffect } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { BudgetStatus } from '@/features/home/active-list';

const BAR_ANIMATION_DURATION = 300;

const STATUS_FILL_COLOR: Record<BudgetStatus, string> = {
  onTrack: '#ffffff',
  warning: '#F2B807',
  overBudget: '#E13E3E',
};

const STATUS_INDEX: Record<BudgetStatus, number> = {
  onTrack: 0,
  warning: 1,
  overBudget: 2,
};

const STATUS_COLOR_RANGE = [
  STATUS_FILL_COLOR.onTrack,
  STATUS_FILL_COLOR.warning,
  STATUS_FILL_COLOR.overBudget,
];

export function BudgetBarFill({
  fillPercent,
  status,
}: {
  fillPercent: number;
  status: BudgetStatus;
}) {
  const width = useSharedValue(fillPercent);
  const colorDriver = useSharedValue(STATUS_INDEX[status]);
  useEffect(() => {
    width.value = withTiming(fillPercent, {
      duration: BAR_ANIMATION_DURATION,
    });
  }, [fillPercent, width]);
  useEffect(() => {
    colorDriver.value = withTiming(STATUS_INDEX[status], {
      duration: BAR_ANIMATION_DURATION,
    });
  }, [status, colorDriver]);
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    backgroundColor: interpolateColor(
      colorDriver.value,
      [0, 1, 2],
      STATUS_COLOR_RANGE,
    ),
  }));
  return (
    <Animated.View
      testID={`shop-progress-fill-${status}`}
      style={animatedStyle}
      className="h-[5px] rounded"
    />
  );
}
