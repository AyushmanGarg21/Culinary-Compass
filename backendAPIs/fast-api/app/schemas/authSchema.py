"""Schemas for authentication operations."""
from typing import Optional
from pydantic import BaseModel, Field


class SignUpRequest(BaseModel):
    """Schema for user sign up request."""
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6, max_length=100, description="User password")
    name: Optional[str] = Field(None, max_length=200, description="User name")
    phone_no: Optional[str] = Field(None, max_length=32, description="User phone number")


class SignInRequest(BaseModel):
    """Schema for user sign in request."""
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class AdminSignInRequest(BaseModel):
    """Schema for admin sign in request."""
    email: str = Field(..., description="Admin email address")
    password: str = Field(..., description="Admin password")


class RefreshTokenRequest(BaseModel):
    """Schema for refresh token request."""
    refresh_token: str = Field(..., description="Refresh token")


class UserInfo(BaseModel):
    """Schema for user information."""
    id: str
    email: str
    name: Optional[str] = None
    phone_no: Optional[str] = None
    profile_pic: Optional[str] = None
    is_creator: bool = False
    is_active: bool = True


class AdminInfo(BaseModel):
    """Schema for admin information."""
    id: str
    email: str
    name: Optional[str] = None
    is_active: bool = True


class AuthResponse(BaseModel):
    """Schema for authentication response."""
    user: Optional[UserInfo] = None
    admin: Optional[AdminInfo] = None
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenResponse(BaseModel):
    """Schema for refresh token response."""
    access_token: str
    token_type: str = "bearer"


class LogoutResponse(BaseModel):
    """Schema for logout response."""
    message: str


class CurrentUserResponse(BaseModel):
    """Schema for current user response."""
    id: str
    email: str
    name: Optional[str] = None
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
    is_creator: bool = False
    is_active: bool = True
