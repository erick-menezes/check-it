import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import type { LucideIcon } from "lucide-react-native";
import type { JSX } from "react";
import { View } from "react-native";

interface HaloIconProps {
  Icon: LucideIcon;
}

export function HaloIcon({ Icon }: HaloIconProps) {
  if (isGlassEffectAPIAvailable()) {
    return (
      <GlassView
        glassEffectStyle="regular"
        className="h-[168px] w-[168px] items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/[0.12]"
        colorScheme="light"
      >
        <Icon size={92} color="white" strokeWidth={1.5} />
      </GlassView>
    );
  }
  return (
    <View className="h-[168px] w-[168px] items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/[0.12]">
      <Icon size={92} color="white" strokeWidth={1.5} />
    </View>
  );
}
