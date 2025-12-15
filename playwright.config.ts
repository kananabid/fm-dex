import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for FM-DEX
 * E2E and API testing configuration
 */
export default defineConfig({
  testDir: './tests',
  
  // Maximum time one test can run
  timeout: 30 * 1000,
  
  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for the application
    baseURL: 'http://localhost:3000',
    
    // API base URL
    apiURL: 'http://localhost:3002',
    
    // Capture screenshot on failure
    screenshot: 'only-on-failure',
    
    // Capture video on failure
    video: 'retain-on-failure',
    
    // Trace on first retry
    trace: 'on-first-retry',
    
    // Collect browser console logs
    contextOptions: {
      recordVideo: {
        dir: './test-results/videos',
        size: { width: 1280, height: 720 }
      }
    }
  },

  // Web Server configuration (auto-start before tests)
  webServer: [
    {
      command: 'npm run client',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      stdout: 'ignore',
      stderr: 'pipe'
    },
    // Note: Backend server commented out due to port mismatch issue
    // Uncomment after fixing server.js port configuration
    // {
    //   command: 'npm run server',
    //   url: 'http://localhost:3002',
    //   reuseExistingServer: !process.env.CI,
    //   timeout: 120 * 1000,
    // }
  ],

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Enable Web3 wallet testing (requires extension)
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
          ]
        }
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // API testing project (no browser)
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: 'http://localhost:3002',
      }
    }
  ],

  // Global test setup/teardown
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),
});
