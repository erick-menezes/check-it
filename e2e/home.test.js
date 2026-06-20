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

describe('Check.it anonymous Home', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true, delete: true });
    await skipOnboarding();
  });

  it('lands on Home with the empty state and only the anonymous tabs', async () => {
    await expect(element(by.id('home-screen'))).toBeVisible();
    await expect(element(by.id('home-empty-state'))).toBeVisible();
    await expect(element(by.id('tab-home'))).toBeVisible();
    await expect(element(by.id('tab-settings'))).toBeVisible();
    await expect(element(by.id('tab-lists'))).not.toBeVisible();
    await expect(element(by.id('tab-summary'))).not.toBeVisible();
  });

  it('opens the limit screen and returns without a dead end', async () => {
    await element(by.id('create-list-cta')).tap();
    await expect(element(by.id('limit-screen'))).toBeVisible();
    await element(by.id('limit-close')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('switches to the Settings tab and back to Home', async () => {
    await element(by.id('tab-settings')).tap();
    await expect(element(by.id('settings-screen'))).toBeVisible();
    await element(by.id('tab-home')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('opens the help screen and returns', async () => {
    await element(by.id('header-help')).tap();
    await expect(element(by.id('help-screen'))).toBeVisible();
    await element(by.id('help-close')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('opens the notifications screen and returns', async () => {
    await element(by.id('header-notifications')).tap();
    await expect(element(by.id('notifications-screen'))).toBeVisible();
    await element(by.id('notifications-close')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
