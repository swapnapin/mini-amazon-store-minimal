from datetime import datetime, timezone
from decimal import Decimal
from functools import partial
import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import Settings, get_settings
from ..database import get_db
from ..models import Product
from ..schemas import PaymentRequest, PaymentResponse
from ..services.email import send_invoice_email


router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("", response_model=PaymentResponse)
def create_demo_payment(payment: PaymentRequest, background_tasks: BackgroundTasks,
                        db: Session = Depends(get_db), settings: Settings = Depends(get_settings)) -> PaymentResponse:
    product_ids = {item.product_id for item in payment.items}
    products = {product.id: product for product in db.scalars(select(Product).where(Product.id.in_(product_ids)))}
    missing = sorted(product_ids - products.keys())
    if missing:
        raise HTTPException(status_code=400, detail=f"Unknown product IDs: {missing}")

    line_items: list[tuple[str, str, Decimal, int]] = []
    total = Decimal("0.00")
    for item in payment.items:
        product = products[item.product_id]
        price = Decimal(product.price).quantize(Decimal("0.01"))
        line_items.append((product.name, product.brand, price, item.quantity))
        total += price * item.quantity

    transaction_id = f"DEMO-{uuid.uuid4().hex[:12].upper()}"
    email_queued = bool(settings.smtp_email and settings.smtp_password)
    if email_queued:
        background_tasks.add_task(partial(send_invoice_email, settings=settings,
            customer_email=str(payment.customer_email), username=payment.username,
            transaction_id=transaction_id, line_items=line_items, total=total))

    return PaymentResponse(success=True, message="Demo payment successful; no real payment was processed",
        transaction_id=transaction_id, amount=total, email_queued=email_queued,
        customer_email=payment.customer_email, created_at=datetime.now(timezone.utc))
