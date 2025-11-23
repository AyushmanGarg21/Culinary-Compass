"""API routes for admin post request operations."""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.adminSchema import (
    ApproveRejectRequest,
    PostRequestsListResponse,
    ActionResponse
)
from app.services.admin.adminPostRequestService import AdminPostRequestService
from app.config.response_helper import ResponseHelper


router = APIRouter(prefix="/post-requests")


@router.get("")
async def get_post_requests(
    request: Request,
    status_filter: Optional[str] = Query(None, description="Filter by status (PENDING, APPROVED, REJECTED)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=200, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get list of creator post requests.
    
    Returns paginated list of post requests with optional status filter.
    Defaults to PENDING posts if no filter is provided.
    Admin ID is extracted from JWT token in request state.
    """
    try:
        posts_data = AdminPostRequestService.get_post_requests(
            db, status_filter, skip, limit
        )
        return ResponseHelper.success_response(
            data=posts_data,
            message="Post requests fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/{post_id}/approve")
async def approve_post_request(
    request: Request,
    post_id: int,
    approve_data: ApproveRejectRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Approve a creator post request.
    
    Approves the post and makes it visible to users.
    Admin ID is extracted from JWT token in request state.
    """
    try:
        admin_id = request.state.user_id
        result = AdminPostRequestService.approve_post_request(
            db, admin_id, post_id, approve_data.comments
        )
        return ResponseHelper.success_response(
            data=result,
            message="Post request approved successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/{post_id}/reject")
async def reject_post_request(
    request: Request,
    post_id: int,
    reject_data: ApproveRejectRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Reject a creator post request.
    
    Rejects the post with optional comments.
    Admin ID is extracted from JWT token in request state.
    """
    try:
        admin_id = request.state.user_id
        result = AdminPostRequestService.reject_post_request(
            db, admin_id, post_id, reject_data.comments
        )
        return ResponseHelper.success_response(
            data=result,
            message="Post request rejected successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
