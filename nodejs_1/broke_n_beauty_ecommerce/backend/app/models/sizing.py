from sqlalchemy import Column, Integer, DateTime, func, ForeignKey
from ..db import Base

class UserSizingOffset(Base):
    __tablename__ = "user_sizing_offsets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    top_offset = Column(Integer, default=0)
    bottom_offset = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())