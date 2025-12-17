from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class RecentlyViewed(Base):
    """Track user's recently viewed products"""
    __tablename__ = "recently_viewed"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    viewed_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="recently_viewed")
    product = relationship("Product", backref="viewed_by")

    # Ensure one entry per user-product pair
    __table_args__ = (
        UniqueConstraint('user_id', 'product_id', name='uq_user_product_view'),
    )
