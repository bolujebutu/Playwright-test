// tests/leave.spec.js
// TC-LEAVE-01 through TC-LEAVE-07
// Tests: Leave list, assign leave, leave types, entitlements, leave calendar

const { test, expect } = require('@playwright/test');
const { ROUTES } = require('../utils/constants');
const {fillDateInput,} = require('../utils/helpers');

test.describe('Leave Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.leave);
    await page.waitForLoadState('networkidle');
  });

  // TC-LEAVE-01: Assign Leave form loads correctly
  test('TC-LEAVE-03: should open the Assign Leave form', async ({ page }) => {
    await page.click('text=Assign Leave');
    await page.waitForURL(/assignLeave/, { timeout: 10000 });
    await expect(page.locator('h6:has-text("Assign Leave")')).toBeVisible();
    await expect(page.locator('.oxd-form')).toBeVisible();
  });

 // TC-LEAVE-02: Fill the Assign Leave form
  test('TC-LEAVE-04: should fill and submit the Assign Leave form', async ({ page }) => {
    await page.click('a:has-text("Assign Leave")');
    await page.waitForURL(/assignLeave/, { timeout: 15000 });

    // Fill Employee Name
    await page.fill('input[placeholder="Type for hints..."]', 'Ranga  Akunuri');
    await page.waitForSelector('.oxd-autocomplete-dropdown', { timeout: 10000 });
    await page.locator('.oxd-autocomplete-option').first().click();

    // Select Leave Type
    await page.locator('.oxd-select-wrapper').first().click();
    await page.locator('.oxd-select-dropdown .oxd-select-option').first().click();

    // Fill From Date - FIXED SELECTOR
    const fromDateInput = page.getByRole('textbox', { name: 'yyyy-dd-mm' }).first();
    await fromDateInput.fill('2026-09-03');
    await fromDateInput.press('Tab');

    // Fill To Date - FIXED SELECTOR
    const toDateInput = page.getByRole('textbox', { name: 'yyyy-dd-mm' }).nth(1);
    await toDateInput.fill('2026-20-03');
    await toDateInput.press('Tab');

    // Partial Days
    const partialDaysDropdown = page.locator('.oxd-select-wrapper').nth(1);
    await partialDaysDropdown.click();
    await page.locator('.oxd-select-dropdown .oxd-select-option span:has-text("All Days")').click();

    // Duration — appears after Partial Days is set, select first available option
    const durationDropdown = page.locator('.oxd-select-wrapper').nth(2);
    await expect(durationDropdown).toBeVisible({ timeout: 8000 });
    await durationDropdown.click();
    await page.locator('.oxd-select-dropdown .oxd-select-option span:has-text("Half Day - Morning")').click();

    // Fill Comments
    await page.fill('textarea', 'Automated test leave request');

    // Verify Assign button is visible and enabled
    await expect(page.locator('button:has-text("Assign")')).toBeVisible();
    await page.getByRole('button', { name: 'Assign' }).click();
  });

  // TC-LEAVE-03: Validation fires when submitting empty Assign Leave form
  test('TC-LEAVE-05: should show validation errors on empty Assign Leave submit', async ({ page }) => {
    await page.goto(ROUTES.leaveAssign);
    await page.waitForLoadState('networkidle');
    await page.click('button[type="submit"]');

    const errors = page.locator('.oxd-input-field-error-message');
    await expect(errors.first()).toBeVisible({ timeout: 8000 });
  });

  // TC-LEAVE-04: Leave Entitlements page loads
  test('TC-LEAVE-06: should load the Leave Entitlements page', async ({ page }) => {
    await page.click('text=Entitlements');
    // Entitlements has sub-links
    const addEntitlement = page.locator('[href*="addLeaveEntitlement"], a:has-text("Add Entitlements")');
    await expect(addEntitlement.first()).toBeVisible({ timeout: 10000 });
  });

  // TC-LEAVE-05: Leave search with date filter
  test('TC-LEAVE-07: should filter Leave List by date range', async ({ page }) => {
    // Fill from date
    const dateInputs = page.locator('.oxd-date-input input');
    if (await dateInputs.count() >= 2) {
      await fillDateInput(dateInputs.first(), '2024-01-01');
      await fillDateInput(dateInputs.nth(1), '2024-12-31');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
      // Either shows records or "No Records Found"
      await expect(page.locator('.oxd-table')).toBeVisible();
    }
  });
});
