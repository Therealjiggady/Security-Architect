from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None

class UserRead(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None = None
    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ProductVariantRead(BaseModel):
    id: int
    size: str
    color: Optional[str] = None
    stock: int

    model_config = ConfigDict(from_attributes=True)

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    sku: Optional[str] = None
    price: float
    image_url: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None

class ProductRead(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    sku: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    variants: list[ProductVariantRead] = []

    model_config = ConfigDict(from_attributes=True)