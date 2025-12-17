from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class Review(Base):
    """Product review with star rating and optional photos"""
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String(200))
    comment = Column(Text)
    verified_purchase = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # Relationships
    product = relationship("Product", backref="reviews")
    user = relationship("User", backref="reviews")
    images = relationship("ReviewImage", back_populates="review", cascade="all, delete-orphan")

class ReviewImage(Base):
    """Photos attached to reviews"""
    __tablename__ = "review_images"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    uploaded_at = Column(DateTime, nullable=False, server_default=func.now())

    # Relationship
    review = relationship("Review", back_populates="images")
