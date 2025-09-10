from pathlib import Path
import os
import sqlite3
from typing import Dict, Any

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine

# Load environment variables from backend/.env robustly (independent of CWD)
BACKEND_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = BACKEND_DIR / ".env"
try:
    from dotenv import load_dotenv  # type: ignore
except Exception:
    load_dotenv = None  # type: ignore

# Best-effort load; do not crash if python-dotenv is unavailable
if load_dotenv is not None:
    try:
        load_dotenv(dotenv_path=str(ENV_FILE))
    except Exception:
        pass

# Paths
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATABASE_DIR = PROJECT_ROOT / "database"
SCHEMA_FILE = DATABASE_DIR / "schema.sql"


def get_database_url() -> str:
    """
    Resolve the database URL in priority order:
    1) DATABASE_URL (e.g., postgresql+psycopg://user:pass@host:5432/dbname)
    2) DEV_DATABASE_URL (e.g., sqlite:////absolute/path/to/dev.sqlite3)
    3) Default to sqlite under database/dev.sqlite3 in this repo
    """
    url = os.getenv("DATABASE_URL") or os.getenv("DEV_DATABASE_URL")
    if url:
        return url

    dev_db_path = DATABASE_DIR / "dev.sqlite3"
    # sqlite with absolute file path => sqlite:////absolute/path
    return "sqlite:///" + str(dev_db_path)


def get_engine() -> Engine:
    """
    Create a SQLAlchemy Engine for the resolved database URL.
    """
    url = get_database_url()
    engine = create_engine(url, future=True)
    return engine


def init_dev_sqlite(engine: Engine) -> None:
    """
    Initialize local SQLite schema from database/schema.sql if using SQLite.

    This is an idempotent operation because the SQL uses IF NOT EXISTS
    and INSERT OR IGNORE semantics.
    """
    try:
        if engine.url.get_backend_name() != "sqlite":
            return

        # Ensure database directory exists
        DATABASE_DIR.mkdir(parents=True, exist_ok=True)

        if not SCHEMA_FILE.exists():
            # Nothing to initialize
            return

        # Use the native sqlite3 driver to reliably execute multi-statement SQL
        db_file = engine.url.database  # absolute file path for sqlite
        if not db_file:
            return

        with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
            schema_sql = f.read()

        # Ensure parent directory for DB file exists
        Path(db_file).parent.mkdir(parents=True, exist_ok=True)

        with sqlite3.connect(db_file) as conn:
            conn.executescript(schema_sql)
            conn.commit()
    except Exception:
        # Intentionally swallow errors here to avoid crashing startup;
        # connection health can still be checked via /db/health.
        # For real apps, consider logging this exception.
        pass


def test_connection(engine: Engine) -> Dict[str, Any]:
    """
    Attempt a simple connection/roundtrip to the database.
    Returns a structured dict with status and minimal diagnostics.
    """
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1")).scalar()
            ok = (result == 1)
            return {
                "status": "ok" if ok else "degraded",
                "dialect": engine.url.get_backend_name(),
                "driver": engine.url.drivername,
                "result": int(result) if result is not None else None,
            }
    except Exception as exc:
        return {
            "status": "error",
            "dialect": engine.url.get_backend_name(),
            "driver": engine.url.drivername,
            "error": str(exc),
        }