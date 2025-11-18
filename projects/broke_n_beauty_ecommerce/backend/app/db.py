from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import QueuePool
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# Database connection configuration
def get_engine():
    """Create database engine with environment-specific configuration"""
    database_url = settings.get_database_url()
    
    # SQLite-specific connection arguments
    connect_args = {}
    if database_url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}
    
    # Production PostgreSQL configuration
    if settings.is_production and database_url.startswith("postgresql"):
        engine = create_engine(
            database_url,
            poolclass=QueuePool,
            pool_size=settings.DATABASE_POOL_SIZE,
            max_overflow=settings.DATABASE_MAX_OVERFLOW,
            pool_pre_ping=True,
            pool_recycle=settings.DATABASE_POOL_RECYCLE,
            echo=False,  # Disable SQL logging in production
        )
    else:
        # Development/staging configuration
        engine = create_engine(
            database_url,
            pool_pre_ping=True,
            connect_args=connect_args,
            echo=settings.DEBUG,  # Enable SQL logging in debug mode
        )
    
    logger.info(f"Database engine created for: {database_url.split('://')[0]}://...")
    return engine

# Create engine and session factory
engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")

def get_database_info():
    """Get database connection information"""
    database_url = settings.get_database_url()
    return {
        "type": database_url.split("://")[0],
        "pool_size": settings.DATABASE_POOL_SIZE if database_url.startswith("postgresql") else "N/A",
        "max_overflow": settings.DATABASE_MAX_OVERFLOW if database_url.startswith("postgresql") else "N/A",
        "pool_recycle": settings.DATABASE_POOL_RECYCLE if database_url.startswith("postgresql") else "N/A",
    }