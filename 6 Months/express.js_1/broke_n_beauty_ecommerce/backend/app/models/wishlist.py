from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from ..db import Base


class Wishlist(Base):
    """
    SQLAlchemy ORM model for the wishlists table.
    """
    __tablename__ = "wishlists"

    # Columns
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    # Relationships
    user = relationship("User", backref="wishlists")
    product = relationship("Product", backref="wishlists")

    # Type hints
    id: int
    user_id: int
    product_id: int

    def __repr__(self) -> str:
        return f"Wishlist(id={self.id!r}, user_id={self.user_id!r}, product_id={self.product_id!r})"