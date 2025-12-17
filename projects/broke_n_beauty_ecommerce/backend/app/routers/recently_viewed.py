from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from app.db import get_db
from app import models
from app.auth import require_auth
from app.config import settings
from datetime import datetime

router = APIRouter(prefix="/recently-viewed", tags=["recently-viewed"])

@router.post("/{product_id}", status_code=201)
def track_product_view(
    product_id: int,
    email: str = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Track when user views a product"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if product exists
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if already viewed (UniqueConstraint will handle this)
    existing_view = db.query(models.RecentlyViewed).filter(
        models.RecentlyViewed.user_id == user.id,
        models.RecentlyViewed.product_id == product_id
    ).first()

    if existing_view:
        # Update timestamp
        existing_view.viewed_at = datetime.utcnow()
    else:
        # Create new view record
        new_view = models.RecentlyViewed(
            user_id=user.id,
            product_id=product_id
        )
        db.add(new_view)

        # Limit total stored views per user
        view_count = db.query(models.RecentlyViewed).filter(
            models.RecentlyViewed.user_id == user.id
        ).count()

        if view_count >= settings.RECENTLY_VIEWED_LIMIT:
            # Delete oldest view
            oldest_view = db.query(models.RecentlyViewed).filter(
                models.RecentlyViewed.user_id == user.id
            ).order_by(models.RecentlyViewed.viewed_at.asc()).first()
            if oldest_view:
                db.delete(oldest_view)

    db.commit()
    return {"message": "Product view tracked"}

@router.get("/")
def get_recently_viewed(
    email: str = Depends(require_auth),
    limit: int = None,
    db: Session = Depends(get_db)
):
    """Get user's recently viewed products"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Use config limit if not specified
    if limit is None:
        limit = settings.RECENTLY_VIEWED_DISPLAY

    # Get recently viewed with product details
    recent_views = (
        db.query(models.RecentlyViewed)
        .filter(models.RecentlyViewed.user_id == user.id)
        .order_by(desc(models.RecentlyViewed.viewed_at))
        .limit(limit)
        .all()
    )

    # Fetch product details
    product_ids = [view.product_id for view in recent_views]
    products = (
        db.query(models.Product)
        .filter(models.Product.id.in_(product_ids))
        .options(joinedload(models.Product.variants))
        .all()
    )

    # Maintain order by view time
    product_map = {p.id: p for p in products}
    ordered_products = [product_map[view.product_id] for view in recent_views if view.product_id in product_map]

    return ordered_products

@router.delete("/clear", status_code=204)
def clear_recently_viewed(
    email: str = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Clear user's recently viewed history"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.query(models.RecentlyViewed).filter(
        models.RecentlyViewed.user_id == user.id
    ).delete()

    db.commit()
    return None
