from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import sys
from pathlib import Path

from app.config import settings
from app.db import Base, engine
from app import models  # Import models so SQLAlchemy knows about them
from app.routers import auth as auth_router
from app.routers import users as users_router
from app.routers import products as products_router
from app.routers import cart as cart_router
from app.routers import wishlist as wishlist_router
from app.routers import sizing as sizing_router
from app.routers import orders as orders_router
from app.routers import chat as chat_router
from app.routers import payments as payments_router
from app.routers import reviews as reviews_router
from app.routers import recently_viewed as recently_viewed_router
from app.routers import inventory_alerts as inventory_alerts_router

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

# Validate settings on startup
config_issues = settings.validate_settings()
if config_issues:
    logger.warning("Configuration issues found:")
    for issue in config_issues:
        logger.warning(f"  - {issue}")

# Initialize FastAPI app with dynamic configuration
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
)

# Mount static files for images (ensure directory exists)
static_dir = Path("static/images")
static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static/images", StaticFiles(directory="static/images"), name="images")

# Mount static files for review images
review_images_dir = Path(settings.REVIEW_IMAGE_DIR)
review_images_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static/review_images", StaticFiles(directory=settings.REVIEW_IMAGE_DIR), name="review_images")

# Add CORS middleware with environment-based configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Maintenance mode check
@app.middleware("http")
async def maintenance_mode_check(request, call_next):
    if settings.MAINTENANCE_MODE and request.url.path not in ["/health", "/docs", "/redoc"]:
        return JSONResponse(
            status_code=503,
            content={
                "detail": "Application is currently under maintenance. Please try again later.",
                "maintenance": True
            }
        )
    response = await call_next(request)
    return response

# Create database tables (development convenience)
if settings.is_development:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created (development mode)")

@app.get("/health")
def health():
    """Health check endpoint with environment info"""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "version": settings.APP_VERSION,
        "demo_mode": settings.DEMO_MODE,
        "maintenance_mode": settings.MAINTENANCE_MODE,
        "features": {
            "registration": settings.REGISTRATION_ENABLED,
            "admin_registration": settings.ADMIN_REGISTRATION_ENABLED,
        }
    }

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "docs": "/docs" if settings.is_development else "Documentation disabled in production",
        "health": "/health"
    }

app.include_router(auth_router.router)
app.include_router(users_router.router)
app.include_router(products_router.router)
app.include_router(cart_router.router)
app.include_router(wishlist_router.router)
app.include_router(sizing_router.router)
app.include_router(orders_router.router)
app.include_router(chat_router.router)
app.include_router(payments_router.router)
app.include_router(reviews_router.router)
app.include_router(recently_viewed_router.router)
app.include_router(inventory_alerts_router.router)
