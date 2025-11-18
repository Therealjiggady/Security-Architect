#!/usr/bin/env python3
"""
Update password for existing account
"""
from app.db import SessionLocal
from app.models.user import User
from app.auth import get_password_hash, verify_password

def main():
    db = SessionLocal()
    
    my_email = "1997Jamesjjohnson@gmail.com"
    my_password = "password123"
    
    print("=" * 70)
    print("🔑 PASSWORD UPDATE TOOL")
    print("=" * 70)
    
    # Find the user
    print(f"\nLooking for user: {my_email}")
    user = db.query(User).filter(User.email == my_email).first()
    
    if not user:
        print(f"❌ User not found!")
        db.close()
        return
    
    print(f"✅ User found: {user.full_name}")
    
    # Update password
    print(f"\nUpdating password to: {my_password}")
    user.hashed_password = get_password_hash(my_password)
    db.commit()
    db.refresh(user)
    
    print("✅ Password updated!")
    
    # Test it
    print(f"\nTesting new password...")
    if verify_password(my_password, user.hashed_password):
        print("✅ Password verification works!")
    else:
        print("❌ Password verification failed!")
        db.close()
        return
    
    print("\n" + "=" * 70)
    print("🎯 YOUR LOGIN CREDENTIALS")
    print("=" * 70)
    print(f"📧 Email:    {my_email}")
    print(f"🔑 Password: {my_password}")
    print("=" * 70)
    print("\n🌐 Go to: http://localhost:5173/login")
    print("   Use the credentials above.\n")
    
    db.close()

if __name__ == '__main__':
    main()