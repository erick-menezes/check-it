import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const ANIMATION_DURATION = 200;
const SEGMENT_HEIGHT = 34;
const MIN_TOUCH_SIZE = 44;
const SEGMENT_HIT_SLOP = (MIN_TOUCH_SIZE - SEGMENT_HEIGHT) / 2;
const TRANSITION_EASING = Easing.bezier(0.4, 0, 0.2, 1);

export interface SegmentOption<T extends string> {
  readonly id: T;
  readonly label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[];
  selectedId: T;
  onChange: (id: T) => void;
  testID?: string;
}

interface SegmentProps<T extends string> {
  option: SegmentOption<T>;
  selected: boolean;
  onPress: () => void;
  testID?: string;
}

function Segment<T extends string>({
  option,
  selected,
  onPress,
  testID,
}: SegmentProps<T>) {
  const progress = useSharedValue(selected ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: TRANSITION_EASING,
    });
  }, [selected, progress]);
  const surfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', '#FFFFFF'],
    ),
  }));
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['#8A8A8A', '#1B1B1B']),
  }));
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={option.label}
      testID={testID}
      hitSlop={SEGMENT_HIT_SLOP}
      android_ripple={null}
      className="flex-1"
    >
      <Animated.View
        className="h-[34px] items-center justify-center rounded-[9px]"
        style={surfaceStyle}
      >
        <Animated.Text className="text-xs font-bold" style={labelStyle}>
          {option.label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

export function SegmentedControl<T extends string>({
  options,
  selectedId,
  onChange,
  testID,
}: SegmentedControlProps<T>) {
  return (
    <View
      testID={testID}
      className="flex-row rounded-xl bg-checkit-linen-cream p-1"
    >
      {options.map((option) => (
        <Segment
          key={option.id}
          option={option}
          selected={option.id === selectedId}
          onPress={() => onChange(option.id)}
          testID={testID ? `${testID}-segment-${option.id}` : undefined}
        />
      ))}
    </View>
  );
}
