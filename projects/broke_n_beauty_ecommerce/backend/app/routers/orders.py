from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from backend.app.db import get_db
from backend.app import models
from backend.app.auth import require_auth
from backend.app.schemas.order import OrderRead

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("/me", response_model=list[OrderRead])
def get_my_orders(email: str = Depends(require_auth), db: Session = Depends(get_db)):
    """
    Get all orders for the authenticated user, including order items.
    """
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    orders = (
        db.query(models.Order)
        .filter(models.Order.user_id == user.id)
        .options(joinedload(models.Order.items))
        .order_by(models.Order.created_at.desc())
        .all()
    )

    return orders