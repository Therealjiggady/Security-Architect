# Day 3: Advanced Product Features and Inventory Management

## 🎯 Objective
Implement product variants (size/color), inventory management, and enhanced product features with proper validation and error handling.

## 📋 What We Accomplished

### 1. **Product Variants System**
- Created product variants table for size/color combinations
- Implemented one-to-many relationship between products and variants
- Added inventory tracking per variant
- Proper foreign key constraints and composite unique indexes

### 2. **Inventory Management**
- Stock level tracking for each product variant
- Automatic inventory validation on orders
- Out-of-stock handling and notifications
- Inventory update operations with proper constraints

### 3. **Enhanced Product API**
Extended product endpoints with variant support:
- `GET /products/{id}/variants` - Get all variants for a product
- `POST /products/{id}/variants` - Add variant to product
- `PUT /products/{id}/variants/{variant_id}` - Update variant
- `DELETE /products/{id}/variants/{variant_id}` - Remove variant

### 4. **Advanced Validation**
- SKU uniqueness validation across products
- Price validation (must be positive)
- Stock level validation (cannot be negative)
- Size/color combination uniqueness per product

### 5. **Error Handling Improvements**
- Custom exception handlers for common errors
- Proper HTTP status codes (400, 404, 409, etc.)
- Detailed error messages for debugging
- Validation error formatting

### 6. **Database Optimization**
- Added database indexes for performance
- Composite indexes for common query patterns
- Foreign key constraints for data integrity
- Proper cascade delete configurations

## 🔧 Technical Details

### Product Variant Model:
```python
class ProductVariant(Base):
    __tablename__ = "product_variants"
    id = Column(BigInteger, primary_key=True, index=True)
    product_id = Column(BigInteger, ForeignKey("products.id", on_delete="CASCADE"), nullable=False)
    size = Column(String(32), nullable=False)
    color = Column(String(64))
    stock = Column(Integer, nullable=False, default=0)

    # Relationships
    product = relationship("Product", back_populates="variants")

    # Constraints
    __table_args__ = (
        UniqueConstraint('product_id', 'size', 'color', name='unique_variant'),
        CheckConstraint('stock >= 0', name='positive_stock'),
    )
```

### Enhanced Product Model:
```python
class Product(Base):
    # ... existing fields ...

    # Relationships
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
```

### Inventory Management Logic:
```python
def check_inventory_availability(product_id: int, size: str, color: str, quantity: int) -> bool:
    """Check if requested quantity is available in inventory"""
    variant = db.query(ProductVariant).filter(
        ProductVariant.product_id == product_id,
        ProductVariant.size == size,
        ProductVariant.color == color
    ).first()

    if not variant:
        return False

    return variant.stock >= quantity
```

## ✅ Verification Steps

### 1. **Create Product with Variants**
```bash
# Create base product
curl -X POST "http://127.0.0.1:8000/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Designer T-Shirt",
    "description": "Premium cotton t-shirt",
    "sku": "TSHIRT001",
    "price": 29.99
  }'
```

### 2. **Add Product Variants**
```bash
# Add Small/Black variant
curl -X POST "http://127.0.0.1:8000/products/1/variants" \
  -H "Content-Type: application/json" \
  -d '{
    "size": "S",
    "color": "Black",
    "stock": 50
  }'

# Add Medium/White variant
curl -X POST "http://127.0.0.1:8000/products/1/variants" \
  -H "Content-Type: application/json" \
  -d '{
    "size": "M",
    "color": "White",
    "stock": 30
  }'
```

### 3. **Get Product with Variants**
```bash
curl http://127.0.0.1:8000/products/1
```
Expected response:
```json
{
  "id": 1,
  "name": "Designer T-Shirt",
  "description": "Premium cotton t-shirt",
  "sku": "TSHIRT001",
  "price": 29.99,
  "created_at": "2024-01-15T10:30:00Z",
  "variants": [
    {
      "id": 1,
      "size": "S",
      "color": "Black",
      "stock": 50
    },
    {
      "id": 2,
      "size": "M",
      "color": "White",
      "stock": 30
    }
  ]
}
```

### 4. **Test Inventory Validation**
```bash
# Try to add variant with negative stock (should fail)
curl -X POST "http://127.0.0.1:8000/products/1/variants" \
  -H "Content-Type: application/json" \
  -d '{
    "size": "L",
    "color": "Blue",
    "stock": -5
  }'
```
Expected: 400 Bad Request with validation error

### 5. **Test Duplicate Variant Prevention**
```bash
# Try to add duplicate S/Black variant (should fail)
curl -X POST "http://127.0.0.1:8000/products/1/variants" \
  -H "Content-Type: application/json" \
  -d '{
    "size": "S",
    "color": "Black",
    "stock": 10
  }'
```
Expected: 409 Conflict with duplicate error

### 6. **Update Inventory**
```bash
curl -X PUT "http://127.0.0.1:8000/products/1/variants/1" \
  -H "Content-Type: application/json" \
  -d '{"stock": 75}'
```

### 7. **Test Error Handling**
```bash
# Try to get non-existent product
curl http://127.0.0.1:8000/products/999
```
Expected: 404 Not Found

## 🎯 Success Criteria Met
- ✅ Product variants system implemented
- ✅ Inventory management working correctly
- ✅ Proper validation and error handling
- ✅ Database constraints enforced
- ✅ API endpoints fully tested
- ✅ Data integrity maintained
- ✅ Performance optimized with indexes

## 📊 Database Schema Enhancements
- **Composite unique constraints**: Prevent duplicate size/color combinations
- **Check constraints**: Ensure positive stock levels and prices
- **Foreign key relationships**: Maintain referential integrity
- **Cascade deletes**: Clean up variants when product is deleted
- **Indexes**: Optimized queries for product-variant lookups

## 🔗 Next Steps
Day 4 will focus on shopping cart functionality, including cart management, item addition/removal, and cart persistence.