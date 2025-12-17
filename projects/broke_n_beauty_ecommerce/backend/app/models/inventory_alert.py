from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class InventoryAlert(Base):
    """Back-in-stock email notification subscriptions"""
    __tablename__ = "inventory_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=False, index=True)
    email = Column(String(255), nullable=False)  # Denormalized for easier email sending
    notified = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    notified_at = Column(DateTime)

    # Relationships
    user = relationship("User", backref="inventory_alerts")
    product_variant = relationship("ProductVariant", backref="inventory_alerts")
