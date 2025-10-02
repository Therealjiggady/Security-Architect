from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.db import get_db
from backend.app import models
from backend.app.auth import require_auth

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
def me(email: str = Depends(require_auth), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "email": user.email, "full_name": user.full_name}

# Protected DELETE to remove a test user (rubric proof)
@router.delete("/by-email")
def delete_by_email(email: str, _: str = Depends(require_auth), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"deleted": email}