import {
  CameraView,
  type CameraView as CameraViewType,
  useCameraPermissions,
} from 'expo-camera';
import { Camera, CheckCircle2, RotateCcw } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import type { NewItemInput } from '@/features/shop/list-item';
import {
  type ReceiptScanState,
  useReceiptScan,
} from '@/features/shop/use-receipt-scan';

const OVERLAY_ICON_SIZE = 34;
const CTA_ICON_SIZE = 18;

interface ReceiptSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddItems: (items: readonly NewItemInput[]) => void;
}

interface PermissionDeniedProps {
  canAskAgain: boolean;
  onRequest: () => void;
}

function PermissionDenied({ canAskAgain, onRequest }: PermissionDeniedProps) {
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

function ScanOverlay({ state }: { state: ReceiptScanState }) {
  if (state.status === 'capturing' || state.status === 'processing') {
    return (
      <View
        testID="receipt-processing"
        className="absolute inset-0 items-center justify-center bg-black/45"
      >
        <ActivityIndicator color="#ffffff" />
        <Text className="mt-2 text-[13px] font-semibold text-white">
          Lendo o cupom…
        </Text>
      </View>
    );
  }
  if (state.status === 'success') {
    return (
      <View
        testID="receipt-success"
        className="absolute inset-0 items-center justify-center bg-black/45"
      >
        <CheckCircle2
          size={OVERLAY_ICON_SIZE}
          color="#ffffff"
          strokeWidth={2}
        />
        <Text className="mt-2 text-[13px] font-semibold text-white">
          {state.count}{' '}
          {state.count === 1 ? 'item adicionado' : 'itens adicionados'}
        </Text>
      </View>
    );
  }
  if (state.status === 'error') {
    return (
      <View
        testID="receipt-error"
        className="absolute inset-0 items-center justify-center bg-black/45 px-6"
      >
        <Text className="text-center text-[13px] font-semibold text-white">
          Não consegui ler o cupom. Tente uma foto mais nítida.
        </Text>
      </View>
    );
  }
  return null;
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

interface ReceiptCtaProps {
  granted: boolean;
  cameraReady: boolean;
  busy: boolean;
  state: ReceiptScanState;
  onScan: () => void;
  onReset: () => void;
  onDone: () => void;
}

function ReceiptCta({
  granted,
  cameraReady,
  busy,
  state,
  onScan,
  onReset,
  onDone,
}: ReceiptCtaProps) {
  if (!granted) return null;
  if (state.status === 'success') {
    return (
      <Pressable
        onPress={onDone}
        accessibilityRole="button"
        accessibilityLabel="Concluir"
        testID="receipt-done"
        className="mt-4 h-[52px] items-center justify-center rounded-xl bg-checkit-primary"
      >
        <Text className="text-[15px] font-bold text-white">Concluir</Text>
      </Pressable>
    );
  }
  if (state.status === 'error') {
    return (
      <Pressable
        onPress={onReset}
        accessibilityRole="button"
        accessibilityLabel="Tentar de novo"
        testID="receipt-retry"
        className="mt-4 h-[52px] flex-row items-center justify-center gap-2 rounded-xl bg-checkit-primary"
      >
        <RotateCcw size={CTA_ICON_SIZE} color="#ffffff" strokeWidth={2} />
        <Text className="text-[15px] font-bold text-white">Tentar de novo</Text>
      </Pressable>
    );
  }
  const disabled = busy || !cameraReady;
  return (
    <Pressable
      onPress={onScan}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Tirar foto do cupom"
      accessibilityState={{ disabled }}
      testID="receipt-capture"
      className="mt-4 h-[52px] flex-row items-center justify-center gap-2 rounded-xl bg-checkit-primary disabled:opacity-50"
    >
      {busy ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Camera size={CTA_ICON_SIZE} color="#ffffff" strokeWidth={2} />
      )}
      <Text className="text-[15px] font-bold text-white">
        {busy ? 'Processando…' : 'Tirar foto'}
      </Text>
    </Pressable>
  );
}
