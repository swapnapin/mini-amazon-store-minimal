from decimal import Decimal
from email.message import EmailMessage
import logging
import smtplib

from ..config import Settings


logger = logging.getLogger(__name__)


def send_invoice_email(
    *, settings: Settings, customer_email: str, username: str,
    transaction_id: str, line_items: list[tuple[str, str, Decimal, int]], total: Decimal,
) -> None:
    if not settings.smtp_email or not settings.smtp_password:
        logger.info("SMTP is not configured; skipping invoice for %s", transaction_id)
        return

    lines = ["MINI AMAZON STORE", "================================", f"Customer: {username}",
             f"Transaction ID: {transaction_id}", "================================", ""]
    for name, brand, price, quantity in line_items:
        lines.extend([f"{name} ({brand})", f"Quantity: {quantity}", f"Price: ${price:.2f}",
                      f"Item Total: ${(price * quantity):.2f}", ""])
    lines.extend(["================================", f"TOTAL: ${total:.2f}", "================================",
                  "This is a demo invoice. No real payment was processed."])

    message = EmailMessage()
    message["Subject"] = f"Mini Amazon - Invoice {transaction_id}"
    message["From"] = settings.smtp_email
    message["To"] = customer_email
    message.set_content("\n".join(lines))
    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            server.starttls()
            server.login(settings.smtp_email, settings.smtp_password)
            server.send_message(message)
    except (OSError, smtplib.SMTPException):
        logger.exception("Failed to send invoice %s", transaction_id)
