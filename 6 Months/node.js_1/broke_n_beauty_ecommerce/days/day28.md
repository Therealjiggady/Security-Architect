# Day 28: Admin Schema + Routes for Product Management (CRUD)

## Overview
Implemented comprehensive admin schema and routes for product management with full CRUD operations, including admin role authentication, updateProduct function with validation loops, and proper error handling for missing fields vs duplicate IDs.

## Features Implemented

### Admin Authentication & Authorization
- **Admin Role Constant**: `ADMIN_ROLE = "superuser"`
- **Role-based Access**: Added `role` field to User model (default: "user")
- **Admin Dependency**: `require_admin_auth()` function for route protection
- **JWT Authentication**: Admin routes require valid JWT tokens with admin role

### Admin Product Schemas
```python
class AdminProductCreate(BaseModel):
    name: str
    description: str
    sku: str
    price: float
    image_url: str = None
    category: str = None

class AdminProductUpdate(BaseModel):
    name: str = None
    description: str = None
    sku: str = None
    price: float = None
    image_url: str = None
    category: str = None
    is_active: bool = None
```

### updateProduct Function with Args
```python
def updateProduct(db: Session, product_id: int, name: str = None, price: float = None, **kwargs) -> Product:
    """
    Update product with validation and return result
    Args: product_id, name, price, and other optional fields
    Returns: Updated Product object
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")
    
    # Apply updates
    if name is not None:
        product.name = name
    if price is not None:
        if price <= 0:
            raise HTTPException(400, "Price must be positive")
        product.price = price
    
    # Handle other kwargs
    for key, value in kwargs.items():
        if hasattr(product, key) and value is not None:
            setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product
```

### Loop for Product Validation
```python
def validate_product_data(products: list) -> list:
    """
    Iterate through products to validate schema
    Returns: List of validation errors
    """
    errors = []
    for i, product in enumerate(products):
        # Check required fields
        if not product.get('name'):
            errors.append(f"Product {i+1}: Missing required field 'name'")
        if not product.get('sku'):
            errors.append(f"Product {i+1}: Missing required field 'sku'")
        if product.get('price') is None:
            errors.append(f"Product {i+1}: Missing required field 'price'")
        
        # Check data types
        if product.get('price') is not None and not isinstance(product['price'], (int, float)):
            errors.append(f"Product {i+1}: Price must be a number")
    
    return errors
```

### If/Else If Logic for Error Handling
```python
def handle_product_validation_error(product_data: dict) -> str:
    """
    Handle missing fields vs duplicate product IDs using if/else if logic
    """
    # Check for missing required fields
    if not product_data.get('name'):
        return "Missing required field: name"
    elif not product_data.get('sku'):
        return "Missing required field: sku"
    elif product_data.get('price') is None:
        return "Missing required field: price"
    
    # Check for duplicate SKU
    elif db.query(Product).filter(Product.sku == product_data['sku']).first():
        return f"Duplicate product SKU: {product_data['sku']}"
    
    # Check price validity
    elif product_data.get('price', 0) <= 0:
        return "Price must be greater than 0"
    
    else:
        return None  # No errors
```

## API Endpoints

### Admin Product CRUD Operations

#### Create Product
**POST /admin/products**
```json
{
  "name": "New Product",
  "description": "Product description",
  "sku": "NEW-PROD-001",
  "price": 29.99,
  "image_url": "/static/images/new-product.png",
  "category": "tops"
}
```

#### Read Products
**GET /admin/products** - List all products
**GET /admin/products/{id}** - Get specific product

#### Update Product
**PUT /admin/products/{id}**
```json
{
  "name": "Updated Product Name",
  "price": 34.99,
  "is_active": true
}
```

#### Delete Product
**DELETE /admin/products/{id}**

## Technical Implementation

### Admin Router Structure
```python
admin_router = APIRouter(prefix="/admin", tags=["admin"])

@admin_router.post("/products", response_model=ProductRead)
def create_product(
    product: AdminProductCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin_auth)
):
    # Validate product data
    validation_error = handle_product_validation_error(product.dict())
    if validation_error:
        raise HTTPException(400, validation_error)
    
    # Check for duplicate SKU
    existing = db.query(Product).filter(Product.sku == product.sku).first()
    if existing:
        raise HTTPException(400, f"Product with SKU '{product.sku}' already exists")
    
    # Create product
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@admin_router.put("/products/{product_id}", response_model=ProductRead)
def update_product(
    product_id: int,
    updates: AdminProductUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin_auth)
):
    # Use updateProduct function
    updated_product = updateProduct(db, product_id, **updates.dict(exclude_unset=True))
    return updated_product
```

### Authentication Dependency
```python
def require_admin_auth(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Require admin authentication for protected routes
    """
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None or user.role != ADMIN_ROLE:
        raise HTTPException(403, "Admin access required")
    
    return {"email": email, "role": user.role}
```

## Files Created/Modified

### Backend
- `backend/app/schemas/admin.py` - Admin product schemas
- `backend/app/routers/admin.py` - Admin routes with CRUD operations
- `backend/app/auth.py` - Updated with admin role constant and dependency
- `backend/app/models/user.py` - Added role field
- `backend/app/main.py` - Added admin router

### Database Migration
- Added `role` column to users table (default: "user")
- Admin users need `role = "superuser"` for access

## Security Features
- **Role-based Access Control**: Only users with `role = "superuser"` can access admin routes
- **JWT Authentication**: All admin routes require valid JWT tokens
- **Input Validation**: Comprehensive validation for all product data
- **SQL Injection Protection**: Using SQLAlchemy ORM for safe queries
- **Error Handling**: Proper HTTP status codes and error messages

## Usage Examples

### Creating Admin User
```sql
UPDATE users SET role = 'superuser' WHERE email = 'admin@example.com';
```

### API Usage
```bash
# Create product (admin only)
curl -X POST "http://localhost:8000/admin/products" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","sku":"TEST-001","price":19.99}'

# Update product
curl -X PUT "http://localhost:8000/admin/products/1" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price":24.99}'
```

This implementation provides secure, comprehensive admin product management with all requested programming concepts: constants, functions with args, loops for validation, and if/else if logic for error handling.