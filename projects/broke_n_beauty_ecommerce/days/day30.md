# Day 30: Order Status Tracking System

## Overview
Implemented a comprehensive order tracking system with status management, validation logic, and proper state transitions. The system uses if/else logic, logical operators, and validation loops to ensure order integrity.

## Implementation Details

### 1. Order Status Enum
Created an `OrderStatus` enum in both the model and schema layers to ensure type safety:

**Model** ([`backend/app/models/order.py`](../backend/app/models/order.py:13)):
```python
class OrderStatus(str, enum.Enum):
    """Enum for order status tracking"""
    PENDING = "pending"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
```

**Schema** ([`backend/app/schemas/order.py`](../backend/app/schemas/order.py:20)):
```python
class OrderStatus(str, Enum):
    """Enum for order status values"""
    PENDING = "pending"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
```

### 2. Order Status Update Schema
Created a dedicated schema for status updates with validation:

```python
class OrderStatusUpdate(BaseModel):
    """Schema for updating order status"""
    status: OrderStatus = Field(..., description="New status for the order (pending, shipped, or delivered)")
```

### 3. updateOrderStatus Function
Implemented the core `updateOrderStatus(orderId, status)` function in [`backend/app/routers/orders.py`](../backend/app/routers/orders.py:31) with the following features:

#### If/Else Logic for Order States
The function uses conditional logic to validate and handle status transitions:

```python
if status == "pending":
    # Can always revert to pending
    order.status = ModelOrderStatus.PENDING
elif status == "shipped":
    # Can ship from pending or remain shipped
    if current_status == "pending" or current_status == "shipped":
        order.status = ModelOrderStatus.SHIPPED
    else:
        # Invalid transition: cannot ship a delivered order
        return False
elif status == "delivered":
    # Can only deliver from shipped status (or remain delivered)
    if current_status == "shipped" or current_status == "delivered":
        order.status = ModelOrderStatus.DELIVERED
    else:
        # Invalid transition: must ship before delivering
        return False
else:
    # Invalid status provided
    return False
```

#### Logical Operators
Uses logical operators (`||` in Python: `or`) to check valid state transitions:
- `if current_status == "pending" or current_status == "shipped"`: Allows shipping from pending or keeping shipped status
- `if current_status == "shipped" or current_status == "delivered"`: Allows delivery only from shipped or keeping delivered status

#### Validation Loop
Before processing any status update, the function validates all order items:

```python
# Validation loop: Check all order items before processing
for item in order.items:
    # Validate each order item has required data
    if item.quantity <= 0:
        return False
    if item.price_at_purchase <= 0:
        return False
    if not item.product_variant_id:
        return False
```

This ensures:
- All items have positive quantities
- All items have valid prices
- All items are linked to valid product variants

#### Return Value
The function returns a **boolean**:
- `True`: Status update was successful
- `False`: Update failed due to:
  - Order not found
  - User doesn't own the order
  - Invalid order items (validation loop failed)
  - Invalid status transition (if/else logic rejected it)
  - Database error during commit

### 4. Status Update Route
Created a new PATCH endpoint: `PATCH /orders/{order_id}/status`

**Endpoint:** [`backend/app/routers/orders.py`](../backend/app/routers/orders.py:97)

**Features:**
- Requires authentication via JWT
- Validates user ownership of the order
- Uses the `updateOrderStatus` function
- Provides detailed error messages
- Returns the updated order with all items

## Valid Status Transitions

The system enforces the following state machine:

```
pending → shipped → delivered
    ↑        ↑          ↑
    └────────┴──────────┘
   (Can always revert to pending)
```

**Valid Transitions:**
- `pending` → `pending` ✅
- `pending` → `shipped` ✅
- `shipped` → `shipped` ✅
- `shipped` → `delivered` ✅
- `delivered` → `delivered` ✅
- Any status → `pending` ✅

**Invalid Transitions:**
- `delivered` → `shipped` ❌
- `pending` → `delivered` ❌ (must ship first)

## API Usage Examples

### Update Order Status to Shipped

**Request:**
```bash
curl -X PATCH http://localhost:8000/orders/123/status \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=your_jwt_token" \
  -d '{
    "status": "shipped"
  }'
```

**Success Response (200 OK):**
```json
{
  "id": 123,
  "user_id": 1,
  "cart_id": 456,
  "status": "shipped",
  "total_amount": 129.99,
  "created_at": "2025-10-22T10:30:00",
  "items": [
    {
      "id": 1,
      "order_id": 123,
      "product_variant_id": 10,
      "quantity": 2,
      "price_at_purchase": 64.99
    }
  ]
}
```

**Error Response - Invalid Transition (400 Bad Request):**
```json
{
  "detail": "Invalid status transition or order validation failed"
}
```

**Error Response - Order Not Found (404):**
```json
{
  "detail": "Order not found"
}
```

**Error Response - Unauthorized (403):**
```json
{
  "detail": "Unauthorized to update this order"
}
```

### Update Order Status to Delivered

**Request:**
```bash
curl -X PATCH http://localhost:8000/orders/123/status \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=your_jwt_token" \
  -d '{
    "status": "delivered"
  }'
```

**Note:** This will only succeed if the order is currently in "shipped" status.

## Testing the Implementation

1. **Create an order** (status defaults to "pending")
2. **Ship the order**:
   ```bash
   PATCH /orders/{order_id}/status
   Body: {"status": "shipped"}
   ```
3. **Deliver the order**:
   ```bash
   PATCH /orders/{order_id}/status
   Body: {"status": "delivered"}
   ```
4. **Try invalid transition** (should fail):
   ```bash
   PATCH /orders/{order_id}/status
   Body: {"status": "shipped"}  # Will fail because order is already delivered
   ```

## Key Learning Points

### If/Else Logic
- Used to implement state machine logic
- Handles different order states with conditional branches
- Validates status transitions before applying changes

### Logical Operators
- `or` operator checks multiple valid conditions
- `and` operator (implicitly) ensures all validations pass
- Used in both validation loop and state transition logic

### Validation Loop
- Iterates through all order items
- Ensures data integrity before processing
- Fails fast if any item is invalid

### Boolean Return Values
- `updateOrderStatus` returns `bool` for success/failure
- Enables clean separation of validation logic from HTTP response handling
- Makes function testable and reusable

## Files Modified

1. [`backend/app/models/order.py`](../backend/app/models/order.py:1) - Added OrderStatus enum and updated Order model
2. [`backend/app/schemas/order.py`](../backend/app/schemas/order.py:1) - Added OrderStatus enum and OrderStatusUpdate schema
3. [`backend/app/routers/orders.py`](../backend/app/routers/orders.py:1) - Implemented updateOrderStatus function and PATCH endpoint

## Conclusion

The order tracking system provides robust status management with:
- ✅ Type-safe status values using enums
- ✅ Validation of all order items before processing
- ✅ Strict state transition rules
- ✅ User authorization checks
- ✅ Clear error messages
- ✅ Boolean return values for success/failure
- ✅ RESTful API design following FastAPI best practices