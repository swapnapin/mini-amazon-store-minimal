from dataclasses import dataclass
from functools import lru_cache
import os
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]


def _csv_env(name: str, default: str) -> tuple[str, ...]:
    return tuple(value.strip() for value in os.getenv(name, default).split(",") if value.strip())


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "Mini Amazon Store API")
    app_env: str = os.getenv("APP_ENV", "development")
    database_url: str = os.getenv(
        "DATABASE_URL", f"sqlite:///{PROJECT_ROOT / 'backend' / 'products.db'}"
    )
    cors_origins: tuple[str, ...] = _csv_env(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    )
    demo_username: str = os.getenv("DEMO_USERNAME", "testuser")
    demo_password: str = os.getenv("DEMO_PASSWORD", "Test@123")
    smtp_host: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_email: str | None = os.getenv("SMTP_EMAIL")
    smtp_password: str | None = os.getenv("SMTP_PASSWORD")

    @property
    def docs_enabled(self) -> bool:
        return self.app_env != "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
