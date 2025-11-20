#!/usr/bin/env python3
"""
Complete reset of your account to make it work like the test account
"""
from app.db import SessionLocal
from app.models.user import User
from app.auth import get_password_hash, verify_password

def main():
    db = SessionLocal()
    
    my_email = "1997Jamesjjohnson@gmail.com"
    my_password = "password123"  # Same as test account
    
    print("=" * 70)
    print("🔧 COMPLETE ACCOUNT RESET")
    print("=" * 70)
    
    # Step 1: Delete existing account if it exists
    print(f"\nStep 1: Checking for existing account...")
    existing = db.query(User).filter(User.email == my_email).first()
    
    if existing:
        print(f"   ⚠️  Found existing account - DELETING IT")
        db.delete(existing)
        db.commit()
        print("   ✅ Old account deleted")
    else:
        print("   ℹ️  No existing account found")
    
    # Step 2: Create fresh account (exactly like test account)
    print(f"\nStep 2: Creating fresh account...")
    
    new_user = User(
        email=my_email,
        hashed_password=get_password_hash(my_password),
        full_name='James Johnson',
        role='user'
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    print("   ✅ Fresh account created")
    
    # Step 3: Verify it works
    print(f"\nStep 3: Testing password verification...")
    
    # Re-fetch from database to be absolutely sure
    test_user = db.query(User).filter(User.email == my_email).first()
    
    if test_user:
        if verify_password(my_password, test_user.hashed_password):
            print("   ✅ Password verification WORKS!")
        else:
            print("   ❌ Password verification FAILED!")
            print("   🔴 SOMETHING IS WRONG - Contact me with this error")
    else:
        print("   ❌ User not found after creation!")
        print("   🔴 SOMETHING IS WRONG - Contact me with this error")
    
    # Step 4: Show credentials
    print("\n" + "=" * 70)
    print("🎯 YOUR LOGIN CREDENTIALS (SAME AS TEST ACCOUNT)")
    print("=" * 70)
    print(f"📧 Email:    {my_email}")
    print(f"🔑 Password: {my_password}")
    print("=" * 70)
    
    # Step 5: Verify it matches test account setup
    print("\n✅ Your account is now set up EXACTLY like the test account.")
    print("✅ Both use the same password hashing method.")
    print("✅ Both use the same password.")
    
    print("\n🌐 Go to: http://localhost:5173/login")
    print("   Use the credentials above.\n")
    
    print("=" * 70)
    print("💡 IMPORTANT: Make sure you type the email EXACTLY:")
    print(f"   {my_email}")
    print("   (with capital J's in Jamesjjohnson)")
    print("=" * 70 + "\n")
    
    db.close()

if __name__ == '__main__':
    main()