"""API routes for admin user and creator management operations."""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.adminSchema import (
    UsersListResponse,
    CreatorsListResponse,
    ActionResponse
)
from app.services.admin.adminManageService import AdminManageService
from app.config.response_helper import ResponseHelper


router = APIRouter(prefix="/manage")


@router.get("/users")
async def get_users(
    search: Optional[str] = Query(None, description="Search by name or email"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=200, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get list of users (non-creators).
    
    Returns paginated list of users with optional search filter.
    """
    try:
        users_data = AdminManageService.get_users(db, search, skip, limit)
        return ResponseHelper.success_response(
            data=users_data,
            message="Users fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/creators")
async def get_creators(
    search: Optional[str] = Query(None, description="Search by name or email"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=200, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get list of creators.
    
    Returns paginated list of creators with optional search filter.
    """
    try:
        creators_data = AdminManageService.get_creators(db, search, skip, limit)
        return ResponseHelper.success_response(
            data=creators_data,
            message="Creators fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/users/{user_id}/deactivate")
async def deactivate_user(
    user_id: str,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Deactivate a user account.
    
    Sets the user's is_active status to False.
    """
    try:
        result = AdminManageService.deactivate_user(db, user_id)
        return ResponseHelper.success_response(
            data=result,
            message="User deactivated successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/users/{user_id}/activate")
async def activate_user(
    user_id: str,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Activate a user account.
    
    Sets the user's is_active status to True.
    """
    try:
        result = AdminManageService.activate_user(db, user_id)
        return ResponseHelper.success_response(
            data=result,
            message="User activated successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/creators/{user_id}/remove-creator-status")
async def remove_creator_status(
    user_id: str,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Remove creator status from a user.
    
    Sets the user's is_creator status to False.
    """
    try:
        result = AdminManageService.remove_creator_status(db, user_id)
        return ResponseHelper.success_response(
            data=result,
            message="Creator status removed successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Delete a user account.
    
    Permanently deletes the user and all associated data.
    """
    try:
        result = AdminManageService.delete_user(db, user_id)
        return ResponseHelper.success_response(
            data=result,
            message="User deleted successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
