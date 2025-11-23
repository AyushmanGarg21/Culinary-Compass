"""Service layer for user messaging operations."""
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import OperationalError, DatabaseError, IntegrityError
from sqlalchemy import and_, or_, func, case, desc
from fastapi import HTTPException, status

from app.models.user_message import UserMessage
from app.models.admin_message import AdminMessage, AdminMessageSender
from app.models.user import User
from app.models.follow import Follow


class UserMessagesService:
    """Service class for user messaging operations."""

    @staticmethod
    def get_conversations(db: Session, user_id: str) -> List[dict]:
        """
        Get list of all conversations for a user.
        
        Returns conversations with last message, unread count, and user details.
        
        Args:
            db: Database session
            user_id: Current user ID from request state
            
        Returns:
            List of conversation dictionaries
        """
        try:
            # Subquery to get last message for each conversation
            last_message_subquery = db.query(
                UserMessage.sender_id,
                UserMessage.recevier_id,
                func.max(UserMessage.created_at).label('last_message_time')
            ).filter(
                or_(
                    UserMessage.sender_id == user_id,
                    UserMessage.recevier_id == user_id
                )
            ).group_by(
                UserMessage.sender_id,
                UserMessage.recevier_id
            ).subquery()

            # Get all unique users the current user has conversations with
            sent_users = db.query(UserMessage.recevier_id.label('other_user_id')).filter(
                UserMessage.sender_id == user_id
            ).distinct()
            
            received_users = db.query(UserMessage.sender_id.label('other_user_id')).filter(
                UserMessage.recevier_id == user_id
            ).distinct()
            
            # Union both queries
            all_conversation_users = sent_users.union(received_users).subquery()
            
            # Get user details with last message info
            conversations_query = db.query(
                User,
                func.coalesce(
                    func.count(
                        case(
                            (and_(
                                UserMessage.recevier_id == user_id,
                                UserMessage.is_read == False
                            ), 1)
                        )
                    ), 0
                ).label('unread_count')
            ).join(
                all_conversation_users,
                User.id == all_conversation_users.c.other_user_id
            ).outerjoin(
                UserMessage,
                or_(
                    and_(
                        UserMessage.sender_id == user_id,
                        UserMessage.recevier_id == User.id
                    ),
                    and_(
                        UserMessage.sender_id == User.id,
                        UserMessage.recevier_id == user_id
                    )
                )
            ).group_by(User.id)

            conversations = conversations_query.all()

            # Build conversation list with last message details
            conversation_list = []
            for user, unread_count in conversations:
                # Get last message for this conversation
                last_message = db.query(UserMessage).filter(
                    or_(
                        and_(
                            UserMessage.sender_id == user_id,
                            UserMessage.recevier_id == user.id
                        ),
                        and_(
                            UserMessage.sender_id == user.id,
                            UserMessage.recevier_id == user_id
                        )
                    )
                ).order_by(UserMessage.created_at.desc()).first()

                if last_message:
                    conversation_list.append({
                        "id": user.id,
                        "username": user.name or "Unknown User",
                        "image": user.profile_pic or "",
                        "lastMessage": last_message.content or "",
                        "lastMessageTime": last_message.created_at.isoformat() if last_message.created_at else None,
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
        user_id: str,
        creator_id: str,
        skip: int = 0,
        limit: int = 50
    ) -> dict:
        """
        Get messages for a specific conversation.
        
        Args:
            db: Database session
            user_id: Current user ID from request state
            creator_id: The creator user in the conversation
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            Dictionary with messages list and pagination info
        """
        try:
            # Verify creator exists
            creator = db.query(User).filter(User.id == creator_id).first()
            if not creator:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Creator not found"
                )

            # Get messages between the two users
            messages_query = db.query(UserMessage).filter(
                or_(
                    and_(
                        UserMessage.sender_id == user_id,
                        UserMessage.recevier_id == creator_id
                    ),
                    and_(
                        UserMessage.sender_id == creator_id,
                        UserMessage.recevier_id == user_id
                    )
                )
            ).order_by(UserMessage.created_at.asc())

            # Get total count
            total = messages_query.count()

            # Get paginated messages
            messages = messages_query.offset(skip).limit(limit).all()

            # Mark received messages as read
            db.query(UserMessage).filter(
                and_(
                    UserMessage.sender_id == creator_id,
                    UserMessage.recevier_id == user_id,
                    UserMessage.is_read == False
                )
            ).update({"is_read": True}, synchronize_session=False)
            db.commit()

            messages_data = []
            for message in messages:
                messages_data.append({
                    "id": message.id,
                    "senderId": message.sender_id,
                    "receiverId": message.recevier_id,
                    "content": message.content,
                    "isRead": message.is_read,
                    "createdAt": message.created_at.isoformat() if message.created_at else None
                })

            return {
                "messages": messages_data,
                "total": total,
                "skip": skip,
                "limit": limit
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
        user_id: str,
        receiver_id: str,
        content: str
    ) -> dict:
        """
        Send a message to another user.
        
        Args:
            db: Database session
            user_id: Current user ID (sender)
            receiver_id: Receiver user ID
            content: Message content
            
        Returns:
            Dictionary with sent message details
        """
        try:
            # Verify receiver exists
            receiver = db.query(User).filter(User.id == receiver_id).first()
            if not receiver:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Receiver not found"
                )

            # Check if trying to message self
            if user_id == receiver_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="You cannot send messages to yourself"
                )

            # Create message
            message = UserMessage(
                sender_id=user_id,
                recevier_id=receiver_id,
                content=content,
                is_read=False
            )
            
            db.add(message)
            db.commit()
            db.refresh(message)

            return {
                "id": message.id,
                "senderId": message.sender_id,
                "receiverId": message.recevier_id,
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
    def mark_conversation_as_read(
        db: Session,
        user_id: str,
        creator_id: str
    ) -> dict:
        """
        Mark all messages in a conversation as read.
        
        Args:
            db: Database session
            user_id: Current user ID
            creator_id: The creator user in the conversation
            
        Returns:
            Dictionary with success message
        """
        try:
            # Mark all unread messages from creator as read
            updated_count = db.query(UserMessage).filter(
                and_(
                    UserMessage.sender_id == creator_id,
                    UserMessage.recevier_id == user_id,
                    UserMessage.is_read == False
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


class AdminMessagesService:
    """Service class for admin messaging operations."""

    @staticmethod
    def get_admin_conversation(
        db: Session,
        user_id: str,
        skip: int = 0,
        limit: int = 50
    ) -> dict:
        """
        Get messages between user and admin.
        
        Args:
            db: Database session
            user_id: Current user ID
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            Dictionary with messages list and pagination info
        """
        try:
            # Get messages
            messages_query = db.query(AdminMessage).filter(
                AdminMessage.user_id == user_id
            ).order_by(AdminMessage.created_at.asc())

            # Get total count
            total = messages_query.count()

            # Get paginated messages
            messages = messages_query.offset(skip).limit(limit).all()

            # Mark admin messages as read
            db.query(AdminMessage).filter(
                and_(
                    AdminMessage.user_id == user_id,
                    AdminMessage.sender == AdminMessageSender.Admin,
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
                "limit": limit
            }

        except OperationalError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection error. Please try again later."
            )
        except DatabaseError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while fetching admin messages"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching admin messages"
            )

    @staticmethod
    def send_message_to_admin(
        db: Session,
        user_id: str,
        content: str
    ) -> dict:
        """
        Send a message to admin.
        
        Args:
            db: Database session
            user_id: Current user ID
            content: Message content
            
        Returns:
            Dictionary with sent message details
        """
        try:
            # Create message
            message = AdminMessage(
                user_id=user_id,
                sender=AdminMessageSender.User,
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
    def get_unread_admin_message_count(db: Session, user_id: str) -> dict:
        """
        Get count of unread admin messages.
        
        Args:
            db: Database session
            user_id: Current user ID
            
        Returns:
            Dictionary with unread count
        """
        try:
            unread_count = db.query(func.count(AdminMessage.id)).filter(
                and_(
                    AdminMessage.user_id == user_id,
                    AdminMessage.sender == AdminMessageSender.Admin,
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
