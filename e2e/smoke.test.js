/* global device, element, by, expect */

describe('Check.it smoke', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('launches and renders the home screen', async () => {
    await expect(element(by.id('home-screen'))).toBeVisible();
    await expect(element(by.text('Check.it'))).toBeVisible();
  });
});
