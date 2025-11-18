# Broke & Beauty E-Commerce Platform

A complete full-stack e-commerce platform for fashion and beauty brands featuring modern design, secure authentication, product management, cart functionality, and real-time chat support.

## 🚀 Live Demo
- **Frontend:** [Your deployed site URL]
- **Backend API:** [Your API URL]
- **API Documentation:** [Your API URL]/docs

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [API Reference](#api-reference)
- [Contributing](#contributing)

## ✨ Features

### 🔐 Authentication & Security
- Secure user registration and login with email/password
- JWT-based authentication with HTTP-only cookies
- Password hashing using bcrypt
- Protected routes requiring authentication
- Role-based access control (user/admin)
- CORS configuration for cross-origin requests

### 🛍️ E-Commerce Core
- **Product Catalog:** Browse products with detailed information, images, and variants
- **Shopping Cart:** Add/remove products with persistent cart state
- **User Profiles:** Manage personal information and view order history
- **Wishlist:** Save favorite products for later
- **Size Recommender:** AI-powered sizing recommendations
- **Payment Integration:** Secure checkout with multiple payment methods

### 👨‍💼 Administration
- Admin-only product CRUD operations
- Product variant management (size, color, stock)
- User management capabilities
- Order tracking and fulfillment
- Real-time chat moderation

### 💬 Real-Time Chat System
- **WebSocket-based live chat** with room support (General, Support)
- **Instant messaging** - messages appear in real-time across all clients
- **Typing indicators** - see when other users are typing
- **Message persistence** - all messages saved to database
- **Admin moderation** - delete inappropriate messages
- **Room isolation** - separate chat rooms for different purposes

### 🎨 User Experience
- Responsive design that works on all devices
- Modern UI with TailwindCSS and shadcn/ui components
- Fast loading with Vite and optimized builds
- Intuitive navigation and user flows
- Accessibility compliant design

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Lightning-fast development and builds
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **React Router** - Client-side routing
- **TypeScript** - Type-safe JavaScript

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - Powerful SQL toolkit and ORM
- **Alembic** - Database migration tool
- **Pydantic** - Data validation using Python type hints
- **JWT** - Secure token-based authentication
- **WebSockets** - Real-time communication

### Database & Deployment
- **SQLite** (development) / **PostgreSQL** (production)
- **Render** - Backend hosting with PostgreSQL
- **Vercel** - Frontend hosting with CDN
- **GitHub Actions** - CI/CD pipelines

## 🚀 Production Deployment

### Step-by-Step Render + Vercel Deployment

#### 1. Backend Deployment (Render)
1. **Create Render Account**
   - Visit [render.com](https://render.com) and sign up with GitHub
   - Connect your repository

2. **Create PostgreSQL Database**
   - Go to Render Dashboard → New → PostgreSQL
   - Choose instance type (Free tier available)
   - Note the **Internal Database URL** for later

3. **Deploy Backend Service**
   - Click "New +" → "Blueprint" or "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
     - **Root Directory:** `backend`

4. **Set Environment Variables**
   ```env
   DATABASE_URL=your-postgresql-internal-url-here
   JWT_SECRET=your-super-secret-jwt-key-256-bits
   FRONTEND_URL=https://your-app.vercel.app
   ```

#### 2. Frontend Deployment (Vercel)
1. **Create Vercel Account**
   - Visit [vercel.com](https://vercel.com) and sign up with GitHub

2. **Import Project**
   - Click "New Project" → Import your repository
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

3. **Set Environment Variables**
   ```env
   VITE_API_URL=https://your-backend.onrender.com
   ```

4. **Deploy**
   - Click "Deploy" and wait for build completion
   - Your app will be live at `https://your-app.vercel.app`

#### 3. Database Setup
```bash
# Connect to your Render service via Shell
# Navigate to your service → Shell tab in Render dashboard

# Run database migrations
python -m alembic upgrade head

# Seed with sample data
python seed_production.py
```

#### 4. Verify Deployment
- **Backend Health Check:** `https://your-backend.onrender.com/health`
- **Frontend:** `https://your-app.vercel.app`
- **API Documentation:** `https://your-backend.onrender.com/docs`

### Alternative: Heroku + Netlify
See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for detailed Heroku and Netlify deployment instructions.

## 📚 API Reference

### Authentication Endpoints
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Product Endpoints
```http
GET /products/
# Returns array of all products with variants

POST /products/
Authorization: Bearer <jwt_token>
Content-Type: application/json
# Admin only - Create new product

PUT /products/{id}
Authorization: Bearer <jwt_token>
Content-Type: application/json
# Admin only - Update product
```

### Chat Endpoints
```http
# WebSocket connection
WS /chat/ws/{room}?token=<jwt_token>
# Rooms: 'general', 'support'

GET /chat/history?room={room}&limit=50
Authorization: Bearer <jwt_token>

DELETE /chat/messages/{message_id}
Authorization: Bearer <jwt_token>
# Admin only
```

### Full OpenAPI Documentation
Visit your deployed backend at `/docs` for complete interactive API documentation powered by FastAPI's automatic OpenAPI generation.

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feat/amazing-feature`
7. Open a Pull Request

### Code Standards
- **Python:** Follow PEP 8, use `black` for formatting
- **JavaScript:** Use ESLint configuration
- **Commits:** Use conventional commits (feat:, fix:, docs:)
- **Testing:** Write tests for new features

### Project Structure
```
broke_n_beauty_ecommerce/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── models/       # SQLAlchemy models
│   │   ├── routers/      # API route handlers
│   │   ├── schemas/      # Pydantic schemas
│   │   └── main.py       # FastAPI app
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── utils/        # Utility functions
├── docs/                 # Documentation
└── days/                 # Development log
```

## 🚀 Quick Start

Get the entire application running in under 5 minutes:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd broke_n_beauty_ecommerce

# 2. Start the backend
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 3. In a new terminal, start the frontend
cd frontend
npm install
npm run dev

# 4. Open your browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## 📦 Installation

### Prerequisites
- **Python 3.11+** - Download from [python.org](https://python.org)
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org)
- **Git** - Version control system

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd broke_n_beauty_ecommerce
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# The SQLite database will be created automatically on first run
# To add sample data, run:
python seed_production.py
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Install additional UI components (if needed)
npm install @radix-ui/react-dialog @radix-ui/react-select lucide-react
```

## 🔧 Development

### Running Development Servers

#### Backend Development Server
```bash
cd backend
source .venv/bin/activate  # Activate virtual environment
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Development Server
```bash
cd frontend
npm run dev  # Runs on http://localhost:5173
```

### Development URLs
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs (Interactive Swagger UI)
- **Alternative API Docs:** http://localhost:8000/redoc
- **Real-time Chat:** http://localhost:5173/chat (login required)

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=sqlite:///./app.db
# For production: postgresql://user:pass@host:5432/dbname

# Security
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:5173

# Optional: Email configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

### Database Management

#### SQLite (Development)
```bash
# View database content
sqlite3 backend/app.db
.tables
.schema products
SELECT * FROM products LIMIT 5;
.exit

# Reset database (delete and restart backend)
rm backend/app.db
```

#### PostgreSQL (Production)
```bash
# Connect to production database
psql $DATABASE_URL

# Run migrations
cd backend
python -m alembic upgrade head

# Seed production data
python seed_production.py
```

## Real-Time Chat Setup & Testing

### Quick Start
1. **Start both servers** (backend and frontend as shown above)
2. **Log in** to the application
3. **Click "Chat"** in the navigation bar
4. **Start chatting!** Messages appear instantly for all connected users

### WebSocket Chat Endpoints

#### Connect to Chat Room
**WebSocket:** `ws://localhost:8000/chat/ws/{room}?token=<jwt_token>`

**Available Rooms:**
- `general` - General discussion
- `support` - Customer support

**Message Types:**
```javascript
// Send a message
{
  "type": "message",
  "content": "Hello, world!"
}

// Send typing indicator
{
  "type": "typing",
  "is_typing": true
}
```

#### Get Chat History
**HTTP GET:** `/chat/history?room={room}&limit={limit}`

**Example:**
```bash
curl "http://localhost:8000/chat/history?room=general&limit=50"
```

**Response:**
```json
[
  {
    "id": 1,
    "room": "general",
    "user_id": 1,
    "username": "John Doe",
    "message": "Hello everyone!",
    "created_at": "2025-10-29T12:00:00"
  }
]
```

#### Delete Message (Admin Only)
**HTTP DELETE:** `/chat/messages/{message_id}`

**Example:**
```bash
curl -X DELETE "http://localhost:8000/chat/messages/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (Success):**
```json
{
  "message": "Message deleted successfully",
  "id": 1,
  "room": "general"
}
```

**Response (Non-Admin):**
```json
{
  "detail": "Admin access required. Only superusers can delete messages."
}
```

### Admin User Setup

To grant admin privileges to a user:

```sql
-- Using SQLite (development)
sqlite3 app.db
UPDATE users SET role = 'superuser' WHERE email = 'admin@example.com';
.exit

-- Or using Python
python3 -c "
from backend.app.db import SessionLocal
from backend.app.models import User
db = SessionLocal()
user = db.query(User).filter(User.email == 'admin@example.com').first()
if user:
    user.role = 'superuser'
    db.commit()
    print('User updated to superuser')
db.close()
"
```

### Testing Real-Time Chat

**Test with two browser tabs:**
1. Open `http://localhost:5173/chat` in Tab 1
2. Open `http://localhost:5173/chat` in Tab 2
3. Log in with the same or different accounts in both tabs
4. Send a message from Tab 1
5. **Success:** Message appears instantly in Tab 2!

**Test typing indicators:**
1. Start typing in Tab 1
2. **Success:** "User is typing..." appears in Tab 2
3. Stop typing for 2 seconds
4. **Success:** Typing indicator disappears

**Test admin deletion:**
1. Grant admin role to a user (see above)
2. Log in as admin user
3. Hover over any message
4. **Success:** Delete button (🗑️) appears
5. Click delete button
6. **Success:** Message disappears from all connected clients instantly

### Chat Test Page

For quick testing without the full UI, visit:
**`http://localhost:5173/chat-test.html`**

This standalone test page:
- Auto-loads your JWT token from localStorage
- Provides a simple interface for WebSocket testing
- Shows all WebSocket events in real-time
- Perfect for debugging and development

---

**Versioning:** SemVer starting at v0.1.0 • **Branching:** trunk‑based with short‑lived feature branches (e.g., `feat/auth-jwt`, `fix/cart-precision`, `feat/realtime-chat`).



## 🧪 Testing

### Run Backend Tests
```bash
cd backend
source .venv/bin/activate
pytest

# With coverage
pytest --cov=app --cov-report=html
```

### Run Frontend Tests
```bash
cd frontend
npm test

# Run in watch mode
npm test -- --watch
```

### Testing Checklist
- [ ] User registration and login
- [ ] Product browsing and search
- [ ] Cart functionality (add/remove items)
- [ ] Real-time chat messaging
- [ ] Admin product management
- [ ] Responsive design on mobile/desktop

## 🔒 Security Features
- **Password Hashing:** bcrypt with salt rounds
- **JWT Authentication:** Secure token-based auth with HTTP-only cookies
- **Input Validation:** Pydantic schemas prevent injection attacks
- **CORS Configuration:** Controlled cross-origin access
- **Database Protection:** SQLAlchemy ORM prevents SQL injection
- **Environment Variables:** Sensitive data kept in environment configs

## 📊 Monitoring & Analytics
- **Health Checks:** `/health` endpoint for uptime monitoring
- **Database Monitoring:** Connection pooling and query optimization
- **Error Tracking:** Comprehensive error handling and logging
- **Performance Metrics:** Response time monitoring

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check Python version
python --version  # Should be 3.11+

# Recreate virtual environment
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**Frontend build fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

**Database connection errors:**
```bash
# Reset SQLite database
rm backend/app.db

# Or check PostgreSQL connection
psql $DATABASE_URL -c "SELECT 1;"
```

**Chat not connecting:**
- Ensure both backend and frontend are running
- Check browser console for WebSocket errors
- Verify JWT token is valid (check localStorage)

## 📄 License
MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- **FastAPI** - Amazing Python web framework
- **React** - Fantastic UI library
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **Render & Vercel** - Excellent hosting platforms

## 🔗 Links
- **Live Demo:** [Your deployed URL]
- **API Documentation:** [Your API URL]/docs
- **Repository:** [Your GitHub repo URL]
- **Issues:** [Your GitHub repo URL]/issues

---

**Built with ❤️ for modern e-commerce experiences**

*Last updated: November 2025 | Version: 1.0.0*
