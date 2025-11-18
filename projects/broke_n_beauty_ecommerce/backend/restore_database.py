#!/usr/bin/env python3
"""
Database restore utility for Broken Beauty e-commerce platform
Supports restoring from both SQLite and PostgreSQL backups
"""

import os
import sys
import sqlite3
import subprocess
import gzip
import shutil
from datetime import datetime
from pathlib import Path
import logging
import argparse

from app.config import settings

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DatabaseRestore:
    def __init__(self, backup_dir="backups"):
        self.backup_dir = Path(backup_dir)
        self.database_url = settings.get_database_url()
        
    def list_available_backups(self):
        """List all available backup files"""
        backups = []
        for backup_file in self.backup_dir.glob("brokenbeauty_*"):
            stats = backup_file.stat()
            backups.append({
                "filename": backup_file.name,
                "path": str(backup_file),
                "size_mb": stats.st_size / 1024 / 1024,
                "created": datetime.fromtimestamp(stats.st_ctime),
                "type": "SQLite" if "sqlite" in backup_file.name else "PostgreSQL"
            })
        
        # Sort by creation time (newest first)
        backups.sort(key=lambda x: x["created"], reverse=True)
        return backups
    
    def decompress_backup(self, backup_path):
        """Decompress a .gz backup file"""
        backup_path = Path(backup_path)
        if not backup_path.suffix == ".gz":
            return backup_path  # Already decompressed
        
        decompressed_path = backup_path.with_suffix("")
        
        logger.info(f"Decompressing backup: {backup_path}")
        
        with gzip.open(backup_path, 'rb') as f_in:
            with open(decompressed_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        
        return decompressed_path
    
    def restore_sqlite(self, backup_path):
        """Restore SQLite database from backup"""
        try:
            backup_path = Path(backup_path)
            
            # Decompress if needed
            if backup_path.suffix == ".gz":
                backup_path = self.decompress_backup(backup_path)
            
            # Extract current database path
            current_db_path = self.database_url.replace("sqlite:///", "").replace("sqlite://", "")
            if not current_db_path.startswith("/"):
                current_db_path = os.path.join(os.getcwd(), current_db_path)
            
            logger.info(f"Restoring SQLite database: {current_db_path}")
            
            # Create backup of current database
            if os.path.exists(current_db_path):
                backup_current = f"{current_db_path}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                shutil.copy2(current_db_path, backup_current)
                logger.info(f"Current database backed up to: {backup_current}")
            
            # Restore from backup
            shutil.copy2(backup_path, current_db_path)
            
            # Verify restore
            conn = sqlite3.connect(current_db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = cursor.fetchall()
            conn.close()
            
            logger.info(f"SQLite restore completed. Found {len(tables)} tables.")
            
            # Clean up decompressed file if it was created
            if backup_path.suffix != ".gz" and not os.path.samefile(backup_path, Path(backup_path).with_suffix(".gz")):
                backup_path.unlink()
            
            return True
            
        except Exception as e:
            logger.error(f"SQLite restore failed: {e}")
            raise
    
    def restore_postgresql(self, backup_path):
        """Restore PostgreSQL database from backup"""
        try:
            backup_path = Path(backup_path)
            
            # Decompress if needed
            if backup_path.suffix == ".gz":
                backup_path = self.decompress_backup(backup_path)
            
            logger.info("Restoring PostgreSQL database...")
            logger.warning("This will DROP and recreate all tables!")
            
            # Run psql to restore
            cmd = ["psql", self.database_url, "-f", str(backup_path)]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True
            )
            
            if result.returncode != 0:
                logger.error(f"psql restore failed: {result.stderr}")
                raise subprocess.CalledProcessError(result.returncode, cmd, result.stderr)
            
            logger.info("PostgreSQL restore completed successfully")
            
            # Clean up decompressed file if it was created
            if backup_path.suffix != ".gz":
                backup_path.unlink()
            
            return True
            
        except subprocess.CalledProcessError as e:
            logger.error(f"PostgreSQL restore failed: {e}")
            raise
        except Exception as e:
            logger.error(f"PostgreSQL restore failed: {e}")
            raise
    
    def restore_from_backup(self, backup_path):
        """Restore database from backup file"""
        backup_path = Path(backup_path)
        
        if not backup_path.exists():
            raise FileNotFoundError(f"Backup file not found: {backup_path}")
        
        logger.info(f"Starting restore from: {backup_path}")
        
        # Determine backup type from filename
        if "sqlite" in backup_path.name.lower():
            return self.restore_sqlite(backup_path)
        elif "postgres" in backup_path.name.lower():
            return self.restore_postgresql(backup_path)
        else:
            # Try to determine from current database URL
            if self.database_url.startswith("sqlite"):
                return self.restore_sqlite(backup_path)
            elif self.database_url.startswith("postgresql"):
                return self.restore_postgresql(backup_path)
            else:
                raise ValueError("Cannot determine backup type from filename or database URL")
    
    def create_test_backup(self):
        """Create a test database backup before restore (safety measure)"""
        from backup_database import DatabaseBackup
        
        logger.info("Creating safety backup before restore...")
        backup = DatabaseBackup(backup_dir=str(self.backup_dir / "safety"))
        safety_backup_path = backup.create_backup()
        logger.info(f"Safety backup created: {safety_backup_path}")
        return safety_backup_path

def main():
    """Main restore function"""
    parser = argparse.ArgumentParser(description="Restore Broken Beauty database from backup")
    parser.add_argument("--backup", "-b", help="Path to backup file to restore from")
    parser.add_argument("--list", "-l", action="store_true", help="List available backups")
    parser.add_argument("--latest", action="store_true", help="Restore from latest backup")
    parser.add_argument("--no-safety", action="store_true", help="Skip safety backup creation")
    
    args = parser.parse_args()
    
    try:
        restore = DatabaseRestore()
        
        if args.list:
            print("\n📋 Available Backups:")
            print("=" * 80)
            backups = restore.list_available_backups()
            
            if not backups:
                print("No backups found in ./backups directory")
                sys.exit(1)
            
            for i, backup in enumerate(backups, 1):
                print(f"{i:2d}. {backup['filename']}")
                print(f"    📅 Created: {backup['created']}")
                print(f"    💾 Size: {backup['size_mb']:.2f} MB")
                print(f"    🗃️  Type: {backup['type']}")
                print()
            
            return
        
        if args.latest:
            backups = restore.list_available_backups()
            if not backups:
                logger.error("No backups found")
                sys.exit(1)
            backup_path = backups[0]["path"]
            logger.info(f"Using latest backup: {backups[0]['filename']}")
        elif args.backup:
            backup_path = args.backup
        else:
            logger.error("Please specify --backup, --latest, or --list")
            parser.print_help()
            sys.exit(1)
        
        # Create safety backup unless disabled
        if not args.no_safety:
            restore.create_test_backup()
        
        # Confirm restore action
        backup_name = Path(backup_path).name
        confirmation = input(f"\n⚠️  RESTORE DATABASE from {backup_name}?\n"
                           f"   This will REPLACE all current data!\n"
                           f"   Type 'yes' to continue: ")
        
        if confirmation.lower() != 'yes':
            logger.info("Restore cancelled by user")
            sys.exit(0)
        
        # Perform restore
        logger.info("Starting database restore...")
        restore.restore_from_backup(backup_path)
        logger.info("✅ Database restore completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Restore process failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()