import enum

from sqlalchemy import Column, Integer, String, Enum, CHAR

from .base import Base


class IngredientType(enum.Enum):
    Vegetables = "Vegetables"
    Protein = "Protein"
    Dairy = "Dairy"
    Grains = "Grains"


class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(Enum(IngredientType), nullable=False, index=True)
    name = Column(String(200), nullable=False, index=True)
    emoji = Column(CHAR(4), nullable=True)

    def __repr__(self) -> str: 
        return f"<Ingredient(id={self.id!r}, name={self.name!r})>"
