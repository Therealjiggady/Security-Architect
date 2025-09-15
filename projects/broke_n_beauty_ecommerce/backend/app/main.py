from fastapi import FastAPI
from datetime import datetime, timezone
from .db import get_engine, init_dev_sqlite, test_connection
from backend.app.routers import users as users_router

app = FastAPI(title="Clover Line API", version="0.1.0")

@app.on_event("startup")
def on_startup():
    engine = get_engine()
    app.state.engine = engine
    # Initialize local SQLite schema if using SQLite
    init_dev_sqlite(engine)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": app.title,
        "version": app.version,
        "time": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }

@app.get("/")
def root():
    return {"message": "Welcome to Clover Line API"}

@app.get("/db/health")
def db_health():
    engine = getattr(app.state, "engine", get_engine())
    return test_connection(engine)

@app.get("/db/url")
def db_url(redact: bool = True):
    engine = getattr(app.state, "engine", get_engine())
    url = engine.url
    safe = str(url)
    try:
        if redact and getattr(url, "password", None):
            safe = safe.replace(url.password, "***")
    except Exception:
        pass
    return {
        "database_url": safe,
        "dialect": url.get_backend_name(),
        "driver": url.drivername,
    }

# Users resource endpoints
app.include_router(users_router.router, prefix="/users", tags=["users"])
