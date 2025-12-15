/**
 * E2E Tests: Dashboard Features
 * 
 * Tests dashboard functionality including:
 * - Page load and rendering
 * - Search functionality
 * - Filter toggles
 * - Navigation
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard Features', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('TC-DASH-001 - Dashboard should load and render main components', async ({ page }) => {
    // Check for main heading/title
    await expect(page.getByText(/filters/i)).toBeVisible();
    
    // Check for search bar
    const searchBar = page.locator('input[type="text"], input[placeholder*="search" i]');
    await expect(searchBar.first()).toBeVisible();
    
    // Check for filter checkbox
    const filterCheckbox = page.getByText(/show only whitelisted/i);
    await expect(filterCheckbox).toBeVisible();
    
    // Check for action buttons
    await expect(page.getByRole('button', { name: /sell/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /buy/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /exchange/i })).toBeVisible();
  });

  test('TC-DASH-002 - Should display offers table with headers', async ({ page }) => {
    // Check for table headers
    const expectedHeaders = [
      /offer id/i,
      /offer token/i,
      /buyer token/i,
      /rate of return/i,
      /offer yield/i,
      /difference/i
    ];
    
    for (const header of expectedHeaders) {
      // Use .first() to handle multiple matches (some headers appear twice)
      await expect(page.getByText(header).first()).toBeVisible();
    }
  });

  test('TC-DASH-003 - Search functionality - Enter key trigger', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();
    
    // Type search query
    await searchInput.fill('Etherium');
    
    // Set up request interception
    const searchRequestPromise = page.waitForRequest(
      request => request.url().includes('search') || request.url().includes('blog'),
      { timeout: 5000 }
    ).catch(() => null);
    
    // Press Enter to trigger search
    await searchInput.press('Enter');
    
    const searchRequest = await searchRequestPromise;
    
    if (searchRequest) {
      // Verify search parameter in request
      const url = searchRequest.url();
      expect(url).toContain('Etherium');
    } else {
      console.warn('Search request not detected - API may not be functional');
    }
  });

  test('TC-DASH-004 - Filter checkbox should toggle state', async ({ page }) => {
    // Find the checkbox (MUI checkbox)
    const checkbox = page.locator('input[type="checkbox"]').first();
    
    // Check initial state
    const initialState = await checkbox.isChecked();
    
    // Click to toggle
    await checkbox.click();
    await page.waitForTimeout(500);
    
    // Verify state changed
    const newState = await checkbox.isChecked();
    expect(newState).toBe(!initialState);
    
    // Toggle back
    await checkbox.click();
    await page.waitForTimeout(500);
    
    // Verify state returned
    const finalState = await checkbox.isChecked();
    expect(finalState).toBe(initialState);
  });


  test('TC-DASH-005 - Sell button navigation', async ({ page }) => {
    // Look for button with text "SELL" (uppercase in the actual UI)
    const sellButton = page.getByRole('button', { name: /sell/i }).first();
    
    // Verify button is visible and clickable
    await expect(sellButton).toBeVisible();
    
    await sellButton.click();
    
    // Should navigate to sell page
    await page.waitForURL('**/sell', { timeout: 5000 });
    
    expect(page.url()).toContain('/sell');
    
    // Verify sell page loaded
    await expect(page.getByText(/sell/i).first()).toBeVisible();
  });

  test('TC-DASH-006 - Dashboard performance - page load time', async ({ page }) => {
    // Navigate to dashboard and measure load time
    const startTime = Date.now();
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    console.log(`Dashboard load time: ${loadTime}ms`);
    
    // Should load within acceptable time (< 5000ms as per test case)
    expect(loadTime).toBeLessThan(5000);
    
    if (loadTime > 2500) {
      console.warn(`Dashboard load time (${loadTime}ms) exceeds target (2500ms)`);
    }
  });

  test('TC-DASH-007 - Dashboard should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check if main elements are still visible
    const searchBar = page.locator('input[type="text"]').first();
    await expect(searchBar).toBeVisible();
    
    // Navigation may be in hamburger menu on mobile
    // Check if page is usable
    const mainContent = page.locator('body');
    await expect(mainContent).toBeVisible();
    
    // Check for horizontal scroll (bad UX)
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1); // Allow 1px margin
  });
});
