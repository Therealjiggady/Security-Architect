from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from backend.app.db import Base, engine
from backend.app import models  # Import models so SQLAlchemy knows about them
from backend.app.routers import auth as auth_router
from backend.app.routers import users as users_router
from backend.app.routers import products as products_router
from backend.app.routers import cart as cart_router
from backend.app.routers import wishlist as wishlist_router
from backend.app.routers import sizing as sizing_router

app = FastAPI(title="Clover Line API", version="0.1.0")

# Mount static files for images
app.mount("/static/images", StaticFiles(directory="backend/static/images"), name="images")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dev convenience: create tables automatically
Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(auth_router.router)
app.include_router(users_router.router)
app.include_router(products_router.router)
app.include_router(cart_router.router)
app.include_router(wishlist_router.router)
app.include_router(sizing_router.router)
