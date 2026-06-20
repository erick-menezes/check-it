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

describe('Check.it Settings / Ajustes screen', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true, delete: true });
    await skipOnboarding();
    await openSettings();
  });

  it('shows the NOTIFICAÇÕES and SOBRE sections, never the placeholder', async () => {
    await expect(element(by.text('NOTIFICAÇÕES'))).toBeVisible();
    await expect(element(by.text('SOBRE'))).toBeVisible();
    await expect(element(by.text('Em breve'))).not.toBeVisible();
  });

  it('flips the budget-alerts toggle from its default ON state', async () => {
    await expect(element(by.id('budget-alerts-toggle'))).toHaveToggleValue(
      true,
    );
    await element(by.id('budget-alerts-toggle')).tap();
    await expect(element(by.id('budget-alerts-toggle'))).toHaveToggleValue(
      false,
    );
  });

  it('navigates to Help and preserves the toggle state on return', async () => {
    await element(by.id('about-row-help')).tap();
    await waitFor(element(by.id('help-screen')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await element(by.id('help-close')).tap();
    await waitFor(element(by.id('settings-screen')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await expect(element(by.id('budget-alerts-toggle'))).toHaveToggleValue(
      false,
    );
  });

  it('navigates to Terms and returns without a dead end', async () => {
    await element(by.id('about-row-terms')).tap();
    await waitFor(element(by.id('terms-screen')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await element(by.id('terms-close')).tap();
    await waitFor(element(by.id('settings-screen')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
  });
});
