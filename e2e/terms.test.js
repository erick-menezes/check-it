/* global device, element, by, expect, waitFor */

const VISIBLE_TIMEOUT = 10000;

async function skipOnboarding() {
  // A fresh install lands on onboarding; skipping reaches the anonymous Home.
  await waitFor(element(by.text('Pular')))
    .toBeVisible()
    .withTimeout(VISIBLE_TIMEOUT);
  await element(by.text('Pular')).tap();
  await waitFor(element(by.id('home-screen')))
    .toBeVisible()
    .withTimeout(VISIBLE_TIMEOUT);
}

async function openSettings() {
  await element(by.id('tab-settings')).tap();
  await waitFor(element(by.id('settings-screen')))
    .toBeVisible()
    .withTimeout(VISIBLE_TIMEOUT);
}

async function openTerms() {
  await element(by.id('about-row-terms')).tap();
  await waitFor(element(by.id('terms-screen')))
    .toBeVisible()
    .withTimeout(VISIBLE_TIMEOUT);
}

describe('Check.it Terms & Privacy / Termos e privacidade screen', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true, delete: true });
    await skipOnboarding();
    await openSettings();
    await openTerms();
  });

  it('opens on the Termos de uso tab with its summary visible', async () => {
    await expect(element(by.id('document-content-terms'))).toBeVisible();
    await expect(element(by.text('Resumo em uma frase'))).toBeVisible();
    await expect(element(by.text('Aceite dos termos'))).toBeVisible();
  });

  it('switches to the Privacidade tab and shows privacy content', async () => {
    await element(by.id('terms-tabs-segment-privacy')).tap();
    await waitFor(element(by.id('document-content-privacy')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await expect(
      element(by.text('O essencial sobre privacidade')),
    ).toBeVisible();
    await expect(element(by.text('Dados que coletamos'))).toBeVisible();
  });

  it('closes and returns to Settings without a dead end', async () => {
    await element(by.id('terms-close')).tap();
    await waitFor(element(by.id('settings-screen')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
  });
});
