// tests/leave.spec.js
// TC-LEAVE-01 through TC-LEAVE-05
// Tests: Assign leave form, assign leave end to end, validation, entitlements, date filter

const { test, expect } = require('@playwright/test');
const { ROUTES, TEST_DATA } = require('../utils/constants');
const {
  openPage, waitForPageReady, openTopNavItem, selectDropdownOption,
  fillDateInput, pickAutocomplete,
} = require('../utils/helpers');

test.describe('Leave Management', () => {
  test.beforeEach(async ({ page }) => {
    await openPage(page, ROUTES.leave);
  });

  // TC-LEAVE-01: Assign Leave form loads correctly
  test('TC-LEAVE-01: should open the Assign Leave form', async ({ page }) => {
    await page.locator('.oxd-topbar-body-nav-tab', { hasText: 'Assign Leave' }).click();
    await page.waitForURL(/assignLeave/);
    await expect(page.locator('h6', { hasText: 'Assign Leave' })).toBeVisible();
    await expect(page.locator('.oxd-form')).toBeVisible();
  });

  // TC-LEAVE-02: Fill and submit the Assign Leave form
  test('TC-LEAVE-02: should fill and submit the Assign Leave form', async ({ page }) => {
    const { startDate, endDate, comment } = TEST_DATA.leave;
    await openPage(page, ROUTES.leaveAssign);

    // Employee: type a letter and take the first suggestion (demo data changes)
    await pickAutocomplete(page, page.locator('input[placeholder="Type for hints..."]'), 'a');

    // Leave type: first available option
    await selectDropdownOption(page, page.locator('.oxd-select-wrapper').first());

    // Date range over more than one day, so the Partial Days field appears
    const dates = page.locator('.oxd-date-input input');
    await fillDateInput(dates.nth(0), startDate);
    await fillDateInput(dates.nth(1), endDate);

    await selectDropdownOption(page, page.locator('.oxd-select-wrapper').nth(1), 'All Days');
    await selectDropdownOption(page, page.locator('.oxd-select-wrapper').nth(2), 'Half Day - Morning');

    await page.locator('textarea').fill(comment);
    await page.getByRole('button', { name: 'Assign' }).click();

    // Outcome: saved straight away, or a confirmation dialog when the balance is insufficient
    const toast = page.locator('.oxd-toast').first();
    const confirmDialog = page.locator('.oxd-dialog-sheet').first();
    await expect(toast.or(confirmDialog).first()).toBeVisible({ timeout: 20000 });

    if (await confirmDialog.isVisible()) {
      await confirmDialog.getByRole('button', { name: /ok|confirm/i }).first().click();
      await expect(toast).toBeVisible({ timeout: 20000 });
    }
    await expect(toast).toContainText(/Success/i);
  });

  // TC-LEAVE-03: Validation fires when submitting an empty Assign Leave form
  test('TC-LEAVE-03: should show validation errors on empty Assign Leave submit', async ({ page }) => {
    await openPage(page, ROUTES.leaveAssign);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('.oxd-input-field-error-message').first()).toBeVisible();
  });

  // TC-LEAVE-04: Add Entitlements page opens from the Entitlements menu
  test('TC-LEAVE-04: should load the Add Entitlements page', async ({ page }) => {
    // "Entitlements" is a dropdown; its items only exist once it is opened
    await openTopNavItem(page, 'Entitlements', 'Add Entitlements');
    await page.waitForURL(/addLeaveEntitlement/);
    await waitForPageReady(page);
    await expect(page.locator('.oxd-form')).toBeVisible();
  });

  // TC-LEAVE-05: Leave list filter by date range
  test('TC-LEAVE-05: should filter Leave List by date range', async ({ page }) => {
    const { fromDate, toDate } = TEST_DATA.leaveFilter;
    const dates = page.locator('.oxd-date-input input');
    await fillDateInput(dates.nth(0), fromDate);
    await fillDateInput(dates.nth(1), toDate);

    // A wrongly formatted date shows a validation message instead of filtering
    await expect(page.locator('.oxd-input-field-error-message')).toHaveCount(0);

    await page.locator('button[type="submit"]').click();
    await waitForPageReady(page);
    await expect(page.locator('.oxd-table')).toBeVisible();
  });
});
