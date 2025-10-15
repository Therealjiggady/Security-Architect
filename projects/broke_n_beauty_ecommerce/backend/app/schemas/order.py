from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

# Pydantic v1/v2 compatibility for ORM mode / from_attributes
try:
    from pydantic import ConfigDict  # type: ignore
    _HAS_CONFIG_DICT = True
except Exception:
    ConfigDict = None  # type: ignore
    _HAS_CONFIG_DICT = False


class OrderItemRead(BaseModel):
    id: int
    order_id: int
    product_variant_id: int
    quantity: int
    price_at_purchase: float

    if _HAS_CONFIG_DICT and ConfigDict is not None:
        # Pydantic v2
        model_config = ConfigDict(from_attributes=True)
    else:
        # Pydantic v1
        class Config:
            orm_mode = True


class OrderRead(BaseModel):
    id: int
    user_id: int
    cart_id: Optional[int] = None
    status: str
    total_amount: float
    created_at: datetime
    items: List[OrderItemRead] = []

    if _HAS_CONFIG_DICT and ConfigDict is not None:
        # Pydantic v2
        model_config = ConfigDict(from_attributes=True)
    else:
        # Pydantic v1
        class Config:
            orm_mode = True


class OrderCreate(BaseModel):
    cart_id: int
    total_amount: float


class OrderUpdate(BaseModel):
    status: Optional[str] = None