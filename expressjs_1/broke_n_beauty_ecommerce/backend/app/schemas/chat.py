from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ChatMessageCreate(BaseModel):
    """Schema for creating a new chat message"""
    message: str = Field(..., max_length=500, description="Message content (max 500 characters)")


class ChatMessageRead(BaseModel):
    """Schema for reading a chat message"""
    id: int
    room: str
    user_id: int
    username: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatHistoryRequest(BaseModel):
    """Schema for requesting chat history"""
    room: str = Field(..., description="Chat room name")
    limit: int = Field(50, ge=1, le=100, description="Number of messages to retrieve (1-100)")


class WebSocketMessage(BaseModel):
    """Schema for WebSocket message events"""
    type: str = Field(..., description="Message type: 'message', 'typing', 'user_joined', 'user_left', 'delete'")
    data: dict = Field(..., description="Message data payload")


class TypingIndicator(BaseModel):
    """Schema for typing indicator events"""
    username: str
    is_typing: bool