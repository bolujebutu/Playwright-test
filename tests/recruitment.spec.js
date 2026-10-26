// tests/recruitment.spec.js
// TC-REC-01 through TC-REC-07
// Tests: Job vacancies, add vacancy, candidates list, add candidate, pipeline

const { test, expect } = require('@playwright/test');
const { ROUTES } = require('../utils/constants');

test.describe('Recruitment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.recruitment);
    await page.waitForLoadState('networkidle');
  });

  // TC-REC-01: Vacancies list loads
  test('TC-REC-01: should display Job Vacancies list', async ({ page }) => {
    await expect(page.locator('.oxd-topbar-header-breadcrumb')).toContainText('Recruitment');
    await expect(page.locator('.oxd-table, .orangehrm-container')).toBeVisible();
  });

  // TC-REC-02: Sub-navigation contains Vacancies and Candidates
  test('TC-REC-02: should show Recruitment sub-nav items', async ({ page }) => {
    await expect(page.locator('a:has-text("Vacancies")')).toBeVisible();
    await expect(page.locator('a:has-text("Candidates")')).toBeVisible();
  });

  // TC-REC-03: Add Job Vacancy form loads
  test('TC-REC-03: should open the Add Job Vacancy form', async ({ page }) => {
    await page.click('button:has-text("Add")');
    await page.waitForURL(/addJobVacancy/, { timeout: 15000 });
    await expect(page.locator('h6:has-text("Add Job Vacancy")')).toBeVisible();
    await expect(page.locator('input.oxd-input').first()).toBeVisible();
  });

  // TC-REC-04: Add Vacancy form validation on empty submit
  test('TC-REC-04: should validate required fields on Add Vacancy form', async ({ page }) => {
    await page.click('button:has-text("Add")');
    await page.waitForURL(/addJobVacancy/, { timeout: 15000 });
    await page.click('button[type="submit"]');

    const errors = page.locator('.oxd-input-field-error-message');
    await expect(errors.first()).toBeVisible({ timeout: 8000 });
  });

  // TC-REC-05: Candidates list page loads
  test('TC-REC-05: should display Candidates list', async ({ page }) => {
    await page.click('a:has-text("Candidates")');
    await page.waitForURL(/viewCandidates/, { timeout: 15000 });
    await expect(page.locator('.oxd-table-header, .orangehrm-container')).toBeVisible();
  });

  // TC-REC-06: Add Candidate form accessible from Candidates page
  test('TC-REC-06: should open Add Candidate form', async ({ page }) => {
    await page.click('a:has-text("Candidates")');
    await page.waitForURL(/viewCandidates/, { timeout: 15000 });
    await page.click('button:has-text("Add")');
    await page.waitForURL(/addCandidate/, { timeout: 15000 });
    await expect(page.locator('h6:has-text("Add Candidate")')).toBeVisible();
  });

  // TC-REC-07: Add Candidate form contains required fields
  test('TC-REC-07: should display required fields on Add Candidate form', async ({ page }) => {
    await page.click('a:has-text("Candidates")');
    await page.waitForURL(/viewCandidates/, { timeout: 15000 });
    await page.click('button:has-text("Add")');
    await page.waitForURL(/addCandidate/, { timeout: 15000 });

    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    // Vacancy dropdown
    await expect(page.locator('.oxd-select-wrapper').first()).toBeVisible();
  });
});
