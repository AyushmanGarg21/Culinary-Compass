"""Service layer for master data GET operations."""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, OperationalError, DatabaseError
from fastapi import HTTPException, status

from app.models.country import Country
from app.models.city import City
from app.models.meal import Meal
from app.models.ingredient import Ingredient


# Country Services
class CountryService:
    @staticmethod
    def get_country(db: Session, country_id: int) -> Optional[Country]:
        """Get a single country by ID with error handling."""
        try:
            country = db.query(Country).filter(Country.id == country_id).first()
            if not country:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Country with id {country_id} not found"
                )
            return country
        except HTTPException:
            raise
        except OperationalError as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection error. Please try again later."
            )
        except DatabaseError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while fetching country"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching country"
            )

    @staticmethod
    def get_all_countries(db: Session, skip: int = 0, limit: int = 100) -> List[Country]:
        """Get all countries with pagination and error handling."""
        try:
            if skip < 0 or limit <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid pagination parameters"
                )
            if limit > 1000:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Limit cannot exceed 1000"
                )
            return db.query(Country).offset(skip).limit(limit).all()
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
                detail="Database error occurred while fetching countries"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching countries"
            )


# City Services
class CityService:
    @staticmethod
    def get_city(db: Session, city_id: int) -> Optional[City]:
        """Get a single city by ID with error handling."""
        try:
            city = db.query(City).filter(City.id == city_id).first()
            if not city:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"City with id {city_id} not found"
                )
            return city
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
                detail="Database error occurred while fetching city"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching city"
            )

    @staticmethod
    def get_all_cities(db: Session, skip: int = 0, limit: int = 100) -> List[City]:
        """Get all cities with pagination and error handling."""
        try:
            if skip < 0 or limit <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid pagination parameters"
                )
            if limit > 1000:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Limit cannot exceed 1000"
                )
            return db.query(City).offset(skip).limit(limit).all()
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
                detail="Database error occurred while fetching cities"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching cities"
            )

    @staticmethod
    def get_cities_by_country(db: Session, country_id: int) -> List[City]:
        """Get all cities for a specific country with error handling."""
        try:
            # Verify country exists
            country = db.query(Country).filter(Country.id == country_id).first()
            if not country:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Country with id {country_id} not found"
                )
            return db.query(City).filter(City.country_id == country_id).all()
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
                detail="Database error occurred while fetching cities by country"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching cities by country"
            )


# Meal Services
class MealService:
    @staticmethod
    def get_meal(db: Session, meal_id: int) -> Optional[Meal]:
        """Get a single meal by ID with error handling."""
        try:
            meal = db.query(Meal).filter(Meal.id == meal_id).first()
            if not meal:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Meal with id {meal_id} not found"
                )
            return meal
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
                detail="Database error occurred while fetching meal"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching meal"
            )

    @staticmethod
    def get_all_meals(db: Session, skip: int = 0, limit: int = 100) -> List[Meal]:
        """Get all meals with pagination and error handling."""
        try:
            if skip < 0 or limit <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid pagination parameters"
                )
            if limit > 1000:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Limit cannot exceed 1000"
                )
            return db.query(Meal).offset(skip).limit(limit).all()
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
                detail="Database error occurred while fetching meals"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching meals"
            )


# Ingredient Services
class IngredientService:
    @staticmethod
    def get_ingredient(db: Session, ingredient_id: int) -> Optional[Ingredient]:
        """Get a single ingredient by ID with error handling."""
        try:
            ingredient = db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()
            if not ingredient:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Ingredient with id {ingredient_id} not found"
                )
            return ingredient
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
                detail="Database error occurred while fetching ingredient"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching ingredient"
            )

    @staticmethod
    def get_all_ingredients(db: Session, skip: int = 0, limit: int = 100) -> List[Ingredient]:
        """Get all ingredients with pagination and error handling."""
        try:
            if skip < 0 or limit <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid pagination parameters"
                )
            if limit > 1000:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Limit cannot exceed 1000"
                )
            return db.query(Ingredient).offset(skip).limit(limit).all()
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
                detail="Database error occurred while fetching ingredients"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching ingredients"
            )

    @staticmethod
    def get_ingredients_by_type(db: Session, ingredient_type: str) -> List[Ingredient]:
        """Get all ingredients by type with error handling."""
        try:
            # Validate ingredient type
            valid_types = ["Vegetables", "Protein", "Dairy", "Grains"]
            if ingredient_type not in valid_types:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid ingredient type. Must be one of: {', '.join(valid_types)}"
                )
            return db.query(Ingredient).filter(Ingredient.type == ingredient_type).all()
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
                detail="Database error occurred while fetching ingredients by type"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching ingredients by type"
            )
