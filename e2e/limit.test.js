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

async function openLimit() {
  await element(by.id('create-list-cta')).tap();
  await waitFor(element(by.id('limit-screen')))
    .toBeVisible()
    .withTimeout(VISIBLE_TIMEOUT);
}

describe('Check.it Limit screen (create list, step 1 of 2)', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true, delete: true });
    await skipOnboarding();
    await openLimit();
  });

  describe('typing a value and confirming', () => {
    it('opens from the Home CTA showing the step chrome and title', async () => {
      expect(element(by.id('limit-screen'))).toBeVisible();
      expect(element(by.text('Passo 1 de 2'))).toBeVisible();
      expect(element(by.text('Qual será o seu valor limite?'))).toBeVisible();
    });

    it('fills the hero from the cents as digits are typed', async () => {
      await element(by.id('limit-hidden-input')).typeText('1500');
      await expect(element(by.text('15,00'))).toBeVisible();
    });

    it('confirms into the shop screen (step 2 of 2)', async () => {
      await element(by.id('limit-confirm')).tap();
      await waitFor(element(by.id('shop-screen')))
        .toBeVisible()
        .withTimeout(VISIBLE_TIMEOUT);
    });
  });

  describe('selecting a preset value', () => {
    it('sets the hero to the preset amount and confirms into the shop screen', async () => {
      await element(by.id('limit-preset-500')).tap();
      expect(element(by.text('500,00'))).toBeVisible();
      await element(by.id('limit-confirm')).tap();
      await waitFor(element(by.id('shop-screen')))
        .toBeVisible()
        .withTimeout(VISIBLE_TIMEOUT);
    });
  });

  describe('closing without creating a list', () => {
    it('returns to Home with the empty state untouched', async () => {
      await element(by.id('limit-close')).tap();
      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(VISIBLE_TIMEOUT);
      // Nothing was confirmed, so no active list exists yet.
      expect(element(by.id('home-empty-state'))).toBeVisible();
    });
  });

  describe('persisting the created list across restarts', () => {
    it('shows the active-list card on Home after relaunching the app', async () => {
      await element(by.id('limit-preset-200')).tap();
      await element(by.id('limit-confirm')).tap();
      await waitFor(element(by.id('shop-screen')))
        .toBeVisible()
        .withTimeout(VISIBLE_TIMEOUT);
      // Relaunch without delete: persisted state must survive the restart.
      await device.launchApp({ newInstance: true });
      await waitFor(element(by.id('active-list-card')))
        .toBeVisible()
        .withTimeout(VISIBLE_TIMEOUT);
      expect(element(by.id('home-empty-state'))).not.toBeVisible();
    });
  });
});
