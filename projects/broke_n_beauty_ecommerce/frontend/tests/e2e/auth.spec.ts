import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  const timestamp = Date.now();
  const testEmail = `test${timestamp}@example.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';

  test('should register new user', async ({ page }) => {
    await page.goto('/register');
    
    // Fill registration form
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.fill('input[placeholder*="name" i], input[name="fullName"]', testName);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to login or home page
    await page.waitForURL(/\/(login|products|)/);
    
    // Verify success (could be a success message or redirect)
    const url = page.url();
    expect(url).toMatch(/\/(login|products|)/);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Use existing test account
    await page.fill('input[type="email"]', '1997Jamesjjohnson@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit login
    await page.click('button[type="submit"]');
    
    // Wait for redirect after successful login
    await page.waitForURL(/\/(products|profile|)/);
    
    // Verify user is logged in by checking for profile link or user info
    const profileLink = page.locator('a[href="/profile"], text=/profile/i');
    await expect(profileLink.first()).toBeVisible({ timeout: 5000 });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit login
    await page.click('button[type="submit"]');
    
    // Should stay on login page and show error
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toContain('login');
    
    // Look for error message
    const errorMessage = page.locator('text=/invalid|error|incorrect/i');
    await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
  });

  test('should logout user', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[type="email"]', '1997Jamesjjohnson@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for successful login
    await page.waitForURL(/\/(products|profile|)/);
    
    // Find and click logout button
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")');
    await logoutButton.first().click();
    
    // Should redirect to home or login page
    await page.waitForURL(/\/(login|)/);
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/register');
    
    // Try to submit without filling fields
    await page.click('button[type="submit"]');
    
    // Should still be on register page
    await page.waitForTimeout(500);
    expect(page.url()).toContain('register');
    
    // HTML5 validation should prevent submission
    // Check if email field has validation
    const emailInput = page.locator('input[type="email"]');
    const isRequired = await emailInput.getAttribute('required');
    expect(isRequired).not.toBeNull();
  });
});