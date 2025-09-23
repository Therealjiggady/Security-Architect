PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO users VALUES(1,'alice@example.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG','Alice Johnson Updated','2025-09-16 18:43:40');
INSERT INTO users VALUES(2,'bob@example.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG','Bob Smith','2025-09-16 18:43:40');
INSERT INTO users VALUES(3,'charlie@example.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG','Charlie Brown','2025-09-16 18:43:40');
INSERT INTO users VALUES(4,'diana@example.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG','Diana Wilson','2025-09-16 18:43:40');
INSERT INTO users VALUES(5,'eve@example.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fM9t8t8tG','Eve Davis','2025-09-16 18:43:40');
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(64) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO products VALUES(1,'BnB Sport Bra – Black','Comfortable sports bra with excellent support for all-day wear','BNB-SB-BLK',11.99000000000000021,'2025-09-16 18:43:40');
INSERT INTO products VALUES(2,'BnB Biker Short – Navy','High-waisted biker shorts perfect for workouts and casual wear','BNB-BS-NVY',9.99000000000000021,'2025-09-16 18:43:40');
INSERT INTO products VALUES(3,'BnB Unisex Scrub Top','Professional scrub top suitable for healthcare workers','BNB-ST-UNI',33.99000000000000198,'2025-09-16 18:43:40');
INSERT INTO products VALUES(4,'BnB Compression Leggings','Moisture-wicking compression leggings for intense workouts','BNB-CL-BLK',24.98999999999999844,'2025-09-16 18:43:40');
INSERT INTO products VALUES(5,'BnB Yoga Tank Top','Breathable tank top designed for yoga and pilates','BNB-YT-GRY',15.99000000000000021,'2025-09-16 18:43:40');
CREATE TABLE product_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    size VARCHAR(32) NOT NULL,
    color VARCHAR(64),
    stock INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id),
    UNIQUE(product_id, size, color)
);
INSERT INTO product_variants VALUES(1,1,'S','Black',50,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(2,1,'M','Black',45,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(3,1,'L','Black',40,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(4,2,'XS','Navy',30,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(5,2,'S','Navy',35,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(6,2,'M','Navy',40,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(7,3,'M','Blue',25,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(8,3,'L','Blue',30,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(9,3,'XL','Blue',20,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(10,4,'S','Black',60,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(11,4,'M','Black',55,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(12,4,'L','Black',50,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(13,5,'XS','Gray',40,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(14,5,'S','Gray',45,'2025-09-16 18:43:40','2025-09-16 18:43:40');
INSERT INTO product_variants VALUES(15,5,'M','Gray',50,'2025-09-16 18:43:40','2025-09-16 18:43:40');
CREATE TABLE carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    status VARCHAR(16) DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
INSERT INTO carts VALUES(1,1,'open','2025-09-16 18:43:41','2025-09-16 18:43:41');
INSERT INTO carts VALUES(2,2,'open','2025-09-16 18:43:41','2025-09-16 18:43:41');
INSERT INTO carts VALUES(3,3,'ordered','2025-09-16 18:43:41','2025-09-16 18:43:41');
INSERT INTO carts VALUES(4,4,'abandoned','2025-09-16 18:43:41','2025-09-16 18:43:41');
INSERT INTO carts VALUES(5,5,'open','2025-09-16 18:43:41','2025-09-16 18:43:41');
CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id INTEGER NOT NULL,
    product_variant_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts (id),
    FOREIGN KEY (product_variant_id) REFERENCES product_variants (id),
    UNIQUE(cart_id, product_variant_id)
);
INSERT INTO cart_items VALUES(2,1,4,1,'2025-09-16 18:43:41');
INSERT INTO cart_items VALUES(3,2,7,1,'2025-09-16 18:43:41');
INSERT INTO cart_items VALUES(4,2,10,3,'2025-09-16 18:43:41');
INSERT INTO cart_items VALUES(5,3,13,2,'2025-09-16 18:43:41');
INSERT INTO cart_items VALUES(6,4,2,1,'2025-09-16 18:43:41');
INSERT INTO cart_items VALUES(7,5,5,1,'2025-09-16 18:43:41');
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    cart_id INTEGER,
    order_number VARCHAR(32) NOT NULL UNIQUE,
    status VARCHAR(16) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address TEXT,
    payment_method VARCHAR(32),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (cart_id) REFERENCES carts (id)
);
INSERT INTO orders VALUES(1,3,3,'ORD-001','completed',47.97999999999999688,'123 Main St, Anytown, USA','credit_card','2025-09-16 18:43:41');
INSERT INTO orders VALUES(2,4,4,'ORD-002','pending',11.99000000000000021,'456 Oak Ave, Somewhere, USA','paypal','2025-09-16 18:43:41');
INSERT INTO orders VALUES(3,1,1,'ORD-003','shipped',33.96999999999999887,'789 Pine Rd, Elsewhere, USA','credit_card','2025-09-16 18:43:41');
INSERT INTO orders VALUES(4,2,2,'ORD-004','paid',93.9699999999999989,'321 Elm St, Nowhere, USA','debit_card','2025-09-16 18:43:41');
INSERT INTO orders VALUES(5,5,5,'ORD-005','pending',9.99000000000000021,'654 Maple Dr, Anywhere, USA','credit_card','2025-09-16 18:43:41');
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_variant_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_variant_id) REFERENCES product_variants (id)
);
INSERT INTO order_items VALUES(1,1,13,2,15.99000000000000021,'2025-09-16 18:43:41');
INSERT INTO order_items VALUES(2,2,2,1,11.99000000000000021,'2025-09-16 18:43:41');
INSERT INTO order_items VALUES(3,3,1,2,11.99000000000000021,'2025-09-16 18:43:41');
INSERT INTO order_items VALUES(4,3,4,1,9.99000000000000021,'2025-09-16 18:43:41');
INSERT INTO order_items VALUES(5,4,7,1,33.99000000000000198,'2025-09-16 18:43:41');
INSERT INTO order_items VALUES(6,4,10,3,24.98999999999999844,'2025-09-16 18:43:41');
INSERT INTO order_items VALUES(7,5,5,1,9.99000000000000021,'2025-09-16 18:43:41');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('users',5);
INSERT INTO sqlite_sequence VALUES('products',5);
INSERT INTO sqlite_sequence VALUES('product_variants',15);
INSERT INTO sqlite_sequence VALUES('carts',5);
INSERT INTO sqlite_sequence VALUES('cart_items',7);
INSERT INTO sqlite_sequence VALUES('orders',5);
INSERT INTO sqlite_sequence VALUES('order_items',7);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
COMMIT;
