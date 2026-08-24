from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

engine = create_engine(
    "sqlite:///./backend/products.db",
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

def get_db():
    return SessionLocal()

def init_db():
    from .models import Product,LoginHistory

    Base.metadata.create_all(bind=engine)
    db = get_db()

    if db.query(Product).count() == 0:
        db.add_all([
            Product(name="iPhone 16", brand="Apple", price=999, category="Phone"),
            Product(name="Galaxy S25", brand="Samsung", price=899, category="Phone"),
            Product(name="Pixel 9", brand="Google", price=799, category="Phone"),
            Product(name="OnePlus 13", brand="OnePlus", price=749, category="Phone"),
            

         # Laptops
            Product(
                name="Dell Inspiron 15",
                brand="Dell",
                price=799,
                category="Laptop"
            ),
            Product(
                name="HP Pavilion 14",
                brand="HP",
                price=749,
                category="Laptop"
            ),
            Product(
                name="Lenovo IdeaPad 5",
                brand="Lenovo",
                price=699,
                category="Laptop"
            ),
            Product(
                name="MacBook Air",
                brand="Apple",
                price=1099,
                category="Laptop"
            ),

            # Tablets
            Product(
                name="iPad",
                brand="Apple",
                price=499,
                category="Tablet"
            ),
            Product(
                name="Galaxy Tab S10",
                brand="Samsung",
                price=699,
                category="Tablet"
            ),
            Product(
                name="Lenovo Tab",
                brand="Lenovo",
                price=299,
                category="Tablet"
            ),
            Product(
                name="Surface Go",
                brand="Microsoft",
                price=599,
                category="Tablet"
            ),
        ])        
        db.commit()

        print("Mini Amazon: Products added successfully!")
        print("Total products: 12")

    db.close()