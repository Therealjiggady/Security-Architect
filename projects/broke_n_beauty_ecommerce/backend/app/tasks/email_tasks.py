from app.celery_app import celery_app
from app.services.email_service import email_service
import asyncio

@celery_app.task(name="app.tasks.email.send_inventory_alert")
def send_inventory_alert_task(to_email: str, product_name: str, variant_info: str, product_url: str):
    """Background task: Send back-in-stock email"""
    loop = asyncio.get_event_loop()
    result = loop.run_until_complete(
        email_service.send_inventory_alert(to_email, product_name, variant_info, product_url)
    )
    return result

@celery_app.task(name="app.tasks.email.send_tracking_update")
def send_tracking_update_task(to_email: str, order_id: int, tracking_number: str,
                              carrier: str, status: str, tracking_url: str):
    """Background task: Send tracking update email"""
    loop = asyncio.get_event_loop()
    result = loop.run_until_complete(
        email_service.send_tracking_update(
            to_email, order_id, tracking_number, carrier, status, tracking_url
        )
    )
    return result
