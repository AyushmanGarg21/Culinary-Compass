"""FastAPI application entry point.

This module initializes the FastAPI application with all its routes,
middleware, exception handlers, and events.
"""
import os
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.exc import SQLAlchemyError

from app.config.logging_config import log_info, log_error, log_warning
from app.config.middleware import AuthMiddleware
from app.db.database import engine
from app.models.base import Base

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
Authenticated = Annotated[str, oauth2_scheme]

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup and shutdown events."""
    try:
        log_info("Application startup complete")
        yield
    finally:
        log_info("Application shutdown")


app = FastAPI(
    title="Foodie App Backend API",
    description="API for managing recipes, meal plans, and social interactions",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=600,
)

app.middleware("http")(AuthMiddleware(app))

# Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors in request data."""
    log_warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """Handle database errors."""
    log_error(f"Database error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": app.version}


from app.api.authRoutes import router as auth_router
from app.api.v1 import router as api_v1_router

app.include_router(auth_router)
app.include_router(api_v1_router)
