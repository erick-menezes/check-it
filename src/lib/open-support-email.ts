import { Linking } from 'react-native';

export const SUPPORT_EMAIL = 'suporte@checkit.com';

const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}`;

export async function openSupportEmail(): Promise<void> {
  try {
    const canOpen = await Linking.canOpenURL(SUPPORT_MAILTO);
    if (!canOpen) return;
    await Linking.openURL(SUPPORT_MAILTO);
  } catch (error) {
    console.warn('Failed to open the support email:', error);
  }
}
