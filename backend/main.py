from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import init_db, get_db
from .models import Product, LoginHistory


app = FastAPI(title="Mini Amazon Store API")


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


init_db()


@app.get("/")
def home():
    return {
        "message": "Mini Amazon Store API is running"
    }


@app.get("/products")
def products(db: Session = Depends(get_db)):
    return db.query(Product).all()


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

@app.get("/login-history")
def login_history(db: Session = Depends(get_db)):
    return db.query(LoginHistory).order_by(
        LoginHistory.id.desc()
    ).all()

    