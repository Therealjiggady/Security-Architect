from __future__ import annotations

from typing import Optional

from pydantic import BaseModel

# Pydantic v1/v2 compatibility for ORM mode / from_attributes
try:
    from pydantic import ConfigDict  # type: ignore
    _HAS_CONFIG_DICT = True
except Exception:
    ConfigDict = None  # type: ignore
    _HAS_CONFIG_DICT = False


class AddToCartRequest(BaseModel):
    product_id: int
    quantity: int


class CartRead(BaseModel):
    id: int
    product_id: int
    quantity: int

    if _HAS_CONFIG_DICT and ConfigDict is not None:
        # Pydantic v2
        model_config = ConfigDict(from_attributes=True)
    else:
        # Pydantic v1
        class Config:
            orm_mode = True