from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .models import Product


PRODUCTS = (
    ("iPhone 16", "Apple", "999.00", "Phone"),
    ("Galaxy S25", "Samsung", "899.00", "Phone"),
    ("Pixel 9", "Google", "799.00", "Phone"),
    ("OnePlus 13", "OnePlus", "749.00", "Phone"),
    ("Dell Inspiron 15", "Dell", "799.00", "Laptop"),
    ("HP Pavilion 14", "HP", "749.00", "Laptop"),
    ("Lenovo IdeaPad 5", "Lenovo", "699.00", "Laptop"),
    ("MacBook Air", "Apple", "1099.00", "Laptop"),
    ("iPad", "Apple", "499.00", "Tablet"),
    ("Galaxy Tab S10", "Samsung", "699.00", "Tablet"),
    ("Lenovo Tab", "Lenovo", "299.00", "Tablet"),
    ("Surface Go", "Microsoft", "599.00", "Tablet"),
)


def seed_products(db: Session) -> None:
    if db.scalar(select(func.count()).select_from(Product)):
        return
    db.add_all(
        Product(name=name, brand=brand, price=Decimal(price), category=category)
        for name, brand, price, category in PRODUCTS
    )
    db.commit()
