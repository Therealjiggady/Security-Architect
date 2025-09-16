-- Seed data for Broke N Beauty E-commerce Database

-- Insert users
INSERT INTO users (email, hashed_password, full_name) VALUES
('alice@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG', 'Alice Johnson'),
('bob@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG', 'Bob Smith'),
('charlie@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG', 'Charlie Brown'),
('diana@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG', 'Diana Wilson'),
('eve@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG', 'Eve Davis');

-- Insert products
INSERT INTO products (name, description, sku, price) VALUES
('BnB Sport Bra – Black', 'Comfortable sports bra with excellent support for all-day wear', 'BNB-SB-BLK', 11.99),
('BnB Biker Short – Navy', 'High-waisted biker shorts perfect for workouts and casual wear', 'BNB-BS-NVY', 9.99),
('BnB Unisex Scrub Top', 'Professional scrub top suitable for healthcare workers', 'BNB-ST-UNI', 33.99),
('BnB Compression Leggings', 'Moisture-wicking compression leggings for intense workouts', 'BNB-CL-BLK', 24.99),
('BnB Yoga Tank Top', 'Breathable tank top designed for yoga and pilates', 'BNB-YT-GRY', 15.99);

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
(4, 'S', 'Black', 60),
(4, 'M', 'Black', 55),
(4, 'L', 'Black', 50),
(5, 'XS', 'Gray', 40),
(5, 'S', 'Gray', 45),
(5, 'M', 'Gray', 50);

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
(2, 10, 3),
(3, 13, 2),
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
(1, 13, 2, 15.99),
(2, 2, 1, 11.99),
(3, 1, 2, 11.99),
(3, 4, 1, 9.99),
(4, 7, 1, 33.99),
(4, 10, 3, 24.99),
(5, 5, 1, 9.99);