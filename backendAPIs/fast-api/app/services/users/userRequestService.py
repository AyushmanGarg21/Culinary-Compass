"""Service layer for user requests (creator request and creator post)."""
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError, DatabaseError, IntegrityError
from fastapi import HTTPException, status

from app.models.creator_request import CreatorRequest, CreatorRequestStatus
from app.models.creator_post import CreatorPost
from app.models.user import User
from app.schemas.userRequestSchema import (
    CreateCreatorRequest,
    CreateCreatorPost
)


class CreatorRequestService:
    """Service class for creator request operations."""

    @staticmethod
    def create_creator_request(
        db: Session,
        user_id: str,
        request_data: CreateCreatorRequest
    ) -> CreatorRequest:
        """
        Create a new creator request.
        
        Args:
            db: Database session
            user_id: User ID from request state
            request_data: Creator request data
            
        Returns:
            Created CreatorRequest object
            
        Raises:
            HTTPException: If validation fails or database error
        """
        try:
            # Check if user exists
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            # Check if user already has a pending or approved request
            existing_request = db.query(CreatorRequest).filter(
                CreatorRequest.user_id == user_id,
                CreatorRequest.status.in_([
                    CreatorRequestStatus.PENDING,
                    CreatorRequestStatus.APPROVED
                ])
            ).first()

            if existing_request:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"You already have a {existing_request.status.value} creator request"
                )

            # Create new creator request
            creator_request = CreatorRequest(
                user_id=user_id,
                **request_data.model_dump()
            )
            
            db.add(creator_request)
            db.commit()
            db.refresh(creator_request)
            return creator_request

        except HTTPException:
            raise
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create creator request due to data integrity issue"
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
                detail="Database error occurred while creating creator request"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while creating creator request"
            )


class CreatorPostService:
    """Service class for creator post operations."""

    @staticmethod
    def create_creator_post(
        db: Session,
        user_id: str,
        post_data: CreateCreatorPost
    ) -> CreatorPost:
        """
        Create a new creator post.
        
        Args:
            db: Database session
            user_id: User ID from request state
            post_data: Creator post data
            
        Returns:
            Created CreatorPost object
            
        Raises:
            HTTPException: If validation fails or database error
        """
        try:
            # Check if user exists and is a creator
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            if not user.is_creator:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Only creators can create posts"
                )

            # Create new creator post
            creator_post = CreatorPost(
                user_id=user_id,
                **post_data.model_dump()
            )
            
            db.add(creator_post)
            db.commit()
            db.refresh(creator_post)
            return creator_post

        except HTTPException:
            raise
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create creator post due to data integrity issue"
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
                detail="Database error occurred while creating creator post"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while creating creator post"
            )