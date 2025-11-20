#!/usr/bin/env python3
"""
Debug script to check users in database and create a test user
"""
from app.db import SessionLocal
from app.models.user import User
from app.auth import get_password_hash, verify_password

def main():
    db = SessionLocal()
    
    print("=" * 60)
    print("🔍 USER DATABASE DEBUG TOOL")
    print("=" * 60)
    
    # Check all users in database
    users = db.query(User).all()
    
    print(f"\n📊 Total users in database: {len(users)}")
    
    if users:
        print("\n👥 Existing users:")
        print("-" * 60)
        for user in users:
            print(f"  ID: {user.id}")
            print(f"  Email: {user.email}")
            print(f"  Full Name: {user.full_name}")
            print(f"  Role: {user.role}")
            print(f"  Password Hash: {user.hashed_password[:50]}...")
            print("-" * 60)
    else:
        print("\n⚠️  No users found in database!")
    
    print("\n" + "=" * 60)
    print("🔧 Creating/Updating Test User")
    print("=" * 60)
    
    # Check if test user exists
    test_email = "test@example.com"
    test_password = "password123"
    
    existing_user = db.query(User).filter(User.email == test_email).first()
    
    if existing_user:
        print(f"\n⚠️  User {test_email} already exists!")
        print("   Updating password to: password123")
        
        # Update the password
        existing_user.hashed_password = get_password_hash(test_password)
        db.commit()
        
        print("\n✅ Password updated successfully!")
        
        # Test the password
        print("\n🔬 Testing password verification...")
        if verify_password(test_password, existing_user.hashed_password):
            print("✅ Password verification works!")
        else:
            print("❌ Password verification failed! There's an issue.")
    else:
        print(f"\n📝 Creating new user: {test_email}")
        
        # Create new user
        new_user = User(
            email=test_email,
            hashed_password=get_password_hash(test_password),
            full_name='Test User',
            role='user'
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print("\n✅ User created successfully!")
        
        # Test the password
        print("\n🔬 Testing password verification...")
        if verify_password(test_password, new_user.hashed_password):
            print("✅ Password verification works!")
        else:
            print("❌ Password verification failed! There's an issue.")
    
    print("\n" + "=" * 60)
    print("🎯 LOGIN CREDENTIALS")
    print("=" * 60)
    print(f"📧 Email:    {test_email}")
    print(f"🔑 Password: {test_password}")
    print("=" * 60)
    print("\n🌐 Go to: http://localhost:5173/login")
    print("   Use the credentials above to log in.\n")
    
    db.close()

if __name__ == '__main__':
    main()