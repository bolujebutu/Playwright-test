const { defineConfig, devices } = require('@playwright/test');

const BASE_URL = 'https://opensource-demo.orangehrmlive.com';
const AUTH_FILE = 'playwright/.auth/admin.json';

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  timeout: 60000,
  expect: { timeout: 15000 },

  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
    viewport: { width: 1280, height: 720 },
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },

  projects: [
    {
      name: 'setup',
      testMatch: '**/auth.setup.js',
      use: { baseURL: BASE_URL, headless: true },
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BASE_URL,
        storageState: AUTH_FILE,
      },
      dependencies: ['setup'],
      testIgnore: ['**/auth.setup.js'],
    },
  ],

  outputDir: 'test-results/',
});