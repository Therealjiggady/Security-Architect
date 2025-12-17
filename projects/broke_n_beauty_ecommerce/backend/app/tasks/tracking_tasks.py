from app.celery_app import celery_app
from app.db import SessionLocal
from app.models import Order, User
from app.services.tracking_service import tracking_service
from app.tasks.email_tasks import send_tracking_update_task
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

@celery_app.task(name="app.tasks.tracking.update_order_tracking")
def update_order_tracking_task(order_id: int):
    """Background task: Poll carrier API for tracking updates"""
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order or not order.easypost_tracker_id:
            return

        # Get latest tracking info from EasyPost
        tracker_data = tracking_service.retrieve_tracker(order.easypost_tracker_id)
        if not tracker_data:
            return

        # Check if status changed
        old_status = order.tracking_status
        new_status = tracker_data["status"]

        # Update order tracking info
        order.tracking_status = new_status
        order.tracking_last_updated = datetime.utcnow()

        # Update delivered timestamp if status is delivered
        if new_status == "delivered" and not order.delivered_at:
            order.delivered_at = datetime.utcnow()
            order.status = "delivered"

        db.commit()

        # Send email notification if status changed
        if old_status != new_status:
            user = db.query(User).filter(User.id == order.user_id).first()
            if user:
                send_tracking_update_task.delay(
                    to_email=user.email,
                    order_id=order.id,
                    tracking_number=order.tracking_number,
                    carrier=order.carrier,
                    status=new_status,
                    tracking_url=tracker_data.get("public_url", "")
                )

    except Exception as e:
        logger.error(f"Error updating tracking for order {order_id}: {str(e)}")
    finally:
        db.close()

@celery_app.task(name="app.tasks.tracking.poll_all_active_shipments")
def poll_all_active_shipments_task():
    """Background task: Poll all undelivered orders (runs every hour)"""
    db = SessionLocal()
    try:
        # Find all shipped orders that aren't delivered yet
        cutoff = datetime.utcnow() - timedelta(days=30)  # Don't poll orders > 30 days old

        orders = db.query(Order).filter(
            Order.status == "shipped",
            Order.easypost_tracker_id.isnot(None),
            Order.created_at > cutoff
        ).all()

        logger.info(f"Polling {len(orders)} active shipments")

        for order in orders:
            # Queue individual update tasks
            update_order_tracking_task.delay(order.id)

    except Exception as e:
        logger.error(f"Error polling active shipments: {str(e)}")
    finally:
        db.close()

# Schedule periodic task (configure in celery beat)
celery_app.conf.beat_schedule = {
    'poll-active-shipments-hourly': {
        'task': 'app.tasks.tracking.poll_all_active_shipments',
        'schedule': 3600.0,  # Every hour
    },
}
