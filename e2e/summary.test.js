/* global device, element, by, expect, waitFor */

const VISIBLE_TIMEOUT = 10000;

async function skipOnboarding() {
  await waitFor(element(by.text('Pular')))
    .toBeVisible()
    .withTimeout(VISIBLE_TIMEOUT);
  await element(by.text('Pular')).tap();
  await waitFor(element(by.id('home-screen')))
    .toBeVisible()
    .withTimeout(VISIBLE_TIMEOUT);
}

async function createListWithLimit(digits) {
  await element(by.id('create-list-cta')).tap();
  await waitFor(element(by.id('limit-screen')))
    .toBeVisible()
    .withTimeout(VISIBLE_TIMEOUT);
  await element(by.id('limit-hidden-input')).typeText(digits);
  await element(by.id('limit-confirm')).tap();
  await waitFor(element(by.id('shop-screen')))
    .toBeVisible()
    .withTimeout(VISIBLE_TIMEOUT);
}

async function addProductByInput(name) {
  await element(by.id('shop-add-input')).tap();
  await element(by.id('shop-add-input')).typeText(name);
  await element(by.id('shop-add-confirm')).tap();
}

async function priceItem(itemName, priceDigits, categoryId) {
  await element(by.label(`Editar ${itemName}`))
    .atIndex(0)
    .tap();
  await waitFor(element(by.id('edit-item-sheet')))
    .toBeVisible()
    .withTimeout(VISIBLE_TIMEOUT);
  await element(by.id('edit-price-input')).tap();
  await element(by.id('edit-price-input')).typeText(priceDigits);
  await element(by.id(`edit-category-${categoryId}`)).tap();
  await element(by.id('edit-save')).tap();
  await waitFor(element(by.id('edit-item-sheet')))
    .not.toBeVisible()
    .withTimeout(VISIBLE_TIMEOUT);
}

describe('Check.it Summary screen', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true, delete: true });
    await skipOnboarding();
    await createListWithLimit('5000');
    await addProductByInput('Arroz');
    await priceItem('Arroz', '1000', 'grocery');
    await element(by.id('shop-add-input')).tap();
    await waitFor(element(by.id('shop-suggestions')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await element(by.label('Adicionar Leite integral')).tap();
    await priceItem('Leite integral', '800', 'drinks');
  });

  it('shows the preview card with the open action', async () => {
    await element(by.id('shop-list')).scrollTo('bottom');
    await expect(element(by.id('shop-summary-preview'))).toBeVisible();
    await expect(element(by.id('shop-summary-open'))).toBeVisible();
    await expect(element(by.id('shop-summary-difference'))).toBeVisible();
  });

  it('opens the full summary from "Ver completo"', async () => {
    await element(by.id('shop-summary-open')).tap();
    await waitFor(element(by.id('summary-screen')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
  });

  it('renders the total tile and the budget banner', async () => {
    await expect(element(by.id('summary-total-tile'))).toBeVisible();
    await expect(element(by.id('summary-banner-label'))).toBeVisible();
    await expect(element(by.id('summary-banner-value'))).toBeVisible();
  });

  it('renders the stacked category bar with a legend per category', async () => {
    await expect(element(by.id('summary-stacked-bar'))).toBeVisible();
    await expect(element(by.id('summary-legend-grocery'))).toBeVisible();
    await expect(element(by.id('summary-legend-drinks'))).toBeVisible();
  });

  it('renders the top items list', async () => {
    await expect(element(by.id('summary-top-items'))).toBeVisible();
    await expect(element(by.text('Arroz'))).toBeVisible();
    await expect(element(by.text('Leite integral'))).toBeVisible();
  });

  it('returns to the shop screen with the back button', async () => {
    await element(by.id('summary-back')).tap();
    await waitFor(element(by.id('shop-screen')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
  });
});
