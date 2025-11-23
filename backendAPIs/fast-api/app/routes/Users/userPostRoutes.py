"""API routes for user post and social operations."""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.userPostSchema import (
    FollowRequest,
    UserFeedResponse,
    FollowingListResponse,
    CreatorSearchResponse,
    CreatorDetailsResponse,
    FollowResponse
)
from app.services.users.userPostService import UserPostService
from app.config.response_helper import ResponseHelper


router = APIRouter(prefix="/posts")


@router.get("/feed")
async def get_user_feed(
    request: Request,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get feed of approved posts from followed users.
    
    Returns paginated list of posts from users that the current user follows.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        feed_data = UserPostService.get_user_feed(db, user_id, skip, limit)
        return ResponseHelper.success_response(
            data=feed_data,
            message="Feed fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/following")
async def get_following_list(
    request: Request,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get list of users that the current user is following.
    
    Returns paginated list of followed users with their basic information.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        following_data = UserPostService.get_following_list(db, user_id, skip, limit)
        return ResponseHelper.success_response(
            data=following_data,
            message="Following list fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/follow")
async def follow_user(
    request: Request,
    follow_request: FollowRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Follow a user.
    
    Creates a follow relationship between current user and target user.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        result = UserPostService.follow_user(db, user_id, follow_request.target_user_id)
        return ResponseHelper.success_response(
            data=result,
            message="User followed successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/unfollow")
async def unfollow_user(
    request: Request,
    unfollow_request: FollowRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Unfollow a user.
    
    Removes the follow relationship between current user and target user.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        result = UserPostService.unfollow_user(db, user_id, unfollow_request.target_user_id)
        return ResponseHelper.success_response(
            data=result,
            message="User unfollowed successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/creators/search")
async def search_creators(
    search: Optional[str] = Query(None, description="Search term for creator name"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Search for creators by name.
    
    Returns paginated list of creators matching the search query.
    If no search term is provided, returns all creators.
    """
    try:
        creators_data = UserPostService.search_creators(db, search, skip, limit)
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


@router.get("/creators/{creator_id}")
async def get_creator_details(
    creator_id: str,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get detailed information about a creator.
    
    Returns creator profile with name, about, location, gender, language,
    follower count, and post count.
    Example: Maria Lopez, Loves painting and hiking in the mountains,
    Mexico City, Mexico, Female, Spanish
    """
    try:
        creator_data = UserPostService.get_creator_details(db, creator_id)
        return ResponseHelper.success_response(
            data=creator_data,
            message="Creator details fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
