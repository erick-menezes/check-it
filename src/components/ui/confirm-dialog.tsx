import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import type { JSX } from "react";
import { Modal, Pressable, Text, View } from "react-native";

type DialogTone = "primary" | "danger";

interface ConfirmDialogProps {
  visible: boolean;
  icon: LucideIcon;
  tone?: DialogTone;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  testID?: string;
}

const TONE_COLOR: Record<DialogTone, string> = {
  primary: "#58AB6A",
  danger: "#E13E3E",
};

const TONE_TINT_BG: Record<DialogTone, string> = {
  primary: "bg-checkit-primary/[0.16]",
  danger: "bg-checkit-danger/[0.16]",
};

const TONE_CONFIRM_BG: Record<DialogTone, string> = {
  primary: "bg-checkit-primary",
  danger: "bg-checkit-danger",
};

export function ConfirmDialog({
  visible,
  icon: Icon,
  tone = "primary",
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  testID,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      testID={testID}
    >
      <View className="flex-1 items-center justify-center">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          testID={testID ? `${testID}-backdrop` : undefined}
          onPress={onCancel}
          className="absolute inset-0 bg-black/45"
        />
        <View className="mx-6 w-full max-w-[320px] rounded-[20px] bg-white p-[22px]">
          <View
            className={cn(
              "mb-3.5 h-[52px] w-[52px] items-center justify-center rounded-[14px]",
              TONE_TINT_BG[tone],
            )}
          >
            <Icon size={26} color={TONE_COLOR[tone]} strokeWidth={2.5} />
          </View>
          <Text className="mb-1.5 text-[17px] font-bold tracking-tight text-checkit-charcoal-ink">
            {title}
          </Text>
          <Text className="mb-5 text-sm leading-5 text-checkit-pebble-gray">
            {message}
          </Text>
          <View className="flex-row gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
              testID={testID ? `${testID}-cancel` : undefined}
              onPress={onCancel}
              className="h-11 flex-1 items-center justify-center rounded-xl border-hairline border-checkit-mist-border"
            >
              <Text className="text-[13px] font-bold text-checkit-charcoal-ink">
                {cancelLabel}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              testID={testID ? `${testID}-confirm` : undefined}
              onPress={onConfirm}
              className={cn(
                "h-11 flex-1 items-center justify-center rounded-xl",
                TONE_CONFIRM_BG[tone],
              )}
            >
              <Text className="text-[13px] font-bold text-white">
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
