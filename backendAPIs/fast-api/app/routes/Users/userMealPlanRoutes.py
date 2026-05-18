"""API routes for user meal plan operations."""
from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.users.userMealPlanService import UserMealPlanService
from app.config.response_helper import ResponseHelper


router = APIRouter(prefix="/meal-plan")


# ─── Schemas ──────────────────────────────────────────────────────────────────

class MealPlanEntry(BaseModel):
    date: str                        # ISO date string e.g. "2025-05-12"
    meal_type: str                   # camelCase key e.g. "breakfast", "highTea"
    meal_id: Optional[int] = None    # None → custom meal or clear slot
    meal_name: Optional[str] = None  # required when meal_id is None
    calories: Optional[int] = None   # required when meal_id is None


class SaveWeekPlanRequest(BaseModel):
    week_id: str                     # e.g. "2025-W20"
    entries: List[MealPlanEntry]


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get("")
async def get_week_plan(
    request: Request,
    week_start: str = Query(..., description="ISO date of the Monday that starts the week, e.g. 2025-05-12"),
    db: Session = Depends(get_db),
) -> JSONResponse:
    """
    Fetch the saved meal plan for a 7-day window.

    Returns a nested dict: { date: { meal_type: meal_info } }
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        week_start_date = date.fromisoformat(week_start)
        data = UserMealPlanService.get_week_plan(db, user_id, week_start_date)
        return ResponseHelper.success_response(
            data=data,
            message="Meal plan fetched successfully",
        )
    except HTTPException:
        raise
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid week_start date format. Use YYYY-MM-DD.",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred",
        )


@router.post("/save")
async def save_week_plan(
    request: Request,
    body: SaveWeekPlanRequest,
    db: Session = Depends(get_db),
) -> JSONResponse:
    """
    Save (upsert) the weekly meal plan.

    Accepts a list of entries. Each entry identifies a (date, meal_type) slot
    and the meal to place there. Passing meal_id=null and meal_name=null clears
    the slot.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        result = UserMealPlanService.save_week_plan(
            db,
            user_id=user_id,
            week_id=body.week_id,
            entries=[e.model_dump() for e in body.entries],
        )
        return ResponseHelper.success_response(
            data=result,
            message=result["message"],
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred",
        )
