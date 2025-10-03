from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.db import get_db
from backend.app import models
from backend.app.schemas.wishlist import AddToWishlistRequest, WishlistRead
from backend.app.auth import require_auth

router = APIRouter(prefix="/wishlist", tags=["wishlist"])

MAX_WISHLIST_SIZE = 10

@router.post("/add", response_model=WishlistRead)
def add_to_wishlist(
    request: AddToWishlistRequest,
    db: Session = Depends(get_db),
    user_email: str = Depends(require_auth)
):
    # Get user by email
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Check if product exists
    product = db.query(models.Product).filter(models.Product.id == request.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if already in wishlist
    existing_wishlist = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == user.id,
        models.Wishlist.product_id == request.product_id
    ).first()
    if existing_wishlist:
        raise HTTPException(status_code=400, detail="Product already in wishlist")

    # Check wishlist size
    wishlist_count = db.query(models.Wishlist).filter(models.Wishlist.user_id == user.id).count()
    if wishlist_count >= MAX_WISHLIST_SIZE:
        raise HTTPException(status_code=400, detail="Wishlist is full")

    # Check if in stock (at least one variant has stock > 0)
    in_stock = db.query(models.ProductVariant).filter(
        models.ProductVariant.product_id == request.product_id,
        models.ProductVariant.stock > 0
    ).first() is not None

    # Check if in cart
    in_cart = db.query(models.Cart).filter(
        models.Cart.user_id == user.id,
        models.Cart.product_id == request.product_id
    ).first() is not None

    if in_stock and not in_cart:
        wishlist_item = models.Wishlist(
            user_id=user.id,
            product_id=request.product_id
        )
        db.add(wishlist_item)
        db.commit()
        db.refresh(wishlist_item)
        return wishlist_item
    elif in_stock:
        # Else if branch for wishlist item availability
        # Perhaps add anyway or handle differently
        wishlist_item = models.Wishlist(
            user_id=user.id,
            product_id=request.product_id
        )
        db.add(wishlist_item)
        db.commit()
        db.refresh(wishlist_item)
        return wishlist_item
    else:
        raise HTTPException(status_code=400, detail="Product out of stock")

@router.get("/", response_model=list[WishlistRead])
def get_wishlist(
    db: Session = Depends(get_db),
    user_email: str = Depends(require_auth)
):
    # Get user by email
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Get wishlist items
    wishlist_items = db.query(models.Wishlist).filter(models.Wishlist.user_id == user.id).all()

    # Looping structure: iterate wishlist entries when saving/loading
    result = []
    for item in wishlist_items:
        result.append(WishlistRead(id=item.id, product_id=item.product_id))

    return result

@router.delete("/remove/{wishlist_item_id}")
def remove_from_wishlist(
    wishlist_item_id: int,
    db: Session = Depends(get_db),
    user_email: str = Depends(require_auth)
):
    # Get user by email
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Get wishlist item
    wishlist_item = db.query(models.Wishlist).filter(
        models.Wishlist.id == wishlist_item_id,
        models.Wishlist.user_id == user.id
    ).first()
    if not wishlist_item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")

    db.delete(wishlist_item)
    db.commit()
    return {"message": "Wishlist item removed successfully"}