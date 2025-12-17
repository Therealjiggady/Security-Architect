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


class InventoryAlertCreate(BaseModel):
    product_variant_id: int


class InventoryAlertRead(BaseModel):
    id: int
    user_id: int
    product_variant_id: int
    email: str
    notified: bool
    created_at: datetime
    notified_at: Optional[datetime] = None

    if _HAS_CONFIG_DICT and ConfigDict is not None:
        # Pydantic v2
        model_config = ConfigDict(from_attributes=True)
    else:
        # Pydantic v1
        class Config:
            orm_mode = True
