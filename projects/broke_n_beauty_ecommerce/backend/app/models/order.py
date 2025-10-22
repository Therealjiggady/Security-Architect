from __future__ import annotations

import enum
from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.app.db import Base


class OrderStatus(str, enum.Enum):
    """Enum for order status tracking"""
    PENDING = "pending"
    SHIPPED = "shipped"
    DELIVERED = "delivered"


class Order(Base):
    """
    SQLAlchemy ORM model for the orders table.
    Mirrors database/schema.sql definition.
    """
    __tablename__ = "orders"

    # Columns
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=True)
    status = Column(Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING)
    total_amount = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    # Relationships
    user = relationship("User", backref="orders")
    cart = relationship("Cart", backref="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    # Type hints
    id: int
    user_id: int
    cart_id: Optional[int]
    status: str
    total_amount: float
    created_at: datetime

    def __repr__(self) -> str:
        return f"Order(id={self.id!r}, user_id={self.user_id!r}, status={self.status!r}, total_amount={self.total_amount!r})"


class OrderItem(Base):
    """
    SQLAlchemy ORM model for the order_items table.
    Mirrors database/schema.sql definition.
    """
    __tablename__ = "order_items"

    # Columns
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Numeric(10, 2), nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    product_variant = relationship("ProductVariant", backref="order_items")

    # Type hints
    id: int
    order_id: int
    product_variant_id: int
    quantity: int
    price_at_purchase: float

    def __repr__(self) -> str:
        return f"OrderItem(id={self.id!r}, order_id={self.order_id!r}, product_variant_id={self.product_variant_id!r}, quantity={self.quantity!r})"