"""Service layer for admin messaging operations."""
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import OperationalError, DatabaseError, IntegrityError
from sqlalchemy import and_, or_, func, desc, case
from fastapi import HTTPException, status

from app.models.admin_message import AdminMessage, AdminMessageSender
from app.models.user import User


class AdminMessagesService:
    """Service class for admin messaging operations."""

    @staticmethod
    def get_conversations(db: Session, admin_id: str) -> List[dict]:
        """
        Get list of all conversations (users who have messaged admin).
        
        Returns conversations with last message, unread count, and user details.
        
        Args:
            db: Database session
            admin_id: Admin ID from request state
            
        Returns:
            List of conversation dictionaries
        """
        try:
            # Get all unique users who have admin messages
            user_ids_subquery = db.query(AdminMessage.user_id).distinct().subquery()
            
            # Get user details with last message info and unread count
            conversations_query = db.query(
                User,
                func.coalesce(
                    func.count(
                        case(
                            (and_(
                                AdminMessage.sender == AdminMessageSender.User,
                                AdminMessage.is_read == False
                            ), 1)
                        )
                    ), 0
                ).label('unread_count')
            ).join(
                user_ids_subquery,
                User.id == user_ids_subquery.c.user_id
            ).outerjoin(
                AdminMessage,
                AdminMessage.user_id == User.id
            ).group_by(User.id)

            conversations = conversations_query.all()

            # Build conversation list with last message details
            conversation_list = []
            for user, unread_count in conversations:
                # Get last message for this conversation
                last_message = db.query(AdminMessage).filter(
                    AdminMessage.user_id == user.id
                ).order_by(AdminMessage.created_at.desc()).first()

                if last_message:
                    conversation_list.append({
                        "id": user.id,
                        "username": user.name or "Unknown User",
                        "email": user.email,
                        "image": user.profile_pic or "",
                        "lastMessage": last_message.content or "",
                        "lastMessageTime": last_message.created_at.isoformat() if last_message.created_at else None,
                        "lastMessageSender": last_message.sender.value,
                        "unreadCount": unread_count,
                        "isOnline": False  # Can be enhanced with real-time status
                    })

            # Sort by last message time
            conversation_list.sort(key=lambda x: x['lastMessageTime'] or '', reverse=True)

            return conversation_list

        except OperationalError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection error. Please try again later."
            )
        except DatabaseError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while fetching conversations"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching conversations"
            )

    @staticmethod
    def get_messages(
        db: Session,
        admin_id: str,
        user_id: str,
        skip: int = 0,
        limit: int = 50
    ) -> dict:
        """
        Get messages for a specific conversation with a user.
        
        Args:
            db: Database session
            admin_id: Admin ID from request state
            user_id: The user in the conversation
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            Dictionary with messages list and pagination info
        """
        try:
            # Verify user exists
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            # Get messages for this user
            messages_query = db.query(AdminMessage).filter(
                AdminMessage.user_id == user_id
            ).order_by(AdminMessage.created_at.asc())

            # Get total count
            total = messages_query.count()

            # Get paginated messages
            messages = messages_query.offset(skip).limit(limit).all()

            # Mark user messages as read
            db.query(AdminMessage).filter(
                and_(
                    AdminMessage.user_id == user_id,
                    AdminMessage.sender == AdminMessageSender.User,
                    AdminMessage.is_read == False
                )
            ).update({"is_read": True}, synchronize_session=False)
            db.commit()

            messages_data = []
            for message in messages:
                messages_data.append({
                    "id": message.id,
                    "userId": message.user_id,
                    "adminId": message.admin_id,
                    "sender": message.sender.value,
                    "content": message.content,
                    "isRead": message.is_read,
                    "createdAt": message.created_at.isoformat() if message.created_at else None
                })

            return {
                "messages": messages_data,
                "total": total,
                "skip": skip,
                "limit": limit,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "profilePic": user.profile_pic
                }
            }

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
                detail="Database error occurred while fetching messages"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching messages"
            )

    @staticmethod
    def send_message(
        db: Session,
        admin_id: str,
        user_id: str,
        content: str
    ) -> dict:
        """
        Send a message to a user.
        
        Args:
            db: Database session
            admin_id: Admin ID (sender)
            user_id: User ID (receiver)
            content: Message content
            
        Returns:
            Dictionary with sent message details
        """
        try:
            # Verify user exists
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            # Create message
            message = AdminMessage(
                user_id=user_id,
                admin_id=admin_id,
                sender=AdminMessageSender.Admin,
                content=content,
                is_read=False
            )
            
            db.add(message)
            db.commit()
            db.refresh(message)

            return {
                "id": message.id,
                "userId": message.user_id,
                "adminId": message.admin_id,
                "sender": message.sender.value,
                "content": message.content,
                "isRead": message.is_read,
                "createdAt": message.created_at.isoformat() if message.created_at else None
            }

        except HTTPException:
            raise
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to send message due to data integrity issue"
            )
        except OperationalError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection error. Please try again later."
            )
        except DatabaseError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while sending message"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while sending message"
            )

    @staticmethod
    def get_unread_count(db: Session, admin_id: str) -> dict:
        """
        Get total count of unread messages from all users.
        
        Args:
            db: Database session
            admin_id: Admin ID from request state
            
        Returns:
            Dictionary with unread count
        """
        try:
            unread_count = db.query(func.count(AdminMessage.id)).filter(
                and_(
                    AdminMessage.sender == AdminMessageSender.User,
                    AdminMessage.is_read == False
                )
            ).scalar()

            return {
                "unreadCount": unread_count or 0
            }

        except OperationalError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection error. Please try again later."
            )
        except DatabaseError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while fetching unread count"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching unread count"
            )

    @staticmethod
    def mark_conversation_as_read(
        db: Session,
        admin_id: str,
        user_id: str
    ) -> dict:
        """
        Mark all messages from a user as read.
        
        Args:
            db: Database session
            admin_id: Admin ID from request state
            user_id: The user in the conversation
            
        Returns:
            Dictionary with success message
        """
        try:
            # Mark all unread messages from user as read
            updated_count = db.query(AdminMessage).filter(
                and_(
                    AdminMessage.user_id == user_id,
                    AdminMessage.sender == AdminMessageSender.User,
                    AdminMessage.is_read == False
                )
            ).update({"is_read": True}, synchronize_session=False)

            db.commit()

            return {
                "message": "Messages marked as read",
                "updated_count": updated_count
            }

        except OperationalError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection error. Please try again later."
            )
        except DatabaseError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while marking messages as read"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while marking messages as read"
            )
