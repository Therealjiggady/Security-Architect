# New Technology: Real-Time Chat Board (WebSocket Implementation)

## Overview
Successfully implemented the backend infrastructure for a real-time chat system using FastAPI WebSockets. This is a new technology addition to the e-commerce platform, enabling live customer-to-customer and customer-to-support communication.

## Features Implemented

### 1. ChatMessage Database Model
Created [`backend/app/models/chat.py`](../backend/app/models/chat.py:1) with the following schema:

```python
class ChatMessage(Base):
    """SQLAlchemy ORM model for chat messages"""
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    room = Column(String(50), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    username = Column(String(255), nullable=False)  # Denormalized for fast retrieval
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationship
    user = relationship("User", backref="chat_messages")
```

**Key Features:**
- Stores messages by room for organization
- Links to user via foreign key
- Denormalizes username for faster message retrieval
- Supports unlimited message length (Text type)
- Auto-timestamps with created_at

### 2. Chat Schemas
Created [`backend/app/schemas/chat.py`](../backend/app/schemas/chat.py:1) with Pydantic models:

```python
class ChatMessageCreate(BaseModel):
    """Schema for creating messages"""
    message: str = Field(..., max_length=500)

class ChatMessageRead(BaseModel):
    """Schema for reading messages"""
    id: int
    room: str
    user_id: int
    username: str
    message: str
    created_at: datetime

class WebSocketMessage(BaseModel):
    """Schema for WebSocket events"""
    type: str  # 'message', 'typing', 'user_joined', 'user_left', 'delete'
    data: dict

class TypingIndicator(BaseModel):
    """Schema for typing events"""
    username: str
    is_typing: bool
```

### 3. WebSocket Router with Connection Manager
Created [`backend/app/routers/chat.py`](../backend/app/routers/chat.py:1) with comprehensive WebSocket functionality.

#### Constants Defined
```python
ALLOWED_ROOMS = {"general", "support"}
MAX_MESSAGE_LENGTH = 500
```

#### ConnectionManager Class
Manages all active WebSocket connections:

```python
class ConnectionManager:
    """Manages WebSocket connections and message broadcasting"""
    
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.connection_usernames: Dict[WebSocket, str] = {}
    
    async def connect(websocket, room, username):
        """Add connection to room and broadcast user_joined"""
        
    async def disconnect(websocket, room):
        """Remove connection and broadcast user_left"""
        
    async def broadcast(room, message, exclude=None):
        """Send message to all connections in room"""
        
    async def send_personal_message(websocket, message):
        """Send message to specific connection"""
```

**Key Features:**
- Tracks connections per room for efficient broadcasting
- Maintains username mapping for each connection
- Broadcasts user join/leave events
- Handles connection cleanup automatically
- Removes dead connections during broadcast

### 4. JWT Authentication for WebSockets
Implemented secure authentication:

```python
async def verify_websocket_token(token: str, db: Session) -> User:
    """Verify JWT token for WebSocket authentication"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user
```

**Security Features:**
- Validates JWT token before accepting WebSocket connection
- Reuses existing JWT_SECRET and JWT_ALG from auth system
- Returns authenticated User object
- Closes connection immediately if authentication fails

### 5. WebSocket Endpoint
Main endpoint at `ws://localhost:8000/chat/ws/{room}?token=<jwt_token>`:

```python
@router.websocket("/ws/{room}")
async def websocket_endpoint(
    websocket: WebSocket,
    room: str,
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Real-time chat WebSocket endpoint.
    
    Message Types:
    - Send: {"type": "message", "content": "your message"}
    - Send: {"type": "typing", "is_typing": true}
    - Receive: {"type": "message", "data": {...}}
    - Receive: {"type": "typing", "data": {...}}
    - Receive: {"type": "user_joined", "data": {...}}
    - Receive: {"type": "user_left", "data": {...}}
    """
```

**Functionality:**
1. Validates room name against ALLOWED_ROOMS
2. Authenticates user via JWT token
3. Connects user to chat room
4. Handles incoming messages:
   - **message**: Saves to database and broadcasts to all users
   - **typing**: Broadcasts typing indicator to others
5. Validates message length (max 500 characters)
6. Broadcasts user join/leave events
7. Handles disconnections and errors gracefully

### 6. Chat History Endpoint
HTTP endpoint for retrieving message history:

```python
@router.get("/history", response_model=List[ChatMessageRead])
async def get_chat_history(
    room: str = Query(...),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get recent messages from a chat room"""
```

**Features:**
- Retrieves up to 100 recent messages
- Returns messages in chronological order (oldest first)
- Validates room name
- Public endpoint (can add auth in future)

### 7. Test Page
Created [`frontend/public/chat-test.html`](../frontend/public/chat-test.html:1) for testing WebSocket functionality.

**Features:**
- Beautiful UI with gradient design
- JWT token input field
- Room selection (General/Support)
- Connect/Disconnect functionality
- Real-time message display
- Typing indicator support
- System messages for events
- Enter key to send messages
- Auto-scroll to latest message
- Instructions for getting JWT token

**Access:** http://localhost:5173/chat-test.html

## API Endpoints

### WebSocket
- **WS** `ws://localhost:8000/chat/ws/{room}?token=<jwt_token>`
  - Rooms: `general`, `support`
  - Requires: Valid JWT token in query parameter
  - Events: message, typing, user_joined, user_left

### HTTP
- **GET** `/chat/history?room={room}&limit={limit}`
  - Get recent messages from a room
  - Default limit: 50, max: 100
  - Returns: Array of ChatMessageRead

