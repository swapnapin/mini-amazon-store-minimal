from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
from sqlalchemy.orm import Session
from .database import init_db, get_db
from .models import Product

app = FastAPI(title="Mini Amazon Store API")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
init_db()

@app.get("/")
def home():
    return {"message": "Mini Amazon Store API is running"}

@app.get("/products")
def products(db: Session = Depends(get_db)):
    return db.query(Product).all()
