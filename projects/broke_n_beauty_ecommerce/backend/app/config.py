"""
Application configuration management
Centralizes all environment variable handling
"""

import os
from typing import List, Optional
from functools import lru_cache

class Settings:
    """Application settings from environment variables"""
    
    # Application
    APP_NAME: str = os.getenv("APP_NAME", "Broken Beauty API")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    DATABASE_POOL_SIZE: int = int(os.getenv("DATABASE_POOL_SIZE", "20"))
    DATABASE_MAX_OVERFLOW: int = int(os.getenv("DATABASE_MAX_OVERFLOW", "30"))
    DATABASE_POOL_RECYCLE: int = int(os.getenv("DATABASE_POOL_RECYCLE", "3600"))
    
    # JWT Authentication
    JWT_SECRET: str = os.getenv("JWT_SECRET", "dev-secret-change-in-production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    ALLOWED_ORIGINS: List[str] = os.getenv(
        "ALLOWED_ORIGINS", 
        "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    
    # Stripe
    STRIPE_SECRET_KEY: Optional[str] = os.getenv("STRIPE_SECRET_KEY")
    STRIPE_PUBLISHABLE_KEY: Optional[str] = os.getenv("STRIPE_PUBLISHABLE_KEY")
    STRIPE_WEBHOOK_SECRET: Optional[str] = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    # Email (Optional)
    SMTP_HOST: Optional[str] = os.getenv("SMTP_HOST")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: Optional[str] = os.getenv("SMTP_USERNAME")
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD")
    FROM_EMAIL: Optional[str] = os.getenv("FROM_EMAIL")
    
    # Security
    SECURITY_COOKIE_SECURE: bool = os.getenv("SECURITY_COOKIE_SECURE", "false").lower() == "true"
    SECURITY_COOKIE_SAMESITE: str = os.getenv("SECURITY_COOKIE_SAMESITE", "lax")
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    RATE_LIMIT_BURST: int = int(os.getenv("RATE_LIMIT_BURST", "10"))
    
    # File Upload
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "5242880"))  # 5MB
    ALLOWED_FILE_TYPES: List[str] = os.getenv(
        "ALLOWED_FILE_TYPES", 
        "image/jpeg,image/png,image/webp"
    ).split(",")
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Feature Flags
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() == "true"
    MAINTENANCE_MODE: bool = os.getenv("MAINTENANCE_MODE", "false").lower() == "true"
    REGISTRATION_ENABLED: bool = os.getenv("REGISTRATION_ENABLED", "true").lower() == "true"
    ADMIN_REGISTRATION_ENABLED: bool = os.getenv("ADMIN_REGISTRATION_ENABLED", "false").lower() == "true"
    
    # External Services
    SENTRY_DSN: Optional[str] = os.getenv("SENTRY_DSN")
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL")
    
    # Server
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    WORKERS: int = int(os.getenv("WORKERS", "1"))
    
    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"
    
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"
    
    @property
    def is_staging(self) -> bool:
        return self.ENVIRONMENT == "staging"
    
    def get_database_url(self) -> str:
        """Get database URL with proper configuration"""
        return self.DATABASE_URL
    
    def get_cors_origins(self) -> List[str]:
        """Get CORS allowed origins"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS if origin.strip()]
    
    def validate_settings(self) -> List[str]:
        """Validate critical settings and return list of issues"""
        issues = []
        
        if self.is_production:
            if self.JWT_SECRET == "dev-secret-change-in-production":
                issues.append("JWT_SECRET must be changed in production")
            
            if len(self.JWT_SECRET) < 32:
                issues.append("JWT_SECRET should be at least 32 characters in production")
            
            if not self.DATABASE_URL.startswith("postgresql"):
                issues.append("Production should use PostgreSQL database")
            
            if not self.STRIPE_SECRET_KEY:
                issues.append("STRIPE_SECRET_KEY is required in production")
        
        return issues

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()

# Global settings instance
settings = get_settings()