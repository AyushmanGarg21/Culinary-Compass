"""Authentication middleware for JWT token validation.

This middleware validates JWT tokens, extracts user information, and attaches
it to the request state for use in route handlers and dependencies.
"""
import os
from datetime import datetime, timezone
from typing import Optional

import jwt
from fastapi import Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.config.logging_config import log_error, log_warning
from app.db.database import SessionLocal
from app.models.user import User
from app.models.admin import Admin
from app.models.user_auth_identity import UserAuthIdentity
from app.models.auth_provider import AuthProvider


class AuthMiddleware:
    """Middleware for JWT token authentication and validation."""

    def __init__(self, app):
        self.app = app
        self.secret_key = os.getenv("SECRET_KEY")
        if not self.secret_key:
            raise ValueError("SECRET_KEY environment variable is not set")
        
        self.public_routes = {
            "/health",
            "/docs",
            "/redoc",
            "/openapi.json",
            "/auth"
        }

    async def __call__(self, request: Request, call_next):
        """Process the request and validate authentication."""
        
        if self._is_public_route(request.url.path):
            return await call_next(request)

        token = self._extract_token(request)
        
        if not token:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Missing authentication token"},
                headers={"WWW-Authenticate": "Bearer"},
            )

        auth_data = await self._validate_token(token)
        
        if not auth_data:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid or expired token"},
                headers={"WWW-Authenticate": "Bearer"},
            )

        request.state.user_id = auth_data.get("user_id")
        request.state.email = auth_data.get("email")
        request.state.phone_no = auth_data.get("phone_no")
        request.state.name = auth_data.get("name")
        request.state.provider_id = auth_data.get("provider_id")
        request.state.is_active = auth_data.get("is_active", True)
        request.state.is_admin = auth_data.get("is_admin", False)
        request.state.is_creator = auth_data.get("is_creator", False)

        
        response = await call_next(request)
        return response

    def _is_public_route(self, path: str) -> bool:
        """Check if the route is public and doesn't require authentication."""
        # Exact match
        if path in self.public_routes:
            return True
        
        # Prefix match for public route patterns
        for public_route in self.public_routes:
            if path.startswith(public_route):
                return True
        
        return False

    def _extract_token(self, request: Request) -> Optional[str]:
        """Extract JWT token from Authorization header."""
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            return None
        
        #format: "Bearer <token>"
        parts = auth_header.split()
        
        if len(parts) != 2 or parts[0].lower() != "bearer":
            log_warning(f"Invalid Authorization header format: {auth_header}")
            return None
        
        return parts[1]

    async def _validate_token(self, token: str) -> Optional[dict]:
        """Validate JWT token and return decoded payload with user information."""
        db: Session = SessionLocal()
        
        try:
            # Decode JWT token
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=["HS256"]
            )
            
            user_id = payload.get("sub")
            email = payload.get("email")
            exp = payload.get("exp")
            provider_id = payload.get("provider_id")
            is_admin = payload.get("is_admin", False)
            
            if not user_id or not email:
                log_warning("Token missing required claims (sub or email)")
                return None
            
            if exp:
                exp_datetime = datetime.fromtimestamp(exp, tz=timezone.utc)
                if datetime.now(timezone.utc) > exp_datetime:
                    log_warning(f"Token expired for user {user_id}")
                    return None
            
            if is_admin:
                user = db.query(Admin).filter(Admin.id == user_id).first()
            else:
                user = db.query(User).filter(User.id == user_id).first()
            
            if not user:
                log_warning(f"User not found for user_id: {user_id}")
                return None
            
            if not user.is_active:
                log_warning(f"Inactive user attempted access: {user_id}")
                return None
            
            auth_identity = (
                db.query(UserAuthIdentity)
                .filter(
                    UserAuthIdentity.user_id == user_id,
                    UserAuthIdentity.provider_id == provider_id
                )
                .first()
            )
            
            if not auth_identity:
                log_warning(f"Auth identity not found for user: {user_id}")
                return None
            
            if auth_identity.token_expires_at:
                if datetime.now(timezone.utc) > auth_identity.token_expires_at:
                    log_warning(f"Database token expired for user: {user_id}")
                    return None
            
            # Return validated auth data
            return {
                "user_id": user.id,
                "email": user.email,
                "is_active": user.is_active,
                "is_creator": getattr(user, "is_creator", False),
                "is_admin": is_admin,
                "name": getattr(user, "name", None),
                "phone_no": getattr(user, "phone_no", None),
            }
            
        except jwt.ExpiredSignatureError:
            log_warning("Token has expired")
            return None
        except jwt.InvalidTokenError as e:
            log_error(f"Invalid token: {str(e)}")
            return None
        except Exception as e:
            log_error(f"Error validating token: {str(e)}", exc_info=True)
            return None
        finally:
            db.close()
