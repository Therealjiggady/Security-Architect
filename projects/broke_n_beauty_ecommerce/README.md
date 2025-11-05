# Clover Line – Secure E‑Commerce Platform with SmartFit Size Recommender

Monorepo for the Clover Line e‑commerce platform (frontend + backend).

## Repo Structure
```
cloverline/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── db.py
│   │   ├── models/
│   │   ├── routers/
│   │   └── __init__.py
│   ├── .env
│   ├── requirements.txt
│   ├── test_connection.py
│   └── venv/  # local only, do not commit
├── database/
│   ├── schema.sql
│   └── seed.sql
├── docs/
├── frontend/
└── README.md
```

## Project Summary
Clover Line is a full‑stack e‑commerce platform for a small clothing brand, featuring secure authentication, product catalog, cart/checkout, order tracking, and admin dashboards. A built‑in **SmartFit** recommender improves conversions by suggesting sizes from body measurements or quick inputs (height/weight).

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS, React Router
- **Backend:** FastAPI (Python), Pydantic, SQLAlchemy, Alembic
- **Database:** PostgreSQL (prod), SQLite (dev)
- **Security:** JWT, bcrypt, input validation, HTTPS, secure cookies
- **Payments:** Stripe/PayPal (planned)
- **Testing:** pytest, Jest, React Testing Library
- **CI/CD:** GitHub Actions, pre‑commit, black/ruff, Bandit, pip‑audit
- **Hosting:** Backend on Render/Heroku/Railway; Frontend on Vercel/Netlify

## Goals (MVP)
- Auth (signup/login) with hashed passwords + JWT
- Product catalog (CRUD for admins)
- Cart + checkout → order creation
- SmartFit API endpoint for size suggestions
- Basic admin dashboard
- Deployed demo (frontend + backend) with docs

## Features

### Authentication
- User registration and login with email/password
- JWT-based authentication with secure HTTP-only cookies
- Password hashing using bcrypt
- Protected routes requiring authentication
- Role-based access control (user/superuser)

### Product Catalog
- View all products with details, images, and variants
- Admin-only CRUD operations for products
- Product variants with size, color, and stock management
- Image upload for products

### Cart Functionality
- Frontend-based cart using React Context
- Add/remove products from cart
- Persistent cart state during session

### User Management
- User profiles with email and full name
- Admin ability to delete users (for testing/cleanup)

### Real-Time Chat System 🆕
- **WebSocket-based live chat** with room support (General, Support)
- **JWT authentication** required for connections
- **Real-time messaging** - messages appear instantly across all connected clients
- **Typing indicators** - see when other users are typing
- **Message persistence** - all messages saved to database
- **Admin moderation** - superusers can delete inappropriate messages
- **500-character message limit** enforced
- **Room isolation** - messages only visible within the same room
- **User join/leave notifications**

### API Endpoints
- `/auth/signup` - User registration
- `/auth/login` - User login
- `/products/` - Get all products (public), create product (admin)
- `/products/{id}` - Update product (admin)
- `/users/me` - Get current user info
- `/health` - Health check endpoint
- **`WS /chat/ws/{room}?token=<jwt>`** - WebSocket chat connection 🆕
- **`GET /chat/history`** - Get chat message history 🆕
- **`DELETE /chat/messages/{id}`** - Delete message (admin only) 🆕

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- SQLite (for development) or PostgreSQL (for production)

### Database Setup
1. For development (SQLite):
   - The database file `app.db` is created automatically when the backend starts.
   - To seed with sample data, run:
     ```bash
     python seed_products.py
     ```

2. For production (PostgreSQL):
   - Update `backend/app/db.py` with your PostgreSQL connection string.
   - Run the schema and seed scripts from `database/schema.sql` and `database/seed.sql`.

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Optional: seed database
python ../seed_products.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

### Running Both Servers
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- API Docs: `http://localhost:8000/docs` (FastAPI Swagger UI)
- **Live Chat**: `http://localhost:5173/chat` (requires login) 🆕

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

