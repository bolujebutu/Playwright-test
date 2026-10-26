const { test: setup } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const AUTH_FILE = path.join(__dirname, '../playwright/.auth/admin.json');

setup('authenticate as admin', async ({ page }) => {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('input[name="username"]', { timeout: 30000 });

  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard/**', { timeout: 30000 });

  await page.context().storageState({ path: AUTH_FILE });
  console.log('Session saved successfully');
});