"""JWT token utilities for authentication.

This module provides functions for creating and managing JWT tokens
for user authentication and authorization.
"""
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.user_auth_identity import UserAuthIdentity


def create_access_token(
    user_id: str,
    email: str,
    provider_id: int,
    is_admin: bool = False,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create a JWT access token.
    
    Args:
        user_id: User's unique identifier
        email: User's email address
        role: User's role (Admin, Creator, User)
        expires_delta: Token expiration time delta
        
    Returns:
        Encoded JWT token string
    """
    secret_key = os.getenv("SECRET_KEY")
    if not secret_key:
        raise ValueError("SECRET_KEY environment variable is not set")
    
    if expires_delta is None:
        expires_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
        expires_delta = timedelta(minutes=expires_minutes)
    
    expire = datetime.now(timezone.utc) + expires_delta
    
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "is_admin": is_admin,
        "provider_id": provider_id,
        "type": "access"
    }
    
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token


def create_refresh_token(
    user_id: str,
    email: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create a JWT refresh token.
    
    Args:
        user_id: User's unique identifier
        email: User's email address
        expires_delta: Token expiration time delta
        
    Returns:
        Encoded JWT refresh token string
    """
    secret_key = os.getenv("SECRET_KEY")
    if not secret_key:
        raise ValueError("SECRET_KEY environment variable is not set")
    
    if expires_delta is None:
        expires_days = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
        expires_delta = timedelta(days=expires_days)
    
    expire = datetime.now(timezone.utc) + expires_delta
    
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh"
    }
    
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token


def decode_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload or None if invalid
    """
    secret_key = os.getenv("SECRET_KEY")
    if not secret_key:
        raise ValueError("SECRET_KEY environment variable is not set")
    
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def update_user_tokens(
    db: Session,
    user_id: str,
    provider_id: int,
    access_token: str,
    refresh_token: str,
    access_token_expires: datetime
) -> bool:
    """Update user's tokens in the database.
    
    Args:
        db: Database session
        user_id: User's unique identifier
        provider_id: Authentication provider ID
        access_token: New access token
        refresh_token: New refresh token
        access_token_expires: Access token expiration datetime
        
    Returns:
        True if successful, False otherwise
    """
    try:
        auth_identity = (
            db.query(UserAuthIdentity)
            .filter(
                UserAuthIdentity.user_id == user_id,
                UserAuthIdentity.provider_id == provider_id
            )
            .first()
        )
        
        if not auth_identity:
            return False
        
        auth_identity.access_token = access_token
        auth_identity.refresh_token = refresh_token
        auth_identity.token_expires_at = access_token_expires
        
        db.commit()
        return True
    except Exception:
        db.rollback()
        return False

