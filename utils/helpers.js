// utils/helpers.js
// Reusable helper functions for common UI interactions in OrangeHRM

/**
 * Logs in to OrangeHRM with given credentials.
 * @param {import('@playwright/test').Page} page
 * @param {string} username
 * @param {string} password
 */
async function login(page, username = 'Admin', password = 'admin123') {
  await page.goto('/web/index.php/auth/login');
  await page.waitForSelector('input[name="username"]', { timeout: 15000 });
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard/**', { timeout: 20000 });
}

/**
 * Navigates to a sidebar menu item by its label text.
 * @param {import('@playwright/test').Page} page
 * @param {string} menuLabel  e.g. 'PIM', 'Leave', 'Admin'
 */
async function navigateToMenu(page, menuLabel) {
  const menuItem = page.locator('.oxd-main-menu-item span', { hasText: menuLabel });
  await menuItem.waitFor({ state: 'visible', timeout: 10000 });
  await menuItem.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Selects a value from an OrangeHRM dropdown (custom oxd-select component).
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} container  — the wrapper div
 * @param {string} optionText
 */
async function selectDropdownOption(page, container, optionText) {
  await container.click();
  const option = page
    .locator('.oxd-select-dropdown .oxd-select-option span', { hasText: optionText })
    .first();
  await option.waitFor({ state: 'visible', timeout: 8000 });
  await option.click();
}

/**
 * Fills a date input field (OrangeHRM uses text inputs for dates).
 * @param {import('@playwright/test').Locator} inputLocator
 * @param {string} dateStr  e.g. '2025-12-01'
 */
async function fillDateInput(inputLocator, dateStr) {
  // OrangeHRM date fields are plain text inputs formatted as MM/DD/YYYY
  const [year, month, day] = dateStr.split('-');
  const formatted = `${month}/${day}/${year}`;
  await inputLocator.clear();
  await inputLocator.type(formatted, { delay: 50 });
}

/**
 * Waits for a toast/success message to appear and disappear.
 * @param {import('@playwright/test').Page} page
 * @param {string} [text]  Optional text to assert in the toast
 */
async function waitForToast(page, text) {
  const toast = page.locator('.oxd-toast');
  await toast.waitFor({ state: 'visible', timeout: 15000 });
  if (text) {
    await toast.locator(`text=${text}`).waitFor({ timeout: 10000 });
  }
  return toast;
}

/**
 * Searches the employee list table using the search/filter bar.
 * @param {import('@playwright/test').Page} page
 * @param {string} name
 */
async function searchEmployeeByName(page, name) {
  const nameInput = page
    .locator('.oxd-table-filter-area input[placeholder*="Type"]')
    .first();
  await nameInput.fill(name);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

module.exports = {
  login,
  navigateToMenu,
  selectDropdownOption,
  fillDateInput,
  waitForToast,
  searchEmployeeByName,
};
