"""API routes for admin messaging operations."""
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.adminSchema import (
    SendMessageRequest,
    AdminConversationsListResponse,
    AdminMessagesListResponse,
    UnreadCountResponse,
    MarkAsReadResponse
)
from app.services.admin.adminMessagesService import AdminMessagesService
from app.config.response_helper import ResponseHelper


router = APIRouter(prefix="/messages")


@router.get("/conversations")
async def get_conversations(
    request: Request,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get list of all conversations with users.
    
    Returns conversations with last message, unread count, and user details.
    Admin ID is extracted from JWT token in request state.
    """
    try:
        admin_id = request.state.user_id
        conversations = AdminMessagesService.get_conversations(db, admin_id)
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


@router.get("/conversation/{user_id}")
async def get_messages(
    request: Request,
    user_id: str,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get messages for a specific conversation with a user.
    
    Returns paginated messages between admin and specified user.
    Automatically marks user messages as read.
    Admin ID is extracted from JWT token in request state.
    """
    try:
        admin_id = request.state.user_id
        messages_data = AdminMessagesService.get_messages(
            db, admin_id, user_id, skip, limit
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


@router.post("/send/{user_id}")
async def send_message(
    request: Request,
    user_id: str,
    message_request: SendMessageRequest,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Send a message to a user.
    
    Creates a new message in the conversation with the specified user.
    Admin ID is extracted from JWT token in request state.
    """
    try:
        admin_id = request.state.user_id
        message_data = AdminMessagesService.send_message(
            db,
            admin_id,
            user_id,
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


@router.get("/unread-count")
async def get_unread_count(
    request: Request,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Get total count of unread messages from all users.
    
    Returns the number of unread messages from users.
    Admin ID is extracted from JWT token in request state.
    """
    try:
        admin_id = request.state.user_id
        count_data = AdminMessagesService.get_unread_count(db, admin_id)
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


@router.post("/mark-read/{user_id}")
async def mark_conversation_as_read(
    request: Request,
    user_id: str,
    db: Session = Depends(get_db)
) -> JSONResponse:
    """
    Mark all messages from a user as read.
    
    Marks all unread messages from the specified user as read.
    Admin ID is extracted from JWT token in request state.
    """
    try:
        admin_id = request.state.user_id
        result = AdminMessagesService.mark_conversation_as_read(
            db, admin_id, user_id
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
