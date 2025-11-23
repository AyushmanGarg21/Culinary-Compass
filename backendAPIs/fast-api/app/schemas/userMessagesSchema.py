"""Schemas for user messaging operations."""
from typing import List, Optional
from pydantic import BaseModel, Field


class SendMessageRequest(BaseModel):
    """Schema for sending a message."""
    receiver_id: str = Field(..., description="Receiver user ID")
    content: str = Field(..., min_length=1, max_length=5000, description="Message content")


class SendAdminMessageRequest(BaseModel):
    """Schema for sending a message to admin."""
    content: str = Field(..., min_length=1, max_length=5000, description="Message content")


class MessageResponse(BaseModel):
    """Schema for message response."""
    id: int
    senderId: str
    receiverId: str
    content: str
    isRead: bool
    createdAt: Optional[str] = None


class AdminMessageResponse(BaseModel):
    """Schema for admin message response."""
    id: int
    userId: Optional[str] = None
    adminId: Optional[str] = None
    sender: str
    content: str
    isRead: bool
    createdAt: Optional[str] = None


class ConversationInfo(BaseModel):
    """Schema for conversation information."""
    id: str
    username: str
    image: str
    lastMessage: str
    lastMessageTime: Optional[str] = None
    unreadCount: int
    isOnline: bool = False


class ConversationsListResponse(BaseModel):
    """Schema for conversations list response."""
    conversations: List[ConversationInfo]


class MessagesListResponse(BaseModel):
    """Schema for messages list response."""
    messages: List[MessageResponse]
    total: int
    skip: int
    limit: int


class AdminMessagesListResponse(BaseModel):
    """Schema for admin messages list response."""
    messages: List[AdminMessageResponse]
    total: int
    skip: int
    limit: int


class MarkAsReadResponse(BaseModel):
    """Schema for mark as read response."""
    message: str
    updated_count: int


class UnreadCountResponse(BaseModel):
    """Schema for unread count response."""
    unreadCount: int
