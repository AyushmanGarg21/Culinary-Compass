from sqlalchemy import Column, Integer, String, CHAR

from .base import Base


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, autoincrement=True)
    meal_type = Column(String(50), nullable=True, index=True)
    icon = Column(CHAR(4), nullable=True)
    meal_name = Column(String(200), nullable=False, index=True)
    calories = Column(Integer, nullable=True)

    def __repr__(self) -> str:  
        return f"<Meal(id={self.id!r}, meal_name={self.meal_name!r})>"
