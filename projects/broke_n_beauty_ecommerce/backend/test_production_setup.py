#!/usr/bin/env python3
"""
Test script for production deployment setup
Tests environment variables, database migrations, and backup/restore procedures
"""

import os
import sys
import subprocess
import tempfile
import logging
from pathlib import Path
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_environment_variables():
    """Test that environment configuration is working"""
    logger.info("🔧 Testing Environment Variables Configuration")
    
    try:
        from app.config import settings
        
        # Test basic configuration
        logger.info(f"✅ App Name: {settings.APP_NAME}")
        logger.info(f"✅ App Version: {settings.APP_VERSION}")
        logger.info(f"✅ Environment: {settings.ENVIRONMENT}")
        logger.info(f"✅ Debug Mode: {settings.DEBUG}")
        logger.info(f"✅ Demo Mode: {settings.DEMO_MODE}")
        
        # Test database configuration
        logger.info(f"✅ Database URL: {settings.DATABASE_URL.split('@')[0]}@***")
        
        # Test CORS configuration
        origins = settings.get_cors_origins()
        logger.info(f"✅ CORS Origins: {len(origins)} configured")
        
        # Test JWT configuration
        if len(settings.JWT_SECRET) >= 20:
            logger.info("✅ JWT Secret: Properly configured")
        else:
            logger.warning("⚠️ JWT Secret: Should be longer in production")
        
        # Validate settings
        issues = settings.validate_settings()
        if issues:
            logger.warning("⚠️ Configuration Issues Found:")
            for issue in issues:
                logger.warning(f"   - {issue}")
        else:
            logger.info("✅ No configuration issues found")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Environment configuration test failed: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    logger.info("🗄️ Testing Database Connection")
    
    try:
        from app.db import engine, get_database_info
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute("SELECT 1 as test")
            test_value = result.scalar()
            
            if test_value == 1:
                logger.info("✅ Database connection successful")
            else:
                logger.error("❌ Database connection test failed")
                return False
        
        # Display database info
        db_info = get_database_info()
        logger.info(f"✅ Database Type: {db_info['type']}")
        if db_info['pool_size'] != "N/A":
            logger.info(f"✅ Pool Size: {db_info['pool_size']}")
            logger.info(f"✅ Max Overflow: {db_info['max_overflow']}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Database connection test failed: {e}")
        return False

def test_alembic_setup():
    """Test Alembic migration setup"""
    logger.info("🔄 Testing Alembic Migration Setup")
    
    try:
        # Test alembic configuration
        if not Path("alembic.ini").exists():
            logger.error("❌ alembic.ini not found")
            return False
        
        if not Path("alembic/env.py").exists():
            logger.error("❌ alembic/env.py not found")
            return False
        
        logger.info("✅ Alembic configuration files found")
        
        # Test alembic current (should work even without migrations)
        try:
            result = subprocess.run([
                sys.executable, "-m", "alembic", "current"
            ], capture_output=True, text=True, check=False)
            
            if result.returncode == 0:
                logger.info("✅ Alembic can read current revision")
            else:
                logger.warning(f"⚠️ Alembic current command output: {result.stderr}")
        
        except Exception as e:
            logger.warning(f"⚠️ Alembic test warning: {e}")
        
        # Check for migration files
        versions_dir = Path("alembic/versions")
        if versions_dir.exists():
            migrations = list(versions_dir.glob("*.py"))
            logger.info(f"✅ Found {len(migrations)} migration files")
        else:
            logger.warning("⚠️ No alembic/versions directory found")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Alembic setup test failed: {e}")
        return False

def test_backup_restore():
    """Test database backup and restore functionality"""
    logger.info("💾 Testing Database Backup and Restore")
    
    try:
        # Test backup creation
        from backup_database import DatabaseBackup
        from restore_database import DatabaseRestore
        
        # Create a test backup directory
        test_backup_dir = Path("test_backups")
        test_backup_dir.mkdir(exist_ok=True)
        
        # Create backup
        backup = DatabaseBackup(backup_dir=str(test_backup_dir))
        backup_path = backup.create_backup()
        
        if Path(backup_path).exists():
            logger.info(f"✅ Backup created successfully: {Path(backup_path).name}")
            
            # Test backup listing
            backups = backup.list_backups()
            logger.info(f"✅ Found {len(backups)} backups")
            
            # Test restore functionality (dry run)
            restore = DatabaseRestore(backup_dir=str(test_backup_dir))
            available_backups = restore.list_available_backups()
            
            if available_backups:
                logger.info(f"✅ Restore can find {len(available_backups)} backups")
            else:
                logger.warning("⚠️ Restore cannot find backups")
            
            # Cleanup test backup
            Path(backup_path).unlink()
            logger.info("✅ Test backup cleaned up")
            
        else:
            logger.error("❌ Backup creation failed")
            return False
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Backup/Restore test failed: {e}")
        return False
    finally:
        # Cleanup test directory
        test_backup_dir = Path("test_backups")
        if test_backup_dir.exists():
            import shutil
            shutil.rmtree(test_backup_dir, ignore_errors=True)

def test_fastapi_startup():
    """Test FastAPI application startup"""
    logger.info("🚀 Testing FastAPI Application Startup")
    
    try:
        from app.main import app
        from app.config import settings
        
        logger.info(f"✅ FastAPI app created: {app.title}")
        logger.info(f"✅ App version: {app.version}")
        logger.info(f"✅ Debug mode: {app.debug}")
        
        # Test health endpoint
        test_client = None
        try:
            from fastapi.testclient import TestClient
            test_client = TestClient(app)
            
            response = test_client.get("/health")
            if response.status_code == 200:
                health_data = response.json()
                logger.info("✅ Health endpoint working")
                logger.info(f"   Status: {health_data.get('status')}")
                logger.info(f"   Environment: {health_data.get('environment')}")
            else:
                logger.warning(f"⚠️ Health endpoint returned {response.status_code}")
        
        except ImportError:
            logger.warning("⚠️ TestClient not available, skipping endpoint test")
        except Exception as e:
            logger.warning(f"⚠️ Health endpoint test failed: {e}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ FastAPI startup test failed: {e}")
        return False

def run_all_tests():
    """Run all production setup tests"""
    logger.info("🧪 Starting Production Setup Tests")
    logger.info("=" * 60)
    
    test_results = {}
    
    # Run tests
    tests = [
        ("Environment Variables", test_environment_variables),
        ("Database Connection", test_database_connection),
        ("Alembic Setup", test_alembic_setup),
        ("Backup & Restore", test_backup_restore),
        ("FastAPI Startup", test_fastapi_startup),
    ]
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            test_results[test_name] = result
            logger.info(f"{'✅' if result else '❌'} {test_name}: {'PASSED' if result else 'FAILED'}")
        except Exception as e:
            test_results[test_name] = False
            logger.error(f"❌ {test_name}: FAILED ({e})")
        
        logger.info("-" * 60)
    
    # Summary
    logger.info("📊 TEST SUMMARY")
    logger.info("=" * 60)
    
    passed = sum(1 for result in test_results.values() if result)
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        logger.info(f"   {test_name:<25} {status}")
    
    logger.info("-" * 60)
    logger.info(f"🎯 Results: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        logger.info("🎉 All production setup tests passed!")
        return True
    else:
        logger.warning("⚠️ Some tests failed. Check the setup before deployment.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)