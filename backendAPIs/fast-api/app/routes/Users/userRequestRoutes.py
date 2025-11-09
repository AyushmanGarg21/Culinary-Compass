"""API routes for user requests (creator request and creator post)."""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.userRequestSchema import (
    CreateCreatorRequest,
    CreatorRequestResponse,
    CreateCreatorPost,
    CreatorPostResponse
)
from app.services.users.userRequestService import (
    CreatorRequestService,
    CreatorPostService
)
from app.config.response_helper import ResponseHelper
from app.config.role_dependencies import RoleAccess


router = APIRouter(prefix="/requests")


# Creator Request Routes
@router.post("/creator-request")
async def create_creator_request(
    request: Request,
    request_data: CreateCreatorRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Create a new creator request.
    
    User can request to become a creator by providing information about themselves.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        creator_request = CreatorRequestService.create_creator_request(
            db, user_id, request_data
        )
        return ResponseHelper.created_response(
            data=CreatorRequestResponse.model_validate(creator_request).model_dump(),
            message="Creator request submitted successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/creator-post", dependencies=[Depends(RoleAccess.creator_access)])
async def create_creator_post(
    request: Request,
    post_data: CreateCreatorPost,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Create a new creator post (recipe).
    
    Only creators can create posts. Post will be in PENDING status until approved by admin.
    User ID is extracted from JWT token in request state.
    Requires creator role.
    """
    try:
        user_id = request.state.user_id
        creator_post = CreatorPostService.create_creator_post(db, user_id, post_data)
        return ResponseHelper.created_response(
            data=CreatorPostResponse.model_validate(creator_post).model_dump(),
            message="Creator post created successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
