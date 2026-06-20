import { Camera } from 'lucide-react-native';
import { Linking, Pressable, Text, View } from 'react-native';

const OVERLAY_ICON_SIZE = 34;

interface PermissionDeniedProps {
  canAskAgain: boolean;
  onRequest: () => void;
}

export function PermissionDenied({
  canAskAgain,
  onRequest,
}: PermissionDeniedProps) {
  const handlePress = canAskAgain ? onRequest : () => Linking.openSettings();
  const label = canAskAgain ? 'Permitir câmera' : 'Abrir configurações';
  return (
    <View testID="receipt-permission-denied" className="items-center px-6">
      <Camera size={OVERLAY_ICON_SIZE} color="#58AB6A" strokeWidth={2} />
      <Text className="mt-3 text-center text-sm leading-5 text-checkit-pebble-gray">
        Precisamos da câmera para fotografar o cupom fiscal e ler os itens.
      </Text>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={label}
        testID="receipt-permission-action"
        className="mt-4 h-[38px] items-center justify-center rounded-xl bg-checkit-primary px-5"
      >
        <Text className="text-[13px] font-bold text-white">{label}</Text>
      </Pressable>
    </View>
  );
}
