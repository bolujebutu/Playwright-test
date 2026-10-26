// tests/admin.spec.js
// TC-ADM-01 through TC-ADM-08
// Tests: System Users, Job Titles, Pay Grades, Locations, Config

const { test, expect } = require('@playwright/test');
const { ROUTES } = require('../utils/constants');

test.describe('Admin Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.admin, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('.oxd-table', { timeout: 35000 });
  });

  // TC-ADM-01
  test('TC-ADM-01: should display System Users list', async ({ page }) => {
    await expect(page.locator('.oxd-topbar-header-breadcrumb')).toContainText('User Management');
    await expect(page.locator('.oxd-table-header')).toBeVisible();
    await expect(page.locator('.oxd-table-card').first()).toBeVisible();;
  });

  // TC-ADM-02
  test('TC-ADM-02: should open Add System User form', async ({ page }) => {
    await page.click('button:has-text("Add")');
    await page.waitForURL(/saveSystemUser/, { timeout: 20000 });
    await expect(page.locator('h6:has-text("Add User")')).toBeVisible();
  });

  // TC-ADM-03
  test('TC-ADM-03: should validate required fields on Add User form', async ({ page }) => {
    await page.click('button:has-text("Add")');
    await page.waitForURL(/saveSystemUser/, { timeout: 20000 });
    await page.click('button[type="submit"]');
    const errors = page.locator('.oxd-input-field-error-message');
    await expect(errors.first()).toBeVisible({ timeout: 10000 });
  });

  // TC-ADM-04
  test('TC-ADM-04: should search system users by username', async ({ page }) => {
    const usernameInput = page.locator('.oxd-table-filter-area input').first();
    await usernameInput.fill('Admin');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.oxd-table-card').first()).toBeVisible({ timeout: 20000 });
  });

  // TC-ADM-05
  test('TC-ADM-05: should navigate to Job Titles page', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewJobTitleList', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await expect(page.locator('.oxd-table-header')).toBeVisible({ timeout: 19000 });
  });

  // TC-ADM-06
  test('TC-ADM-06: should navigate to Pay Grades page', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewPayGrades', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await expect(page.locator('.orangehrm-container')).toBeVisible({ timeout: 19000 });
  });

  // TC-ADM-07
  test('TC-ADM-07: should navigate to Organization Locations', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewLocations', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await expect(page.locator('.oxd-table-header')).toBeVisible({ timeout: 19000 });
  });

  // TC-ADM-08
  test('TC-ADM-08: should display all Admin top-nav sections', async ({ page }) => {
    const adminSections = ['User Management', 'Job', 'Organization', 'Qualifications', 'Nationalities', 'Configuration'];
    for (const section of adminSections) {
      await expect(
        page.locator('.oxd-topbar-body-nav-tab', { hasText: section }).first()
      ).toBeVisible({ timeout: 10000 });
    }
  });
});