"""Alembic environment configuration.

This module sets up the Alembic environment for database migrations, including:
- Database connection configuration
- Model metadata import
- Migration context setup
- Online and offline migration support
"""
import os
from logging.config import fileConfig

from alembic import context
from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool

# Ensure the project root (fast-api) is on sys.path so `app` imports work
import sys
from pathlib import Path

_this_file = Path(__file__).resolve()
# parents: [migrations, db, app, fast-api, ...]
try:
    project_root = _this_file.parents[3]
except IndexError:
    project_root = _this_file.parent

if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

# Import your models so Alembic can autodiscover them
from app.models import Base

# Load environment variables
load_dotenv()

# this is the Alembic Config object
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Add your model's MetaData object here for 'autogenerate' support
target_metadata = Base.metadata

# Database URL from environment
database_url = os.getenv("DATABASE_URL")
if not database_url:
    raise ValueError("DATABASE_URL environment variable is not set")


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL and not an Engine,
    though an Engine is acceptable here as well.
    """
    context.configure(
        url=database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        # Add any custom configs here
        compare_type=True,  # Compare column types
        compare_server_default=True,  # Compare default values
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine and associate a
    connection with the context.
    """
    configuration = config.get_section(config.config_ini_section)
    if not configuration:
        configuration = {}
    configuration["sqlalchemy.url"] = database_url

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,  # Don't use a connection pool for migrations
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            # Add any custom configs here
            compare_type=True,  # Compare column types
            compare_server_default=True,  # Compare default values
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()