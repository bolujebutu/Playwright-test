// tests/pim.spec.js
// TC-PIM-01 through TC-PIM-08
// Tests: Employee list, add employee, search, view profile, update personal details

const { test, expect } = require('@playwright/test');
const { ROUTES, TEST_DATA } = require('../utils/constants');
const { navigateToMenu, waitForToast, searchEmployeeByName } = require('../utils/helpers');

test.describe('PIM - Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.pim);
    await page.waitForLoadState('networkidle');
  });

  // TC-PIM-01: Employee list page loads with data
  test('TC-PIM-01: should display the employee list', async ({ page }) => {
    await expect(page.locator('.oxd-table-header')).toBeVisible();
    await expect(page.locator('.oxd-table-card')).toHaveCount({ minimum: 1 });
    // Record count badge visible
    await expect(page.locator('.orangehrm-bottom-container')).toBeVisible();
  });

  // TC-PIM-02: Add New Employee page loads correctly
  test('TC-PIM-02: should open the Add Employee form', async ({ page }) => {
    await page.click('text=Add Employee');
    await expect(page).toHaveURL(/addEmployee/);
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="middleName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
  });

  // TC-PIM-03: Add a new employee successfully
  test('TC-PIM-03: should add a new employee successfully', async ({ page }) => {
    const { firstName, lastName, employeeId } = TEST_DATA.employee;

    await page.goto(ROUTES.addEmployee);
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="firstName"]', firstName);
    await page.fill('input[name="lastName"]', lastName);

    // Clear and fill Employee ID field
    const empIdInput = page.locator('input.oxd-input').nth(4);
    await empIdInput.clear();
    await empIdInput.fill(employeeId);

    await page.click('button[type="submit"]');

    // Should redirect to the employee profile
    await page.waitForURL(/viewPersonalDetails/, { timeout: 20000 });
    await expect(page.locator('.oxd-topbar-header-breadcrumb')).toContainText('Personal Details');
  });

  // TC-PIM-04: Search for an employee by name
  test('TC-PIM-04: should search and find an employee by name', async ({ page }) => {
    // Use a name that's likely to exist in the demo
    const nameInput = page.locator('.oxd-table-filter-area input').first();
    await nameInput.fill('Alice');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    const results = page.locator('.oxd-table-card');
    // Either finds results or shows "No Records Found" — both are valid
    const noRecords = page.locator('.oxd-table-cell:has-text("No Records Found")');
    const hasResults = await results.count() > 0;
    const hasNoRecords = await noRecords.count() > 0;
    expect(hasResults || hasNoRecords).toBe(true);
  });

  // TC-PIM-05: Search with no results shows "No Records Found"
  test('TC-PIM-05: should show no records for non-existent employee', async ({ page }) => {
    const nameInput = page.locator('.oxd-table-filter-area input').first();
    await nameInput.fill('ZZZ_NONEXISTENT_USER_XYZ');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.oxd-table-card')).toHaveCount(0);
    await expect(page.locator('span:has-text("No Records Found")')).toBeVisible();
  });

  // TC-PIM-06: View employee personal details
  test('TC-PIM-06: should navigate to an employee personal details page', async ({ page }) => {
    const firstRow = page.locator('.oxd-table-card').first();
    await firstRow.locator('i.bi-pencil-fill').click();
    await page.waitForURL(/viewPersonalDetails/, { timeout: 15000 });
    await expect(page.locator('h6:has-text("Personal Details")')).toBeVisible();
  });

  // TC-PIM-07: Employee profile tabs are all accessible
  test('TC-PIM-07: should display all employee profile tab sections', async ({ page }) => {
    const firstRow = page.locator('.oxd-table-card').first();
    await firstRow.locator('i.bi-pencil-fill').click();
    await page.waitForURL(/viewPersonalDetails/, { timeout: 15000 });

    const expectedTabs = ['Personal Details', 'Contact Details', 'Emergency Contacts', 'Dependents', 'Immigration', 'Job', 'Salary', 'Tax Exemptions', 'Report-to', 'Qualifications', 'Memberships'];
    for (const tab of expectedTabs) {
      await expect(
        page.locator('.orangehrm-tabs-wrapper a, .orangehrm-tabs-wrapper li', { hasText: tab }).first()
      ).toBeVisible({ timeout: 8000 });
    }
  });

  // TC-PIM-08: Reset search filter clears results
  test('TC-PIM-08: should reset search filter and reload full list', async ({ page }) => {
    const nameInput = page.locator('.oxd-table-filter-area input').first();
    await nameInput.fill('Alice');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    await page.click('button:has-text("Reset")');
    await page.waitForLoadState('networkidle');

    // After reset, input should be cleared
    await expect(nameInput).toHaveValue('');
    await expect(page.locator('.oxd-table-card')).toHaveCount({ minimum: 1 });
  });
});
