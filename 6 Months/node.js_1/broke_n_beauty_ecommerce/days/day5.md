# Day 5: Order Processing and Payment Integration

## 🎯 Objective
Implement order processing system, payment preparation, and order lifecycle management.

## 📋 What We Accomplished

### 1. **Order Management System**
- Created orders table with comprehensive order tracking
- Implemented order-item relationships for detailed order history
- Added order status management (pending, paid, shipped, completed, cancelled)
- Proper order numbering and reference generation

### 2. **Checkout Process**
- Cart-to-order conversion functionality
- Inventory reservation during checkout
- Order total calculations with tax and shipping
- Order confirmation and reference generation

### 3. **Order API Endpoints**
Implemented order management operations:
- `POST /orders` - Create order from cart
- `GET /orders` - List user orders
- `GET /orders/{id}` - Get specific order details
- `PUT /orders/{id}/status` - Update order status (admin)
- `DELETE /orders/{id}` - Cancel order (if pending)

### 4. **Payment Integration Preparation**
- Payment method storage structure
- Payment status tracking
- Integration points for payment processors
- Webhook handling preparation

### 5. **Order History and Tracking**
- Complete order history for users
- Order status progression tracking
- Order search and filtering capabilities
- Order analytics preparation

### 6. **Inventory Management Integration**
- Automatic inventory reduction on order completion
- Stock reservation during checkout process
- Inventory rollback on order cancellation
- Low stock alerts and notifications

## 🔧 Technical Details

### Order Model Structure:
```python
class Order(Base):
    __tablename__ = "orders"
    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id", on_delete="RESTRICT"), nullable=False)
    cart_id = Column(BigInteger, ForeignKey("carts.id", on_delete="SET NULL"))
    order_number = Column(String(32), unique=True, nullable=False)
    status = Column(String(16), nullable=False, default="pending")
    total_amount = Column(Numeric(10,2), nullable=False)
    shipping_address = Column(Text)
    payment_method = Column(String(32))
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="orders")
    cart = relationship("Cart")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    # Constraints
    __table_args__ = (
        CheckConstraint("status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled')", name='valid_order_status'),
        CheckConstraint('total_amount >= 0', name='positive_total'),
    )
```

### Order Item Model:
```python
class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(BigInteger, primary_key=True, index=True)
    order_id = Column(BigInteger, ForeignKey("orders.id", on_delete="CASCADE"), nullable=False)
    product_variant_id = Column(BigInteger, ForeignKey("product_variants.id", on_delete="RESTRICT"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Numeric(10,2), nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    product_variant = relationship("ProductVariant")

    # Constraints
    __table_args__ = (
        CheckConstraint('quantity > 0', name='positive_order_quantity'),
        CheckConstraint('price_at_purchase >= 0', name='positive_price'),
    )
```

### Checkout Process Logic:
```python
def create_order_from_cart(user_id: int, shipping_address: str, payment_method: str):
    """Convert cart to order with inventory validation"""
    # Get user's cart
    cart = db.query(Cart).filter(
        Cart.user_id == user_id,
        Cart.status == "open"
    ).first()

    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Validate inventory for all items
    for item in cart.items:
        if item.product_variant.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {item.product_variant.product.name}"
            )

    # Calculate total
    total = calculate_cart_total(cart)

    # Generate order number
    order_number = generate_order_number()

    # Create order
    order = Order(
        user_id=user_id,
        cart_id=cart.id,
        order_number=order_number,
        total_amount=total,
        shipping_address=shipping_address,
        payment_method=payment_method,
        status="pending"
    )

    # Create order items
    for cart_item in cart.items:
        order_item = OrderItem(
            order_id=order.id,
            product_variant_id=cart_item.product_variant_id,
            quantity=cart_item.quantity,
            price_at_purchase=cart_item.product_variant.product.price
        )
        db.add(order_item)

    # Update cart status
    cart.status = "ordered"

    db.add(order)
    db.commit()
    db.refresh(order)

    return order
```

## ✅ Verification Steps

### 1. **Setup Test Data**
```bash
# Login to get JWT token
TOKEN=$(curl -s -X POST "http://127.0.0.1:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"shopper@test.com","password":"password123"}' | jq -r '.access_token')

# Add items to cart (from Day 4)
curl -X POST "http://127.0.0.1:8000/cart/items" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_variant_id": 1, "quantity": 2}'
```

### 2. **Create Order from Cart**
```bash
curl -X POST "http://127.0.0.1:8000/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": "123 Main St, Anytown, USA 12345",
    "payment_method": "credit_card"
  }'
```
Expected response:
```json
{
  "id": 1,
  "order_number": "ORD-20240115-001",
  "user_id": 1,
  "status": "pending",
  "total_amount": 389.97,
  "shipping_address": "123 Main St, Anytown, USA 12345",
  "payment_method": "credit_card",
  "created_at": "2024-01-15T14:30:00Z",
  "items": [
    {
      "id": 1,
      "product_variant_id": 1,
      "quantity": 2,
      "price_at_purchase": 129.99,
      "product_name": "Running Shoes",
      "size": "9",
      "color": "Black",
      "subtotal": 259.98
    }
  ]
}
```

### 3. **List User Orders**
```bash
curl -X GET "http://127.0.0.1:8000/orders" \
  -H "Authorization: Bearer $TOKEN"
```

### 4. **Get Specific Order**
```bash
curl -X GET "http://127.0.0.1:8000/orders/1" \
  -H "Authorization: Bearer $TOKEN"
```

### 5. **Update Order Status (Admin Operation)**
```bash
curl -X PUT "http://127.0.0.1:8000/orders/1/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "paid"}'
```

### 6. **Cancel Order (if pending)**
```bash
# Create another order first
curl -X POST "http://127.0.0.1:8000/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": "456 Oak Ave, Somewhere, USA 67890",
    "payment_method": "paypal"
  }'

# Cancel the order
curl -X DELETE "http://127.0.0.1:8000/orders/2" \
  -H "Authorization: Bearer $TOKEN"
```

### 7. **Test Inventory Reduction**
```bash
# Check inventory before order completion
curl http://127.0.0.1:8000/products/1/variants

# Complete order (simulate payment)
curl -X PUT "http://127.0.0.1:8000/orders/1/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "paid"}'

# Check inventory after order completion
curl http://127.0.0.1:8000/products/1/variants
```
Expected: Stock should be reduced by ordered quantity

## 🎯 Success Criteria Met
- ✅ Order creation from shopping cart
- ✅ Inventory validation and reservation
- ✅ Order status management
- ✅ Order history and tracking
- ✅ Proper order numbering system
- ✅ Payment method integration points
- ✅ Order cancellation and refund handling
- ✅ Comprehensive order API

## 📊 Order System Features
- **Order numbering**: Unique, sequential order references
- **Status tracking**: Complete order lifecycle management
- **Inventory integration**: Automatic stock management
- **Order history**: Complete audit trail
- **Payment preparation**: Ready for payment processor integration
- **Order analytics**: Data collection for business intelligence

## 🔗 Next Steps
Day 6 will focus on frontend development, API documentation improvements, and deployment preparation.