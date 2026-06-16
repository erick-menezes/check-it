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

describe('Check.it Help / FAQ screen', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true, delete: true });
    await skipOnboarding();
  });

  it('opens the Help screen from the Home header with Listas expanded by default', async () => {
    await element(by.id('header-help')).tap();
    await waitFor(element(by.id('help-screen')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await expect(element(by.id('faq-section-listas'))).toBeVisible();
    // Listas is open on entry (PRD 2.5): its first answer is visible.
    await expect(element(by.text('Como crio uma lista?'))).toBeVisible();
  });

  it('switches to Limites, collapsing Listas (single-open accordion)', async () => {
    await element(by.id('faq-section-limites')).tap();
    await waitFor(element(by.text('Como definir um limite?')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    // Listas content collapses when Limites opens (PRD 2.3).
    await expect(element(by.text('Como crio uma lista?'))).not.toBeVisible();
  });

  it('closes the Help screen and returns to Home', async () => {
    await element(by.id('help-close')).tap();
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
