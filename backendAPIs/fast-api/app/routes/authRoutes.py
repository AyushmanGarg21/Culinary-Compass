"""API routes for authentication operations."""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.authSchema import (
    SignUpRequest,
    SignInRequest,
    AdminSignInRequest,
    RefreshTokenRequest,
    AuthResponse,
    RefreshTokenResponse,
    LogoutResponse,
    CurrentUserResponse
)
from app.services.authService import AuthService
from app.config.response_helper import ResponseHelper


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def sign_up(
    signup_data: SignUpRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Register a new user.
    
    Creates a new user account with email and password.
    Returns user data and authentication tokens.
    """
    try:
        result = AuthService.sign_up(
            db,
            email=signup_data.email,
            password=signup_data.password,
            name=signup_data.name,
            phone_no=signup_data.phone_no
        )
        return ResponseHelper.created_response(
            data=result,
            message="User registered successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during sign up"
        )


@router.post("/signin")
async def sign_in(
    signin_data: SignInRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Authenticate a user.
    
    Validates credentials and returns user data with authentication tokens.
    """
    try:
        result = AuthService.sign_in(
            db,
            email=signin_data.email,
            password=signin_data.password
        )
        return ResponseHelper.success_response(
            data=result,
            message="Signed in successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during sign in"
        )


@router.post("/admin/signin")
async def admin_sign_in(
    signin_data: AdminSignInRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Authenticate an admin.
    
    Validates admin credentials and returns admin data with authentication tokens.
    """
    try:
        result = AuthService.admin_sign_in(
            db,
            email=signin_data.email,
            password=signin_data.password
        )
        return ResponseHelper.success_response(
            data=result,
            message="Admin signed in successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during admin sign in"
        )


@router.post("/refresh")
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Refresh access token.
    
    Uses refresh token to generate a new access token.
    """
    try:
        result = AuthService.refresh_access_token(
            db,
            refresh_token=refresh_data.refresh_token
        )
        return ResponseHelper.success_response(
            data=result,
            message="Token refreshed successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during token refresh"
        )


@router.post("/logout")
async def logout(
    request: Request,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Logout user.
    
    Invalidates user's tokens.
    User ID and provider ID are extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        provider_id = request.state.provider_id
        result = AuthService.logout(db, user_id, provider_id)
        return ResponseHelper.success_response(
            data=result,
            message="Logged out successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during logout"
        )


@router.get("/me")
async def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get current user information.
    
    Returns detailed information about the authenticated user.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        user_data = AuthService.get_current_user(db, user_id)
        return ResponseHelper.success_response(
            data=user_data,
            message="User data fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while fetching user data"
        )