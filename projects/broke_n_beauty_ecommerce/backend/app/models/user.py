from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func

from app.db import Base


class User(Base):
    """
    SQLAlchemy ORM model for the users table.
    Mirrors database/schema.sql definition.
    """
    __tablename__ = "users"

    # Columns
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    # Type hints (for IDEs/type checkers)
    id: int
    email: str
    hashed_password: str
    full_name: Optional[str]
    created_at: datetime

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, email={self.email!r})"