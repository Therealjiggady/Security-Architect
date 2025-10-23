from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.db import get_db
from app import models
from app.auth import require_auth
from app.schemas.order import OrderRead, OrderCreate, OrderStatusUpdate, OrderStatus
from app.models.order import OrderStatus as ModelOrderStatus

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderRead, status_code=201)
def create_order(
    order_data: OrderCreate,
    email: str = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """
    Create a new order for the authenticated user.
    """
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create the order
    order = models.Order(
        user_id=user.id,
        total_amount=order_data.total_amount,
        shipping_address=order_data.shipping_address,
        payment_method=order_data.payment_method,
        status=ModelOrderStatus.PENDING
    )
    db.add(order)
    db.flush()  # Get the order ID
    
    # Create order items
    for item_data in order_data.items:
        order_item = models.OrderItem(
            order_id=order.id,
            product_variant_id=item_data.product_variant_id,
            quantity=item_data.quantity,
            price_at_purchase=item_data.price_at_purchase
        )
        db.add(order_item)
    
    db.commit()
    db.refresh(order)
    
    # Return order with items
    order_with_items = (
        db.query(models.Order)
        .filter(models.Order.id == order.id)
        .options(joinedload(models.Order.items))
        .first()
    )
    
    return order_with_items

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


def updateOrderStatus(order_id: int, status: str, db: Session, user_id: int) -> bool:
    """
    Update order status with validation logic.
    
    Args:
        order_id: The ID of the order to update
        status: The new status (pending, shipped, delivered)
        db: Database session
        user_id: ID of the user making the request
        
    Returns:
        bool: True if update was successful, False otherwise
    """
    # Fetch the order with items
    order = (
        db.query(models.Order)
        .filter(models.Order.id == order_id)
        .options(joinedload(models.Order.items))
        .first()
    )
    
    # Check if order exists
    if not order:
        return False
    
    # Verify user owns this order
    if order.user_id != user_id:
        return False
    
    # Validation loop: Check all order items before processing
    for item in order.items:
        # Validate each order item has required data
        if item.quantity <= 0:
            return False
        if item.price_at_purchase <= 0:
            return False
        if not item.product_variant_id:
            return False
    
    # If/else logic to handle different order states with logical operators
    current_status = order.status.value if isinstance(order.status, ModelOrderStatus) else order.status
    
    # Validate status transitions using if/else logic
    if status == "pending":
        # Can always revert to pending
        order.status = ModelOrderStatus.PENDING
    elif status == "shipped":
        # Can ship from pending or remain shipped
        if current_status == "pending" or current_status == "shipped":
            order.status = ModelOrderStatus.SHIPPED
        else:
            # Invalid transition: cannot ship a delivered order
            return False
    elif status == "delivered":
        # Can only deliver from shipped status (or remain delivered)
        if current_status == "shipped" or current_status == "delivered":
            order.status = ModelOrderStatus.DELIVERED
        else:
            # Invalid transition: must ship before delivering
            return False
    else:
        # Invalid status provided
        return False
    
    # Commit the changes
    try:
        db.commit()
        db.refresh(order)
        return True
    except Exception:
        db.rollback()
        return False


@router.patch("/{order_id}/status", response_model=OrderRead)
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    email: str = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """
    Update the status of an order.
    
    Validates:
    - User owns the order
    - All order items are valid
    - Status transition is valid (pending -> shipped -> delivered)
    
    Args:
        order_id: ID of the order to update
        status_update: New status for the order
        email: Authenticated user's email
        db: Database session
        
    Returns:
        OrderRead: Updated order with new status
        
    Raises:
        HTTPException: If user not found, order not found, unauthorized, or invalid status transition
    """
    # Get the authenticated user
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Use the updateOrderStatus function to update the order
    success = updateOrderStatus(
        order_id=order_id,
        status=status_update.status.value,
        db=db,
        user_id=user.id
    )
    
    # Check if update was successful using if/else logic
    if not success:
        # Determine the reason for failure
        order = db.query(models.Order).filter(models.Order.id == order_id).first()
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        elif order.user_id != user.id:
            raise HTTPException(status_code=403, detail="Unauthorized to update this order")
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid status transition or order validation failed"
            )
    
    # Fetch and return the updated order
    updated_order = (
        db.query(models.Order)
        .filter(models.Order.id == order_id)
        .options(joinedload(models.Order.items))
        .first()
    )
    
    return updated_order