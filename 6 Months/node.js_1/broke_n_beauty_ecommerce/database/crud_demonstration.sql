-- CRUD Operations Demonstration for Broke N Beauty Ecommerce Database
-- This file demonstrates SELECT, UPDATE, and DELETE operations as required

-- =========================================
-- SELECT OPERATIONS DEMONSTRATION
-- =========================================

-- 1. SELECT: Get all users
SELECT '=== SELECT: All Users ===' as operation;
SELECT id, email, full_name, created_at FROM users;

-- 2. SELECT: Get products with JOIN to categories (demonstrates relationship)
SELECT '=== SELECT: Products with Categories (JOIN) ===' as operation;
SELECT
    p.id,
    p.name,
    p.price,
    p.sku,
    GROUP_CONCAT(c.name) as categories
FROM products p
LEFT JOIN product_categories pc ON p.id = pc.product_id
LEFT JOIN categories c ON pc.category_id = c.id
GROUP BY p.id, p.name, p.price, p.sku;

-- 3. SELECT: Get user's cart with product details
SELECT '=== SELECT: User Cart with Product Details ===' as operation;
SELECT
    u.email,
    u.full_name,
    c.status as cart_status,
    p.name as product_name,
    p.price,
    pv.size,
    pv.color,
    ci.quantity,
    (ci.quantity * p.price) as line_total
FROM users u
JOIN carts c ON u.id = c.user_id
JOIN cart_items ci ON c.id = ci.cart_id
JOIN product_variants pv ON ci.product_variant_id = pv.id
JOIN products p ON pv.product_id = p.id
WHERE u.email = 'alice@example.com';

-- 4. SELECT: Get order history
SELECT '=== SELECT: Order History ===' as operation;
SELECT
    o.order_number,
    u.email,
    o.total_amount,
    o.status as order_status,
    o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;

-- =========================================
-- UPDATE OPERATIONS DEMONSTRATION
-- =========================================

-- 1. UPDATE: Change product price
SELECT '=== UPDATE: Before - Product Price ===' as operation;
SELECT name, price FROM products WHERE name = 'BnB Sport Bra – Black';

UPDATE products
SET price = 12.99
WHERE name = 'BnB Sport Bra – Black';

SELECT '=== UPDATE: After - Product Price ===' as operation;
SELECT name, price FROM products WHERE name = 'BnB Sport Bra – Black';

-- 2. UPDATE: Update user information
SELECT '=== UPDATE: Before - User Info ===' as operation;
SELECT full_name, email FROM users WHERE email = 'bob@example.com';

UPDATE users
SET full_name = 'Bob Smith Jr.'
WHERE email = 'bob@example.com';

SELECT '=== UPDATE: After - User Info ===' as operation;
SELECT full_name, email FROM users WHERE email = 'bob@example.com';

-- 3. UPDATE: Change cart status
SELECT '=== UPDATE: Before - Cart Status ===' as operation;
SELECT c.id, c.status, u.email FROM carts c JOIN users u ON c.user_id = u.id WHERE u.email = 'alice@example.com';

UPDATE carts
SET status = 'ordered'
WHERE user_id = (SELECT id FROM users WHERE email = 'alice@example.com');

SELECT '=== UPDATE: After - Cart Status ===' as operation;
SELECT c.id, c.status, u.email FROM carts c JOIN users u ON c.user_id = u.id WHERE u.email = 'alice@example.com';

-- =========================================
-- DELETE OPERATIONS DEMONSTRATION
-- =========================================

-- 1. DELETE: Remove a cart item
SELECT '=== DELETE: Before - Cart Items Count ===' as operation;
SELECT COUNT(*) as cart_items_count FROM cart_items;

-- Delete one cart item (we'll delete the first one found)
DELETE FROM cart_items
WHERE id = (SELECT MIN(id) FROM cart_items);

SELECT '=== DELETE: After - Cart Items Count ===' as operation;
SELECT COUNT(*) as cart_items_count FROM cart_items;

-- 2. DELETE: Remove a product variant (be careful with foreign keys)
SELECT '=== DELETE: Before - Product Variants Count ===' as operation;
SELECT COUNT(*) as variants_count FROM product_variants;

-- Delete a product variant that doesn't have cart items
DELETE FROM product_variants
WHERE id NOT IN (SELECT product_variant_id FROM cart_items)
AND id NOT IN (SELECT product_variant_id FROM order_items)
AND id = (SELECT MIN(id) FROM product_variants WHERE id NOT IN (SELECT product_variant_id FROM cart_items) AND id NOT IN (SELECT product_variant_id FROM order_items));

SELECT '=== DELETE: After - Product Variants Count ===' as operation;
SELECT COUNT(*) as variants_count FROM product_variants;

-- =========================================
-- SUMMARY OF CRUD OPERATIONS PERFORMED
-- =========================================

SELECT '=== DATABASE SUMMARY ===' as operation;
SELECT
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM products) as total_products,
    (SELECT COUNT(*) FROM categories) as total_categories,
    (SELECT COUNT(*) FROM product_categories) as total_product_categories,
    (SELECT COUNT(*) FROM carts) as total_carts,
    (SELECT COUNT(*) FROM cart_items) as total_cart_items,
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT COUNT(*) FROM order_items) as total_order_items;

-- Show final state of key tables
SELECT '=== FINAL STATE: Users ===' as operation;
SELECT id, email, full_name FROM users;

SELECT '=== FINAL STATE: Products ===' as operation;
SELECT id, name, price FROM products;

SELECT '=== FINAL STATE: Categories ===' as operation;
SELECT id, name FROM categories;

-- =========================================
-- VERIFICATION QUERIES
-- =========================================

-- Verify data integrity after operations
SELECT '=== DATA INTEGRITY CHECK ===' as operation;

-- Check for orphaned records
SELECT 'Cart items without valid carts:' as check_type, COUNT(*) as count
FROM cart_items ci
LEFT JOIN carts c ON ci.cart_id = c.id
WHERE c.id IS NULL

UNION ALL

SELECT 'Product variants without valid products:' as check_type, COUNT(*) as count
FROM product_variants pv
LEFT JOIN products p ON pv.product_id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 'Orders without valid users:' as check_type, COUNT(*) as count
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
WHERE u.id IS NULL;

-- =========================================
-- END OF CRUD DEMONSTRATION
-- =========================================

/*
SUMMARY OF CRUD OPERATIONS DEMONSTRATED:

SELECT Operations:
1. Retrieved all users
2. Performed JOIN query between products and categories
3. Retrieved user's cart with product details
4. Retrieved order history

UPDATE Operations:
1. Updated product price
2. Updated user information
3. Updated cart status

DELETE Operations:
1. Removed a cart item
2. Removed a product variant (with safety checks)

All operations maintain data integrity and demonstrate proper SQL usage.
*/