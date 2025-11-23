from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, CHAR, Enum as SQLEnum

from .base import Base


class MealType(PyEnum):
    BREAKFAST = "Breakfast"
    BRUNCH = "Brunch"
    ELEVENSES = "Elevenses"
    LUNCH = "Lunch"
    AFTERNOON_TEA = "Afternoon Tea"
    HIGH_TEA = "High Tea"
    DINNER = "Dinner"
    SUPPER = "Supper"
    MIDNIGHT_SNACK = "Midnight Snack"




class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, autoincrement=True)
    meal_type = Column(SQLEnum(MealType), nullable=False, index=True)
    icon = Column(CHAR(4), nullable=True)
    meal_name = Column(String(200), nullable=False, index=True)
    calories = Column(Integer, nullable=True)

    def __repr__(self) -> str:  
        return f"<Meal(id={self.id!r}, meal_name={self.meal_name!r})>"
