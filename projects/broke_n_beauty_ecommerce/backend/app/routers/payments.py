from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db import get_db
from app.auth import require_auth
import os
import stripe

router = APIRouter(prefix="/payments", tags=["payments"])


def get_stripe_client() -> stripe:
    """Initialize Stripe with secret key from environment."""
    secret_key = os.getenv("STRIPE_SECRET_KEY")
    if not secret_key:
        raise HTTPException(status_code=500, detail="Stripe secret key not configured")
    stripe.api_key = secret_key
    return stripe


@router.post("/intents")
async def create_payment_intent(
    request: Request,
    email: str = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """
    Create a Stripe PaymentIntent for the provided amount.
    Expects JSON body: { amount: <integer cents>, currency?: "usd", order_id?: <int> }
    Returns: { client_secret }
    """
    body = await request.json()
    amount = body.get("amount")
    currency = body.get("currency", "usd")
    order_id = body.get("order_id")

    if not isinstance(amount, int) or amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount. Must be positive integer (cents)")

    # Initialize Stripe
    stripe_client = get_stripe_client()

    try:
        intent = stripe_client.PaymentIntent.create(
            amount=amount,
            currency=currency,
            automatic_payment_methods={"enabled": True},
            metadata={
                "user_email": email,
                **({"order_id": str(order_id)} if order_id else {}),
            },
        )
        return {"client_secret": intent.client_secret}
    except stripe.error.StripeError as e:
        # Surface Stripe errors cleanly
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request):
    """
    Stripe webhook handler (scaffold).
    Validates signature if STRIPE_WEBHOOK_SECRET is provided.
    Logs event and returns 200.
    """
    payload = await request.body()
    sig_header = request.headers.get("Stripe-Signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    stripe_client = get_stripe_client()

    event = None
    try:
        if webhook_secret:
            event = stripe_client.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        else:
            event = stripe_client.Event.construct_from(
                stripe_client.api_requestor._parse_client_json(body=payload),
                stripe_client.api_key,
            )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid webhook payload or signature")

    # Minimal scaffolding: log interesting events
    event_type = event.get("type")
    # In a full implementation, we would locate the order by intent metadata
    # and update status accordingly.

    # Return 200 OK to Stripe
    return {"received": True, "type": event_type}