"""Service layer for admin user and creator management operations."""
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import OperationalError, DatabaseError
from sqlalchemy import and_, func
from fastapi import HTTPException, status

from app.models.user import User


class AdminManageService:
    """Service class for admin user and creator management operations."""

    @staticmethod
    def get_users(
        db: Session,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> dict:
        """
        Get list of users (non-creators).
        
        Args:
            db: Database session
            search: Search term for name or email
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            Dictionary with users list and pagination info
        """
        try:
            # Build query for non-creator users
            query = db.query(User).filter(User.is_creator == False)

            # Apply search filter
            if search:
                search_term = f"%{search}%"
                query = query.filter(
                    (User.name.ilike(search_term)) | (User.email.ilike(search_term))
                )

            # Get total count
            total = query.count()

            # Get paginated users
            users = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()

            users_data = []
            for user in users:
                users_data.append({
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "phone": user.phone_no,
                    "profilePic": user.profile_pic,
                    "isActive": user.is_active,
                    "createdAt": user.created_at.isoformat() if user.created_at else None
                })

            return {
                "data": users_data,
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
                detail="Database error occurred while fetching users"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching users"
            )

    @staticmethod
    def get_creators(
        db: Session,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> dict:
        """
        Get list of creators.
        
        Args:
            db: Database session
            search: Search term for name or email
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            Dictionary with creators list and pagination info
        """
        try:
            # Build query for creators
            query = db.query(User).filter(User.is_creator == True)

            # Apply search filter
            if search:
                search_term = f"%{search}%"
                query = query.filter(
                    (User.name.ilike(search_term)) | (User.email.ilike(search_term))
                )

            # Get total count
            total = query.count()

            # Get paginated creators
            creators = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()

            creators_data = []
            for creator in creators:
                creators_data.append({
                    "id": creator.id,
                    "name": creator.name,
                    "email": creator.email,
                    "phone": creator.phone_no,
                    "profilePic": creator.profile_pic,
                    "isActive": creator.is_active,
                    "createdAt": creator.created_at.isoformat() if creator.created_at else None
                })

            return {
                "data": creators_data,
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
                detail="Database error occurred while fetching creators"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching creators"
            )

    @staticmethod
    def deactivate_user(db: Session, user_id: str) -> dict:
        """
        Deactivate a user account.
        
        Args:
            db: Database session
            user_id: User ID to deactivate
            
        Returns:
            Dictionary with success message
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            user.is_active = False
            db.commit()

            return {
                "message": "User deactivated successfully",
                "userId": user_id
            }

        except HTTPException:
            raise
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
                detail="Database error occurred while deactivating user"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while deactivating user"
            )

    @staticmethod
    def activate_user(db: Session, user_id: str) -> dict:
        """
        Activate a user account.
        
        Args:
            db: Database session
            user_id: User ID to activate
            
        Returns:
            Dictionary with success message
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            user.is_active = True
            db.commit()

            return {
                "message": "User activated successfully",
                "userId": user_id
            }

        except HTTPException:
            raise
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
                detail="Database error occurred while activating user"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while activating user"
            )

    @staticmethod
    def remove_creator_status(db: Session, user_id: str) -> dict:
        """
        Remove creator status from a user.
        
        Args:
            db: Database session
            user_id: User ID to remove creator status from
            
        Returns:
            Dictionary with success message
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            if not user.is_creator:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User is not a creator"
                )

            user.is_creator = False
            db.commit()

            return {
                "message": "Creator status removed successfully",
                "userId": user_id
            }

        except HTTPException:
            raise
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
                detail="Database error occurred while removing creator status"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while removing creator status"
            )

    @staticmethod
    def delete_user(db: Session, user_id: str) -> dict:
        """
        Delete a user account.
        
        Args:
            db: Database session
            user_id: User ID to delete
            
        Returns:
            Dictionary with success message
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            db.delete(user)
            db.commit()

            return {
                "message": "User deleted successfully",
                "userId": user_id
            }

        except HTTPException:
            raise
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
                detail="Database error occurred while deleting user"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while deleting user"
            )
