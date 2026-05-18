"""Service layer for meal planner operations."""
from datetime import date, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError, DatabaseError
from sqlalchemy import and_
from fastapi import HTTPException, status

from app.models.meal_planner import MealPlanner
from app.models.meal import Meal


class UserMealPlanService:
    """Service class for saving and fetching the weekly meal plan."""

    @staticmethod
    def get_week_plan(db: Session, user_id: str, week_start: date) -> dict:
        """
        Fetch the saved meal plan for a 7-day window starting from week_start.

        Returns a dict keyed by ISO date string, each value being a dict of
        meal_type → { id, meal_id, meal_name, calories, is_custom, is_marked_done }
        """
        try:
            week_end = week_start + timedelta(days=6)

            plans = db.query(MealPlanner).filter(
                and_(
                    MealPlanner.user_id == user_id,
                    MealPlanner.date >= week_start,
                    MealPlanner.date <= week_end,
                )
            ).all()

            # Build a nested dict: { "2025-05-12": { "breakfast": {...}, ... } }
            week_plan: dict = {}
            for plan in plans:
                date_key = plan.date.isoformat()
                if date_key not in week_plan:
                    week_plan[date_key] = {}

                meal_info = {
                    "id": plan.id,
                    "meal_type": plan.meal_type,
                    "is_marked_done": plan.is_marked_done,
                    "is_custom_meal": plan.is_custom_meal,
                }

                if plan.is_custom_meal:
                    meal_info["meal_id"] = None
                    meal_info["meal_name"] = plan.custom_meal_name
                    meal_info["calories"] = int(plan.custom_calories) if plan.custom_calories else 0
                else:
                    meal_info["meal_id"] = plan.meal_id
                    if plan.meal:
                        meal_info["meal_name"] = plan.meal.meal_name
                        meal_info["calories"] = plan.meal.calories or 0
                    else:
                        meal_info["meal_name"] = None
                        meal_info["calories"] = 0

                # Normalize meal_type key to camelCase for frontend compatibility
                week_plan[date_key][plan.meal_type] = meal_info

            return {
                "week_start": week_start.isoformat(),
                "week_end": week_end.isoformat(),
                "plan": week_plan,
            }

        except OperationalError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection error. Please try again later.",
            )
        except DatabaseError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while fetching meal plan",
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching meal plan",
            )

    @staticmethod
    def save_week_plan(db: Session, user_id: str, week_id: str, entries: list) -> dict:
        """
        Upsert meal plan entries for a week.

        Each entry in `entries` must have:
            date        (str, ISO format)
            meal_type   (str, camelCase key matching frontend)
            meal_id     (int | None)  — None means custom meal
            meal_name   (str | None)  — required when meal_id is None
            calories    (int | None)  — required when meal_id is None

        Existing rows for the same (user_id, date, meal_type) are replaced.
        Entries with meal_id=None AND meal_name=None are treated as "clear slot"
        and any existing row is deleted.
        """
        try:
            saved = 0
            deleted = 0

            for entry in entries:
                entry_date = date.fromisoformat(entry["date"])
                meal_type = entry["meal_type"]
                meal_id = entry.get("meal_id")
                meal_name = entry.get("meal_name")
                calories = entry.get("calories")

                # Find existing row
                existing = db.query(MealPlanner).filter(
                    and_(
                        MealPlanner.user_id == user_id,
                        MealPlanner.date == entry_date,
                        MealPlanner.meal_type == meal_type,
                    )
                ).first()

                # Clear slot — delete if exists
                if meal_id is None and not meal_name:
                    if existing:
                        db.delete(existing)
                        deleted += 1
                    continue

                is_custom = meal_id is None

                if existing:
                    existing.week_id = week_id
                    existing.meal_id = meal_id
                    existing.is_custom_meal = is_custom
                    existing.custom_meal_name = meal_name if is_custom else None
                    existing.custom_calories = str(calories) if (is_custom and calories is not None) else None
                else:
                    new_plan = MealPlanner(
                        week_id=week_id,
                        user_id=user_id,
                        date=entry_date,
                        meal_type=meal_type,
                        meal_id=meal_id,
                        is_custom_meal=is_custom,
                        custom_meal_name=meal_name if is_custom else None,
                        custom_calories=str(calories) if (is_custom and calories is not None) else None,
                        is_marked_done=False,
                    )
                    db.add(new_plan)

                saved += 1

            db.commit()

            return {
                "message": "Meal plan saved successfully",
                "saved": saved,
                "deleted": deleted,
            }

        except OperationalError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection error. Please try again later.",
            )
        except DatabaseError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while saving meal plan",
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while saving meal plan",
            )
