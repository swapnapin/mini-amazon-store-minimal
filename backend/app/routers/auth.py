import hmac

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import Settings, get_settings
from ..database import get_db
from ..models import LoginHistory
from ..schemas import LoginHistoryResponse, LoginRequest, LoginResponse


router = APIRouter(tags=["authentication"])


@router.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db),
          settings: Settings = Depends(get_settings)) -> LoginResponse:
    valid = hmac.compare_digest(credentials.username, settings.demo_username) and hmac.compare_digest(
        credentials.password, settings.demo_password
    )
    if not valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    db.add(LoginHistory(username=credentials.username))
    db.commit()
    return LoginResponse(message="Login successful", username=credentials.username)


@router.get("/login-history", response_model=list[LoginHistoryResponse])
def login_history(db: Session = Depends(get_db)) -> list[LoginHistory]:
    return list(db.scalars(select(LoginHistory).order_by(LoginHistory.id.desc()).limit(100)))
