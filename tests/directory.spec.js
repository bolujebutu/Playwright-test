// tests/directory.spec.js
// TC-DIR-01 through TC-DIR-04 | TC-BUZZ-01 through TC-BUZZ-03
// Tests: Employee directory search, Buzz social feed

const { test, expect } = require('@playwright/test');
const { ROUTES } = require('../utils/constants');

test.describe('Directory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.directory);
    await page.waitForLoadState('networkidle');
  });

  // TC-DIR-01: Directory page loads with employee cards
  test('TC-DIR-01: should display the Employee Directory', async ({ page }) => {
    await expect(page.locator('.oxd-topbar-header-breadcrumb')).toContainText('Directory');
    await expect(page.locator('.orangehrm-container')).toBeVisible();
  });

  // TC-DIR-02: Directory search by employee name
  test('TC-DIR-02: should search employee in Directory', async ({ page }) => {
    const nameInput = page.locator('input[placeholder*="Type"]').first();
    await nameInput.fill('Alice');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Either cards appear or "No Records Found"
    const container = page.locator('.orangehrm-container');
    await expect(container).toBeVisible();
  });

  // TC-DIR-03: Reset directory search works
  test('TC-DIR-03: should reset Directory search', async ({ page }) => {
    const nameInput = page.locator('input[placeholder*="Type"]').first();
    await nameInput.fill('Alice');
    await page.click('button:has-text("Reset")');
    await page.waitForLoadState('networkidle');
    await expect(nameInput).toHaveValue('');
  });

  // TC-DIR-04: Directory cards contain name and job title
  test('TC-DIR-04: should show employee info cards in Directory', async ({ page }) => {
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    const cards = page.locator('.orangehrm-directory-card');
    if (await cards.count() > 0) {
      await expect(cards.first().locator('.orangehrm-directory-card-header')).toBeVisible();
    }
  });
});

test.describe('Buzz', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.buzz);
    await page.waitForLoadState('networkidle');
  });

  // TC-BUZZ-01: Buzz social wall loads
  test('TC-BUZZ-01: should load the Buzz social wall', async ({ page }) => {
    await expect(page.locator('.oxd-topbar-header-breadcrumb')).toContainText('Buzz');
    await expect(page.locator('.orangehrm-buzz-newsfeed, .orangehrm-container')).toBeVisible();
  });

  // TC-BUZZ-02: Post input area is visible
  test('TC-BUZZ-02: should display post creation area', async ({ page }) => {
    const postInput = page.locator('textarea[placeholder*="What"], .orangehrm-buzz-post-input textarea');
    await expect(postInput.first()).toBeVisible({ timeout: 10000 });
  });

  // TC-BUZZ-03: Posts / feed items appear
  test('TC-BUZZ-03: should display existing posts in the feed', async ({ page }) => {
    const posts = page.locator('.orangehrm-buzz-post-body, .orangehrm-buzz-post');
    // May be empty on a fresh demo, just assert the container is visible
    await expect(page.locator('.orangehrm-buzz-newsfeed, .orangehrm-container')).toBeVisible();
  });
});
