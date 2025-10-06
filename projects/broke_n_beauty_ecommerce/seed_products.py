#!/usr/bin/env python3

import sys
import os
sys.path.append('backend')

from backend.app.db import SessionLocal, engine
from backend.app.models import Product, ProductVariant

def seed_products():
    db = SessionLocal()

    try:
        # Clear existing data
        db.query(ProductVariant).delete()
        db.query(Product).delete()
        db.commit()

        # Create products
        products_data = [
            {
                'name': 'BnB Sport Bra – Black',
                'description': 'Comfortable sports bra with excellent support for all-day wear',
                'sku': 'BNB-SB-BLK',
                'price': 13.99,
                'image_url': '/static/images/sports_bra.png',
                'variants': [
                    {'size': 'S', 'color': 'Black', 'stock': 50},
                    {'size': 'M', 'color': 'Black', 'stock': 45},
                    {'size': 'L', 'color': 'Black', 'stock': 40},
                ]
            },
            {
                'name': 'BnB Biker Short – Grey',
                'description': 'High-waisted biker shorts perfect for workouts and casual wear',
                'sku': 'BNB-BS-GRY',
                'price': 9.99,
                'image_url': '/static/images/Grey fit.png',
                'variants': [
                    {'size': 'XS', 'color': 'Grey', 'stock': 30},
                    {'size': 'S', 'color': 'Grey', 'stock': 35},
                    {'size': 'M', 'color': 'Grey', 'stock': 40},
                ]
            },
            {
                'name': 'BnB Unisex Scrub Top',
                'description': 'Professional scrub top suitable for healthcare workers',
                'sku': 'BNB-ST-UNI',
                'price': 15.00,
                'image_url': '/static/images/Scrubs2.png',
                'variants': [
                    {'size': 'M', 'color': 'Blue', 'stock': 25},
                    {'size': 'L', 'color': 'Blue', 'stock': 30},
                    {'size': 'XL', 'color': 'Blue', 'stock': 20},
                ]
            },
            {
                'name': 'BnB Unisex Scrub Pants',
                'description': 'Professional scrub pants suitable for healthcare workers',
                'sku': 'BNB-SP-UNI',
                'price': 17.00,
                'image_url': '/static/images/navy blue scrubs.png',
                'variants': [
                    {'size': 'M', 'color': 'Blue', 'stock': 25},
                    {'size': 'L', 'color': 'Blue', 'stock': 30},
                    {'size': 'XL', 'color': 'Blue', 'stock': 20},
                ]
            },
            {
                'name': 'BnB Compression Leggings',
                'description': 'Moisture-wicking compression leggings for intense workouts',
                'sku': 'BNB-CL-BLK',
                'price': 24.99,
                'image_url': '/static/images/compression leggings.png',
                'variants': [
                    {'size': 'S', 'color': 'Black', 'stock': 60},
                    {'size': 'M', 'color': 'Black', 'stock': 55},
                    {'size': 'L', 'color': 'Black', 'stock': 50},
                ]
            },
            {
                'name': 'BnB Yoga Tank Top',
                'description': 'Breathable tank top designed for yoga and pilates',
                'sku': 'BNB-YT-GRY',
                'price': 15.99,
                'image_url': '/static/images/yoga tank top.png',
                'variants': [
                    {'size': 'XS', 'color': 'Gray', 'stock': 40},
                    {'size': 'S', 'color': 'Gray', 'stock': 45},
                    {'size': 'M', 'color': 'Gray', 'stock': 50},
                ]
            }
        ]

        for product_data in products_data:
            variants = product_data.pop('variants')
            product = Product(**product_data)
            db.add(product)
            db.commit()
            db.refresh(product)

            for variant_data in variants:
                variant = ProductVariant(product_id=product.id, **variant_data)
                db.add(variant)

            db.commit()

        print("✅ Products seeded successfully!")

    except Exception as e:
        print(f"❌ Error seeding products: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_products()