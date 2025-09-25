from fastapi import FastAPI
from backend.app.db import Base, engine
from backend.app import models  # Import models so SQLAlchemy knows about them
from backend.app.routers import auth as auth_router
from backend.app.routers import users as users_router
from backend.app.routers import products as products_router

app = FastAPI(title="Clover Line API", version="0.1.0")

# Dev convenience: create tables automatically
Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(auth_router.router)
app.include_router(users_router.router)
app.include_router(products_router.router)
