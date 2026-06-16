import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';

export const FONT_MAP = {
  'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
  'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
  'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
  'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
  'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
} as const;

interface AppFontsResult {
  fontsLoaded: boolean;
}

export function useAppFonts(): AppFontsResult {
  const [loaded, error] = useFonts(FONT_MAP);
  if (error) {
    console.warn(
      'Failed to load Plus Jakarta Sans, falling back to system-ui:',
      error,
    );
  }
  return { fontsLoaded: loaded || error !== null };
}
