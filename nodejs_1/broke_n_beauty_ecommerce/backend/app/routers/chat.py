from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, Query
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime
import json
from jose import jwt, JWTError

from app.db import get_db
from app.models import ChatMessage, User
from app.schemas.chat import ChatMessageRead, ChatHistoryRequest
from app.auth import JWT_SECRET, JWT_ALG, ADMIN_ROLE, require_admin_auth

router = APIRouter(prefix="/chat", tags=["chat"])

# Constants for chat functionality
ALLOWED_ROOMS = {"general", "support"}
MAX_MESSAGE_LENGTH = 500

bearer_scheme = HTTPBearer()


class ConnectionManager:
    """
    Manages WebSocket connections and message broadcasting.
    Keeps track of active connections per room for efficient message delivery.
    """
    def __init__(self):
        # Dictionary: room_name -> list of WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Dictionary: WebSocket -> username for tracking
        self.connection_usernames: Dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, room: str, username: str):
        """Add a new WebSocket connection to a room"""
        await websocket.accept()
        
        if room not in self.active_connections:
            self.active_connections[room] = []
        
        self.active_connections[room].append(websocket)
        self.connection_usernames[websocket] = username
        
        # Broadcast user joined event
        await self.broadcast(room, {
            "type": "user_joined",
            "data": {
                "username": username,
                "timestamp": datetime.utcnow().isoformat()
            }
        }, exclude=websocket)

    async def disconnect(self, websocket: WebSocket, room: str):
        """Remove a WebSocket connection from a room"""
        if room in self.active_connections:
            self.active_connections[room].remove(websocket)
            
            # Clean up empty rooms
            if not self.active_connections[room]:
                del self.active_connections[room]
        
        # Get username before removing
        username = self.connection_usernames.get(websocket)
        if websocket in self.connection_usernames:
            del self.connection_usernames[websocket]
        
        # Broadcast user left event
        if username:
            await self.broadcast(room, {
                "type": "user_left",
                "data": {
                    "username": username,
                    "timestamp": datetime.utcnow().isoformat()
                }
            })

    async def broadcast(self, room: str, message: dict, exclude: WebSocket = None):
        """
        Broadcast a message to all connections in a room.
        Optionally exclude a specific connection (e.g., the sender).
        """
        if room not in self.active_connections:
            return
        
        # Remove any closed connections
        dead_connections = []
        for connection in self.active_connections[room]:
            if connection == exclude:
                continue
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.append(connection)
        
        # Clean up dead connections
        for connection in dead_connections:
            if connection in self.active_connections[room]:
                self.active_connections[room].remove(connection)
            if connection in self.connection_usernames:
                del self.connection_usernames[connection]

    async def send_personal_message(self, websocket: WebSocket, message: dict):
        """Send a message to a specific WebSocket connection"""
        try:
            await websocket.send_json(message)
        except Exception:
            pass


# Global connection manager instance
manager = ConnectionManager()


async def verify_websocket_token(token: str, db: Session) -> User:
    """
    Verify JWT token for WebSocket authentication.
    Returns User object if valid, raises HTTPException if invalid.
    """
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


@router.get("/history", response_model=List[ChatMessageRead])
async def get_chat_history(
    room: str = Query(..., description="Chat room name"),
    limit: int = Query(50, ge=1, le=100, description="Number of messages to retrieve"),
    db: Session = Depends(get_db)
):
    """
    Get chat history for a specific room.
    Returns recent messages in chronological order.
    """
    if room not in ALLOWED_ROOMS:
        raise HTTPException(status_code=400, detail=f"Invalid room. Allowed rooms: {', '.join(ALLOWED_ROOMS)}")
    
    messages = db.query(ChatMessage)\
        .filter(ChatMessage.room == room)\
        .order_by(ChatMessage.created_at.desc())\
        .limit(limit)\
        .all()
    
    # Reverse to get chronological order (oldest first)
    return list(reversed(messages))


