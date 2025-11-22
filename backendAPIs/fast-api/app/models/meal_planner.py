from uuid import uuid4
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from .base import Base


class MealPlanner(Base):
    __tablename__ = "meal_planner"

    id = Column(Integer, primary_key=True, autoincrement=True)
    week_id = Column(String(64), nullable=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    meal_type = Column(String(100), nullable=False)
    is_marked_done = Column(Boolean, default=False)
    is_custom_meal = Column(Boolean, default=False)
    meal_id = Column(Integer, ForeignKey("meals.id", ondelete="SET NULL"), nullable=True)
    custom_meal_name = Column(String(255), nullable=True)
    custom_calories = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", back_populates="meal_plans")
    meal = relationship("Meal")

    def __repr__(self) -> str:  
        return f"<MealPlanner(id={self.id!r}, user_id={self.user_id!r}, date={self.date!r})>"
