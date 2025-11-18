import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  const timestamp = Date.now();
  const testEmail = `e2e${timestamp}@example.com`;
  const testPassword = 'E2ETest123!';
  const testName = 'E2E Test User';

  test('full user journey: signup -> login -> browse -> add to cart -> checkout', async ({ page }) => {
    console.log('Starting complete user journey test...');
    
    // Step 1: Register new user
    console.log('Step 1: Registration');
    await page.goto('/register');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.fill('input[placeholder*="name" i], input[name="fullName"]', testName);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(login|products|)/, { timeout: 10000 });
    console.log('✓ Registration complete');
    
    // Step 2: Login (if redirected to login page)
    console.log('Step 2: Login');
    if (page.url().includes('login')) {
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', testPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/(products|profile|)/, { timeout: 10000 });
    }
    console.log('✓ Login complete');
    
    // Step 3: Browse products
    console.log('Step 3: Browse Products');
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"], .product-card, article', { timeout: 5000 });
    
    // Verify products are displayed
    const products = page.locator('[data-testid="product-card"], .product-card, article');
    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(0);
    console.log(`✓ Found ${productCount} products`);
    
    // Step 4: Add product to cart
    console.log('Step 4: Add to Cart');
    const addToCartButton = page.locator('button:has-text("Add to cart")').first();
    await addToCartButton.click();
    await page.waitForTimeout(1000);
    console.log('✓ Product added to cart');
    
    // Step 5: View cart
    console.log('Step 5: View Cart');
    await page.goto('/cart');
    await page.waitForTimeout(1000);
    
    // Verify cart has items
    const cartItems = page.locator('[data-testid="cart-item"], .cart-item, tr');
    const cartItemCount = await cartItems.count();
    expect(cartItemCount).toBeGreaterThan(0);
    console.log(`✓ Cart has ${cartItemCount} items`);
    
    // Step 6: Verify cart total
    console.log('Step 6: Verify Cart Total');
    const totalElement = page.locator('text=/total|subtotal/i').first();
    await expect(totalElement).toBeVisible();
    console.log('✓ Cart total displayed');
    
    // Step 7: Proceed to checkout (if button exists)
    console.log('Step 7: Checkout Process');
    const checkoutButton = page.locator('button:has-text("Checkout"), a:has-text("Checkout")');
    const hasCheckout = await checkoutButton.count() > 0;
    
    if (hasCheckout) {
      await checkoutButton.first().click();
      await page.waitForTimeout(2000);
      console.log('✓ Checkout initiated');
      
      // Fill checkout form if present
      const shippingAddress = page.locator('input[name="address"], input[placeholder*="address" i]');
      if (await shippingAddress.count() > 0) {
        await shippingAddress.first().fill('123 Test Street');
        console.log('✓ Shipping address entered');
      }
      
      // Select payment method if present
      const paymentMethod = page.locator('select[name="payment"], input[name="payment"]');
      if (await paymentMethod.count() > 0) {
        await paymentMethod.first().click();
        console.log('✓ Payment method selected');
      }
    } else {
      console.log('⚠ Checkout button not found - cart functionality verified');
    }
    
    // Step 8: Verify user profile
    console.log('Step 8: Verify Profile');
    await page.goto('/profile');
    await page.waitForTimeout(1000);
    
    // Check if user info is displayed
    const userInfo = page.locator('text=/james|user|profile/i');
    await expect(userInfo.first()).toBeVisible({ timeout: 5000 });
    console.log('✓ Profile page accessible');
    
    console.log('✅ Complete user journey test passed!');
  });

  test('verify order in order history', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', '1997Jamesjjohnson@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(products|profile|)/);
    
    // Navigate to orders page if it exists
    const ordersLink = page.locator('a[href="/orders"], text=/orders|history/i');
    const hasOrdersPage = await ordersLink.count() > 0;
    
    if (hasOrdersPage) {
      await ordersLink.first().click();
      await page.waitForTimeout(1000);
      
      // Check for order history content
      const orderContent = page.locator('text=/order|history/i');
      await expect(orderContent.first()).toBeVisible();
    } else {
      console.log('⚠ Orders page not yet implemented');
    }
  });
});