#!/usr/bin/env python3
"""
List ALL users in the database
"""
from app.db import SessionLocal
from app.models.user import User

def main():
    db = SessionLocal()
    
    print("=" * 70)
    print("📋 ALL USERS IN DATABASE")
    print("=" * 70)
    
    users = db.query(User).all()
    
    if not users:
        print("\n❌ NO USERS FOUND IN DATABASE!\n")
    else:
        print(f"\n✅ Found {len(users)} user(s):\n")
        
        for i, user in enumerate(users, 1):
            print(f"User #{i}:")
            print(f"  📧 Email:     {user.email}")
            print(f"  👤 Full Name: {user.full_name}")
            print(f"  🏷️  Role:      {user.role}")
            print(f"  🔑 Has Password: {'Yes' if user.hashed_password else 'No'}")
            print("-" * 70)
    
    print("\n" + "=" * 70)
    print("💡 WHAT TO DO:")
    print("=" * 70)
    
    # Check if your specific email exists
    my_email = "1997Jamesjjohnson@gmail.com"
    user = db.query(User).filter(User.email == my_email).first()
    
    if user:
        print(f"\n✅ Your email ({my_email}) EXISTS in database")
        print("\n   Run this to reset your password:")
        print("   python check_my_account.py")
    else:
        print(f"\n❌ Your email ({my_email}) DOES NOT exist in database")
        print("\n   Options:")
        print("   1. Register a new account at: http://localhost:5173/register")
        print("   2. Or run: python check_my_account.py (to create it)")
    
    print("\n" + "=" * 70 + "\n")
    
    db.close()

if __name__ == '__main__':
    main()