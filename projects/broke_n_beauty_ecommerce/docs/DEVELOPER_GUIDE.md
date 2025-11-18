# Broke & Beauty - Developer Guide

Complete guide for developers contributing to the Broke & Beauty e-commerce platform.

## 📋 Table of Contents
- [Development Environment Setup](#development-environment-setup)
- [Project Architecture](#project-architecture)
- [Code Standards & Guidelines](#code-standards--guidelines)
- [Database Development](#database-development)
- [API Development](#api-development)
- [Frontend Development](#frontend-development)
- [Testing Guidelines](#testing-guidelines)
- [Deployment Process](#deployment-process)
- [Contributing Workflow](#contributing-workflow)
- [Advanced Topics](#advanced-topics)

## 🛠️ Development Environment Setup

### Prerequisites
```bash
# Required software versions
Node.js >= 18.0.0
Python >= 3.11.0
Git >= 2.30.0
SQLite3 (for development)
```

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd broke_n_beauty_ecommerce

# Backend setup
cd backend
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies

# Frontend setup
cd ../frontend
npm install
npm install -D @types/react @types/react-dom  # TypeScript support
```

### Development Tools
```bash
# Install recommended development tools
pip install black isort flake8 mypy pytest-cov
npm install -g @typescript-eslint/cli prettier
```

### IDE Configuration
- **VS Code Extensions:** Python, ES7+ React/Redux/React-Native, Prettier, ESLint
- **PyCharm:** Python plugin, JavaScript plugin
- **Editor Config:** Use provided `.editorconfig` for consistent formatting

## 🏗️ Project Architecture

### Directory Structure
```
broke_n_beauty_ecommerce/
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI app initialization
│   │   ├── auth.py         # JWT authentication logic
│   │   ├── config.py       # Configuration management
│   │   ├── db.py           # Database connection & session
│   │   ├── models/         # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   ├── product.py  # Product & variant models
│   │   │   ├── chat.py     # Chat message models
│   │   │   ├── sizing.py   # Size recommendation models
│   │   │   └── wishlist.py # Wishlist models
│   │   ├── routers/        # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── products.py # Product CRUD endpoints
│   │   │   ├── chat.py     # WebSocket & chat endpoints
│   │   │   ├── orders.py   # Order management
│   │   │   ├── sizing.py   # Size recommendation API
│   │   │   └── wishlist.py # Wishlist management
│   │   └── schemas/        # Pydantic request/response schemas
│   │       ├── __init__.py
│   │       ├── product.py  # Product schemas
│   │       ├── user.py     # User schemas
│   │       └── chat.py     # Chat schemas
│   ├── alembic/            # Database migrations
│   ├── tests/              # Backend tests
│   ├── requirements.txt    # Production dependencies
│   └── requirements-dev.txt # Development dependencies
├── frontend/               # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── ...
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── contexts/      # React context providers
│   │   └── App.jsx        # Main application component
│   ├── tests/             # Frontend tests
│   ├── package.json
│   └── vite.config.js     # Vite configuration
├── docs/                  # Documentation
├── days/                  # Development log
└── database/              # Database schemas & seeds
```

### Architecture Patterns

#### Backend Architecture (FastAPI)
- **Layered Architecture:** Controllers (routers) → Services → Models → Database
- **Dependency Injection:** FastAPI's dependency system for database sessions, auth
- **Repository Pattern:** Abstract data access in models
- **Schema Validation:** Pydantic for request/response validation

#### Frontend Architecture (React)
- **Component-Based:** Modular, reusable components
- **Context API:** Global state management for auth, cart
- **Custom Hooks:** Reusable business logic
- **Atomic Design:** Components organized by complexity level

#### Database Design
- **SQLAlchemy ORM:** Object-relational mapping
- **Migration-First:** Alembic for version control
- **Normalized Schema:** Proper foreign key relationships
- **Indexing Strategy:** Performance-optimized queries

## 📝 Code Standards & Guidelines

### Python (Backend)
```python
# Code formatting with Black
black --line-length 88 app/

# Import sorting with isort
isort app/

# Linting with flake8
flake8 app/ --max-line-length=88

# Type checking with mypy
mypy app/
```

#### Python Style Guide
```python
# Good: Clear function names and type hints
async def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db)
) -> Optional[Product]:
    """
    Retrieve a product by its ID.
    
    Args:
        product_id: The unique identifier for the product
        db: Database session dependency
        
    Returns:
        Product instance or None if not found
    """
    return db.query(Product).filter(Product.id == product_id).first()

# Bad: Unclear naming and no type hints
def get_prod(id, db):
    return db.query(Product).filter(Product.id == id).first()
```

#### Error Handling
```python
from fastapi import HTTPException, status

# Use specific HTTP status codes
@router.get("/products/{product_id}")
async def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    return product
```

### JavaScript/React (Frontend)
```bash
# Code formatting with Prettier
prettier --write src/

# Linting with ESLint
eslint src/
```

#### React Component Guidelines
```jsx
// Good: Functional component with proper prop types
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProductCard = ({ product, onAddToCart, className = '' }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await onAddToCart(product.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`product-card ${className}`}>
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button 
        onClick={handleAddToCart} 
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image_url: PropTypes.string.isRequired
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default ProductCard;
```

#### State Management Patterns
```jsx
// Context for global state
import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
```

### Git Commit Standards
```bash
# Use conventional commits
feat: add product size recommender
fix: resolve cart total calculation bug
docs: update API documentation
refactor: optimize database queries
test: add unit tests for auth service
chore: update dependencies

# Commit message format
<type>(<scope>): <subject>

<body>

<footer>
```

## 🗄️ Database Development

### Migration Workflow
```bash
# Create new migration
cd backend
alembic revision --autogenerate -m "Add wishlist table"

# Review generated migration
# Edit alembic/versions/xxx_add_wishlist_table.py

# Apply migration
alembic upgrade head

# Rollback if needed
alembic downgrade -1
```

### Model Development
```python
# SQLAlchemy model example
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="wishlists")
    product = relationship("Product", back_populates="wishlists")

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('user_id', 'product_id', name='unique_user_product_wishlist'),
    )
```

### Query Optimization
```python
# Good: Eager loading to prevent N+1 queries
def get_products_with_variants(db: Session):
    return db.query(Product).options(
        joinedload(Product.variants)
    ).all()

# Bad: Lazy loading causes multiple queries
def get_products_lazy(db: Session):
    products = db.query(Product).all()
    for product in products:
        variants = product.variants  # This triggers additional queries
    return products

# Good: Specific field selection
def get_product_summaries(db: Session):
    return db.query(
        Product.id,
        Product.name,
        Product.price,
        Product.image_url
    ).all()
```

## 🔌 API Development

### FastAPI Route Patterns
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve products with pagination.
    
    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return
    """
    products = db.query(Product).offset(skip).limit(limit).all()
    return products

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Create a new product. Requires admin privileges.
    """
    db_product = Product(**product_data.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
```

### WebSocket Implementation
```python
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Set
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room: str):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = set()
        self.active_connections[room].add(websocket)

    def disconnect(self, websocket: WebSocket, room: str):
        if room in self.active_connections:
            self.active_connections[room].discard(websocket)

    async def broadcast_to_room(self, message: dict, room: str):
        if room in self.active_connections:
            for connection in self.active_connections[room].copy():
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    self.active_connections[room].discard(connection)

@router.websocket("/ws/{room}")
async def websocket_endpoint(websocket: WebSocket, room: str, token: str = None):
    # Authenticate user with JWT token
    user = await verify_jwt_token(token)
    if not user:
        await websocket.close(code=4001)
        return

    await manager.connect(websocket, room)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Process and broadcast message
            await handle_chat_message(message_data, user, room)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, room)
```

### Authentication & Authorization
```python
from functools import wraps
from jose import jwt, JWTError
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
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
    
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "superuser":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user
```

## 🎨 Frontend Development

### Component Development
```jsx
// Custom hook for API calls
import { useState, useEffect } from 'react';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

// Component using the custom hook
import React from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsPage;
```

### WebSocket Integration
```jsx
// WebSocket hook for real-time chat
import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url, token) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting');

  useEffect(() => {
    const wsUrl = `${url}?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnectionStatus('Connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    ws.onclose = () => {
      setConnectionStatus('Disconnected');
    };

    ws.onerror = (error) => {
      setConnectionStatus('Error');
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [url, token]);

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return { messages, sendMessage, connectionStatus };
};
```

### State Management with Context
```jsx
// Auth context provider
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token and get user info
      validateToken(token).then(userData => {
        setUser(userData);
      }).catch(() => {
        localStorage.removeItem('authToken');
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('authToken', data.access_token);
      setUser(data.user);
      return data;
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## 🧪 Testing Guidelines

### Backend Testing (pytest)
```python
# test_products.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db import get_db, Base

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as client:
        yield client
    Base.metadata.drop_all(bind=engine)

def test_get_products(client):
    response = client.get("/api/products/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_product_requires_admin(client):
    # Test without authentication
    response = client.post("/api/products/", json={
        "name": "Test Product",
        "description": "Test Description",
        "price": 99.99
    })
    assert response.status_code == 401

def test_create_product_as_admin(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.post("/api/products/", 
        json={
            "name": "Test Product",
            "description": "Test Description", 
            "price": 99.99
        },
        headers=headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Product"
    assert data["price"] == 99.99
```

### Frontend Testing (Jest + React Testing Library)
```jsx
// ProductCard.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../components/ProductCard';

const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 99.99,
  image_url: 'test-image.jpg'
};

describe('ProductCard', () => {
  test('renders product information correctly', () => {
    const mockAddToCart = jest.fn();
    
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  test('calls onAddToCart when button is clicked', async () => {
    const mockAddToCart = jest.fn().mockResolvedValue(true);
    
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);
    
    expect(mockAddToCart).toHaveBeenCalledWith(1);
    
    await waitFor(() => {
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });
  });

  test('shows loading state when adding to cart', async () => {
    const mockAddToCart = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Adding...')).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });
});
```

### Integration Testing
```bash
# Run full test suite
cd backend
pytest --cov=app --cov-report=html

cd ../frontend  
npm test -- --coverage --watchAll=false

# End-to-end testing with Playwright
npx playwright test
```

## 🚀 Deployment Process

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Security scan completed
- [ ] Performance benchmarks met

### Deployment Scripts
```bash
# deploy.sh
#!/bin/bash
set -e

echo "Starting deployment process..."

# Backend deployment
echo "Deploying backend..."
cd backend
python -m alembic upgrade head
echo "Backend deployed successfully"

# Frontend deployment
echo "Building frontend..."
cd ../frontend
npm run build
echo "Frontend built successfully"

echo "Deployment completed!"
```

### Environment Management
```bash
# Development
export DATABASE_URL="sqlite:///./app.db"
export JWT_SECRET="dev-secret-key"
export FRONTEND_URL="http://localhost:5173"

# Production
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"
export JWT_SECRET="production-secret-key-256-bits"
export FRONTEND_URL="https://your-app.vercel.app"
```

## 🤝 Contributing Workflow

### Branch Strategy
```bash
# Feature development
git checkout -b feat/user-authentication
# Work on feature
git add .
git commit -m "feat: implement JWT authentication"
git push origin feat/user-authentication
# Create Pull Request

# Bug fixes
git checkout -b fix/cart-calculation-bug
git commit -m "fix: resolve cart total calculation error"

# Documentation
git checkout -b docs/api-reference
git commit -m "docs: add API endpoint documentation"
```

### Pull Request Process
1. **Create Feature Branch:** Branch from `main`
2. **Develop Feature:** Follow coding standards
3. **Write Tests:** Ensure good test coverage
4. **Update Documentation:** Keep docs current
5. **Submit PR:** Include clear description and testing notes
6. **Code Review:** Address reviewer feedback
7. **Merge:** Squash and merge to main

### Code Review Guidelines
- **Functionality:** Does the code work as intended?
- **Security:** Are there any security vulnerabilities?
- **Performance:** Will this impact application performance?
- **Maintainability:** Is the code readable and well-structured?
- **Testing:** Are there adequate tests?
- **Documentation:** Is documentation updated?

## 🔬 Advanced Topics

### Performance Optimization
```python
# Database query optimization
from sqlalchemy.orm import joinedload, selectinload

# Eager loading relationships
def get_products_optimized(db: Session):
    return db.query(Product).options(
        joinedload(Product.variants),
        selectinload(Product.reviews)
    ).all()

# Database connection pooling
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True
)
```

### Caching Strategy
```python
from functools import lru_cache
import redis

# Redis caching
redis_client = redis.Redis(host='localhost', port=6379, db=0)

@lru_cache(maxsize=100)
def get_product_cache_key(product_id: int) -> str:
    return f"product:{product_id}"

async def get_product_cached(product_id: int, db: Session):
    cache_key = get_product_cache_key(product_id)
    
    # Try cache first
    cached_product = redis_client.get(cache_key)
    if cached_product:
        return json.loads(cached_product)
    
    # Fallback to database
    product = db.query(Product).filter(Product.id == product_id).first()
    if product:
        redis_client.setex(cache_key, 3600, json.dumps(product.dict()))
    
    return product
```

### Security Best Practices
```python
# Input validation and sanitization
from pydantic import BaseModel, validator
import re

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    
    @validator('name')
    def name_must_be_valid(cls, v):
        if not v or len(v.strip()) < 1:
            raise ValueError('Name cannot be empty')
        if len(v) > 100:
            raise ValueError('Name too long')
        return v.strip()
    
    @validator('price')
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Price must be positive')
        return round(v, 2)

# Rate limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/products/")
@limiter.limit("5/minute")  # 5 requests per minute
async def create_product(request: Request, ...):
    # Endpoint implementation
    pass
```

### Monitoring and Logging
```python
import logging
from contextlib import asynccontextmanager
import time

# Structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Request timing middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.3f}s"
    )
    
    return response
```

---

**This developer guide is a living document. Please keep it updated as the project evolves.**

*Last updated: November 2025*