import { useEffect } from 'react';
import { Keyboard, type KeyboardEvent, Platform } from 'react-native';
import {
  type SharedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export function useKeyboardHeight(): SharedValue<number> {
  const height = useSharedValue(0);
  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    function animateTo(target: number, event: KeyboardEvent): void {
      const FALLBACK_ANIMATION_DURATION = 250;
      height.value = withTiming(target, {
        duration: event.duration || FALLBACK_ANIMATION_DURATION,
      });
    }
    const showSub = Keyboard.addListener(showEvent, (event) =>
      animateTo(event.endCoordinates.height, event),
    );
    const hideSub = Keyboard.addListener(hideEvent, (event) =>
      animateTo(0, event),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [height]);
  return height;
}
