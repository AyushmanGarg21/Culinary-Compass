"""API routes for user profile operations."""
from fastapi import APIRouter, Depends, HTTPException, status, Request, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.userProfileSchema import (
    UserProfileResponse,
    UpdateUserProfileRequest,
    UpdatePasswordRequest
)
from app.services.users.userProfileService import UserProfileService
from app.config.response_helper import ResponseHelper


router = APIRouter(prefix="/profile")


@router.get("")
async def get_user_profile(
    request: Request,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get user profile.
    
    Returns authenticated user's profile with essential details only.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        user = UserProfileService.get_user_by_id(db, user_id)
        return ResponseHelper.ok_response(
            data=UserProfileResponse.model_validate(user).model_dump(),
            message="User profile retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.put("")
async def update_user_profile(
    request: Request,
    update_data: UpdateUserProfileRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Update user profile details.
    
    Allows updating profile information like name, phone, location, physical stats, etc.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        user = UserProfileService.update_user_profile(db, user_id, update_data)
        return ResponseHelper.ok_response(
            data=UserProfileResponse.model_validate(user).model_dump(),
            message="User profile updated successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.put("/password")
async def update_user_password(
    request: Request,
    password_data: UpdatePasswordRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Update user password.
    
    Requires old password for verification before updating to new password.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        result = UserProfileService.update_password(db, user_id, password_data)
        return ResponseHelper.ok_response(
            data=None,
            message=result["message"]
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/picture")
async def upload_profile_picture(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """Upload profile picture. Stores as base64 in the profile_pic field."""
    try:
        import base64
        user_id = request.state.user_id
        content = await file.read()
        if len(content) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Max 5MB.")
        mime = file.content_type or "image/jpeg"
        b64 = base64.b64encode(content).decode("utf-8")
        data_url = f"data:{mime};base64,{b64}"
        user = UserProfileService.update_user_profile(
            db, user_id, type('obj', (object,), {'profile_pic': data_url, '__dict__': {'profile_pic': data_url}})()
        )
        return ResponseHelper.ok_response(
            message="Profile picture updated successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to upload profile picture")
