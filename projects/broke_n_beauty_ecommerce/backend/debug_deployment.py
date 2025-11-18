#!/usr/bin/env python3
"""
Deployment Debugging Tool
Checks common deployment issues and provides fixes
"""
import os
import sys
from pathlib import Path


def check_environment_variables():
    """Check if required environment variables are set"""
    print("\n" + "=" * 70)
    print("🔍 CHECKING ENVIRONMENT VARIABLES")
    print("=" * 70)
    
    required_vars = {
        "DATABASE_URL": "Database connection string",
        "JWT_SECRET": "Secret key for JWT tokens",
        "FRONTEND_URL": "Frontend application URL for CORS"
    }
    
    optional_vars = {
        "PORT": "Server port (default: 8000)",
        "STRIPE_SECRET_KEY": "Stripe API key for payments",
        "ENVIRONMENT": "Environment name (production/staging)"
    }
    
    issues = []
    
    print("\nRequested Variables:")
    for var, description in required_vars.items():
        value = os.getenv(var)
        if value:
            # Mask sensitive values
            display = value[:20] + "..." if len(value) > 20 else value
            if "password" in value.lower() or "secret" in var.lower():
                display = "*" * 10
            print(f"  ✅ {var}: {display}")
        else:
            print(f"  ❌ {var}: NOT SET")
            issues.append(f"Missing {var} - {description}")
    
    print("\nOptional Variables:")
    for var, description in optional_vars.items():
        value = os.getenv(var)
        if value:
            display = value if var != "STRIPE_SECRET_KEY" else "*" * 10
            print(f"  ✅ {var}: {display}")
        else:
            print(f"  ⚠️  {var}: Not set (using default)")
    
    return issues


def check_static_files():
    """Check if static files exist and are accessible"""
    print("\n" + "=" * 70)
    print("🔍 CHECKING STATIC FILES")
    print("=" * 70)
    
    static_dir = Path("static/images")
    issues = []
    
    if not static_dir.exists():
        print(f"  ❌ Static directory not found: {static_dir}")
        issues.append("Static directory missing - create backend/static/images/")
        return issues
    
    print(f"  ✅ Static directory exists: {static_dir}")
    
    # Count image files
    image_files = list(static_dir.glob("*.png")) + list(static_dir.glob("*.jpg"))
    print(f"  ℹ️  Found {len(image_files)} image files")
    
    if len(image_files) == 0:
        issues.append("No images found in static/images/ directory")
        print("  ⚠️  No images found")
    else:
        print(f"  ✅ Images present")
        for img in image_files[:5]:  # Show first 5
            print(f"     - {img.name}")
        if len(image_files) > 5:
            print(f"     ... and {len(image_files) - 5} more")
    
    return issues


def check_database_connection():
    """Check database connection"""
    print("\n" + "=" * 70)
    print("🔍 CHECKING DATABASE CONNECTION")
    print("=" * 70)
    
    issues = []
    
    try:
        from app.db import engine
        
        # Try to connect
        with engine.connect() as conn:
            print("  ✅ Database connection successful")
            
            # Check if tables exist
            from sqlalchemy import inspect
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            
            print(f"  ℹ️  Found {len(tables)} tables:")
            for table in tables:
                print(f"     - {table}")
            
            if len(tables) == 0:
                issues.append("No tables found - run migrations or check Base.metadata.create_all()")
                print("  ⚠️  No tables found in database")
    
    except Exception as e:
        print(f"  ❌ Database connection failed: {e}")
        issues.append(f"Database connection error: {str(e)}")
    
    return issues


