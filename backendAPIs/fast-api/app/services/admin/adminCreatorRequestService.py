"""Service layer for admin creator request operations."""
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import OperationalError, DatabaseError
from sqlalchemy import and_, func
from fastapi import HTTPException, status

from app.models.creator_request import CreatorRequest, CreatorRequestStatus
from app.models.user import User


class AdminCreatorRequestService:
    """Service class for admin creator request operations."""

    @staticmethod
    def get_creator_requests(
        db: Session,
        status_filter: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> dict:
        """
        Get list of creator requests.
        
        Args:
            db: Database session
            status_filter: Filter by status (PENDING, APPROVED, REJECTED)
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            Dictionary with creator requests list and pagination info
        """
        try:
            # Build query
            query = db.query(CreatorRequest).options(
                joinedload(CreatorRequest.user)
            )

            # Apply status filter
            if status_filter:
                try:
                    status_enum = CreatorRequestStatus[status_filter.upper()]
                    query = query.filter(CreatorRequest.status == status_enum)
                except KeyError:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Invalid status: {status_filter}"
                    )
            else:
                # Default to PENDING requests
                query = query.filter(CreatorRequest.status == CreatorRequestStatus.PENDING)

            # Get total count
            total = query.count()

            # Get paginated requests
            requests = query.order_by(CreatorRequest.requested_date.desc()).offset(skip).limit(limit).all()

            requests_data = []
            for req in requests:
                requests_data.append({
                    "id": req.id,
                    "userId": req.user_id,
                    "username": req.user.name if req.user else "Unknown",
                    "profilePic": req.user.profile_pic if req.user else "",
                    "description": req.about_self,
                    "experience": req.experience,
                    "links": req.links,
                    "requestedDate": req.requested_date.isoformat() if req.requested_date else None,
                    "status": req.status.value,
                    "actionDate": req.action_date.isoformat() if req.action_date else None,
                    "actionComments": req.action_comments
                })

            return {
                "requests": requests_data,
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
                detail="Database error occurred while fetching creator requests"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching creator requests"
            )

    @staticmethod
    def approve_creator_request(
        db: Session,
        admin_id: str,
        request_id: int,
        comments: Optional[str] = None
    ) -> dict:
        """
        Approve a creator request.
        
        Args:
            db: Database session
            admin_id: Admin ID from request state
            request_id: Creator request ID
            comments: Optional approval comments
            
        Returns:
            Dictionary with success message
        """
        try:
            # Get request
            creator_request = db.query(CreatorRequest).filter(
                CreatorRequest.id == request_id
            ).first()

            if not creator_request:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Creator request not found"
                )

            if creator_request.status != CreatorRequestStatus.PENDING:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Request is already {creator_request.status.value}"
                )

            # Update request status
            creator_request.status = CreatorRequestStatus.APPROVED
            creator_request.action_date = datetime.now()
            creator_request.action_by = admin_id
            creator_request.action_comments = comments

            # Update user to creator
            user = db.query(User).filter(User.id == creator_request.user_id).first()
            if user:
                user.is_creator = True

            db.commit()

            return {
                "message": "Creator request approved successfully",
                "requestId": request_id
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
                detail="Database error occurred while approving request"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while approving request"
            )

    @staticmethod
    def reject_creator_request(
        db: Session,
        admin_id: str,
        request_id: int,
        comments: Optional[str] = None
    ) -> dict:
        """
        Reject a creator request.
        
        Args:
            db: Database session
            admin_id: Admin ID from request state
            request_id: Creator request ID
            comments: Optional rejection comments
            
        Returns:
            Dictionary with success message
        """
        try:
            # Get request
            creator_request = db.query(CreatorRequest).filter(
                CreatorRequest.id == request_id
            ).first()

            if not creator_request:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Creator request not found"
                )

            if creator_request.status != CreatorRequestStatus.PENDING:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Request is already {creator_request.status.value}"
                )

            # Update request status
            creator_request.status = CreatorRequestStatus.REJECTED
            creator_request.action_date = datetime.now()
            creator_request.action_by = admin_id
            creator_request.action_comments = comments

            db.commit()

            return {
                "message": "Creator request rejected successfully",
                "requestId": request_id
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
                detail="Database error occurred while rejecting request"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while rejecting request"
            )
