"""Schemas for master data response models."""
from typing import Optional
from pydantic import BaseModel
from enum import Enum


# Country Schema
class CountryResponse(BaseModel):
    id: int
    name: str
    code: Optional[str] = None
    phone_code: Optional[str] = None

    class Config:
        from_attributes = True


# City Schema
class CityResponse(BaseModel):
    id: int
    name: str
    country_id: int

    class Config:
        from_attributes = True


# Meal Schema
class MealResponse(BaseModel):
    id: int
    meal_name: str
    meal_type: Optional[str] = None
    icon: Optional[str] = None
    calories: Optional[int] = None

    class Config:
        from_attributes = True


# Ingredient Schema
class IngredientTypeEnum(str, Enum):
    Vegetables = "Vegetables"
    Protein = "Protein"
    Dairy = "Dairy"
    Grains = "Grains"


class IngredientResponse(BaseModel):
    id: int
    name: str
    type: IngredientTypeEnum
    emoji: Optional[str] = None

    class Config:
        from_attributes = True
