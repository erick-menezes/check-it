import {
  Children,
  Fragment,
  isValidElement,
  type JSX,
  type ReactNode,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SettingsSectionProps {
  label: string;
  children: ReactNode;
}

export function SettingsSection({
  label,
  children,
}: SettingsSectionProps) {
  const rows = Children.toArray(children);
  return (
    <View className="mt-[26px]">
      <Text className="px-4 text-[13px] font-semibold uppercase tracking-[1.04px] text-checkit-pebble-gray">
        {label}
      </Text>
      <View className="mt-2">
        {rows.map((row, index) => (
          <Fragment key={isValidElement(row) ? row.key : index}>
            {row}
            <View
              className="bg-checkit-mist-border"
              style={{ height: StyleSheet.hairlineWidth }}
            />
          </Fragment>
        ))}
      </View>
    </View>
  );
}
