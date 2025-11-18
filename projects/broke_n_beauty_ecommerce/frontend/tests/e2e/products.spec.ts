import { test, expect } from '@playwright/test';

test.describe('Products', () => {
  test('should load products page', async ({ page }) => {
    await page.goto('/products');
    
    // Check page title
    await expect(page.locator('h1')).toContainText(/products|shop/i);
    
    // Should display products
    const products = page.locator('[data-testid="product-card"], .product-card, article');
    await expect(products.first()).toBeVisible({ timeout: 5000 });
    
    // Should have multiple products
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display product details', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"], .product-card, article', { timeout: 5000 });
    
    // Check for product information
    const productName = page.locator('text=/BnB|Sport Bra|Leggings|Scrub/i').first();
    await expect(productName).toBeVisible();
    
    const productPrice = page.locator('text=/\\$[0-9]+/').first();
    await expect(productPrice).toBeVisible();
  });

  test('should load product images', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for images to load
    await page.waitForSelector('img[src*="images"], img[alt]', { timeout: 5000 });
    
    const images = page.locator('img[src*="images"], img[alt]');
    const firstImage = images.first();
    
    // Check image is visible
    await expect(firstImage).toBeVisible();
    
    // Check image has loaded successfully
    const isLoaded = await firstImage.evaluate((img: HTMLImageElement) => img.complete);
    expect(isLoaded).toBeTruthy();
  });

  test('should navigate from home to products', async ({ page }) => {
    await page.goto('/');
    
    // Find and click products link
    const productsLink = page.locator('a[href="/products"], text=/shop|products/i');
    await productsLink.first().click();
    
    // Should be on products page
    await page.waitForURL('/products');
    expect(page.url()).toContain('/products');
  });

  test('should show add to cart buttons', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"], .product-card, article', { timeout: 5000 });
    
    // Check for "Add to Cart" buttons
    const addToCartButtons = page.locator('button:has-text("Add to cart"), button:has-text("Add to Cart")');
    const count = await addToCartButtons.count();
    
    expect(count).toBeGreaterThan(0);
  });
});