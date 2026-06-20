import { router } from "expo-router";
import { X } from "lucide-react-native";
import type { JSX } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function handleClose(): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace("/(tabs)/home");
}

export function HelpHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top + 12 }}
      className="border-b-hairline border-b-checkit-mist-border bg-white px-[22px] pb-4"
    >
      <Pressable
        onPress={handleClose}
        accessibilityRole="button"
        accessibilityLabel="Fechar"
        testID="help-close"
        className="-ml-2 h-11 w-11 items-center justify-center rounded-full"
      >
        <X size={24} color="#1B1B1B" strokeWidth={2} />
      </Pressable>
      <Text className="mt-2 text-[22px] font-bold tracking-tight text-checkit-charcoal-ink">
        Sobre o que você quer saber?
      </Text>
      <Text className="mt-1 text-[13px] text-checkit-charcoal-ink/85">
        Selecione uma seção pra ver as principais dúvidas.
      </Text>
    </View>
  );
}