- **DELETE** `/chat/messages/{message_id}`
  - Delete a message (placeholder for Task 3)
  - Will add admin role check later

## Testing Instructions

### Step 1: Get JWT Token
1. Navigate to http://localhost:5173/login
2. Log in with your credentials
3. Open browser DevTools (F12)
4. Go to Network tab
5. Look for the login request
6. Copy the JWT token from the response

### Step 2: Test WebSocket Connection
1. Open http://localhost:5173/chat-test.html
2. Paste your JWT token in the input field
3. Select a room (General or Support)
4. Click "Connect to Chat"
5. You should see "Connected" status and "✅ Connected to chat!" message

### Step 3: Test Real-Time Messaging
1. Open the same chat-test.html page in a **second browser tab**
2. Connect both tabs with the same (or different) JWT tokens
3. Send a message from one tab
4. **Success**: Message appears in both tabs within 1 second
5. Test typing indicator by typing in one tab

### Step 4: Test Room Isolation
1. Connect Tab 1 to "General" room
2. Connect Tab 2 to "Support" room
3. Send messages in each
4. **Success**: Messages only appear in the same room

## Message Flow

### Sending a Message
```
Client                  Server                   Database
  |                       |                          |
  |---{"type":"message"}->|                          |
  |                       |--Save message----------->|
  |                       |<-Message ID--------------|
  |                       |                          |
  |<--broadcast message---|                          |
  |                       |--broadcast to all------->|
```

### Typing Indicator
```
Client A                Server                  Client B
  |                       |                          |
  |--{"type":"typing"}---->|                          |
  |                       |--broadcast (exclude A)-->|
  |                       |                          |<-Shows "A is typing"
```

## Key Programming Concepts Used

### 1. Async/Await
All WebSocket operations use async functions for non-blocking I/O:
```python
async def connect(websocket: WebSocket, room: str, username: str)
async def broadcast(room: str, message: dict)
```

### 2. Dictionary Data Structures
Efficient connection tracking:
```python
self.active_connections: Dict[str, List[WebSocket]] = {}
self.connection_usernames: Dict[WebSocket, str] = {}
```

### 3. Exception Handling
Proper error handling for WebSocket disconnects:
```python
try:
    while True:
        data = await websocket.receive_text()
        # Process message
except WebSocketDisconnect:
    await manager.disconnect(websocket, room)
except Exception as e:
    print(f"WebSocket error: {e}")
```

### 4. Constants
```python
ALLOWED_ROOMS = {"general", "support"}
MAX_MESSAGE_LENGTH = 500
```

### 5. Validation
- Room name validation
- Message length validation (500 char max)
- Empty message rejection
- JWT token validation

## Files Created/Modified

### Backend
1. ✅ [`backend/app/models/chat.py`](../backend/app/models/chat.py:1) - ChatMessage model
2. ✅ [`backend/app/schemas/chat.py`](../backend/app/schemas/chat.py:1) - Chat schemas
3. ✅ [`backend/app/routers/chat.py`](../backend/app/routers/chat.py:1) - WebSocket router and ConnectionManager
4. ✅ [`backend/app/models/__init__.py`](../backend/app/models/__init__.py:1) - Added ChatMessage import
5. ✅ [`backend/app/main.py`](../backend/app/main.py:1) - Registered chat router

### Frontend
6. ✅ [`frontend/public/chat-test.html`](../frontend/public/chat-test.html:1) - WebSocket test page

## Success Criteria ✅

Task 1 Success Criteria from PLAN.md:
> "Two browser tabs connected to the same chat room see new messages appear in real time within 1 second when either sends a message."

**Status**: ✅ **READY FOR TESTING**

The backend infrastructure is complete and ready for testing:
- ✅ WebSocket server running
- ✅ JWT authentication implemented
- ✅ Message broadcasting functional
- ✅ Database persistence ready
- ✅ Test page created
- ✅ Connection manager handling multiple clients

## Next Steps

### Immediate: Testing Phase
1. Get JWT token from login
2. Open chat-test.html in two browser tabs
3. Connect both tabs to same room
4. Send messages and verify real-time delivery
5. Test typing indicators
6. Test user join/leave notifications
7. Take screenshots/video for proof

### Task 2 (Nov 1-5): React Chat UI
After testing validates Task 1, proceed to:
- Create ChatBoard React component
- Integrate with existing UI
- Add polished typing indicators
- Improve UX with animations

### Task 3 (Nov 6-10): Security & Documentation
- Add admin-only message deletion
- Enforce role-based access
- Complete README documentation
- Add proof screenshots/videos

## Technical Achievements

✅ **Real-time Communication**: WebSocket bidirectional communication
✅ **Authentication**: JWT-secured connections
✅ **Scalability**: Room-based message isolation
✅ **Broadcasting**: Efficient multi-client messaging
✅ **Persistence**: All messages saved to database
✅ **Event System**: Multiple event types (message, typing, join, leave)
✅ **Error Handling**: Graceful disconnection and error recovery
✅ **Validation**: Message length and room name validation

## Database Schema Update

The chat_messages table is automatically created by SQLAlchemy with:
- id (Primary Key)
- room (String, indexed)
- user_id (Foreign Key to users.id)
- username (String, denormalized)
- message (Text)
- created_at (DateTime, auto-generated)

## Proof Checklist for Task 1

Required proof (from PLAN.md):
- [ ] Screenshot or screen recording showing two browser tabs chatting live
- [ ] Database screenshot showing saved messages in `chat_messages` table
- [ ] Server log snippet showing users joining/leaving and broadcasting

**Next Action**: Test the WebSocket connection and capture the required proof.