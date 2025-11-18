from app.db import SessionLocal
from app.models import Product

db = SessionLocal()
try:
    products = db.query(Product).all()
    print(f'Found {len(products)} products in database:')
    for p in products:
        print(f'  - ID: {p.id}, Name: {p.name}, Price: ${p.price}, Image: {p.image_url}')
except Exception as e:
    print(f'Error querying products: {e}')
finally:
    db.close()