// tests/performance.spec.js
// TC-PERF-01 through TC-PERF-06
// Tests: Performance Review list, KPI management, Trackers

const { test, expect } = require('@playwright/test');
const { ROUTES } = require('../utils/constants');

test.describe('Performance Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.performance);
    await page.waitForLoadState('networkidle');
  });

  // TC-PERF-01: Performance module loads
  test('TC-PERF-01: should load Performance Review List page', async ({ page }) => {
    await expect(page.locator('.oxd-topbar-header-breadcrumb')).toContainText('Performance');
    await expect(page.locator('.oxd-table, .orangehrm-container')).toBeVisible();
  });

  // TC-PERF-02: Sub-navigation is present
  test('TC-PERF-02: should show Performance sub-navigation', async ({ page }) => {
    const navLinks = page.locator('.oxd-topbar-body-nav a');
    await expect(navLinks.filter({ hasText: 'Manage Reviews' })).toBeVisible();
    await expect(navLinks.filter({ hasText: 'My Reviews' })).toBeVisible();
    await expect(navLinks.filter({ hasText: 'Employee Reviews' })).toBeVisible();
  });

  // TC-PERF-03: Manage Reviews - Configure sub-menu visible
  test('TC-PERF-03: should display Configure menu under Performance', async ({ page }) => {
    const configureLink = page.locator('a:has-text("Configure")').first();
    await configureLink.hover();
    // KPIs option visible
    await expect(page.locator('a:has-text("KPIs")')).toBeVisible({ timeout: 8000 });
  });

  // TC-PERF-04: KPI list page accessible
  test('TC-PERF-04: should navigate to KPIs page', async ({ page }) => {
    const configureLink = page.locator('a:has-text("Configure")').first();
    await configureLink.hover();
    await page.click('a:has-text("KPIs")');
    await page.waitForURL(/searchKpi/, { timeout: 15000 });
    await expect(page.locator('.oxd-table-header')).toBeVisible();
  });

  // TC-PERF-05: My Reviews page loads
  test('TC-PERF-05: should load My Reviews page', async ({ page }) => {
    await page.click('a:has-text("My Reviews")');
    await page.waitForURL(/myPerformanceReview/, { timeout: 15000 });
    await expect(page.locator('.orangehrm-container, .oxd-table')).toBeVisible();
  });

  // TC-PERF-06: Performance search filter works
  test('TC-PERF-06: should apply Performance Review search filters', async ({ page }) => {
    // Status dropdown
    const statusDropdown = page.locator('.oxd-select-wrapper').first();
    await expect(statusDropdown).toBeVisible();

    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.oxd-table, .orangehrm-container')).toBeVisible();
  });
});
