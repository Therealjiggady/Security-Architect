# Learning Notes - Broke N Beauty E-commerce Project

## Overview
This document contains key learnings, best practices, and technical notes from building the Broke N Beauty e-commerce platform.

---

## Table of Contents
1. [Frontend Development](#frontend-development)
2. [Backend Development](#backend-development)
3. [Real-Time Communication](#real-time-communication)
4. [Testing Strategies](#testing-strategies)
5. [Security Best Practices](#security-best-practices)
6. [Performance Optimization](#performance-optimization)
7. [Deployment](#deployment)
8. [Common Issues & Solutions](#common-issues--solutions)

---

## Frontend Development

### React Best Practices

#### Component Organization
```javascript
// ✅ Good: Functional components with hooks
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div onMouseEnter={() => setIsHovered(true)}>
      {product.name}
    </div>
  );
};

// ❌ Avoid: Class components (legacy)
class ProductCard extends React.Component { ... }
```

#### Context API for State Management
```javascript
// Create context in separate file
const UserContext = createContext();

// Provider wraps app
<UserProvider>
  <App />
</UserProvider>

// Consume with hook
const { user, login } = useUser();
```

#### Lazy Loading for Performance
```javascript
// Code splitting with React.lazy
const ProductsPage = lazy(() => import('./ProductsPage'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ProductsPage />
</Suspense>
```

### Tailwind CSS Tips

```css
/* Use utility classes for consistency */
className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"

/* Custom classes when needed */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
  }
}
```

### React Router Patterns

```javascript
// Protected routes
<Route 
  path="/profile" 
  element={user ? <ProfilePage /> : <Navigate to="/login" />} 
/>

// Nested routes
<Route path="/products">
  <Route index element={<ProductList />} />
  <Route path=":id" element={<ProductDetail />} />
</Route>
```

---

## Backend Development

### FastAPI Structure

#### Models (SQLAlchemy)
```python
# Always use proper typing
class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    
    # Add indexes for frequently queried fields
    __table_args__ = (
        Index('idx_product_name', 'name'),
    )
```

#### Schemas (Pydantic)
```python
# Separate schemas for input/output
class ProductCreate(BaseModel):
    name: str = Field(..., max_length=255)
    price: float = Field(..., gt=0)

class ProductRead(BaseModel):
    id: int
    name: str
    price: float
    
    class Config:
        orm_mode = True  # Enable ORM compatibility
```

#### Routers
```python
# Keep routes thin, logic in services/controllers
@router.post("/products", response_model=ProductRead)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    return create_product_service(product, db)
```

### Database Best Practices

#### Query Optimization
```python
# ❌ N+1 query problem
products = db.query(Product).all()
for product in products:
    category = product.category  # Additional query!

# ✅ Eager loading
products = db.query(Product)\
    .options(joinedload(Product.category))\
    .all()
```

#### Pagination
```python
# Always paginate large datasets
@router.get("/products")
def get_products(
    skip: int = 0,
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db)
):
    return db.query(Product).offset(skip).limit(limit).all()
```

---

## Real-Time Communication

### WebSocket Implementation

#### Backend (FastAPI)
```python
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, room: str):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = []
        self.active_connections[room].append(websocket)
    
    async def broadcast(self, room: str, message: dict):
        for connection in self.active_connections.get(room, []):
            try:
                await connection.send_json(message)
            except:
                # Remove dead connections
                self.active_connections[room].remove(connection)
```

#### Frontend (React)
```javascript
useEffect(() => {
  const ws = new WebSocket(`ws://localhost:8000/chat/ws/${room}?token=${token}`);
  
  ws.onopen = () => console.log('Connected');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Handle different message types
    if (data.type === 'message') {
      setMessages(prev => [...prev, data.data]);
    }
  };
  
  ws.onerror = (error) => console.error('WebSocket error:', error);
  
  ws.onclose = () => console.log('Disconnected');
  
  return () => ws.close();
}, [room, token]);
```

### Key Learnings
- WebSockets enable bidirectional real-time communication
- Always handle connection errors and cleanup
- Use rooms/channels to organize conversations
- Implement reconnection logic for reliability
- Add typing indicators for better UX

---

## Testing Strategies

### Unit Testing

#### Frontend (Jest + React Testing Library)
```javascript
// Test component rendering
it('should render product name', () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText('Test Product')).toBeInTheDocument();
});

// Test user interactions
it('should call onClick when clicked', () => {
  const onClick = jest.fn();
  render(<Button onClick={onClick}>Click me</Button>);
  fireEvent.click(screen.getByText('Click me'));
  expect(onClick).toHaveBeenCalled();
});

// Test async operations
it('should fetch data on mount', async () => {
  render(<ProductList />);
  await waitFor(() => {
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });
});
```

#### Backend (pytest)
```python
def test_create_product(client, db):
    response = client.post(
        "/products",
        json={"name": "Test", "price": 29.99}
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Test"
```

### Integration Testing

```javascript
// Test API integration with supertest
describe('Product API', () => {
  it('should create and retrieve product', async () => {
    // Create
    const createRes = await request(app)
      .post('/products')
      .send({ name: 'Test', price: 29.99 });
    
    const productId = createRes.body.id;
    
    // Retrieve
    const getRes = await request(app)
      .get(`/products/${productId}`);
    
    expect(getRes.body.name).toBe('Test');
  });
});
```

### Testing Best Practices
- Write tests before or alongside code (TDD)
- Aim for 80%+ code coverage
- Test edge cases and error conditions
- Mock external dependencies
- Keep tests isolated and independent
- Use descriptive test names

---

## Security Best Practices

### Authentication & Authorization

#### JWT Token Management
```python
# Backend: Create secure tokens
def create_access_token(sub: str) -> str:
    payload = {
        "sub": sub,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

# Verify tokens
def verify_token(token: str) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

```javascript
// Frontend: Store tokens securely
localStorage.setItem('token', access_token);

// Include in requests
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

#### Password Security
```python
# Use bcrypt or argon2 for hashing
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

# Hash passwords before storing
hashed = pwd_context.hash(plain_password)

# Verify passwords
pwd_context.verify(plain_password, hashed_password)
```

### CORS Configuration
```python
# Allow specific origins only
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Development
        "https://yourdomain.com"  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

### Input Validation
```python
# Always validate input
class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    price: float = Field(..., gt=0, le=100000)
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v
```

### SQL Injection Prevention
```python
# ✅ Use ORM (SQLAlchemy) - safe from SQL injection
products = db.query(Product).filter(Product.name == user_input).all()

# ❌ Never use raw SQL with user input
db.execute(f"SELECT * FROM products WHERE name = '{user_input}'")
```

---

## Performance Optimization

### Frontend Optimization

#### Code Splitting
```javascript
// Split by route
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));

// Split by feature
const Chat = lazy(() => import('./features/Chat'));
```

#### Image Optimization
```javascript
// Use lazy loading
<img src={product.image} loading="lazy" alt={product.name} />

// Use appropriate formats (WebP)
<picture>
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Product" />
</picture>
```

#### Memoization
```javascript
// Prevent unnecessary re-renders
const MemoizedComponent = React.memo(ExpensiveComponent);

// Memoize expensive calculations
const totalPrice = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

### Backend Optimization

#### Database Indexing
```python
# Add indexes to frequently queried columns
class Product(Base):
    __table_args__ = (
        Index('idx_product_category', 'category'),
        Index('idx_product_price', 'price'),
    )
```

#### Caching
```python
# Use Redis for caching
from redis import Redis

redis_client = Redis(host='localhost', port=6379)

# Cache expensive queries
@lru_cache(maxsize=100)
def get_popular_products():
    return db.query(Product).order_by(Product.views.desc()).limit(10).all()
```

#### Connection Pooling
```python
engine = create_engine(
    DATABASE_URL,
    pool_size=10,          # Persistent connections
    max_overflow=20,       # Additional connections under load
    pool_pre_ping=True,    # Verify connections before use
    pool_recycle=3600      # Recycle connections after 1 hour
)
```

### Compression
```javascript
// Node.js/Express
const compression = require('compression');
app.use(compression());

// Reduces response size by 70-90%
```

---

## Deployment

### Environment Variables

```bash
# .env (never commit this!)
DATABASE_URL=postgresql://user:pass@localhost/dbname
JWT_SECRET=your-super-secret-key-here
STRIPE_SECRET_KEY=sk_test_...
NODE_ENV=production
```

```python
# Load in application
from dotenv import load_dotenv
load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
```

### Production Checklist

#### Backend
- [ ] Use production database (PostgreSQL)
- [ ] Set strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up error logging (Sentry)
- [ ] Enable rate limiting
- [ ] Use gunicorn/uvicorn workers
- [ ] Set up database backups

#### Frontend
- [ ] Build for production (`npm run build`)
- [ ] Minify and compress assets
- [ ] Use CDN for static assets
- [ ] Enable service workers (PWA)
- [ ] Configure SEO meta tags
- [ ] Set up analytics
- [ ] Enable error tracking

### Deployment Platforms

**Frontend:**
- Vercel (recommended for React)
- Netlify
- GitHub Pages

**Backend:**
- Railway (easy Python deployment)
- Heroku
- DigitalOcean
- AWS/Google Cloud

**Database:**
- Railway (PostgreSQL)
- Supabase
- PlanetScale
- AWS RDS

---

## Common Issues & Solutions

### Issue: CORS Errors

**Problem:** 
```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:**
```python
# Add CORS middleware to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

### Issue: JWT Token Not Working

**Problem:** Getting 401 Unauthorized

**Solution:**
```javascript
// Check token is stored correctly
const token = localStorage.getItem('token');
console.log('Token:', token);

// Include in Authorization header
headers: {
  'Authorization': `Bearer ${token}`
}

// Verify token hasn't expired
// Tokens typically expire after 1 hour
```

### Issue: WebSocket Connection Fails

**Problem:** WebSocket won't connect

**Solutions:**
```javascript
// 1. Check URL format
const ws = new WebSocket('ws://localhost:8000/chat/ws/general?token=...');
// Note: ws:// not wss:// for local development

// 2. Include authentication token
const token = localStorage.getItem('token');
const ws = new WebSocket(`ws://localhost:8000/chat/ws/general?token=${token}`);

// 3. Check backend is running on correct port
```

### Issue: Database Migration Errors

**Problem:** Table doesn't exist

**Solution:**
```python
# Recreate all tables (development only)
from app.db import Base, engine
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

# Or use Alembic for proper migrations
alembic revision --autogenerate -m "Create tables"
alembic upgrade head
```

### Issue: React State Not Updating

**Problem:** Component doesn't re-render

**Solutions:**
```javascript
// 1. Make sure you're not mutating state directly
// ❌ Don't do this
state.push(item);

// ✅ Do this
setState([...state, item]);

// 2. Use functional updates for state that depends on previous state
setState(prev => [...prev, item]);

// 3. Check dependencies in useEffect
useEffect(() => {
  fetchData();
}, [dependency]); // Make sure dependency is listed
```

### Issue: Password Login Fails

**Problem:** "Invalid email or password" even with correct credentials

**Solutions:**
```python
# 1. Check password hash is stored correctly
user = db.query(User).filter(User.email == email).first()
print(f"Hash in DB: {user.hashed_password}")

# 2. Verify password hashing is consistent
from app.auth import get_password_hash, verify_password

# When creating user
hashed = get_password_hash(password)

# When verifying
is_valid = verify_password(plain_password, user.hashed_password)

# 3. Make sure you're using the same hashing algorithm
# (bcrypt, argon2, etc.)
```

---

## Quick Reference

### Common Commands

```bash
# Backend (FastAPI)
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload

# Frontend (React)
cd frontend
npm run dev

# Run tests
npm test                    # Frontend
pytest                      # Backend

# Build for production
npm run build              # Frontend
```

### Useful VS Code Extensions
- Python
- Pylance
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- SQLite Viewer
- Thunder Client (API testing)
- GitLens

### Learning Resources
- React Docs: https://react.dev
- FastAPI Docs: https://fastapi.tiangolo.com
- Tailwind CSS: https://tailwindcss.com
- PostgreSQL Tutorial: https://www.postgresqltutorial.com
- WebSocket Guide: https://javascript.info/websocket

---

## Project Structure Best Practices

```
broke_n_beauty_ecommerce/
├── backend/
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routers/        # API endpoints
│   │   ├── auth.py         # Authentication logic
│   │   ├── db.py          # Database connection
│   │   └── main.py        # Application entry
│   ├── tests/             # Backend tests
│   └── requirements.txt   # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   └── package.json       # Node dependencies
│
├── days/                  # Daily documentation
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

---

## Final Tips

### Development Workflow
1. Plan features with user stories
2. Write tests first (TDD)
3. Implement features incrementally
4. Commit frequently with clear messages
5. Review and refactor regularly
6. Document as you go
7. Deploy early and often

### Code Quality
- Use linters (ESLint, Pylint)
- Follow style guides (PEP 8 for Python, Airbnb for JavaScript)
- Write meaningful comments
- Keep functions small and focused
- Use descriptive variable names
- Avoid code duplication (DRY principle)

### Debugging Tips
- Use debugger, don't just console.log
- Read error messages carefully
- Check network requests in DevTools
- Verify environment variables
- Test in isolation
- Ask for help when stuck

---

**Last Updated:** November 6, 2024  
**Project:** Broke N Beauty E-commerce Platform  
**Status:** Production-ready with comprehensive testing ✅