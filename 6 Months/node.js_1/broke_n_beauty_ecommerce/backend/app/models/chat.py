from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db import Base


class ChatMessage(Base):
    """
    SQLAlchemy ORM model for chat messages.
    Stores all messages sent in chat rooms with user attribution.
    """
    __tablename__ = "chat_messages"

    # Columns
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    room = Column(String(50), nullable=False, index=True)  # e.g., "general", "support"
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    username = Column(String(255), nullable=False)  # Denormalized for faster retrieval
    message = Column(Text, nullable=False)  # Message content
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    
    # Relationships
    user = relationship("User", backref="chat_messages")

    # Type hints
    id: int
    room: str
    user_id: int
    username: str
    message: str
    created_at: datetime

    def __repr__(self) -> str:
        return f"ChatMessage(id={self.id!r}, room={self.room!r}, user={self.username!r})"