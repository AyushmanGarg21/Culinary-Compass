"""API routes for user messaging operations."""
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.userMessagesSchema import (
    SendMessageRequest,
    SendAdminMessageRequest,
    MessageResponse,
    AdminMessageResponse,
    ConversationsListResponse,
    MessagesListResponse,
    AdminMessagesListResponse,
    MarkAsReadResponse,
    UnreadCountResponse
)
from app.services.users.userMessagesService import (
    UserMessagesService,
    AdminMessagesService
)
from app.config.response_helper import ResponseHelper


router = APIRouter(prefix="/messages")


# User-to-User Messaging Routes

@router.get("/conversations")
async def get_conversations(
    request: Request,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get list of all conversations for the current user.
    
    Returns conversations with last message, unread count, and user details.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        conversations = UserMessagesService.get_conversations(db, user_id)
        return ResponseHelper.success_response(
            data={"conversations": conversations},
            message="Conversations fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/conversation/{creator_id}")
async def get_messages(
    request: Request,
    creator_id: str,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get messages for a specific conversation.
    
    Returns paginated messages between current user and specified creator.
    Automatically marks received messages as read.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        messages_data = UserMessagesService.get_messages(
            db, user_id, creator_id, skip, limit
        )
        return ResponseHelper.success_response(
            data=messages_data,
            message="Messages fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/send")
async def send_message(
    request: Request,
    message_request: SendMessageRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Send a message to another user.
    
    Creates a new message in the conversation with the specified user.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        message_data = UserMessagesService.send_message(
            db,
            user_id,
            message_request.receiver_id,
            message_request.content
        )
        return ResponseHelper.created_response(
            data=message_data,
            message="Message sent successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/mark-read/{creator_id}")
async def mark_conversation_as_read(
    request: Request,
    creator_id: str,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Mark all messages in a conversation as read.
    
    Marks all unread messages from the specified creator as read.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        result = UserMessagesService.mark_conversation_as_read(
            db, user_id, creator_id
        )
        return ResponseHelper.success_response(
            data=result,
            message="Messages marked as read"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


# Admin Messaging Routes

@router.get("/admin")
async def get_admin_conversation(
    request: Request,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get messages between user and admin.
    
    Returns paginated messages in the admin conversation.
    Automatically marks admin messages as read.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        messages_data = AdminMessagesService.get_admin_conversation(
            db, user_id, skip, limit
        )
        return ResponseHelper.success_response(
            data=messages_data,
            message="Admin messages fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post("/admin/send")
async def send_message_to_admin(
    request: Request,
    message_request: SendAdminMessageRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Send a message to admin.
    
    Creates a new message in the admin conversation.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        message_data = AdminMessagesService.send_message_to_admin(
            db, user_id, message_request.content
        )
        return ResponseHelper.created_response(
            data=message_data,
            message="Message sent to admin successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/admin/unread-count")
async def get_unread_admin_message_count(
    request: Request,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get count of unread admin messages.
    
    Returns the number of unread messages from admin.
    User ID is extracted from JWT token in request state.
    """
    try:
        user_id = request.state.user_id
        count_data = AdminMessagesService.get_unread_admin_message_count(db, user_id)
        return ResponseHelper.success_response(
            data=count_data,
            message="Unread count fetched successfully"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
