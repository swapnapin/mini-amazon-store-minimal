from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import Base, SessionLocal, engine
from .routers import auth, health, payments, products
from .seed import seed_products


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_products(db)
    yield
    engine.dispose()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, version="2.0.0",
        docs_url="/docs" if settings.docs_enabled else None, redoc_url=None, lifespan=lifespan)
    app.add_middleware(CORSMiddleware, allow_origins=list(settings.cors_origins),
        allow_credentials=False, allow_methods=["GET", "POST"],
        allow_headers=["Content-Type", "Authorization"])
    app.include_router(health.router)
    app.include_router(products.router)
    app.include_router(auth.router)
    app.include_router(payments.router)
    return app


app = create_app()
