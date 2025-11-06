from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from ..db import Base


class Cart(Base):
    """
    SQLAlchemy ORM model for the carts table.
    """
    __tablename__ = "carts"

    # Columns
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)

    # Relationships
    user = relationship("User", backref="carts")
    product = relationship("Product", backref="carts")

    # Type hints
    id: int
    user_id: int
    product_id: int
    quantity: int

    def __repr__(self) -> str:
        return f"Cart(id={self.id!r}, user_id={self.user_id!r}, product_id={self.product_id!r}, quantity={self.quantity!r})"