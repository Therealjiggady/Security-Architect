-- Clean re-run
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- USERS
CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(255),
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- PRODUCTS (base info)
CREATE TABLE products (
  id          BIGSERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  sku         VARCHAR(64) UNIQUE,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- PRODUCT VARIANTS (size/color) to keep 3NF
CREATE TABLE product_variants (
  id         BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size       VARCHAR(32) NOT NULL,
  color      VARCHAR(64),
  stock      INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  UNIQUE (product_id, size, color)
);

-- CARTS
CREATE TABLE carts (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status     VARCHAR(16) NOT NULL DEFAULT 'open'
             CHECK (status IN ('open','ordered','abandoned')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CART ITEMS
CREATE TABLE cart_items (
  id                 BIGSERIAL PRIMARY KEY,
  cart_id            BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_variant_id BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  quantity           INTEGER NOT NULL CHECK (quantity > 0),
  UNIQUE (cart_id, product_variant_id)
);

-- ORDERS
CREATE TABLE orders (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  cart_id      BIGINT REFERENCES carts(id) ON DELETE SET NULL,
  status       VARCHAR(16) NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','paid','shipped','completed','cancelled')),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ORDER ITEMS (snapshot price)
CREATE TABLE order_items (
  id                 BIGSERIAL PRIMARY KEY,
  order_id           BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  quantity           INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase  NUMERIC(10,2) NOT NULL CHECK (price_at_purchase >= 0)
);

-- Helpful indexes
CREATE INDEX idx_products_name     ON products(name);
CREATE INDEX idx_variants_product  ON product_variants(product_id);
CREATE INDEX idx_cart_items_cart   ON cart_items(cart_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
