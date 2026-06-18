import { ArrowRight, type LucideIcon } from 'lucide-react-native';
import { type JSX, useRef } from 'react';
import {
  Animated,
  Pressable,
  type PressableProps,
  Text,
  View,
} from 'react-native';
import { cn } from '@/lib/utils';

type ButtonVariant = 'accent' | 'onPrimary' | 'ghost' | 'soft';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  iconRight?: boolean;
  iconLeft?: LucideIcon;
}

const PRESS_SCALE = 0.97;
const PRESS_DURATION = 120;

const VARIANT_CONTAINER: Record<ButtonVariant, string> = {
  accent: 'bg-checkit-accent',
  onPrimary: 'border border-white/30 bg-white/[0.16]',
  ghost: 'bg-transparent',
  soft: 'bg-checkit-linen-cream',
};

const VARIANT_TEXT: Record<ButtonVariant, string> = {
  accent: 'text-checkit-charcoal-ink',
  onPrimary: 'text-white',
  ghost: 'text-white/80',
  soft: 'text-checkit-charcoal-ink',
};

const ICON_COLOR: Record<ButtonVariant, string> = {
  accent: '#1B1B1B',
  onPrimary: '#ffffff',
  ghost: 'rgba(255,255,255,0.8)',
  soft: '#1B1B1B',
};

const SIZE_CONTAINER: Record<ButtonSize, string> = {
  sm: 'h-[34px] px-4',
  md: 'h-[44px] px-[18px]',
  lg: 'h-[52px] px-[22px]',
};

const SIZE_TEXT: Record<ButtonSize, string> = {
  sm: 'text-xs',
  md: 'text-[13px]',
  lg: 'text-[15px]',
};

const ICON_SIZE: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export function Button({
  variant = 'accent',
  size = 'md',
  label,
  iconRight,
  iconLeft: IconLeft,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}: ButtonProps): JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    if (disabled) return;
    Animated.timing(scale, {
      toValue: PRESS_SCALE,
      duration: PRESS_DURATION,
      useNativeDriver: true,
    }).start();
  }

  function handlePressOut() {
    Animated.timing(scale, {
      toValue: 1,
      duration: PRESS_DURATION,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={(e) => {
          handlePressIn();
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          handlePressOut();
          onPressOut?.(e);
        }}
        disabled={disabled}
        accessible
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled ?? undefined }}
        className={cn(
          'flex-row items-center justify-center gap-2 rounded-xl',
          VARIANT_CONTAINER[variant],
          SIZE_CONTAINER[size],
          disabled && 'opacity-40',
        )}
        {...rest}
      >
        {IconLeft && (
          <View>
            <IconLeft
              size={ICON_SIZE[size]}
              color={ICON_COLOR[variant]}
              strokeWidth={2}
            />
          </View>
        )}
        <Text
          className={cn(
            'font-bold tracking-tight',
            VARIANT_TEXT[variant],
            SIZE_TEXT[size],
          )}
        >
          {label}
        </Text>
        {iconRight && (
          <View>
            <ArrowRight
              size={ICON_SIZE[size]}
              color={ICON_COLOR[variant]}
              strokeWidth={2}
            />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}
