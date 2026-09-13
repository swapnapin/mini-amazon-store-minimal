from datetime import datetime
from decimal import Decimal
import re

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    brand: str
    price: Decimal
    category: str


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=80)
    password: str = Field(min_length=1, max_length=128)


class LoginResponse(BaseModel):
    message: str
    username: str


class LoginHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    login_time: datetime


class CheckoutItem(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(ge=1, le=99)


class PaymentRequest(BaseModel):
    username: str = Field(min_length=1, max_length=80)
    customer_email: EmailStr
    card_name: str = Field(min_length=1, max_length=120)
    card_number: str
    expiry: str
    cvv: str
    items: list[CheckoutItem] = Field(min_length=1, max_length=100)

    @field_validator("card_number")
    @classmethod
    def validate_card_number(cls, value: str) -> str:
        if not re.fullmatch(r"\d{16}", value):
            raise ValueError("card number must contain exactly 16 digits")
        return value

    @field_validator("cvv")
    @classmethod
    def validate_cvv(cls, value: str) -> str:
        if not re.fullmatch(r"\d{3,4}", value):
            raise ValueError("CVV must contain 3 or 4 digits")
        return value

    @field_validator("expiry")
    @classmethod
    def validate_expiry(cls, value: str) -> str:
        if not re.fullmatch(r"(0[1-9]|1[0-2])/\d{2}", value):
            raise ValueError("expiry must use MM/YY format")
        return value


class PaymentResponse(BaseModel):
    success: bool
    message: str
    transaction_id: str
    amount: Decimal
    email_queued: bool
    customer_email: EmailStr
    created_at: datetime
