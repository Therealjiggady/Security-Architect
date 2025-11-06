from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field

# Pydantic v1/v2 compatibility for ORM mode / from_attributes
try:
    from pydantic import ConfigDict  # type: ignore
    _HAS_CONFIG_DICT = True
except Exception:
    ConfigDict = None  # type: ignore
    _HAS_CONFIG_DICT = False


class OrderStatus(str, Enum):
    """Enum for order status values"""
    PENDING = "pending"
    SHIPPED = "shipped"
    DELIVERED = "delivered"


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
    items: List["OrderItemCreate"]
    total_amount: float
    shipping_address: Optional[str] = None
    payment_method: Optional[str] = None
    cart_id: Optional[int] = None


class OrderUpdate(BaseModel):
    status: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    """Schema for updating order status"""
    status: OrderStatus = Field(..., description="New status for the order (pending, shipped, or delivered)")


class OrderItemCreate(BaseModel):
    product_variant_id: int
    quantity: int
    price_at_purchase: float