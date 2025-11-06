-- Seed data for Broken Beauty E-commerce Database

-- Insert users
INSERT INTO users (email, hashed_password, full_name) VALUES
('alice@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG', 'Alice Johnson'),
('bob@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG', 'Bob Smith'),
('charlie@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG', 'Charlie Brown'),
('diana@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG', 'Diana Wilson'),
('eve@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG', 'Eve Davis');

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Sports Bras', 'Supportive and comfortable sports bras for active lifestyles'),
('Biker Shorts', 'High-waisted shorts perfect for workouts and casual wear'),
('Scrubs', 'Professional medical and healthcare apparel'),
('Leggings', 'Compression and yoga leggings for various activities'),
('Tank Tops', 'Breathable tank tops for yoga and casual wear'),
('Activewear', 'General athletic and fitness clothing');

-- Insert products
INSERT INTO products (name, description, sku, price, image_url) VALUES
('BnB Sport Bra – Black', 'Comfortable sports bra with excellent support for all-day wear', 'BNB-SB-BLK', 13.99, 'https://i.ibb.co/example/black-outfit.jpg'),
('BnB Biker Short – Grey', 'High-waisted biker shorts perfect for workouts and casual wear', 'BNB-BS-GRY', 9.99, 'https://i.ibb.co/example/grey-fit.jpg'),
('BnB Unisex Scrub Top', 'Professional scrub top suitable for healthcare workers', 'BNB-ST-UNI', 15.00, 'https://i.ibb.co/example/grey-scrubs.jpg'),
('BnB Unisex Scrub Pants', 'Professional scrub pants suitable for healthcare workers', 'BNB-SP-UNI', 17.00, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=800&auto=format&fit=crop'),
('BnB Compression Leggings', 'Moisture-wicking compression leggings for intense workouts', 'BNB-CL-BLK', 24.99, 'https://images.unsplash.com/photo-1506629905607-0b5ab9a9e21a?q=80&w=800&auto=format&fit=crop'),
('BnB Yoga Tank Top', 'Breathable tank top designed for yoga and pilates', 'BNB-YT-GRY', 15.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop');

-- Insert product-category relationships
INSERT INTO product_categories (product_id, category_id) VALUES
(1, 1), -- Sport Bra -> Sports Bras
(1, 6), -- Sport Bra -> Activewear
(2, 2), -- Biker Short -> Biker Shorts
(2, 6), -- Biker Short -> Activewear
(3, 3), -- Scrub Top -> Scrubs
(4, 3), -- Scrub Pants -> Scrubs
(5, 4), -- Compression Leggings -> Leggings
(5, 6), -- Compression Leggings -> Activewear
(6, 5), -- Yoga Tank Top -> Tank Tops
(6, 6); -- Yoga Tank Top -> Activewear

-- Insert product variants
INSERT INTO product_variants (product_id, size, color, stock) VALUES
(1, 'S', 'Black', 50),
(1, 'M', 'Black', 45),
(1, 'L', 'Black', 40),
(2, 'XS', 'Navy', 30),
(2, 'S', 'Navy', 35),
(2, 'M', 'Navy', 40),
(3, 'M', 'Blue', 25),
(3, 'L', 'Blue', 30),
(3, 'XL', 'Blue', 20),
(4, 'M', 'Blue', 25),
(4, 'L', 'Blue', 30),
(4, 'XL', 'Blue', 20),
(5, 'S', 'Black', 60),
(5, 'M', 'Black', 55),
(5, 'L', 'Black', 50),
(6, 'XS', 'Gray', 40),
(6, 'S', 'Gray', 45),
(6, 'M', 'Gray', 50);

-- Insert carts
INSERT INTO carts (user_id, status) VALUES
(1, 'open'),
(2, 'open'),
(3, 'ordered'),
(4, 'abandoned'),
(5, 'open');

-- Insert cart items
INSERT INTO cart_items (cart_id, product_variant_id, quantity) VALUES
(1, 1, 2),
(1, 4, 1),
(2, 7, 1),
(2, 13, 3),
(3, 16, 2),
(4, 2, 1),
(5, 5, 1);

-- Insert orders
INSERT INTO orders (user_id, cart_id, order_number, status, total_amount, shipping_address, payment_method) VALUES
(3, 3, 'ORD-001', 'completed', 47.98, '123 Main St, Anytown, USA', 'credit_card'),
(4, 4, 'ORD-002', 'pending', 11.99, '456 Oak Ave, Somewhere, USA', 'paypal'),
(1, 1, 'ORD-003', 'shipped', 33.97, '789 Pine Rd, Elsewhere, USA', 'credit_card'),
(2, 2, 'ORD-004', 'paid', 93.97, '321 Elm St, Nowhere, USA', 'debit_card'),
(5, 5, 'ORD-005', 'pending', 9.99, '654 Maple Dr, Anywhere, USA', 'credit_card');

-- Insert order items
INSERT INTO order_items (order_id, product_variant_id, quantity, price_at_purchase) VALUES
(1, 16, 2, 15.99),
(2, 2, 1, 13.99),
(3, 1, 2, 13.99),
(3, 4, 1, 9.99),
(4, 7, 1, 15.00),
(4, 13, 3, 24.99),
(5, 5, 1, 9.99);