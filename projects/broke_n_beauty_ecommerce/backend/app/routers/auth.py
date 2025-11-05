from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.db import get_db
from app import models
from app.schemas.user import UserRead, UserCreate, Token, LoginRequest
import os
from app.auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=UserRead, status_code=201)
def signup(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    # Hash password safely and handle runtime errors gracefully
    try:
        hashed = get_password_hash(data.password)
    except Exception:
        # Ensure we always return JSON so frontend error parsing works
        raise HTTPException(status_code=400, detail="Failed to hash password")

    user = models.User(
        email=data.email,
        full_name=data.full_name,
        hashed_password=hashed,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # Surface a consistent JSON error if a race or constraint occurs
        raise HTTPException(status_code=400, detail="Email already registered")
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    # Verify password against stored hash (argon2 or bcrypt)
    try:
        ok = verify_password(data.password, user.hashed_password)
    except ValueError:
        # bcrypt may raise ValueError for >72-byte secrets; treat as invalid
        ok = False
    if not ok:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token = create_access_token(sub=user.email)
    return {"access_token": token, "token_type": "bearer"}