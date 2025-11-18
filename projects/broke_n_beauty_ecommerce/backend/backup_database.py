#!/usr/bin/env python3
"""
Database backup utility for Broken Beauty e-commerce platform
Supports both SQLite (development) and PostgreSQL (production) databases
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

from app.config import settings

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DatabaseBackup:
    def __init__(self, backup_dir="backups"):
        self.backup_dir = Path(backup_dir)
        self.backup_dir.mkdir(exist_ok=True)
        self.database_url = settings.get_database_url()
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
    def create_backup_filename(self, compressed=True):
        """Generate backup filename with timestamp"""
        if self.database_url.startswith("sqlite"):
            extension = ".sqlite.gz" if compressed else ".sqlite"
            return f"brokenbeauty_sqlite_{self.timestamp}{extension}"
        else:
            extension = ".sql.gz" if compressed else ".sql"
            return f"brokenbeauty_postgres_{self.timestamp}{extension}"
    
    def backup_sqlite(self):
        """Backup SQLite database"""
        try:
            # Extract database file path from URL
            db_path = self.database_url.replace("sqlite:///", "").replace("sqlite://", "")
            if not db_path.startswith("/"):
                db_path = os.path.join(os.getcwd(), db_path)
            
            if not os.path.exists(db_path):
                raise FileNotFoundError(f"SQLite database not found: {db_path}")
            
            # Create backup filename
            backup_filename = self.create_backup_filename(compressed=False)
            backup_path = self.backup_dir / backup_filename
            
            logger.info(f"Starting SQLite backup: {db_path}")
            
            # Copy database file
            shutil.copy2(db_path, backup_path)
            
            # Compress the backup
            compressed_filename = self.create_backup_filename(compressed=True)
            compressed_path = self.backup_dir / compressed_filename
            
            with open(backup_path, 'rb') as f_in:
                with gzip.open(compressed_path, 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
            
            # Remove uncompressed backup
            backup_path.unlink()
            
            file_size = compressed_path.stat().st_size / 1024 / 1024  # MB
            logger.info(f"SQLite backup completed: {compressed_path} ({file_size:.2f} MB)")
            
            return str(compressed_path)
            
        except Exception as e:
            logger.error(f"SQLite backup failed: {e}")
            raise
    
    def backup_postgresql(self):
        """Backup PostgreSQL database using pg_dump"""
        try:
            backup_filename = self.create_backup_filename(compressed=False)
            backup_path = self.backup_dir / backup_filename
            
            logger.info("Starting PostgreSQL backup...")
            
            # Run pg_dump
            cmd = ["pg_dump", self.database_url]
            
            with open(backup_path, 'w') as f:
                result = subprocess.run(
                    cmd,
                    stdout=f,
                    stderr=subprocess.PIPE,
                    text=True,
                    check=True
                )
            
            # Compress the backup
            compressed_filename = self.create_backup_filename(compressed=True)
            compressed_path = self.backup_dir / compressed_filename
            
            with open(backup_path, 'rb') as f_in:
                with gzip.open(compressed_path, 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
            
            # Remove uncompressed backup
            backup_path.unlink()
            
            file_size = compressed_path.stat().st_size / 1024 / 1024  # MB
            logger.info(f"PostgreSQL backup completed: {compressed_path} ({file_size:.2f} MB)")
            
            return str(compressed_path)
            
        except subprocess.CalledProcessError as e:
            logger.error(f"pg_dump failed: {e.stderr}")
            raise
        except Exception as e:
            logger.error(f"PostgreSQL backup failed: {e}")
            raise
    
    def create_backup(self):
        """Create database backup based on database type"""
        logger.info(f"Creating backup for database: {self.database_url.split('://')[0]}://...")
        
        if self.database_url.startswith("sqlite"):
            return self.backup_sqlite()
        elif self.database_url.startswith("postgresql"):
            return self.backup_postgresql()
        else:
            raise ValueError(f"Unsupported database type: {self.database_url}")
    
    def list_backups(self):
        """List all available backups"""
        backups = []
        for backup_file in self.backup_dir.glob("brokenbeauty_*"):
            stats = backup_file.stat()
            backups.append({
                "filename": backup_file.name,
                "path": str(backup_file),
                "size_mb": stats.st_size / 1024 / 1024,
                "created": datetime.fromtimestamp(stats.st_ctime),
                "modified": datetime.fromtimestamp(stats.st_mtime)
            })
        
        # Sort by creation time (newest first)
        backups.sort(key=lambda x: x["created"], reverse=True)
        return backups
    
    def cleanup_old_backups(self, keep_count=10):
        """Remove old backup files, keeping only the specified number"""
        backups = self.list_backups()
        
        if len(backups) <= keep_count:
            logger.info(f"Found {len(backups)} backups, keeping all (limit: {keep_count})")
            return
        
        logger.info(f"Found {len(backups)} backups, removing {len(backups) - keep_count} old backups")
        
        for backup in backups[keep_count:]:
            backup_path = Path(backup["path"])
            backup_path.unlink()
            logger.info(f"Removed old backup: {backup['filename']}")

def main():
    """Main backup function"""
    try:
        # Create backup instance
        backup = DatabaseBackup()
        
        # Create backup
        backup_path = backup.create_backup()
        
        # List current backups
        logger.info("Current backups:")
        for backup_info in backup.list_backups():
            logger.info(f"  {backup_info['filename']} - {backup_info['size_mb']:.2f} MB - {backup_info['created']}")
        
        # Cleanup old backups (keep last 10)
        backup.cleanup_old_backups(keep_count=10)
        
        logger.info("Backup process completed successfully!")
        return backup_path
        
    except Exception as e:
        logger.error(f"Backup process failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()