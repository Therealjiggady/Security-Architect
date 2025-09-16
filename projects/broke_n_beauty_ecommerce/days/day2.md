# Day 2: Database Setup and Basic CRUD Operations

## 🎯 Objective
Configure database connection, create SQLAlchemy models, and implement basic CRUD operations for products.

## 📋 What We Accomplished

### 1. **Database Configuration**
- Set up SQLAlchemy ORM configuration
- Created database connection helper (`backend/app/db.py`)
- Configured SQLite as development database with PostgreSQL support for production
- Added environment variable support for database URLs

### 2. **Database Schema Design**
Created `database/schema.sql` with:
- Users table (foundation for future authentication)
- Products table with proper constraints
- Product variants table (size/color variations)
- Shopping cart and order management tables
- Proper foreign key relationships and indexes

### 3. **SQLAlchemy Models**
Created `backend/app/models/` directory structure:
- `models/__init__.py` - Package exports
- `models/user.py` - User model with proper typing
- Configured Base declarative class for ORM

### 4. **Basic CRUD Operations**
Implemented product management endpoints:
- `GET /products` - List all products
- `GET /products/{id}` - Get specific product
- `POST /products` - Create new product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### 5. **Pydantic Schemas**
Created `backend/app/schemas/` directory:
- `schemas/user.py` - User data validation schemas
- Request/response models for API endpoints
- Proper data serialization and validation

### 6. **Router Organization**
Set up modular router structure:
- `backend/app/routers/__init__.py`
- Organized endpoints by resource type
- Proper API prefix configuration

## 🔧 Technical Details

### Database Configuration (`backend/app/db.py`):
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

### Product Model Structure:
```python
class Product(Base):
    __tablename__ = "products"
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    sku = Column(String(64), unique=True)
    price = Column(Numeric(10,2), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
```

### API Endpoints Created:
- `GET /health` - Health check
- `GET /products` - List products with pagination
- `POST /products` - Create product
- `GET /products/{id}` - Get product by ID
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

## ✅ Verification Steps

### 1. **Database Connection Test**
```bash
curl http://127.0.0.1:8000/db/health
```
Expected response:
```json
{
  "status": "ok",
  "dialect": "sqlite",
  "driver": "pysqlite"
}
```

### 2. **Create a Test Product**
```bash
curl -X POST "http://127.0.0.1:8000/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "A test product for verification",
    "sku": "TEST001",
    "price": 29.99
  }'
```

### 3. **List Products**
```bash
curl http://127.0.0.1:8000/products
```
Expected response:
```json
[
  {
    "id": 1,
    "name": "Test Product",
    "description": "A test product for verification",
    "sku": "TEST001",
    "price": 29.99,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### 4. **Get Specific Product**
```bash
curl http://127.0.0.1:8000/products/1
```

### 5. **Update Product**
```bash
curl -X PUT "http://127.0.0.1:8000/products/1" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Test Product", "price": 39.99}'
```

### 6. **Delete Product**
```bash
curl -X DELETE http://127.0.0.1:8000/products/1
```

## 🎯 Success Criteria Met
- ✅ Database connection established successfully
- ✅ SQLAlchemy models created and working
- ✅ CRUD operations implemented and tested
- ✅ Pydantic schemas provide proper validation
- ✅ API endpoints return correct responses
- ✅ Error handling for not found resources
- ✅ Proper HTTP status codes used

## 📝 Database Schema Highlights
- **Users table**: Foundation for authentication (Day 7)
- **Products table**: Core e-commerce functionality
- **Product variants**: Size/color variations support
- **Carts and orders**: Shopping cart functionality
- **Proper constraints**: NOT NULL, UNIQUE, CHECK constraints
- **Indexes**: Optimized for common query patterns

## 🔗 Next Steps
Day 3 will focus on advanced product features, including product variants, inventory management, and improved error handling.