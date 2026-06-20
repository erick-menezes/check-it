import { View } from 'react-native';
import { Segment } from './components/segment';

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
