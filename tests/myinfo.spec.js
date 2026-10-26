// tests/myinfo.spec.js
// TC-INFO-01 through TC-INFO-05
// Tests: My Info page structure and editable fields

const { test, expect } = require('@playwright/test');
const { ROUTES } = require('../utils/constants');

test.describe('My Info', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.myInfo);
    await page.waitForLoadState('networkidle');
  });

  // TC-INFO-01: My Info page loads
  test('TC-INFO-01: should display My Info Personal Details page', async ({ page }) => {
    await expect(page.locator('h6:has-text("Personal Details")')).toBeVisible({ timeout: 10000 });
  });

  // TC-INFO-02: Personal Details fields are editable
  test('TC-INFO-02: should display editable personal detail fields', async ({ page }) => {
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
  });

  // TC-INFO-03: Contact Details tab accessible
  test('TC-INFO-03: should navigate to Contact Details tab', async ({ page }) => {
    await page.click('a:has-text("Contact Details")');
    await page.waitForURL(/contactDetails/, { timeout: 10000 });
    await expect(page.locator('h6:has-text("Contact Details")')).toBeVisible();
  });

  // TC-INFO-04: Change Password option accessible
  test('TC-INFO-04: should open Change Password from user dropdown', async ({ page }) => {
    await page.click('.oxd-userdropdown-tab');
    await page.click('a:has-text("Change Password")');
    await page.waitForURL(/changePassword/, { timeout: 10000 });
    await expect(page.locator('.oxd-form')).toBeVisible();
  });

  // TC-INFO-05: Emergency Contacts tab accessible
  test('TC-INFO-05: should navigate to Emergency Contacts tab', async ({ page }) => {
    await page.click('a:has-text("Emergency Contacts")');
    await page.waitForURL(/emergencyContacts/, { timeout: 10000 });
    await expect(page.locator('.orangehrm-container')).toBeVisible();
  });
});