@router.websocket("/ws/{room}")
async def websocket_endpoint(
    websocket: WebSocket,
    room: str,
    token: str = Query(..., description="JWT authentication token"),
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint for real-time chat.
    Requires JWT authentication via query parameter.
    
    Message format:
    - Send: {"type": "message", "content": "your message"}
    - Send: {"type": "typing", "is_typing": true}
    - Receive: {"type": "message", "data": {...}}
    - Receive: {"type": "typing", "data": {...}}
    - Receive: {"type": "user_joined", "data": {...}}
    - Receive: {"type": "user_left", "data": {...}}
    """
    
    # Validate room
    if room not in ALLOWED_ROOMS:
        await websocket.close(code=1008, reason=f"Invalid room. Allowed: {', '.join(ALLOWED_ROOMS)}")
        return
    
    # Authenticate user via JWT
    try:
        user = await verify_websocket_token(token, db)
    except HTTPException as e:
        await websocket.close(code=1008, reason=e.detail)
        return
    
    # Connect to room
    await manager.connect(websocket, room, user.full_name or user.email)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            message_type = message_data.get("type")
            
            if message_type == "message":
                # Handle chat message
                content = message_data.get("content", "").strip()
                
                if not content:
                    await manager.send_personal_message(websocket, {
                        "type": "error",
                        "data": {"message": "Message cannot be empty"}
                    })
                    continue
                
                if len(content) > MAX_MESSAGE_LENGTH:
                    await manager.send_personal_message(websocket, {
                        "type": "error",
                        "data": {"message": f"Message too long. Maximum {MAX_MESSAGE_LENGTH} characters."}
                    })
                    continue
                
                # Save message to database
                db_message = ChatMessage(
                    room=room,
                    user_id=user.id,
                    username=user.full_name or user.email,
                    message=content
                )
                db.add(db_message)
                db.commit()
                db.refresh(db_message)
                
                # Broadcast message to all users in room
                await manager.broadcast(room, {
                    "type": "message",
                    "data": {
                        "id": db_message.id,
                        "room": db_message.room,
                        "user_id": db_message.user_id,
                        "username": db_message.username,
                        "message": db_message.message,
                        "created_at": db_message.created_at.isoformat()
                    }
                })
            
            elif message_type == "typing":
                # Handle typing indicator
                is_typing = message_data.get("is_typing", False)
                
                await manager.broadcast(room, {
                    "type": "typing",
                    "data": {
                        "username": user.full_name or user.email,
                        "is_typing": is_typing
                    }
                }, exclude=websocket)
            
            else:
                # Unknown message type
                await manager.send_personal_message(websocket, {
                    "type": "error",
                    "data": {"message": f"Unknown message type: {message_type}"}
                })
    
    except WebSocketDisconnect:
        await manager.disconnect(websocket, room)
    except Exception as e:
        print(f"WebSocket error: {e}")
        await manager.disconnect(websocket, room)


@router.delete("/messages/{message_id}")
async def delete_message(
    message_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    """
    Delete a chat message (admin only).
    Requires admin role (superuser).
    Broadcasts deletion to all connected clients in the room.
    """
    # Verify admin authentication
    token = credentials.credentials
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
    
    # Check admin role
    if not hasattr(user, 'role') or user.role != ADMIN_ROLE:
        raise HTTPException(status_code=403, detail="Admin access required. Only superusers can delete messages.")
    
    # Find the message
    message = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Store room before deletion for broadcasting
    room = message.room
    
    # Delete message from database
    db.delete(message)
    db.commit()
    
    # Broadcast deletion to all connected clients in the room
    await manager.broadcast(room, {
        "type": "delete",
        "data": {
            "message_id": message_id,
            "deleted_by": user.full_name or user.email,
            "timestamp": datetime.utcnow().isoformat()
        }
    })
    
    return {
        "message": "Message deleted successfully",
        "id": message_id,
        "room": room
    }