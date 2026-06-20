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

describe('Check.it Notifications screen', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true, delete: true });
    await skipOnboarding();
  });

  it('opens the Notifications screen from the Home header showing the empty state', async () => {
    await element(by.id('header-notifications')).tap();
    await waitFor(element(by.id('notifications-screen')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await expect(element(by.id('notifications-empty-state'))).toBeVisible();
    await expect(element(by.text('Tudo em dia'))).toBeVisible();
  });

  it('closes the screen and shows no unread dot on Home', async () => {
    await element(by.id('notifications-close')).tap();
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await expect(element(by.id('notifications-dot'))).not.toBeVisible();
  });
});
