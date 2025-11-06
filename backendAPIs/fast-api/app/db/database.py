"""Database connection and session management.

This module handles database configuration, engine creation, and session management.
It provides a Base class for SQLAlchemy models and a dependency function for FastAPI
to get database sessions.
"""
import os
from contextlib import contextmanager
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

engine_kwargs = {
    "pool_pre_ping": True,
    "pool_size": int(os.getenv("DB_POOL_SIZE", "5")),  
    "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "10")),
    "pool_timeout": int(os.getenv("DB_POOL_TIMEOUT", "30")), 
    "pool_recycle": int(os.getenv("DB_POOL_RECYCLE", "1800")), 
}

engine: Engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    """Context manager for database sessions.

    Use this for scripts, tasks, or anywhere outside the FastAPI request cycle.
    For FastAPI endpoints, use get_db dependency instead.

    Yields:
        Session: Database session

    Example:
        with get_db_session() as session:
            users = session.query(User).all()
    """
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for database sessions.

    Use this as a dependency in FastAPI path operations to get a database session.

    Yields:
        Session: Database session

    Example:
        @app.get("/users/")
        def get_users(db: Session = Depends(get_db)):
            return db.query(User).all()
    """
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
