from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Request
from sqlalchemy.orm import Session
from backend.app.db import get_db
from backend.app import models, schemas
from backend.app.auth import require_auth
import uuid
import os

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=list[schemas.ProductRead])
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    return products

@router.post("/", response_model=schemas.ProductRead)
async def create_product(
    request: Request,
    db: Session = Depends(get_db),
    user: str = Depends(require_auth)
):
    content_type = request.headers.get('content-type', '')
    if content_type.startswith('multipart/form-data'):
        form = await request.form()
        data = {}
        for field in ['name', 'description', 'sku', 'price', 'image_url']:
            val = form.get(field)
            if val is not None:
                if field == 'price':
                    data[field] = float(val)
                else:
                    data[field] = val
        image_file = form.get('image')
    else:
        data = await request.json()
        image_file = None

    if image_file:
        if image_file.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG and PNG are allowed.")
        ext = image_file.filename.split('.')[-1] if '.' in image_file.filename else 'jpg'
        filename = f"{uuid.uuid4()}.{ext}"
        file_path = f"backend/static/images/{filename}"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        try:
            with open(file_path, "wb") as buffer:
                content = await image_file.read()
                buffer.write(content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
        data['image_url'] = f"/static/images/{filename}"

    product = models.Product(**data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=schemas.ProductRead)
async def update_product(
    product_id: int,
    request: Request,
    db: Session = Depends(get_db),
    user: str = Depends(require_auth)
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    content_type = request.headers.get('content-type', '')
    if content_type.startswith('multipart/form-data'):
        form = await request.form()
        data = {}
        for field in ['name', 'description', 'sku', 'price', 'image_url']:
            val = form.get(field)
            if val is not None:
                if field == 'price':
                    data[field] = float(val)
                else:
                    data[field] = val
        image_file = form.get('image')
    else:
        data = await request.json()
        image_file = None

    if image_file:
        if image_file.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG and PNG are allowed.")
        ext = image_file.filename.split('.')[-1] if '.' in image_file.filename else 'jpg'
        filename = f"{uuid.uuid4()}.{ext}"
        file_path = f"backend/static/images/{filename}"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        try:
            with open(file_path, "wb") as buffer:
                content = await image_file.read()
                buffer.write(content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
        data['image_url'] = f"/static/images/{filename}"

    for key, value in data.items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

@router.post("/{product_id}/upload-image")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: str = Depends(require_auth)
):
    # Check if product exists
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG and PNG are allowed.")

    # Generate unique filename
    ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = f"backend/static/images/{filename}"

    # Ensure directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # Save file
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")

    # Update product image_url
    product.image_url = f"/static/images/{filename}"
    db.commit()

    return {"message": "Image uploaded successfully", "image_url": product.image_url}