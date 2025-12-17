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
    
    # Validate order items: variants must exist and have sufficient stock
    variant_checks = []
    for item_data in order_data.items:
        variant = db.query(models.ProductVariant).filter(
            models.ProductVariant.id == item_data.product_variant_id
        ).first()
        if not variant:
            raise HTTPException(status_code=404, detail=f"Product variant {item_data.product_variant_id} not found")
        if item_data.quantity <= 0:
            raise HTTPException(status_code=400, detail="Item quantity must be positive")
        if variant.stock is None or variant.stock < item_data.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for variant {variant.id}")
        if item_data.price_at_purchase <= 0:
            raise HTTPException(status_code=400, detail="Invalid item price")
        variant_checks.append(variant)

    # Create the order
    order = models.Order(
        user_id=user.id,
        cart_id=order_data.cart_id,
        total_amount=order_data.total_amount,
        status=ModelOrderStatus.PENDING
    )
    db.add(order)
    db.flush()  # Get the order ID

    # Create order items
    for idx, item_data in enumerate(order_data.items):
        order_item = models.OrderItem(
            order_id=order.id,
            product_variant_id=item_data.product_variant_id,
            quantity=item_data.quantity,
            price_at_purchase=item_data.price_at_purchase
        )
        db.add(order_item)
        # Decrement stock for the corresponding variant
        variant = variant_checks[idx]
        variant.stock = (variant.stock or 0) - item_data.quantity

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

# Import tracking service and tasks at top of file if not already imported
from app.services.tracking_service import tracking_service
from app.tasks.tracking_tasks import update_order_tracking_task
from datetime import datetime
from fastapi import Form

@router.post("/{order_id}/tracking")
def add_tracking_number(
    order_id: int,
    tracking_number: str = Form(...),
    carrier: str = Form(...),
    email: str = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Add tracking number to order (admin only or order owner)"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Only order owner or admin can add tracking
    if order.user_id != user.id and user.role != "superuser":
        raise HTTPException(status_code=403, detail="Unauthorized")

    # Validate carrier
    valid_carriers = ["UPS", "FEDEX", "USPS"]
    if carrier.upper() not in valid_carriers:
        raise HTTPException(status_code=400, detail=f"Carrier must be one of: {valid_carriers}")

    # Create EasyPost tracker
    tracker_data = tracking_service.create_tracker(tracking_number, carrier)
    if not tracker_data:
        raise HTTPException(status_code=500, detail="Failed to create tracker")

    # Update order
    order.tracking_number = tracking_number
    order.carrier = carrier.upper()
    order.easypost_tracker_id = tracker_data["id"]
    order.tracking_status = tracker_data["status"]
    order.tracking_last_updated = datetime.utcnow()
    order.shipped_at = datetime.utcnow()
    order.status = ModelOrderStatus.SHIPPED

    db.commit()
    db.refresh(order)

    # Queue background task to poll for updates
    update_order_tracking_task.delay(order.id)

    return order

@router.get("/{order_id}/tracking")
def get_tracking_info(
    order_id: int,
    email: str = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Get tracking information for an order"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.user_id != user.id and user.role != "superuser":
        raise HTTPException(status_code=403, detail="Unauthorized")

    if not order.tracking_number:
        return {"message": "No tracking information available"}

    # Get latest tracking data from EasyPost
    if order.easypost_tracker_id:
        tracker_data = tracking_service.retrieve_tracker(order.easypost_tracker_id)
        if tracker_data:
            return {
                "order_id": order.id,
                "tracking_number": order.tracking_number,
                "carrier": order.carrier,
                "status": tracker_data["status"],
                "est_delivery_date": tracker_data.get("est_delivery_date"),
                "tracking_url": tracker_data.get("public_url"),
                "tracking_details": tracker_data.get("tracking_details", []),
                "last_updated": tracker_data.get("updated_at")
            }

    # Fallback to database info
    return {
        "order_id": order.id,
        "tracking_number": order.tracking_number,
        "carrier": order.carrier,
        "status": order.tracking_status,
        "tracking_url": tracking_service.get_tracking_url(order.carrier, order.tracking_number),
        "last_updated": order.tracking_last_updated
    }