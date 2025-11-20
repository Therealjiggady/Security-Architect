#!/usr/bin/env python3
"""
Check and fix a specific user account
"""
from app.db import SessionLocal
from app.models.user import User
from app.auth import get_password_hash, verify_password

def main():
    db = SessionLocal()
    
    # Your email
    my_email = "1997Jamesjjohnson@gmail.com"
    
    print("=" * 60)
    print(f"🔍 Checking account: {my_email}")
    print("=" * 60)
    
    # Check if user exists
    user = db.query(User).filter(User.email == my_email).first()
    
    if user:
        print(f"\n✅ Account found!")
        print(f"   ID: {user.id}")
        print(f"   Email: {user.email}")
        print(f"   Full Name: {user.full_name}")
        print(f"   Role: {user.role}")
        print(f"   Password Hash: {user.hashed_password[:50]}...")
        
        # Ask to reset password
        print("\n" + "=" * 60)
        print("🔧 RESETTING PASSWORD")
        print("=" * 60)
        
        new_password = "MyNewPassword123"
        
        print(f"\nSetting new password to: {new_password}")
        user.hashed_password = get_password_hash(new_password)
        db.commit()
        
        print("\n✅ Password updated successfully!")
        
        # Test the password
        print("\n🔬 Testing password verification...")
        if verify_password(new_password, user.hashed_password):
            print("✅ Password verification works!")
        else:
            print("❌ Password verification failed!")
        
        print("\n" + "=" * 60)
        print("🎯 YOUR LOGIN CREDENTIALS")
        print("=" * 60)
        print(f"📧 Email:    {my_email}")
        print(f"🔑 Password: {new_password}")
        print("=" * 60)
        
    else:
        print(f"\n❌ Account NOT found!")
        print(f"   The email {my_email} doesn't exist in the database.")
        print("\n📝 Creating account now...")
        
        new_password = "MyNewPassword123"
        
        new_user = User(
            email=my_email,
            hashed_password=get_password_hash(new_password),
            full_name='James Johnson',
            role='user'
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print("\n✅ Account created successfully!")
        
        # Test the password
        print("\n🔬 Testing password verification...")
        if verify_password(new_password, new_user.hashed_password):
            print("✅ Password verification works!")
        else:
            print("❌ Password verification failed!")
        
        print("\n" + "=" * 60)
        print("🎯 YOUR LOGIN CREDENTIALS")
        print("=" * 60)
        print(f"📧 Email:    {my_email}")
        print(f"🔑 Password: {new_password}")
        print("=" * 60)
    
    print("\n🌐 Go to: http://localhost:5173/login")
    print("   Use the credentials above to log in.\n")
    
    db.close()

if __name__ == '__main__':
    main()