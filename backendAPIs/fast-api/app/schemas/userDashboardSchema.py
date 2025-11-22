"""Schemas for user dashboard operations."""
from datetime import date as date_type
from typing import List, Optional
from pydantic import BaseModel, Field


class DateRequest(BaseModel):
    """Schema for date request."""
    date: date_type = Field(..., description="Target date for the query")


class MarkMealsDoneRequest(BaseModel):
    """Schema for marking meals as done."""
    meal_ids: List[int] = Field(..., description="List of meal planner IDs to mark as done", min_length=1)


class MealInfo(BaseModel):
    """Schema for meal information."""
    id: int
    meal_type: str
    is_marked_done: bool
    is_custom_meal: bool
    meal_name: Optional[str] = None
    calories: Optional[int | str] = None


class TodaysMealsResponse(BaseModel):
    """Schema for today's meals response."""
    date: str
    meals: List[MealInfo]


class CaloriesIntakeResponse(BaseModel):
    """Schema for calories intake response."""
    date: str
    total_calories: int
    target_calories: int


class MarkMealsDoneResponse(BaseModel):
    """Schema for mark meals done response."""
    message: str
    updated_count: int


class LatestPostResponse(BaseModel):
    """Schema for latest post response."""
    id: int
    user_id: str
    title: str
    overview: str
    cooking_time: int
    cuisine_type: str
    servings: int
    image: Optional[str] = None
    ingredients: List
    instructions: Optional[str] = None
    created_at: Optional[str] = None
