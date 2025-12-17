from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app import models
from app.auth import require_auth
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/inventory-alerts", tags=["inventory-alerts"])

# Simple schemas inline since we'll create proper ones in Phase 6
class InventoryAlertCreate(BaseModel):
    product_variant_id: int

@router.post("/", status_code=201)
def subscribe_to_restock(
    alert_data: InventoryAlertCreate,
    email: str = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Subscribe to back-in-stock notification for a product variant"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if variant exists
    variant = db.query(models.ProductVariant).filter(
        models.ProductVariant.id == alert_data.product_variant_id
    ).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Product variant not found")

    # Check if variant is in stock
    if variant.stock > 0:
        raise HTTPException(status_code=400, detail="Product variant is currently in stock")

    # Check if alert already exists
    existing_alert = db.query(models.InventoryAlert).filter(
        models.InventoryAlert.user_id == user.id,
        models.InventoryAlert.product_variant_id == alert_data.product_variant_id,
        models.InventoryAlert.notified == False
    ).first()

    if existing_alert:
        raise HTTPException(status_code=400, detail="You are already subscribed to this restock alert")

    # Create alert
    alert = models.InventoryAlert(
        user_id=user.id,
        product_variant_id=alert_data.product_variant_id,
        email=user.email  # Denormalize for easier email sending
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert

@router.get("/me")
def get_my_alerts(
    email: str = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Get all active inventory alerts for the authenticated user"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    alerts = db.query(models.InventoryAlert).filter(
        models.InventoryAlert.user_id == user.id,
        models.InventoryAlert.notified == False
    ).all()

    return alerts

@router.delete("/{alert_id}", status_code=204)
def unsubscribe_from_alert(
    alert_id: int,
    email: str = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Unsubscribe from a restock alert"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    alert = db.query(models.InventoryAlert).filter(
        models.InventoryAlert.id == alert_id
    ).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    if alert.user_id != user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own alerts")

    db.delete(alert)
    db.commit()

    return None
