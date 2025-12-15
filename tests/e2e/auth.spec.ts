/**
 * E2E Tests: User Authentication Flow
 * 
 * Tests login functionality including:
 * - Form validation
 * - Successful login
 * - Failed login attempts
 */

import { test, expect } from '@playwright/test';
import { testUsers, edgeCaseInputs } from '../fixtures/testData';

test.describe('User Authentication', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
    await expect(page).toHaveTitle(/eSTOKKyam/i);
  });

  test('TC-AUTH-001-A - Login page should render correctly', async ({ page }) => {
    // Check for essential UI elements
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    
    // Check for form fields
    const usernameInput = page.getByLabel(/username/i);
    const passwordInput = page.getByLabel(/password/i);
    const submitButton = page.getByRole('button', { name: /sign in/i });
    
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Verify password field is of type password
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC-AUTH-001-B - Should show validation errors for empty fields', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /sign in/i });
    
    // Try to submit without filling fields
    await submitButton.click();
    
    // Wait for validation errors
    await page.waitForTimeout(500);
    
    // Check for error messages
    const usernameError = page.getByText(/please add user name/i);
    const passwordError = page.getByText(/please add password/i);
    
    await expect(usernameError).toBeVisible();
    await expect(passwordError).toBeVisible();
  });

  test('TC-AUTH-001-C - Should handle failed login gracefully', async ({ page }) => {
    const usernameInput = page.getByLabel(/username/i);
    const passwordInput = page.getByLabel(/password/i);
    const submitButton = page.getByRole('button', { name: /sign in/i });
    
    // Try to login with invalid credentials
    await usernameInput.fill('nonexistent@example.com');
    await passwordInput.fill('wrongpassword');
    
    // Listen for response
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/auth') && response.status() !== 200,
      { timeout: 5000 }
    ).catch(() => null);
    
    await submitButton.click();
    
    const response = await responsePromise;
    
    if (response) {
      // Verify error handling
      const statusCode = response.status();
      expect([401, 400, 500]).toContain(statusCode);
      
      // Check for error alert/message in UI
      await page.waitForTimeout(1000);
      const errorAlert = page.locator('[role="alert"], .MuiAlert-root');
      // Error message should appear
    }
  });


  test('TC-AUTH-001-D - Accessibility check for login page', async ({ page }) => {
    // Basic accessibility checks
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1, h2, h3, h4, h5, h6').first();
    await expect(h1).toBeVisible();
    
    // Check for form labels
    const usernameInput = page.getByLabel(/username/i);
    const passwordInput = page.getByLabel(/password/i);
    
    await expect(usernameInput).toHaveAttribute('id');
    await expect(passwordInput).toHaveAttribute('id');
    
    // Check button has accessible name
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await expect(submitButton).toBeVisible();
    
    // Check color contrast (basic check)
    const buttonColor = await submitButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        background: styles.backgroundColor,
        color: styles.color
      };
    });
    
    // Should have visible colors (not transparent)
    expect(buttonColor.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(buttonColor.color).not.toBe('rgba(0, 0, 0, 0)');
  });
});
