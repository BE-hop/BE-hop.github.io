import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './test/browser',
  outputDir: './test-results',
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['json', {outputFile:'test-results/results.json'}]],
  use: {
    baseURL: process.env.BEHOP_TEST_BASE_URL || 'http://127.0.0.1:4017',
    headless: true,
    viewport: {width:390, height:844},
    deviceScaleFactor: 2,
    trace: 'retain-on-failure',
    launchOptions: process.env.CI ? {} : {channel:'chrome'},
  },
  webServer: process.env.BEHOP_TEST_BASE_URL ? undefined : {
    command: 'python3 scripts/preview-server.py --port 4017 --test-fixtures',
    url: 'http://127.0.0.1:4017/',
    reuseExistingServer: !process.env.CI,
  },
});
