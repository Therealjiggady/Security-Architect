from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel

# Pydantic v1/v2 compatibility for ORM mode / from_attributes
try:
    from pydantic import ConfigDict  # type: ignore
    _HAS_CONFIG_DICT = True
except Exception:
    ConfigDict = None  # type: ignore
    _HAS_CONFIG_DICT = False


class ProductVariantRead(BaseModel):
    id: int
    size: str
    color: Optional[str] = None
    stock: int

    if _HAS_CONFIG_DICT and ConfigDict is not None:
        # Pydantic v2
        model_config = ConfigDict(from_attributes=True)
    else:
        # Pydantic v1
        class Config:
            orm_mode = True


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

    if _HAS_CONFIG_DICT and ConfigDict is not None:
        # Pydantic v2
        model_config = ConfigDict(from_attributes=True)
    else:
        # Pydantic v1
        class Config:
            orm_mode = True