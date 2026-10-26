// tests/leave.spec.js
// TC-LEAVE-01 through TC-LEAVE-05
// Tests: Assign leave form, assign leave end to end, validation, entitlements, date filter

const { test, expect } = require('@playwright/test');
const { ROUTES, TEST_DATA, workingDayPair } = require('../utils/constants');
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
    const { firstDaysAhead, maxAttempts, comment } = TEST_DATA.leave;
    await openPage(page, ROUTES.leaveAssign);

    // Employee: type a letter and take the first suggestion (demo data changes)
    await pickAutocomplete(page, page.locator('input[placeholder="Type for hints..."]'), 'a');

    // Leave type: first available option
    await selectDropdownOption(page, page.locator('.oxd-select-wrapper').first());
    await page.locator('textarea').fill(comment);

    const dates = page.locator('.oxd-date-input input');
    const toast = page.locator('.oxd-toast').first();
    const confirmDialog = page.locator('.oxd-dialog-sheet').first();

    // Holidays on the shared demo can change, so if a date window has no working days,
    // the site says so and the test tries the following week instead.
    let outcome = '';
    let daysAhead = firstDaysAhead;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const { start, end } = workingDayPair(daysAhead);
      // Next attempt: one week after this window
      daysAhead = Math.ceil((new Date(`${start}T12:00`) - Date.now()) / 86_400_000) + 7;
      await fillDateInput(dates.nth(0), start);
      await fillDateInput(dates.nth(1), end);

      // A range of more than one day shows Partial Days; then pick a half-day duration
      await selectDropdownOption(page, page.locator('.oxd-select-wrapper').nth(1), 'All Days');
      await selectDropdownOption(page, page.locator('.oxd-select-wrapper').nth(2), 'Half Day - Morning');

      await page.getByRole('button', { name: 'Assign' }).click();

      // Outcome: a toast, or a confirmation dialog when the leave balance is insufficient
      await expect(toast.or(confirmDialog).first()).toBeVisible({ timeout: 20000 });
      if (await confirmDialog.isVisible()) {
        outcome = 'confirm';
        break;
      }
      outcome = (await toast.textContent()) || '';
      if (!/No Working Days/i.test(outcome)) break;

      test.info().annotations.push({ type: 'retry-dates', description: `${start} to ${end} had no working days` });
      await expect(toast).toBeHidden({ timeout: 15000 });
    }

    if (outcome === 'confirm') {
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
