import { type JSX, type ReactNode, useEffect } from 'react';
import { Modal, Pressable, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const RISE_DURATION = 280;
const SHEET_OFFSCREEN = 600;
const SHEET_RESTING = 0;
const RISE_EASING = Easing.bezier(0.2, 0.7, 0.2, 1);
const DRAG_CLOSE_THRESHOLD = 120;
const DRAG_CLOSE_VELOCITY = 800;
const SETTLE_DURATION = 200;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
}

export function BottomSheet({
  visible,
  onClose,
  children,
  testID,
  accessibilityLabel,
}: BottomSheetProps): JSX.Element {
  const translateY = useSharedValue(SHEET_OFFSCREEN);
  useEffect(() => {
    translateY.value = visible
      ? withTiming(SHEET_RESTING, {
          duration: RISE_DURATION,
          easing: RISE_EASING,
        })
      : SHEET_OFFSCREEN;
  }, [visible, translateY]);
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const dragGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(SHEET_RESTING, event.translationY);
    })
    .onEnd((event) => {
      const shouldClose =
        event.translationY > DRAG_CLOSE_THRESHOLD ||
        event.velocityY > DRAG_CLOSE_VELOCITY;
      if (shouldClose) {
        translateY.value = withTiming(SHEET_OFFSCREEN, {
          duration: SETTLE_DURATION,
        });
        runOnJS(onClose)();
        return;
      }
      translateY.value = withTiming(SHEET_RESTING, {
        duration: SETTLE_DURATION,
      });
    });
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID={testID}
    >
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 justify-end">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar"
            testID={testID ? `${testID}-backdrop` : undefined}
            onPress={onClose}
            className="absolute inset-0 bg-black/45"
          />
          <GestureDetector gesture={dragGesture}>
            <Animated.View
              accessibilityLabel={accessibilityLabel}
              style={sheetStyle}
              className="rounded-t-3xl bg-white px-[22px] pb-[30px] pt-3.5"
            >
              <View className="mb-3.5 h-1 w-[38px] self-center rounded-full bg-checkit-mist-border" />
              {children}
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
