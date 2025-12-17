from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.db import get_db
from app import models
from app.auth import require_auth
from app.config import settings
from typing import List, Optional
import uuid
import os
from PIL import Image

router = APIRouter(prefix="/reviews", tags=["reviews"])

# Validation constants
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
MAX_IMAGE_DIMENSION = 2000

def validate_review_image(file: UploadFile) -> bool:
    """Validate review image file"""
    # Check content type
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image type. Use JPEG, PNG, or WebP")

    # Check file extension
    ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Invalid file extension. Use: {ALLOWED_EXTENSIONS}")

    return True

async def save_review_image(file: UploadFile, review_id: int) -> str:
    """Save and process review image"""
    validate_review_image(file)

    # Generate unique filename
    ext = file.filename.split('.')[-1].lower()
    filename = f"review_{review_id}_{uuid.uuid4()}.{ext}"
    file_path = f"{settings.REVIEW_IMAGE_DIR}/{filename}"

    # Ensure directory exists
    os.makedirs(settings.REVIEW_IMAGE_DIR, exist_ok=True)

    # Read and validate file size
    content = await file.read()
    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail=f"Image too large. Max size: {MAX_IMAGE_SIZE / 1024 / 1024}MB")

    # Save and resize if needed
    with open(file_path, "wb") as buffer:
        buffer.write(content)

    # Resize image if too large (using Pillow)
    try:
        img = Image.open(file_path)
        if img.width > MAX_IMAGE_DIMENSION or img.height > MAX_IMAGE_DIMENSION:
            img.thumbnail((MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION), Image.Resampling.LANCZOS)
            img.save(file_path, optimize=True, quality=85)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")

    return f"/{settings.REVIEW_IMAGE_DIR}/{filename}"

@router.post("/", status_code=201)
async def create_review(
    product_id: int = Form(...),
    rating: int = Form(...),
    title: Optional[str] = Form(None),
    comment: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
    email: str = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Create a product review with optional photo uploads"""
    # Validate rating
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    # Check image count
    if len(images) > settings.MAX_REVIEW_IMAGES:
        raise HTTPException(status_code=400, detail=f"Maximum {settings.MAX_REVIEW_IMAGES} images allowed")

    # Get user
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if product exists
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if user already reviewed this product
    existing_review = db.query(models.Review).filter(
        models.Review.product_id == product_id,
        models.Review.user_id == user.id
    ).first()
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this product")

    # Check if user purchased this product (verified purchase)
    verified_purchase = db.query(models.Order).join(models.OrderItem).join(
        models.ProductVariant
    ).filter(
        models.Order.user_id == user.id,
        models.ProductVariant.product_id == product_id
    ).first() is not None

    # Create review
    review = models.Review(
        product_id=product_id,
        user_id=user.id,
        rating=rating,
        title=title,
        comment=comment,
        verified_purchase=verified_purchase
    )
    db.add(review)
    db.flush()  # Get review ID

    # Save images
    for image_file in images:
        if image_file.filename:  # Skip empty file uploads
            image_url = await save_review_image(image_file, review.id)
            review_image = models.ReviewImage(
                review_id=review.id,
                image_url=image_url
            )
            db.add(review_image)

    db.commit()
    db.refresh(review)

    # Return review with images
    review_with_images = (
        db.query(models.Review)
        .filter(models.Review.id == review.id)
        .options(joinedload(models.Review.images))
        .first()
    )

    return review_with_images

@router.get("/product/{product_id}")
def get_product_reviews(
    product_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get all reviews for a product"""
    reviews = (
        db.query(models.Review)
        .filter(models.Review.product_id == product_id)
        .options(joinedload(models.Review.images))
        .order_by(models.Review.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return reviews

@router.get("/product/{product_id}/summary")
def get_review_summary(product_id: int, db: Session = Depends(get_db)):
    """Get review statistics for a product"""
    # Calculate average rating and count
    stats = db.query(
        func.count(models.Review.id).label("total_reviews"),
        func.avg(models.Review.rating).label("average_rating"),
        func.sum(func.cast(models.Review.rating == 5, models.Review.rating.type)).label("five_star"),
        func.sum(func.cast(models.Review.rating == 4, models.Review.rating.type)).label("four_star"),
        func.sum(func.cast(models.Review.rating == 3, models.Review.rating.type)).label("three_star"),
        func.sum(func.cast(models.Review.rating == 2, models.Review.rating.type)).label("two_star"),
        func.sum(func.cast(models.Review.rating == 1, models.Review.rating.type)).label("one_star"),
    ).filter(models.Review.product_id == product_id).first()

    return {
        "product_id": product_id,
        "total_reviews": stats.total_reviews or 0,
        "average_rating": round(float(stats.average_rating) if stats.average_rating else 0, 2),
        "rating_distribution": {
            "5": int(stats.five_star or 0),
            "4": int(stats.four_star or 0),
            "3": int(stats.three_star or 0),
            "2": int(stats.two_star or 0),
            "1": int(stats.one_star or 0),
        }
    }

@router.delete("/{review_id}", status_code=204)
def delete_review(
    review_id: int,
    email: str = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Delete a review (only by author)"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if review.user_id != user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own reviews")

    # Delete associated images from filesystem
    for image in review.images:
        try:
            file_path = image.image_url.lstrip('/')
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception:
            pass  # Continue even if image deletion fails

    db.delete(review)
    db.commit()

    return None
