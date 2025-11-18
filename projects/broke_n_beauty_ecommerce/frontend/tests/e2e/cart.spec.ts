import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  // Login before cart tests
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', '1997Jamesjjohnson@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(products|profile|)/);
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for products to load
    await page.waitForSelector('button:has-text("Add to cart")', { timeout: 5000 });
    
    // Click first "Add to Cart" button
    await page.locator('button:has-text("Add to cart")').first().click();
    
    // Wait for cart to update
    await page.waitForTimeout(1000);
    
    // Navigate to cart
    await page.goto('/cart');
    
    // Verify cart has items
    const cartItems = page.locator('[data-testid="cart-item"], .cart-item, tr');
    await expect(cartItems.first()).toBeVisible({ timeout: 5000 });
  });

  test('should update cart quantity', async ({ page }) => {
    await page.goto('/products');
    
    // Add item to cart
    await page.locator('button:has-text("Add to cart")').first().click();
    await page.waitForTimeout(1000);
    
    // Go to cart
    await page.goto('/cart');
    
    // Find quantity input or buttons
    const quantityInput = page.locator('input[type="number"], input[data-testid="quantity"]').first();
    
    if (await quantityInput.isVisible()) {
      await quantityInput.fill('2');
      await page.waitForTimeout(500);
      
      // Verify quantity updated
      const value = await quantityInput.inputValue();
      expect(value).toBe('2');
    }
  });

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/products');
    
    // Add item to cart
    await page.locator('button:has-text("Add to cart")').first().click();
    await page.waitForTimeout(1000);
    
    // Go to cart
    await page.goto('/cart');
    
    // Count initial items
    const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
    const initialCount = await cartItems.count();
    
    // Click remove button
    const removeButton = page.locator('button:has-text("Remove"), button[data-testid="remove"]').first();
    await removeButton.click();
    await page.waitForTimeout(500);
    
    // Verify item count decreased
    const newCount = await cartItems.count();
    expect(newCount).toBeLessThan(initialCount);
  });

  test('should display cart total', async ({ page }) => {
    await page.goto('/products');
    
    // Add item to cart
    await page.locator('button:has-text("Add to cart")').first().click();
    await page.waitForTimeout(1000);
    
    // Go to cart
    await page.goto('/cart');
    
    // Check for total/subtotal
    const total = page.locator('text=/total|subtotal/i');
    await expect(total.first()).toBeVisible();
    
    // Check for price
    const price = page.locator('text=/\\$[0-9]+/');
    await expect(price.first()).toBeVisible();
  });

  test('should show empty cart message', async ({ page }) => {
    await page.goto('/cart');
    
    // Remove all items if any exist
    const removeButtons = page.locator('button:has-text("Remove"), button[data-testid="remove"]');
    const count = await removeButtons.count();
    
    for (let i = 0; i < count; i++) {
      await removeButtons.first().click();
      await page.waitForTimeout(500);
    }
    
    // Should show empty cart message
    const emptyMessage = page.locator('text=/empty|no items/i');
    await expect(emptyMessage.first()).toBeVisible({ timeout: 5000 });
  });
});