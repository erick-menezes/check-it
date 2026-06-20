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

describe('Check.it Shop list (full loop)', () => {
  beforeAll(async () => {
    // Deny the camera so the receipt sheet deterministically shows the
    // permission-denied messaging instead of a live camera preview.
    await device.launchApp({
      newInstance: true,
      delete: true,
      permissions: { camera: 'NO' },
    });
    await skipOnboarding();
    await createListWithLimit('5000');
  });

  it('lands on the shop screen with the budget chip and empty state', async () => {
    await expect(element(by.id('shop-screen'))).toBeVisible();
    await expect(element(by.id('shop-budget-chip'))).toBeVisible();
    await expect(element(by.id('shop-empty-state'))).toBeVisible();
  });

  it('opens the receipt sheet from the empty state and dismisses it via backdrop', async () => {
    await element(by.id('shop-scan-receipt')).tap();
    await waitFor(element(by.id('shop-receipt-sheet')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await expect(element(by.id('receipt-permission-denied'))).toBeVisible();
    await expect(
      element(
        by.text(
          'Precisamos da câmera para fotografar o cupom fiscal e ler os itens.',
        ),
      ),
    ).toBeVisible();
    await element(by.id('shop-receipt-sheet-backdrop')).tap();
    await waitFor(element(by.id('shop-receipt-sheet')))
      .not.toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
  });

  it('adds a product through the input', async () => {
    await addProductByInput('Arroz');
    await expect(element(by.label('Marcar Arroz'))).toBeVisible();
    // The action row and search only appear once the list has items.
    await expect(element(by.id('shop-sort-button'))).toBeVisible();
    await expect(element(by.id('shop-search-input'))).toBeVisible();
  });

  it('adds a product through a suggestion chip', async () => {
    await element(by.id('shop-add-input')).tap();
    await waitFor(element(by.id('shop-suggestions')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await element(by.label('Adicionar Feijão preto')).tap();
    await expect(element(by.label('Marcar Feijão preto'))).toBeVisible();
  });

  it('opens the receipt sheet from the action row shortcut and dismisses it', async () => {
    await element(by.id('shop-camera-shortcut')).tap();
    await waitFor(element(by.id('shop-receipt-sheet')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await expect(element(by.id('receipt-permission-denied'))).toBeVisible();
    await element(by.id('shop-receipt-sheet-backdrop')).tap();
    await waitFor(element(by.id('shop-receipt-sheet')))
      .not.toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
  });

  it('edits price, quantity and category through the edit sheet', async () => {
    await element(by.label('Editar Arroz')).atIndex(0).tap();
    await waitFor(element(by.id('edit-item-sheet')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await element(by.id('edit-price-input')).tap();
    await element(by.id('edit-price-input')).typeText('500');
    await element(by.id('edit-qty-increment')).tap();
    await expect(element(by.id('edit-qty-value'))).toHaveText('2');
    await element(by.id('edit-category-grocery')).tap();
    await element(by.id('edit-save')).tap();
    await waitFor(element(by.id('edit-item-sheet')))
      .not.toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
  });

  it('reflects the checked item in the budget status (on track)', async () => {
    await element(by.label('Marcar Arroz')).tap();
    await expect(element(by.id('shop-progress-fill-onTrack'))).toBeVisible();
    await expect(element(by.id('shop-status-line'))).toBeVisible();
    await expect(element(by.id('shop-summary-difference'))).toBeVisible();
  });

  it('sorts the list by price', async () => {
    await element(by.id('shop-sort-button')).tap();
    await waitFor(element(by.id('sort-sheet')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await element(by.id('sort-option-price-desc')).tap();
    await waitFor(element(by.id('sort-sheet')))
      .not.toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
  });

  it('filters the list with the search field', async () => {
    await element(by.id('shop-search-input')).tap();
    await element(by.id('shop-search-input')).typeText('Arroz');
    await expect(element(by.label('Marcar Arroz'))).toBeVisible();
    await expect(element(by.label('Marcar Feijão preto'))).not.toBeVisible();
    await element(by.id('shop-search-input')).clearText();
    await expect(element(by.label('Marcar Feijão preto'))).toBeVisible();
  });

  it('marks all items at once', async () => {
    await element(by.id('shop-mark-all')).tap();
    await expect(element(by.text('Marcar todos (2/2)'))).toBeVisible();
  });

  it('removes an item with swipe-to-delete', async () => {
    await element(by.label('Editar Feijão preto'))
      .atIndex(0)
      .swipe('left', 'fast');
    await waitFor(element(by.label('Excluir Feijão preto')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await element(by.label('Excluir Feijão preto')).tap();
    await expect(element(by.label('Marcar Feijão preto'))).not.toBeVisible();
  });

  it('persists the list across an app restart', async () => {
    // Relaunch without delete: the persisted list must survive the restart.
    await device.launchApp({ newInstance: true });
    await waitFor(element(by.id('active-list-card')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await element(by.id('active-list-card')).tap();
    await waitFor(element(by.id('shop-screen')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await expect(element(by.label('Marcar Arroz'))).toBeVisible();
  });

  it('renames the list title', async () => {
    await element(by.id('shop-title')).tap();
    await waitFor(element(by.id('shop-title-input')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await element(by.id('shop-title-input')).replaceText('Compras da semana');
    await element(by.id('shop-title-input')).tapReturnKey();
    // The title Pressable encodes the name in its accessibility label.
    await expect(
      element(by.label('Editar nome da lista, Compras da semana')),
    ).toBeVisible();
  });

  it('deletes the list and returns Home', async () => {
    await element(by.id('shop-list')).scrollTo('bottom');
    await element(by.id('shop-delete-list')).tap();
    await waitFor(element(by.id('delete-list-dialog')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await element(by.id('delete-list-dialog-confirm')).tap();
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await expect(element(by.id('home-empty-state'))).toBeVisible();
  });
});
