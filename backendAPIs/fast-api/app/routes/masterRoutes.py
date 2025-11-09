"""API routes for master data GET operations."""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.schema.masterSchema import (
    CountryResponse, CityResponse, MealResponse, IngredientResponse
)
from app.services.masterService import (
    CountryService, CityService, MealService, IngredientService
)
from app.config.response_helper import ResponseHelper


router = APIRouter(prefix="/master", tags=["Master Data"])


# Country Routes
@router.get("/countries/{country_id}")
async def get_country(
    country_id: int = Path(..., gt=0, description="The ID of the country to retrieve"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """Get a country by ID."""
    try:
        country = CountryService.get_country(db, country_id)
        return ResponseHelper.ok_response(
            data=CountryResponse.model_validate(country).model_dump(),
            message="Country retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/countries")
async def get_all_countries(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """Get all countries with pagination."""
    try:
        countries = CountryService.get_all_countries(db, skip, limit)
        return ResponseHelper.ok_response(
            data=[CountryResponse.model_validate(c).model_dump() for c in countries],
            message="Countries retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


# City Routes
@router.get("/cities/{city_id}")
async def get_city(
    city_id: int = Path(..., gt=0, description="The ID of the city to retrieve"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """Get a city by ID."""
    try:
        city = CityService.get_city(db, city_id)
        return ResponseHelper.ok_response(
            data=CityResponse.model_validate(city).model_dump(),
            message="City retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/cities")
async def get_all_cities(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """Get all cities with pagination."""
    try:
        cities = CityService.get_all_cities(db, skip, limit)
        return ResponseHelper.ok_response(
            data=[CityResponse.model_validate(c).model_dump() for c in cities],
            message="Cities retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/countries/{country_id}/cities")
async def get_cities_by_country(
    country_id: int = Path(..., gt=0, description="The ID of the country"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """Get all cities for a specific country."""
    try:
        cities = CityService.get_cities_by_country(db, country_id)
        return ResponseHelper.ok_response(
            data=[CityResponse.model_validate(c).model_dump() for c in cities],
            message="Cities retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


# Meal Routes
@router.get("/meals/{meal_id}")
async def get_meal(
    meal_id: int = Path(..., gt=0, description="The ID of the meal to retrieve"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """Get a meal by ID."""
    try:
        meal = MealService.get_meal(db, meal_id)
        return ResponseHelper.ok_response(
            data=MealResponse.model_validate(meal).model_dump(),
            message="Meal retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/meals")
async def get_all_meals(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """Get all meals with pagination."""
    try:
        meals = MealService.get_all_meals(db, skip, limit)
        return ResponseHelper.ok_response(
            data=[MealResponse.model_validate(m).model_dump() for m in meals],
            message="Meals retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


# Ingredient Routes
@router.get("/ingredients/{ingredient_id}")
async def get_ingredient(
    ingredient_id: int = Path(..., gt=0, description="The ID of the ingredient to retrieve"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """Get an ingredient by ID."""
    try:
        ingredient = IngredientService.get_ingredient(db, ingredient_id)
        return ResponseHelper.ok_response(
            data=IngredientResponse.model_validate(ingredient).model_dump(),
            message="Ingredient retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/ingredients")
async def get_all_ingredients(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """Get all ingredients with pagination."""
    try:
        ingredients = IngredientService.get_all_ingredients(db, skip, limit)
        return ResponseHelper.ok_response(
            data=[IngredientResponse.model_validate(i).model_dump() for i in ingredients],
            message="Ingredients retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/ingredients/type/{ingredient_type}")
async def get_ingredients_by_type(
    ingredient_type: str = Path(..., description="Type of ingredient (Vegetables, Protein, Dairy, Grains)"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """Get all ingredients by type."""
    try:
        ingredients = IngredientService.get_ingredients_by_type(db, ingredient_type)
        return ResponseHelper.ok_response(
            data=[IngredientResponse.model_validate(i).model_dump() for i in ingredients],
            message="Ingredients retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
