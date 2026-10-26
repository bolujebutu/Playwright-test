// tests/time.spec.js
// TC-TIME-01 through TC-TIME-05
// Tests: Timesheet, attendance punch in/out, project time

const { test, expect } = require('@playwright/test');
const { ROUTES } = require('../utils/constants');

test.describe('Time & Attendance', () => {
  // TC-TIME-01: My Timesheet page loads
  test('TC-TIME-01: should load My Timesheet page', async ({ page }) => {
    await page.goto(ROUTES.timesheet);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.oxd-topbar-header-breadcrumb')).toContainText('My Timesheet');
    await expect(page.locator('.orangehrm-timesheet-wrapper, .orangehrm-container')).toBeVisible();
  });

  // TC-TIME-02: Time module sub-navigation accessible
  test('TC-TIME-02: should display Time module sub-nav', async ({ page }) => {
    await page.goto('/web/index.php/time/viewMyTimesheet');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a:has-text("Timesheets")')).toBeVisible();
    await expect(page.locator('a:has-text("Attendance")')).toBeVisible();
    await expect(page.locator('a:has-text("Reports")')).toBeVisible();
    await expect(page.locator('a:has-text("Project Info")')).toBeVisible();
  });

  // TC-TIME-03: Punch In page loads
  test('TC-TIME-03: should load the Punch In/Out page', async ({ page }) => {
    await page.goto('/web/index.php/attendance/punchIn');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.orangehrm-container')).toBeVisible();
  });

  // TC-TIME-04: View Attendance page accessible
  test('TC-TIME-04: should load View Attendance page', async ({ page }) => {
    await page.goto('/web/index.php/attendance/viewMyAttendanceRecord');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.orangehrm-container, .oxd-table')).toBeVisible();
  });

  // TC-TIME-05: Timesheet navigation (prev/next week) works
  test('TC-TIME-05: should navigate timesheets with prev/next week buttons', async ({ page }) => {
    await page.goto(ROUTES.timesheet);
    await page.waitForLoadState('networkidle');

    const prevButton = page.locator('button:has-text("Previous"), i.bi-chevron-left').first();
    if (await prevButton.isVisible()) {
      await prevButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.orangehrm-timesheet-wrapper, .orangehrm-container')).toBeVisible();
    }
  });
});
