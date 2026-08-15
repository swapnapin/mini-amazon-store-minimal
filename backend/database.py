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
    from .models import Product

    Base.metadata.create_all(bind=engine)
    db = get_db()

    if db.query(Product).count() == 0:
        db.add_all([
            Product(name="iPhone 16", brand="Apple", price=999),
            Product(name="Galaxy S25", brand="Samsung", price=899),
            Product(name="Pixel 9", brand="Google", price=799),
            Product(name="OnePlus 13", brand="OnePlus", price=749),
        ])
        db.commit()

    db.close()
