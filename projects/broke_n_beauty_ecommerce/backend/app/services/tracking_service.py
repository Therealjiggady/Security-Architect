import easypost
from app.config import settings
from typing import Optional, Dict
import logging

logger = logging.getLogger(__name__)

class TrackingService:
    """Service for real carrier API integration via EasyPost"""

    def __init__(self):
        if settings.EASYPOST_API_KEY:
            easypost.api_key = settings.EASYPOST_API_KEY

    def create_tracker(self, tracking_number: str, carrier: str) -> Optional[Dict]:
        """Create EasyPost tracker for a tracking number"""
        try:
            # Normalize carrier names to EasyPost format
            carrier_map = {
                "UPS": "UPS",
                "FEDEX": "FedEx",
                "USPS": "USPS",
            }

            easypost_carrier = carrier_map.get(carrier.upper(), carrier)

            tracker = easypost.Tracker.create(
                tracking_code=tracking_number,
                carrier=easypost_carrier
            )

            return {
                "id": tracker.id,
                "status": tracker.status,
                "tracking_number": tracker.tracking_code,
                "carrier": tracker.carrier,
                "public_url": tracker.public_url,
                "est_delivery_date": tracker.est_delivery_date,
                "tracking_details": tracker.tracking_details,
            }
        except Exception as e:
            logger.error(f"Failed to create tracker for {tracking_number}: {str(e)}")
            return None

    def retrieve_tracker(self, tracker_id: str) -> Optional[Dict]:
        """Retrieve updated tracker information"""
        try:
            tracker = easypost.Tracker.retrieve(tracker_id)

            return {
                "id": tracker.id,
                "status": tracker.status,
                "tracking_number": tracker.tracking_code,
                "carrier": tracker.carrier,
                "public_url": tracker.public_url,
                "est_delivery_date": tracker.est_delivery_date,
                "tracking_details": tracker.tracking_details,
                "updated_at": tracker.updated_at,
            }
        except Exception as e:
            logger.error(f"Failed to retrieve tracker {tracker_id}: {str(e)}")
            return None

    def get_tracking_url(self, carrier: str, tracking_number: str) -> str:
        """Generate carrier-specific tracking URL as fallback"""
        urls = {
            "UPS": f"https://www.ups.com/track?tracknum={tracking_number}",
            "FEDEX": f"https://www.fedex.com/fedextrack/?tracknumbers={tracking_number}",
            "USPS": f"https://tools.usps.com/go/TrackConfirmAction?tLabels={tracking_number}",
        }
        return urls.get(carrier.upper(), "")

tracking_service = TrackingService()
