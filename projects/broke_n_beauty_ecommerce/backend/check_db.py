from app.db import SessionLocal
from app.models.user import User
from app.models.product import Product

db = SessionLocal()

# Check users
users = db.query(User).all()
print('=== USERS IN DATABASE ===')
print(f'Total users: {len(users)}')
for u in users[:5]:
    print(f'  - {u.email} (ID: {u.id})')

print()

# Check products
products = db.query(Product).all()
print('=== PRODUCTS IN DATABASE ===')
print(f'Total products: {len(products)}')
for p in products[:5]:
    print(f'  - {p.name} (${p.price})')

db.close()