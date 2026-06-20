import {
  CameraView,
  type CameraView as CameraViewType,
  useCameraPermissions,
} from 'expo-camera';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import type { NewItemInput } from '@/features/shop/list-item';
import { useReceiptScan } from '@/features/shop/use-receipt-scan';
import { PermissionDenied } from './components/permission-denied';
import { ReceiptCta } from './components/receipt-cta';
import { ScanOverlay } from './components/scan-overlay';

interface ReceiptSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddItems: (items: readonly NewItemInput[]) => void;
}

export function ReceiptSheet({
  visible,
  onClose,
  onAddItems,
}: ReceiptSheetProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraViewType | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const { state, scan, reset } = useReceiptScan({
    cameraRef,
    onItemsParsed: onAddItems,
  });
  useEffect(() => {
    if (visible && permission?.status === 'undetermined') {
      requestPermission();
    }
  }, [visible, permission, requestPermission]);
  const handleClose = useCallback(() => {
    reset();
    setCameraReady(false);
    onClose();
  }, [reset, onClose]);
  const granted = permission?.granted ?? false;
  const busy = state.status === 'capturing' || state.status === 'processing';
  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      testID="shop-receipt-sheet"
      accessibilityLabel="Escanear cupom fiscal"
    >
      <Text className="text-lg font-bold tracking-tight text-checkit-charcoal-ink">
        Escanear cupom fiscal
      </Text>
      <Text className="mt-1.5 text-sm leading-5 text-checkit-pebble-gray">
        Tire foto do cupom e preenchemos itens e preços pra você.
      </Text>
      <View
        testID="receipt-preview"
        className="mt-4 h-[230px] items-center justify-center overflow-hidden rounded-[14px] bg-checkit-linen-cream"
      >
        {granted && visible ? (
          <>
            <CameraView
              ref={cameraRef}
              facing="back"
              onCameraReady={() => setCameraReady(true)}
              style={StyleSheet.absoluteFill}
              testID="receipt-camera"
            />
            <ScanOverlay state={state} />
          </>
        ) : (
          <PermissionDenied
            canAskAgain={permission?.canAskAgain ?? true}
            onRequest={requestPermission}
          />
        )}
      </View>
      <ReceiptCta
        granted={granted}
        cameraReady={cameraReady}
        busy={busy}
        state={state}
        onScan={scan}
        onReset={reset}
        onDone={handleClose}
      />
    </BottomSheet>
  );
}
