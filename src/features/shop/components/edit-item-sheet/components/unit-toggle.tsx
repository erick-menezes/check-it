import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import type { ItemUnit } from '@/features/shop/list-item';
import { cn } from '@/lib/utils';

interface UnitOption {
  readonly id: ItemUnit;
  readonly label: string;
  readonly accessibilityLabel: string;
}

const UNIT_OPTIONS: readonly UnitOption[] = [
  { id: 'unit', label: '/un', accessibilityLabel: 'Vender por unidade' },
  { id: 'kg', label: '/kg', accessibilityLabel: 'Vender por quilo' },
];

interface UnitToggleProps {
  unit: ItemUnit;
  disabled: boolean;
  onSelectUnit: (unit: ItemUnit) => void;
}

export function UnitToggle({ unit, disabled, onSelectUnit }: UnitToggleProps) {
  return (
    <View
      accessibilityRole="radiogroup"
      className="flex-row rounded-full bg-checkit-fog-gray p-0.5"
    >
      {UNIT_OPTIONS.map((option) => {
        const selected = unit === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelectUnit(option.id)}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            accessibilityLabel={option.accessibilityLabel}
            testID={`edit-unit-${option.id}`}
            className={cn(
              'h-11 min-w-[48px] items-center justify-center rounded-full px-3',
              selected ? 'bg-checkit-primary' : 'bg-transparent',
            )}
          >
            <Text
              className={cn(
                'text-xs font-bold',
                selected ? 'text-white' : 'text-checkit-pebble-gray',
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
