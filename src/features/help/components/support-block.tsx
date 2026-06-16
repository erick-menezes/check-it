import { Mail } from 'lucide-react-native';
import type { JSX } from 'react';
import { Pressable, Text, View } from 'react-native';
import { openSupportEmail, SUPPORT_EMAIL } from '@/lib/open-support-email';

export function SupportBlock(): JSX.Element {
  return (
    <View className="mt-6">
      <Text className="text-[18px] font-bold tracking-tight text-checkit-charcoal-ink">
        Não achou sua dúvida?
      </Text>
      <Text className="mt-1 text-[12px] text-checkit-pebble-gray">
        Manda pra gente que respondemos assim que possível.
      </Text>
      <Pressable
        onPress={openSupportEmail}
        accessibilityRole="button"
        accessibilityLabel={SUPPORT_EMAIL}
        testID="support-email-button"
        className="mt-3 min-h-[52px] flex-row items-center justify-center gap-2 rounded-xl border border-checkit-mist-border"
      >
        <Mail size={18} color="#1B1B1B" strokeWidth={2} />
        <Text className="text-[13px] font-bold text-checkit-charcoal-ink">
          {SUPPORT_EMAIL}
        </Text>
      </Pressable>
    </View>
  );
}
