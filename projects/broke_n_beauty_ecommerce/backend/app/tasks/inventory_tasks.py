from app.celery_app import celery_app
from app.db import SessionLocal
from app.models import InventoryAlert, ProductVariant, Product
from app.tasks.email_tasks import send_inventory_alert_task
from app.config import settings
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@celery_app.task(name="app.tasks.inventory.check_variant_stock")
def check_variant_stock_task(variant_id: int):
    """Background task: Check if variant is back in stock and notify subscribers"""
    db = SessionLocal()
    try:
        variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
        if not variant or variant.stock <= 0:
            return

        # Find all unnotified alerts for this variant
        alerts = db.query(InventoryAlert).filter(
            InventoryAlert.product_variant_id == variant_id,
            InventoryAlert.notified == False
        ).all()

        if not alerts:
            return

        logger.info(f"Found {len(alerts)} alerts for variant {variant_id}")

        # Get product info for email
        product = db.query(Product).filter(Product.id == variant.product_id).first()
        if not product:
            return

        product_name = product.name
        variant_info = f"{variant.size} {variant.color or ''}".strip()
        product_url = f"{settings.FRONTEND_URL}/products?id={product.id}"

        # Send notifications
        for alert in alerts:
            send_inventory_alert_task.delay(
                to_email=alert.email,
                product_name=product_name,
                variant_info=variant_info,
                product_url=product_url
            )

            # Mark as notified
            alert.notified = True
            alert.notified_at = datetime.utcnow()

        db.commit()
        logger.info(f"Sent {len(alerts)} inventory alerts for variant {variant_id}")

    except Exception as e:
        logger.error(f"Error checking stock for variant {variant_id}: {str(e)}")
    finally:
        db.close()
