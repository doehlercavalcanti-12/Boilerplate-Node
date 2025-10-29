import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
  reporter: [['list']],
  retries: process.env.CI ? 2 : 0
});
