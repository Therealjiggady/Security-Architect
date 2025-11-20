#!/usr/bin/env python3
"""
Test the login process step by step
"""
from app.db import SessionLocal
from app.models.user import User
from app.auth import get_password_hash, verify_password, create_access_token
import json

def test_login(email, password):
    """Simulate the exact login process"""
    db = SessionLocal()
    
    print("=" * 70)
    print(f"🧪 TESTING LOGIN FOR: {email}")
    print("=" * 70)
    
    # Step 1: Check if user exists
    print(f"\n📌 Step 1: Looking up user in database...")
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        print(f"   ❌ FAIL: No user found with email: {email}")
        print(f"\n💡 Solution: The email doesn't exist in database.")
        print(f"   Run: python fix_my_account.py")
        db.close()
        return False
    
    print(f"   ✅ SUCCESS: User found!")
    print(f"      ID: {user.id}")
    print(f"      Email: {user.email}")
    print(f"      Full Name: {user.full_name}")
    
    # Step 2: Check password
    print(f"\n📌 Step 2: Verifying password...")
    print(f"   Password you're trying: {password}")
    print(f"   Password hash in DB: {user.hashed_password[:50]}...")
    
    try:
        password_ok = verify_password(password, user.hashed_password)
    except Exception as e:
        print(f"   ❌ FAIL: Error verifying password: {e}")
        db.close()
        return False
    
    if not password_ok:
        print(f"   ❌ FAIL: Password doesn't match!")
        print(f"\n💡 Solution: Password is wrong for this email.")
        print(f"   Run: python fix_my_account.py")
        db.close()
        return False
    
    print(f"   ✅ SUCCESS: Password matches!")
    
    # Step 3: Create access token
    print(f"\n📌 Step 3: Creating access token...")
    try:
        token = create_access_token(sub=user.email)
        print(f"   ✅ SUCCESS: Token created!")
        print(f"      Token: {token[:50]}...")
    except Exception as e:
        print(f"   ❌ FAIL: Error creating token: {e}")
        db.close()
        return False
    
    # Summary
    print("\n" + "=" * 70)
    print("✅ ✅ ✅ LOGIN SHOULD WORK! ✅ ✅ ✅")
    print("=" * 70)
    print(f"\nIf login still fails in browser, check:")
    print(f"1. Are you typing the email EXACTLY: {email}")
    print(f"2. Are you using password: {password}")
    print(f"3. Is backend running on http://localhost:8000")
    print(f"4. Check browser console for errors (F12)")
    print("=" * 70 + "\n")
    
    db.close()
    return True

def main():
    print("\n" + "=" * 70)
    print("🔍 LOGIN DIAGNOSTIC TOOL")
    print("=" * 70)
    
    tests = [
        ("test@example.com", "password123"),
        ("1997Jamesjjohnson@gmail.com", "password123"),
    ]
    
    for email, password in tests:
        test_login(email, password)
        print("\n")

if __name__ == '__main__':
    main()