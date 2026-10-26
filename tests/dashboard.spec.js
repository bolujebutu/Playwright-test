// tests/dashboard.spec.js
// TC-DASH-01 through TC-DASH-05
// Tests: Dashboard widgets, quick launch, charts, navigation, header

const { test, expect } = require('@playwright/test');
const { ROUTES } = require('../utils/constants');

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.dashboard);
    await page.waitForLoadState('networkidle');
  });

  // TC-DASH-03: Sidebar navigation items are all visible
  test('TC-DASH-03: should display all sidebar navigation items', async ({ page }) => {
    const expectedMenuItems = ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info', 'Performance', 'Dashboard', 'Directory', 'Maintenance', 'Buzz'];

    for (const item of expectedMenuItems) {
      await expect(
        page.locator('.oxd-main-menu-item span', { hasText: item }).first()
      ).toBeVisible({ timeout: 8000 });
    }
  });

  // TC-DASH-04: Top header shows username and logo
  test('TC-DASH-04: should display header with user info', async ({ page }) => {
    await expect(page.locator('.oxd-userdropdown-name')).toBeVisible();
    await expect(page.locator('.oxd-brand-banner')).toBeVisible();
  });

  // TC-DASH-05: User dropdown shows profile and logout options
  test('TC-DASH-05: should open user dropdown with profile options', async ({ page }) => {
    await page.click('.oxd-userdropdown-tab');
    await expect(page.locator('.oxd-userdropdown-link', { hasText: 'About' })).toBeVisible();
    await expect(page.locator('.oxd-userdropdown-link', { hasText: 'Support' })).toBeVisible();
    await expect(page.locator('.oxd-userdropdown-link', { hasText: 'Change Password' })).toBeVisible();
    await expect(page.locator('.oxd-userdropdown-link', { hasText: 'Logout' })).toBeVisible();
  });
});
