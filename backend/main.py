from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime
from email.message import EmailMessage
import smtplib
import os
import uuid

from .database import init_db, get_db
from .models import Product, LoginHistory


# ============================================================
# APP
# ============================================================

app = FastAPI(title="Mini Amazon Store API")


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DATABASE
# ============================================================

init_db()


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():
    return {
        "message": "Mini Amazon Store API is running"
    }


# ============================================================
# PRODUCTS
# ============================================================

@app.get("/products")
def products(db: Session = Depends(get_db)):
    return db.query(Product).all()


# ============================================================
# LOGIN
# ============================================================

@app.post("/login")
def login(
    username: str,
    db: Session = Depends(get_db)
):

    login_record = LoginHistory(
        username=username
    )

    db.add(login_record)
    db.commit()

    return {
        "message": "Login recorded successfully"
    }


# ============================================================
# LOGIN HISTORY
# ============================================================

@app.get("/login-history")
def login_history(
    db: Session = Depends(get_db)
):

    return db.query(LoginHistory).order_by(
        LoginHistory.id.desc()
    ).all()


# ============================================================
# PAYMENT MODELS
# ============================================================

class PaymentItem(BaseModel):

    name: str
    brand: str
    price: float
    quantity: int


class PaymentRequest(BaseModel):

    username: str

    # Email is plain string.
    # We are NOT using EmailStr.
    customer_email: str

    card_name: str
    card_number: str
    expiry: str
    cvv: str

    items: List[PaymentItem]

    total: float


# ============================================================
# EMAIL SETTINGS
# ============================================================

# IMPORTANT:
#
# For email sending, set these environment variables:
#
# SMTP_EMAIL
# SMTP_PASSWORD
#
# Example for Gmail:
#
# SMTP_EMAIL = yourgmail@gmail.com
# SMTP_PASSWORD = your Gmail App Password
#
# Do NOT put your real email password in this code.
#
# If these variables are not configured, the payment will still
# succeed as a DEMO payment, but an email will not be sent.
# ============================================================


def send_invoice_email(
    customer_email,
    username,
    transaction_id,
    items,
    total
):

    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")

    # Email not configured
    if not smtp_email or not smtp_password:

        print("------------------------------------------------")
        print("EMAIL NOT CONFIGURED")
        print("Payment successful, but invoice email was not sent.")
        print("Set SMTP_EMAIL and SMTP_PASSWORD to enable email.")
        print("------------------------------------------------")

        return False


    # --------------------------------------------------------
    # Create invoice text
    # --------------------------------------------------------

    invoice_lines = []

    invoice_lines.append(
        "MINI AMAZON STORE"
    )

    invoice_lines.append(
        "================================"
    )

    invoice_lines.append(
        f"Customer: {username}"
    )

    invoice_lines.append(
        f"Transaction ID: {transaction_id}"
    )

    invoice_lines.append(
        f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    )

    invoice_lines.append(
        "================================"
    )

    invoice_lines.append("")


    for item in items:

        item_total = item.price * item.quantity

        invoice_lines.append(
            f"{item.name} ({item.brand})"
        )

        invoice_lines.append(
            f"Quantity: {item.quantity}"
        )

        invoice_lines.append(
            f"Price: ${item.price:.2f}"
        )

        invoice_lines.append(
            f"Item Total: ${item_total:.2f}"
        )

        invoice_lines.append("")


    invoice_lines.append(
        "================================"
    )

    invoice_lines.append(
        f"TOTAL PAID: ${total:.2f}"
    )

    invoice_lines.append(
        "================================"
    )

    invoice_lines.append("")

    invoice_lines.append(
        "This is a demo invoice."
    )

    invoice_lines.append(
        "No real payment was processed."
    )


    invoice_body = "\n".join(invoice_lines)


    # --------------------------------------------------------
    # Create email
    # --------------------------------------------------------

    message = EmailMessage()

    message["Subject"] = (
        f"Mini Amazon - Invoice {transaction_id}"
    )

    message["From"] = smtp_email

    message["To"] = customer_email

    message.set_content(invoice_body)


    # --------------------------------------------------------
    # Send email
    # --------------------------------------------------------

    try:

        with smtplib.SMTP(
            "smtp.gmail.com",
            587
        ) as server:

            server.starttls()

            server.login(
                smtp_email,
                smtp_password
            )

            server.send_message(message)


        print(
            f"Invoice email sent to {customer_email}"
        )

        return True


    except Exception as error:

        print(
            "Email sending failed:"
        )

        print(error)

        return False


# ============================================================
# DUMMY PAYMENT
# ============================================================

@app.post("/payment")
def payment(
    payment: PaymentRequest
):

    # --------------------------------------------------------
    # Basic validation
    # --------------------------------------------------------

    if not payment.username:

        raise HTTPException(
            status_code=400,
            detail="Username is required"
        )


    if not payment.customer_email:

        raise HTTPException(
            status_code=400,
            detail="Customer email is required"
        )


    if not payment.card_name:

        raise HTTPException(
            status_code=400,
            detail="Card name is required"
        )


    if len(payment.card_number) != 16:

        raise HTTPException(
            status_code=400,
            detail="Card number must contain 16 digits"
        )


    if not payment.card_number.isdigit():

        raise HTTPException(
            status_code=400,
            detail="Card number must contain digits only"
        )


    if len(payment.cvv) != 3:

        raise HTTPException(
            status_code=400,
            detail="CVV must contain 3 digits"
        )


    if not payment.cvv.isdigit():

        raise HTTPException(
            status_code=400,
            detail="CVV must contain digits only"
        )


    if not payment.expiry:

        raise HTTPException(
            status_code=400,
            detail="Expiry date is required"
        )


    if payment.total <= 0:

        raise HTTPException(
            status_code=400,
            detail="Payment amount must be greater than zero"
        )


    # --------------------------------------------------------
    # DEMO PAYMENT
    # --------------------------------------------------------
    #
    # IMPORTANT:
    # This does NOT contact a bank/payment provider.
    #
    # It only simulates a successful payment.
    # --------------------------------------------------------

    transaction_id = (
        "DUMMY-"
        + uuid.uuid4().hex[:8].upper()
    )


    # --------------------------------------------------------
    # Send invoice email
    # --------------------------------------------------------

    email_sent = send_invoice_email(
        customer_email=payment.customer_email,
        username=payment.username,
        transaction_id=transaction_id,
        items=payment.items,
        total=payment.total
    )


    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {

        "success": True,

        "message": "Demo payment successful",

        "transaction_id": transaction_id,

        "amount": payment.total,

        "email_sent": email_sent,

        "customer_email": payment.customer_email,

        "date": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    }