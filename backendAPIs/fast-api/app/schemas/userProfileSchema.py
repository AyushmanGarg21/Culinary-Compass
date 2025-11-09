"""Schemas for user profile operations."""
from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime


class UserProfileResponse(BaseModel):
    """Response schema for user profile - only essential details."""
    id: str
    name: Optional[str] = None
    email: str
    phone_no: Optional[str] = None
    profile_pic: Optional[str] = None
    country_id: Optional[int] = None
    city_id: Optional[int] = None
    gender: Optional[str] = None
    language: Optional[str] = None
    age: Optional[int] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    calories_target: Optional[int] = None
    about_me: Optional[str] = None
    is_active: bool
    is_creator: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UpdateUserProfileRequest(BaseModel):
    """Request schema for updating user profile."""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    phone_no: Optional[str] = Field(None, max_length=32)
    profile_pic: Optional[str] = Field(None, max_length=1024)
    country_id: Optional[int] = Field(None, gt=0)
    city_id: Optional[int] = Field(None, gt=0)
    gender: Optional[str] = Field(None, max_length=16)
    language: Optional[str] = Field(None, max_length=32)
    age: Optional[int] = Field(None, ge=1, le=150)
    height: Optional[int] = Field(None, ge=1, le=300, description="Height in cm")
    weight: Optional[int] = Field(None, ge=1, le=500, description="Weight in kg")
    calories_target: Optional[int] = Field(None, ge=0)
    about_me: Optional[str] = None


class UpdatePasswordRequest(BaseModel):
    """Request schema for updating user password."""
    old_password: str = Field(..., min_length=6, max_length=100)
    new_password: str = Field(..., min_length=6, max_length=100)

    class Config:
        json_schema_extra = {
            "example": {
                "old_password": "oldPassword123",
                "new_password": "newPassword456"
            }
        }
