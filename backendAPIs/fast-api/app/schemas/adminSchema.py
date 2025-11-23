"""Schemas for admin operations."""
from typing import List, Optional
from pydantic import BaseModel, Field


# Creator Request Schemas
class ApproveRejectRequest(BaseModel):
    """Schema for approve/reject request."""
    comments: Optional[str] = Field(None, max_length=1000, description="Optional comments")


class CreatorRequestInfo(BaseModel):
    """Schema for creator request information."""
    id: int
    userId: str
    username: str
    profilePic: str
    description: str
    experience: str
    links: Optional[List] = None
    requestedDate: Optional[str] = None
    status: str
    actionDate: Optional[str] = None
    actionComments: Optional[str] = None


class CreatorRequestsListResponse(BaseModel):
    """Schema for creator requests list response."""
    requests: List[CreatorRequestInfo]
    total: int
    skip: int
    limit: int


# Post Request Schemas
class PostRequestInfo(BaseModel):
    """Schema for post request information."""
    id: int
    userId: str
    username: str
    profilePic: str
    title: str
    overview: str
    cookingTime: int
    cuisineType: str
    servings: int
    image: Optional[str] = None
    ingredients: List
    instructions: Optional[str] = None
    status: str
    createdAt: Optional[str] = None
    actionDate: Optional[str] = None
    actionComments: Optional[str] = None


class PostRequestsListResponse(BaseModel):
    """Schema for post requests list response."""
    posts: List[PostRequestInfo]
    total: int
    skip: int
    limit: int


# User Management Schemas
class UserInfo(BaseModel):
    """Schema for user information."""
    id: str
    name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    profilePic: Optional[str] = None
    isActive: bool
    createdAt: Optional[str] = None


class UsersListResponse(BaseModel):
    """Schema for users list response."""
    data: List[UserInfo]
    total: int
    skip: int
    limit: int


class CreatorInfo(BaseModel):
    """Schema for creator information."""
    id: str
    name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    profilePic: Optional[str] = None
    isActive: bool
    createdAt: Optional[str] = None


class CreatorsListResponse(BaseModel):
    """Schema for creators list response."""
    data: List[CreatorInfo]
    total: int
    skip: int
    limit: int


# Action Response Schemas
class ActionResponse(BaseModel):
    """Schema for action response."""
    message: str
    userId: Optional[str] = None
    requestId: Optional[int] = None
    postId: Optional[int] = None


# Admin Messaging Schemas
class SendMessageRequest(BaseModel):
    """Schema for sending a message to user."""
    content: str = Field(..., min_length=1, max_length=5000, description="Message content")


class AdminMessageInfo(BaseModel):
    """Schema for admin message information."""
    id: int
    userId: Optional[str] = None
    adminId: Optional[str] = None
    sender: str
    content: str
    isRead: bool
    createdAt: Optional[str] = None


class UserBasicInfo(BaseModel):
    """Schema for basic user information in messages."""
    id: str
    name: Optional[str] = None
    email: str
    profilePic: Optional[str] = None


class AdminConversationInfo(BaseModel):
    """Schema for admin conversation information."""
    id: str
    username: str
    email: str
    image: str
    lastMessage: str
    lastMessageTime: Optional[str] = None
    lastMessageSender: str
    unreadCount: int
    isOnline: bool = False


class AdminConversationsListResponse(BaseModel):
    """Schema for admin conversations list response."""
    conversations: List[AdminConversationInfo]


class AdminMessagesListResponse(BaseModel):
    """Schema for admin messages list response."""
    messages: List[AdminMessageInfo]
    total: int
    skip: int
    limit: int
    user: UserBasicInfo


class UnreadCountResponse(BaseModel):
    """Schema for unread count response."""
    unreadCount: int


class MarkAsReadResponse(BaseModel):
    """Schema for mark as read response."""
    message: str
    updated_count: int
