# Database Table Screenshots - Broke N Beauty Ecommerce

## 📸 Table Structure Documentation

This document contains the complete table structures (equivalent to DESCRIBE output) for all tables in the Broke N Beauty Ecommerce database. Generated using SQLite `.schema` command.

---

## 1. Users Table

```sql
.schema users
```

**Output:**
```
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_users_email ON users(email);
```

**Field Details:**
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `email`: VARCHAR(255) NOT NULL UNIQUE
- `hashed_password`: VARCHAR(255) NOT NULL
- `full_name`: VARCHAR(255)
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL

**Indexes:**
- `idx_users_email` on `email`

---

## 2. Products Table

```sql
.schema products
```

**Output:**
```
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(64) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_products_sku ON products(sku);
```

**Field Details:**
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `name`: VARCHAR(255) NOT NULL
- `description`: TEXT
- `sku`: VARCHAR(64) UNIQUE
- `price`: DECIMAL(10,2) NOT NULL
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL

**Indexes:**
- `idx_products_sku` on `sku`

---

## 3. Product Variants Table

```sql
.schema product_variants
```

**Output:**
```
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
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
```

**Field Details:**
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `product_id`: INTEGER NOT NULL (FK → products.id)
- `size`: VARCHAR(32) NOT NULL
- `color`: VARCHAR(64)
- `stock`: INTEGER DEFAULT 0
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at`: DATETIME DEFAULT CURRENT_TIMESTAMP

**Constraints:**
- FOREIGN KEY (product_id) REFERENCES products (id)
- UNIQUE(product_id, size, color)

**Indexes:**
- `idx_product_variants_product_id` on `product_id`

---

## 4. Carts Table

```sql
.schema carts
```

**Output:**
```
CREATE TABLE carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    status VARCHAR(16) DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
CREATE INDEX idx_carts_user_id ON carts(user_id);
```

**Field Details:**
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `user_id`: INTEGER NOT NULL (FK → users.id)
- `status`: VARCHAR(16) DEFAULT 'open'
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
- `updated_at`: DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL

**Constraints:**
- FOREIGN KEY (user_id) REFERENCES users (id)

**Indexes:**
- `idx_carts_user_id` on `user_id`

---

## 5. Cart Items Table

```sql
.schema cart_items
```

**Output:**
```
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
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
```

**Field Details:**
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `cart_id`: INTEGER NOT NULL (FK → carts.id)
- `product_variant_id`: INTEGER NOT NULL (FK → product_variants.id)
- `quantity`: INTEGER NOT NULL
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP

**Constraints:**
- FOREIGN KEY (cart_id) REFERENCES carts (id)
- FOREIGN KEY (product_variant_id) REFERENCES product_variants (id)
- UNIQUE(cart_id, product_variant_id)

**Indexes:**
- `idx_cart_items_cart_id` on `cart_id`

---

## 6. Orders Table

```sql
.schema orders
```

**Output:**
```
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
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

**Field Details:**
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `user_id`: INTEGER NOT NULL (FK → users.id)
- `cart_id`: INTEGER (FK → carts.id)
- `order_number`: VARCHAR(32) NOT NULL UNIQUE
- `status`: VARCHAR(16) DEFAULT 'pending'
- `total_amount`: DECIMAL(10,2) NOT NULL
- `shipping_address`: TEXT
- `payment_method`: VARCHAR(32)
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL

**Constraints:**
- FOREIGN KEY (user_id) REFERENCES users (id)
- FOREIGN KEY (cart_id) REFERENCES carts (id)

**Indexes:**
- `idx_orders_user_id` on `user_id`

---

## 7. Order Items Table

```sql
.schema order_items
```

**Output:**
```
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
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

**Field Details:**
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `order_id`: INTEGER NOT NULL (FK → orders.id)
- `product_variant_id`: INTEGER NOT NULL (FK → product_variants.id)
- `quantity`: INTEGER NOT NULL
- `price_at_purchase`: DECIMAL(10,2) NOT NULL
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP

**Constraints:**
- FOREIGN KEY (order_id) REFERENCES orders (id)
- FOREIGN KEY (product_variant_id) REFERENCES product_variants (id)

**Indexes:**
- `idx_order_items_order_id` on `order_id`

---

## 8. Categories Table

```sql
.schema categories
```

**Output:**
```
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_categories_name ON categories(name);
```

**Field Details:**
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `name`: VARCHAR(100) NOT NULL UNIQUE
- `description`: TEXT
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL

**Indexes:**
- `idx_categories_name` on `name`

---

## 9. Product Categories Table (Junction)

```sql
.schema product_categories
```

**Output:**
```
CREATE TABLE product_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (category_id) REFERENCES categories (id),
    UNIQUE(product_id, category_id)
);
CREATE INDEX idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX idx_product_categories_category_id ON product_categories(category_id);
```

**Field Details:**
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `product_id`: INTEGER NOT NULL (FK → products.id)
- `category_id`: INTEGER NOT NULL (FK → categories.id)
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL

**Constraints:**
- FOREIGN KEY (product_id) REFERENCES products (id)
- FOREIGN KEY (category_id) REFERENCES categories (id)
- UNIQUE(product_id, category_id)

**Indexes:**
- `idx_product_categories_product_id` on `product_id`
- `idx_product_categories_category_id` on `category_id`

---

## 📊 Database Relationships Summary

### Entity Relationship Diagram (ERD)
```
Users (1) ──── (M) Carts
     │              │
     │              │
     └── (1) Orders (M) ──── (M) Order Items
            │                      │
            │                      │
            └──────── (1) Cart ──── (M) Cart Items
                           │
                           │
                           └── (M) Product Variants (M) ──── (1) Products
```

### Foreign Key Relationships
- `carts.user_id` → `users.id`
- `cart_items.cart_id` → `carts.id`
- `cart_items.product_variant_id` → `product_variants.id`
- `product_variants.product_id` → `products.id`
- `orders.user_id` → `users.id`
- `orders.cart_id` → `carts.id`
- `order_items.order_id` → `orders.id`
- `order_items.product_variant_id` → `product_variants.id`

### Indexes Created
- Primary key indexes on all tables (automatic)
- Foreign key indexes for performance optimization
- Unique indexes on email and SKU fields
- Composite unique constraints where needed

---

## 🔧 How to Generate These Screenshots

To generate these table structures yourself:

```bash
# Connect to SQLite database
sqlite3 app.db

# Get schema for specific table
.schema users
.schema products
.schema product_variants
.schema carts
.schema cart_items
.schema orders
.schema order_items

# Exit SQLite
.quit
```

**Note:** Since this is SQLite (not MySQL), we use `.schema` instead of `DESCRIBE`. The output provides the same structural information as DESCRIBE would in other database systems.

---

*Generated on: 2025-09-18*
*Database: SQLite (app.db)*
*Total Tables: 9*
*Total Relationships: 10 foreign keys*