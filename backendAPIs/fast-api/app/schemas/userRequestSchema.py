"""Schemas for user requests (creator request and creator post)."""
from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


# Creator Request Schemas
class CreatorRequestStatusEnum(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    DEACTIVE = "DEACTIVE"


class CreateCreatorRequest(BaseModel):
    """Request schema for creating a creator request."""
    about_self: str = Field(..., min_length=10, max_length=5000)
    experience: str = Field(..., min_length=10, max_length=5000)
    links: Optional[List[str]] = Field(None, description="Social media or portfolio links")


class CreatorRequestResponse(BaseModel):
    """Response schema for creator request."""
    id: int
    user_id: str
    about_self: str
    experience: str
    links: Optional[List[str]] = None
    requested_date: datetime
    action_date: Optional[datetime] = None
    action_by: Optional[str] = None
    action_comments: Optional[str] = None
    status: CreatorRequestStatusEnum

    class Config:
        from_attributes = True


# Creator Post Schemas
class CreatorPostStatusEnum(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class CreateCreatorPost(BaseModel):
    """Request schema for creating a creator post."""
    title: str = Field(..., min_length=5, max_length=500)
    overview: str = Field(..., min_length=10, max_length=5000)
    cooking_time: int = Field(..., gt=0, description="Cooking time in minutes")
    cuisine_type: str = Field(..., min_length=2, max_length=200)
    servings: int = Field(..., gt=0, description="Number of servings")
    image: Optional[str] = Field(None, max_length=1024)
    ingredients: List[dict] = Field(..., min_items=1, description="List of ingredients")
    instructions: Optional[str] = Field(None, description="Cooking instructions")


class UpdateCreatorPost(BaseModel):
    """Request schema for updating a creator post."""
    title: Optional[str] = Field(None, min_length=5, max_length=500)
    overview: Optional[str] = Field(None, min_length=10, max_length=5000)
    cooking_time: Optional[int] = Field(None, gt=0, description="Cooking time in minutes")
    cuisine_type: Optional[str] = Field(None, min_length=2, max_length=200)
    servings: Optional[int] = Field(None, gt=0, description="Number of servings")
    image: Optional[str] = Field(None, max_length=1024)
    ingredients: Optional[List[dict]] = Field(None, min_items=1, description="List of ingredients")
    instructions: Optional[str] = Field(None, description="Cooking instructions")


class CreatorPostResponse(BaseModel):
    """Response schema for creator post."""
    id: int
    user_id: str
    title: str
    overview: str
    cooking_time: int
    cuisine_type: str
    servings: int
    image: Optional[str] = None
    ingredients: List[dict]
    instructions: Optional[str] = None
    action_date: Optional[datetime] = None
    action_by: Optional[str] = None
    action_comments: Optional[str] = None
    status: CreatorPostStatusEnum
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
