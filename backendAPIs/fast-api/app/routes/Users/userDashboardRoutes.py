"""API routes for user dashboard operations."""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.userDashboardSchema import (
    DateRequest,
    MarkMealsDoneRequest,
    TodaysMealsResponse,
    CaloriesIntakeResponse,
    MarkMealsDoneResponse,
    LatestPostResponse
)
from app.services.users.userDashboardService import UserDashboardService
from app.config.response_helper import ResponseHelper


router = APIRouter(prefix="/dashboard")


@router.post("/meals")
async def get_todays_meals(
    request: Request,
    date_request: DateRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Fetch meals for a specific date.
    
    Returns meals with either custom meal info or meal table info (not both).
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        meals_data = UserDashboardService.get_todays_meals(
            db, user_id, date_request.date
        )
        return ResponseHelper.success_response(
            data=meals_data,
            message="Meals fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/calories-intake")
async def get_calories_intake(
    request: Request,
    date_request: DateRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Calculate total calories intake for a specific date.
    
    Only counts meals marked as done. Returns total calories and user's target calories.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        calories_data = UserDashboardService.get_calories_intake(
            db, user_id, date_request.date
        )
        return ResponseHelper.success_response(
            data=calories_data,
            message="Calories intake calculated successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/mark-meals-done")
async def mark_meals_done(
    request: Request,
    mark_request: MarkMealsDoneRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Mark multiple meals as done.
    
    Accepts a list of meal planner IDs and marks them as done.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        result = UserDashboardService.mark_meals_done(
            db, user_id, mark_request.meal_ids
        )
        return ResponseHelper.success_response(
            data=result,
            message="Meals marked as done successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/latest-post")
async def get_latest_followed_user_post(
    request: Request,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get the latest approved post from users that the current user follows.
    
    Returns the most recent approved creator post from followed users.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        post_data = UserDashboardService.get_latest_followed_user_post(db, user_id)
        
        if not post_data:
            return ResponseHelper.success_response(
                data=None,
                message="No posts found from followed users"
            )
        
        return ResponseHelper.success_response(
            data=post_data,
            message="Latest post fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )