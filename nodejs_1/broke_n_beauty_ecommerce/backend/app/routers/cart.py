from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app import models
from app.schemas.cart import AddToCartRequest, CartRead
from app.auth import require_auth

router = APIRouter(prefix="/cart", tags=["cart"])

@router.post("/add", response_model=CartRead)
def add_to_cart(
    request: AddToCartRequest,
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

    # Check if cart item already exists
    existing_cart = db.query(models.Cart).filter(
        models.Cart.user_id == user.id,
        models.Cart.product_id == request.product_id
    ).first()

    if existing_cart:
        existing_cart.quantity += request.quantity
        cart_item = existing_cart
    else:
        cart_item = models.Cart(
            user_id=user.id,
            product_id=request.product_id,
            quantity=request.quantity
        )
        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.delete("/remove/{cart_item_id}")
def remove_from_cart(
    cart_item_id: int,
    db: Session = Depends(get_db),
    user_email: str = Depends(require_auth)
):
    # Get user by email
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Get cart item
    cart_item = db.query(models.Cart).filter(
        models.Cart.id == cart_item_id,
        models.Cart.user_id == user.id
    ).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()
    return {"message": "Cart item removed successfully"}