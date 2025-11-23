"""Schemas for user post and social operations."""
from typing import List, Optional
from pydantic import BaseModel, Field


class FollowRequest(BaseModel):
    """Schema for follow/unfollow request."""
    target_user_id: str = Field(..., description="User ID to follow/unfollow")


class PostInfo(BaseModel):
    """Schema for post information in feed."""
    id: int
    user_id: str
    user_name: Optional[str] = None
    user_profile_pic: Optional[str] = None
    title: str
    overview: str
    cooking_time: int
    cuisine_type: str
    servings: int
    image: Optional[str] = None
    ingredients: List
    instructions: Optional[str] = None
    created_at: Optional[str] = None


class UserFeedResponse(BaseModel):
    """Schema for user feed response."""
    posts: List[PostInfo]
    total: int
    skip: int
    limit: int


class UserBasicInfo(BaseModel):
    """Schema for basic user information."""
    user_id: str
    name: Optional[str] = None
    profile_pic: Optional[str] = None
    about_me: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    gender: Optional[str] = None
    language: Optional[str] = None
    is_creator: bool = False


class FollowingInfo(UserBasicInfo):
    """Schema for following user information."""
    followed_at: Optional[str] = None


class FollowingListResponse(BaseModel):
    """Schema for following list response."""
    following: List[FollowingInfo]
    total: int
    skip: int
    limit: int


class CreatorInfo(BaseModel):
    """Schema for creator information."""
    user_id: str
    name: Optional[str] = None
    profile_pic: Optional[str] = None
    about_me: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    gender: Optional[str] = None
    language: Optional[str] = None


class CreatorSearchResponse(BaseModel):
    """Schema for creator search response."""
    creators: List[CreatorInfo]
    total: int
    skip: int
    limit: int


class CreatorDetailsResponse(BaseModel):
    """Schema for creator details response."""
    user_id: str
    name: Optional[str] = None
    profile_pic: Optional[str] = None
    about_me: Optional[str] = None
    location: Optional[str] = None
    gender: Optional[str] = None
    language: Optional[str] = None
    follower_count: int = 0
    post_count: int = 0


class FollowResponse(BaseModel):
    """Schema for follow/unfollow response."""
    message: str
