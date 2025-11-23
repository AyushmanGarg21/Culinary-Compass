"""API routes for admin creator request operations."""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.adminSchema import (
    ApproveRejectRequest,
    CreatorRequestsListResponse,
    ActionResponse
)
from app.services.admin.adminCreatorRequestService import AdminCreatorRequestService
from app.config.response_helper import ResponseHelper


router = APIRouter(prefix="/creator-requests")


@router.get("")
async def get_creator_requests(
    request: Request,
    status_filter: Optional[str] = Query(None, description="Filter by status (PENDING, APPROVED, REJECTED)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=200, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get list of creator requests.
    
    Returns paginated list of creator requests with optional status filter.
    Defaults to PENDING requests if no filter is provided.
    Admin ID is extracted from JWT token in request state.
    """
    try:
        requests_data = AdminCreatorRequestService.get_creator_requests(
            db, status_filter, skip, limit
        )
        return ResponseHelper.success_response(
            data=requests_data,
            message="Creator requests fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/{request_id}/approve")
async def approve_creator_request(
    request: Request,
    request_id: int,
    approve_data: ApproveRejectRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Approve a creator request.
    
    Approves the creator request and grants creator status to the user.
    Admin ID is extracted from JWT token in request state.
    """
    try:
        admin_id = request.state.user_id
        result = AdminCreatorRequestService.approve_creator_request(
            db, admin_id, request_id, approve_data.comments
        )
        return ResponseHelper.success_response(
            data=result,
            message="Creator request approved successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/{request_id}/reject")
async def reject_creator_request(
    request: Request,
    request_id: int,
    reject_data: ApproveRejectRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Reject a creator request.
    
    Rejects the creator request with optional comments.
    Admin ID is extracted from JWT token in request state.
    """
    try:
        admin_id = request.state.user_id
        result = AdminCreatorRequestService.reject_creator_request(
            db, admin_id, request_id, reject_data.comments
        )
        return ResponseHelper.success_response(
            data=result,
            message="Creator request rejected successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
