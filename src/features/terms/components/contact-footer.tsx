import { Mail } from 'lucide-react-native';
import type { JSX } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { openSupportEmail } from '@/lib/open-support-email';

export function ContactFooter(): JSX.Element {
  return (
    <View className="mt-2 items-center rounded-[14px] border border-dashed border-checkit-mist-border px-5 py-6">
      <Text className="text-[15px] font-bold tracking-tight text-checkit-charcoal-ink">
        Ficou com alguma dúvida?
      </Text>
      <Text className="mt-1 text-center text-[13px] text-checkit-pebble-gray">
        Nosso time responde assim que possível.
      </Text>
      <View className="mt-4">
        <Button
          variant="soft"
          size="sm"
          label="Falar com o suporte"
          iconLeft={Mail}
          onPress={openSupportEmail}
          testID="terms-support-button"
        />
      </View>
    </View>
  );
}
