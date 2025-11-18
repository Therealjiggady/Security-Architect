#!/usr/bin/env python3
"""
Production database seed script
Creates initial products and admin user
"""
from app.db import SessionLocal
from app.models import User, Product, ProductVariant
from app.auth import get_password_hash
import sys


def seed_products(db):
    """Seed initial products"""
    print("Creating products...")
    
    products_data = [
        {
            "name": "BnB Sport Bra – Black",
            "description": "Comfortable sports bra with excellent support for all-day wear",
            "sku": "BNB-SB-BLK",
            "price": 13.99,
            "image_url": "/static/images/cursive bra.png",
            "variants": [
                {"size": "S", "color": "Black", "stock": 50},
                {"size": "M", "color": "Black", "stock": 50},
                {"size": "L", "color": "Black", "stock": 50}
            ]
        },
        {
            "name": "BnB Biker Short – Black",
            "description": "High-waisted biker shorts perfect for workouts and casual wear",
            "sku": "BNB-BS-BLK",
            "price": 9.99,
            "image_url": "/static/images/biker shorts in back.png",
            "variants": [
                {"size": "XS", "color": "Black", "stock": 30},
                {"size": "S", "color": "Black", "stock": 35},
                {"size": "M", "color": "Black", "stock": 40}
            ]
        },
        {
            "name": "BnB Scrub Top",
            "description": "Professional scrub top suitable for healthcare workers",
            "sku": "BNB-ST-UNI",
            "price": 15.00,
            "image_url": "/static/images/india top.png",
            "variants": [
                {"size": "M", "color": "Blue", "stock": 25},
                {"size": "L", "color": "Blue", "stock": 30},
                {"size": "XL", "color": "Blue", "stock": 20}
            ]
        },
        {
            "name": "BnB Scrub Pants",
            "description": "Professional scrub pants suitable for healthcare workers",
            "sku": "BNB-SP-UNI",
            "price": 17.00,
            "image_url": "/static/images/india 22.png",
            "variants": [
                {"size": "M", "color": "Blue", "stock": 25},
                {"size": "L", "color": "Blue", "stock": 30},
                {"size": "XL", "color": "Blue", "stock": 20}
            ]
        },
        {
            "name": "BnB Compression Leggings",
            "description": "Moisture-wicking compression leggings for intense workouts",
            "sku": "BNB-CL-BLK",
            "price": 24.99,
            "image_url": "/static/images/Generated Image October 07, 2025 - 9_15AM.png",
            "variants": [
                {"size": "S", "color": "Black", "stock": 60},
                {"size": "M", "color": "Black", "stock": 55},
                {"size": "L", "color": "Black", "stock": 50}
            ]
        },
        {
            "name": "BnB Yoga Tank Top",
            "description": "Breathable tank top designed for yoga and pilates",
            "sku": "BNB-YT-GRY",
            "price": 15.99,
            "image_url": "/static/images/dominican tanktop.png",
            "variants": [
                {"size": "XS", "color": "Gray", "stock": 40},
                {"size": "S", "color": "Gray", "stock": 45},
                {"size": "M", "color": "Gray", "stock": 50}
            ]
        }
    ]
    
    for product_data in products_data:
        # Check if product already exists
        existing = db.query(Product).filter(Product.sku == product_data["sku"]).first()
        if existing:
            print(f"  ⚠ Product {product_data['name']} already exists, skipping...")
            continue
        
        # Create product
        variants_data = product_data.pop("variants")
        product = Product(**product_data)
        db.add(product)
        db.flush()
        
        # Create variants
        for variant_data in variants_data:
            variant = ProductVariant(product_id=product.id, **variant_data)
            db.add(variant)
        
        print(f"  ✓ Created {product_data['name']}")
    
    db.commit()
    print("✅ Products seeded successfully")


def seed_admin_user(db):
    """Create admin user if not exists"""
    print("\nCreating admin user...")
    
    admin_email = input("Enter admin email (or press Enter to skip): ")
    
    if not admin_email:
        print("  ⚠ Skipping admin user creation")
        return
    
    # Check if user exists
    existing = db.query(User).filter(User.email == admin_email).first()
    if existing:
        print(f"  ⚠ User {admin_email} already exists, skipping...")
        return
    
    admin_password = input("Enter admin password: ")
    admin_name = input("Enter admin full name: ")
    
    admin = User(
        email=admin_email,
        hashed_password=get_password_hash(admin_password),
        full_name=admin_name,
        role="superuser"
    )
    
    db.add(admin)
    db.commit()
    print(f"  ✓ Created admin user: {admin_email}")
    print("✅ Admin user created successfully")


def main():
    print("=" * 70)
    print("🌱 PRODUCTION DATABASE SEEDING")
    print("=" * 70)
    print("\n⚠️  WARNING: This will add data to your production database!")
    
    confirm = input("\nContinue? (yes/no): ")
    if confirm.lower() != "yes":
        print("❌ Seeding cancelled")
        sys.exit(0)
    
    db = SessionLocal()
    
    try:
        # Seed products
        seed_products(db)
        
        # Seed admin user
        seed_admin_user(db)
        
        print("\n" + "=" * 70)
        print("✅ PRODUCTION SEEDING COMPLETE")
        print("=" * 70)
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == '__main__':
    main()