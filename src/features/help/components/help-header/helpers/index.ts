import { router } from 'expo-router';

export function handleClose(): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace('/(tabs)/home');
}
