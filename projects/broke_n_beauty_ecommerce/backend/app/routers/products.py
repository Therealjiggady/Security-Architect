from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.db import get_db
from backend.app import models, schemas

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=list[schemas.ProductRead])
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    return products