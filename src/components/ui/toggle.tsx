import { type JSX, useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const TRACK_WIDTH = 38;
const TRACK_HEIGHT = 22;
const KNOB_SIZE = 18;
const KNOB_MARGIN = 2;
const KNOB_OFF_OFFSET = KNOB_MARGIN;
const KNOB_ON_OFFSET = TRACK_WIDTH - KNOB_SIZE - KNOB_MARGIN;
const ANIMATION_DURATION = 200;
const MIN_TOUCH_SIZE = 44;

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  testID?: string;
}

export function Toggle({
  value,
  onValueChange,
  accessibilityLabel,
  testID,
}: ToggleProps): JSX.Element {
  const progress = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [value, progress]);
  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#EBEBEB', '#58AB6A'],
    ),
  }));
  const knobStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [KNOB_OFF_OFFSET, KNOB_ON_OFFSET],
        ),
      },
    ],
  }));
  return (
    <Pressable
      testID={testID}
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      hitSlop={(MIN_TOUCH_SIZE - TRACK_HEIGHT) / 2}
      className="min-h-[44px] min-w-[44px] items-center justify-center"
    >
      <Animated.View
        className="h-[22px] w-[38px] justify-center rounded-full"
        style={trackStyle}
      >
        <Animated.View
          className="h-[18px] w-[18px] rounded-full bg-white"
          style={[
            {
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 1.5,
              elevation: 2,
            },
            knobStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
