"""Service layer for user dashboard operations."""
from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError, DatabaseError
from sqlalchemy import and_, func
from fastapi import HTTPException, status

from app.models.meal_planner import MealPlanner
from app.models.meal import Meal
from app.models.user import User
from app.models.creator_post import CreatorPost, CreatorPostStatus
from app.models.follow import Follow


class UserDashboardService:
    """Service class for user dashboard operations."""

    @staticmethod
    def get_todays_meals(db: Session, user_id: str, target_date: date) -> dict:
        """
        Fetch meals for a specific date.
        
        Args:
            db: Database session
            user_id: User ID from request state
            target_date: Date to fetch meals for
            
        Returns:
            Dictionary with date and list of meals
        """
        try:
            meal_plans = db.query(MealPlanner).filter(
                and_(
                    MealPlanner.user_id == user_id,
                    MealPlanner.date == target_date
                )
            ).all()

            meals_data = []
            for plan in meal_plans:
                meal_info = {
                    "id": plan.id,
                    "meal_type": plan.meal_type,
                    "is_marked_done": plan.is_marked_done,
                    "is_custom_meal": plan.is_custom_meal
                }

                if plan.is_custom_meal:
                    meal_info["meal_name"] = plan.custom_meal_name
                    meal_info["calories"] = plan.custom_calories
                else:
                    if plan.meal:
                        meal_info["meal_name"] = plan.meal.meal_name
                        meal_info["calories"] = plan.meal.calories

                meals_data.append(meal_info)

            return {
                "date": target_date.isoformat(),
                "meals": meals_data
            }

        except OperationalError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection error. Please try again later."
            )
        except DatabaseError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while fetching meals"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching meals"
            )

    @staticmethod
    def get_calories_intake(db: Session, user_id: str, target_date: date) -> dict:
        """
        Calculate total calories intake for a specific date.
        
        Args:
            db: Database session
            user_id: User ID from request state
            target_date: Date to calculate calories for
            
        Returns:
            Dictionary with total calories, target calories, and date
        """
        try:
            # Get user's target calories
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            # Get all marked done meals for the date
            meal_plans = db.query(MealPlanner).filter(
                and_(
                    MealPlanner.user_id == user_id,
                    MealPlanner.date == target_date,
                    MealPlanner.is_marked_done == True
                )
            ).all()

            total_calories = 0
            for plan in meal_plans:
                if plan.is_custom_meal:
                    # Handle custom calories (stored as string)
                    if plan.custom_calories:
                        try:
                            total_calories += int(plan.custom_calories)
                        except ValueError:
                            pass  # Skip if calories can't be converted
                else:
                    # Get calories from meal table
                    if plan.meal and plan.meal.calories:
                        total_calories += plan.meal.calories

            return {
                "date": target_date.isoformat(),
                "total_calories": total_calories,
                "target_calories": user.calories_target or 0
            }

        except HTTPException:
            raise
        except OperationalError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection error. Please try again later."
            )
        except DatabaseError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while calculating calories"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while calculating calories"
            )

    @staticmethod
    def mark_meals_done(db: Session, user_id: str, meal_ids: List[int]) -> dict:
        """
        Mark multiple meals as done.
        
        Args:
            db: Database session
            user_id: User ID from request state
            meal_ids: List of meal planner IDs to mark as done
            
        Returns:
            Dictionary with success message and updated count
        """
        try:
            # Update meals that belong to the user
            updated_count = db.query(MealPlanner).filter(
                and_(
                    MealPlanner.id.in_(meal_ids),
                    MealPlanner.user_id == user_id
                )
            ).update(
                {"is_marked_done": True},
                synchronize_session=False
            )

            db.commit()

            return {
                "message": "Meals marked as done successfully",
                "updated_count": updated_count
            }

        except OperationalError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection error. Please try again later."
            )
        except DatabaseError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while updating meals"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while updating meals"
            )

    @staticmethod
    def get_latest_followed_user_post(db: Session, user_id: str) -> Optional[dict]:
        """
        Get the latest approved post from users that the current user follows.
        
        Args:
            db: Database session
            user_id: User ID from request state
            
        Returns:
            Dictionary with latest post details or None
        """
        try:
            # Get the latest approved post from followed users
            latest_post = db.query(CreatorPost).join(
                Follow,
                CreatorPost.user_id == Follow.followed_user_id
            ).filter(
                and_(
                    Follow.following_user_id == user_id,
                    CreatorPost.status == CreatorPostStatus.APPROVED
                )
            ).order_by(CreatorPost.created_at.desc()).first()

            if not latest_post:
                return None

            return {
                "id": latest_post.id,
                "user_id": latest_post.user_id,
                "title": latest_post.title,
                "overview": latest_post.overview,
                "cooking_time": latest_post.cooking_time,
                "cuisine_type": latest_post.cuisine_type,
                "servings": latest_post.servings,
                "image": latest_post.image,
                "ingredients": latest_post.ingredients,
                "instructions": latest_post.instructions,
                "created_at": latest_post.created_at.isoformat() if latest_post.created_at else None
            }

        except OperationalError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection error. Please try again later."
            )
        except DatabaseError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while fetching post"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching post"
            )
