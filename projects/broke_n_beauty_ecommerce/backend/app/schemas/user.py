from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

# Pydantic v1/v2 compatibility for ORM mode / from_attributes
try:
    from pydantic import ConfigDict  # type: ignore
    _HAS_CONFIG_DICT = True
except Exception:
    ConfigDict = None  # type: ignore
    _HAS_CONFIG_DICT = False


class UserRead(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    created_at: Optional[datetime] = None

    if _HAS_CONFIG_DICT and ConfigDict is not None:
        # Pydantic v2
        model_config = ConfigDict(from_attributes=True)
    else:
        # Pydantic v1
        class Config:
            orm_mode = True


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"