def check_cors_configuration():
    """Check CORS configuration"""
    print("\n" + "=" * 70)
    print("🔍 CHECKING CORS CONFIGURATION")
    print("=" * 70)
    
    issues = []
    
    try:
        from app.main import app
        
        # Find CORS middleware
        cors_middleware = None
        for middleware in app.user_middleware:
            if "CORSMiddleware" in str(middleware):
                cors_middleware = middleware
                break
        
        if cors_middleware:
            print("  ✅ CORS middleware configured")
            frontend_url = os.getenv("FRONTEND_URL")
            if frontend_url:
                print(f"  ℹ️  Frontend URL: {frontend_url}")
            else:
                issues.append("FRONTEND_URL not set - CORS may fail in production")
                print("  ⚠️  FRONTEND_URL environment variable not set")
        else:
            print("  ⚠️  CORS middleware not found")
            issues.append("CORS middleware may not be configured")
    
    except Exception as e:
        print(f"  ❌ Error checking CORS: {e}")
        issues.append(f"CORS check failed: {str(e)}")
    
    return issues


def check_api_endpoints():
    """Check if key API endpoints are accessible"""
    print("\n" + "=" * 70)
    print("🔍 CHECKING API ENDPOINTS")
    print("=" * 70)
    
    issues = []
    
    try:
        from fastapi.testclient import TestClient
        from app.main import app
        
        client = TestClient(app)
        
        endpoints = [
            ("/health", "Health check"),
            ("/products/", "Products list"),
        ]
        
        for endpoint, description in endpoints:
            try:
                response = client.get(endpoint)
                if response.status_code == 200:
                    print(f"  ✅ {description}: {endpoint} - OK")
                else:
                    print(f"  ⚠️  {description}: {endpoint} - Status {response.status_code}")
                    issues.append(f"{endpoint} returned {response.status_code}")
            except Exception as e:
                print(f"  ❌ {description}: {endpoint} - Error: {e}")
                issues.append(f"{endpoint} failed: {str(e)}")
    
    except Exception as e:
        print(f"  ❌ Cannot test endpoints: {e}")
        issues.append(f"Endpoint testing failed: {str(e)}")
    
    return issues


def main():
    print("=" * 70)
    print("🔧 DEPLOYMENT DEBUGGING TOOL")
    print("=" * 70)
    print("\nThis tool checks common deployment issues.\n")
    
    all_issues = []
    
    # Run all checks
    all_issues.extend(check_environment_variables())
    all_issues.extend(check_static_files())
    all_issues.extend(check_database_connection())
    all_issues.extend(check_cors_configuration())
    all_issues.extend(check_api_endpoints())
    
    # Summary
    print("\n" + "=" * 70)
    if len(all_issues) == 0:
        print("✅ ✅ ✅ ALL CHECKS PASSED! ✅ ✅ ✅")
        print("=" * 70)
        print("\nYour deployment looks good!")
        print("Backend should be ready for production.\n")
        return 0
    else:
        print(f"⚠️  FOUND {len(all_issues)} ISSUES")
        print("=" * 70)
        print("\nIssues to fix:")
        for i, issue in enumerate(all_issues, 1):
            print(f"{i}. {issue}")
        
        print("\n" + "=" * 70)
        print("💡 RECOMMENDED ACTIONS")
        print("=" * 70)
        
        if any("DATABASE_URL" in issue for issue in all_issues):
            print("\n📌 Database Configuration:")
            print("   Set DATABASE_URL in your environment")
            print("   For Render: Set in Environment Variables tab")
            print("   Format: postgresql://user:pass@host:5432/dbname")
        
        if any("JWT_SECRET" in issue for issue in all_issues):
            print("\n📌 JWT Configuration:")
            print("   Set JWT_SECRET to a secure random string")
            print("   Generate: python -c 'import secrets; print(secrets.token_hex(32))'")
        
        if any("FRONTEND_URL" in issue for issue in all_issues):
            print("\n📌 CORS Configuration:")
            print("   Set FRONTEND_URL to your frontend URL")
            print("   Example: https://broke-beauty.vercel.app")
        
        if any("Static" in issue or "images" in issue for issue in all_issues):
            print("\n📌 Static Files:")
            print("   Ensure static/images/ directory exists")
            print("   Commit images to Git")
            print("   mkdir -p backend/static/images")
        
        if any("tables" in issue for issue in all_issues):
            print("\n📌 Database Tables:")
            print("   Run migrations or let SQLAlchemy auto-create")
            print("   Python will create tables on startup")
        
        print("\n")
        return 1


if __name__ == '__main__':
    sys.exit(main())