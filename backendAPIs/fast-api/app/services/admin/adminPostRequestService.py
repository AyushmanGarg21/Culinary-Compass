"""Service layer for admin post request operations."""
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import OperationalError, DatabaseError
from sqlalchemy import and_, func
from fastapi import HTTPException, status

from app.models.creator_post import CreatorPost, CreatorPostStatus
from app.models.user import User


class AdminPostRequestService:
    """Service class for admin post request operations."""

    @staticmethod
    def get_post_requests(
        db: Session,
        status_filter: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> dict:
        """
        Get list of creator post requests.
        
        Args:
            db: Database session
            status_filter: Filter by status (PENDING, APPROVED, REJECTED)
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            Dictionary with post requests list and pagination info
        """
        try:
            # Build query
            query = db.query(CreatorPost).options(
                joinedload(CreatorPost.user)
            )

            # Apply status filter
            if status_filter:
                try:
                    status_enum = CreatorPostStatus[status_filter.upper()]
                    query = query.filter(CreatorPost.status == status_enum)
                except KeyError:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Invalid status: {status_filter}"
                    )
            else:
                # Default to PENDING posts
                query = query.filter(CreatorPost.status == CreatorPostStatus.PENDING)

            # Get total count
            total = query.count()

            # Get paginated posts
            posts = query.order_by(CreatorPost.created_at.desc()).offset(skip).limit(limit).all()

            posts_data = []
            for post in posts:
                posts_data.append({
                    "id": post.id,
                    "userId": post.user_id,
                    "username": post.user.name if post.user else "Unknown",
                    "profilePic": post.user.profile_pic if post.user else "",
                    "title": post.title,
                    "overview": post.overview,
                    "cookingTime": post.cooking_time,
                    "cuisineType": post.cuisine_type,
                    "servings": post.servings,
                    "image": post.image,
                    "ingredients": post.ingredients,
                    "instructions": post.instructions,
                    "status": post.status.value,
                    "createdAt": post.created_at.isoformat() if post.created_at else None,
                    "actionDate": post.action_date.isoformat() if post.action_date else None,
                    "actionComments": post.action_comments
                })

            return {
                "posts": posts_data,
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
                detail="Database error occurred while fetching post requests"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching post requests"
            )

    @staticmethod
    def approve_post_request(
        db: Session,
        admin_id: str,
        post_id: int,
        comments: Optional[str] = None
    ) -> dict:
        """
        Approve a creator post request.
        
        Args:
            db: Database session
            admin_id: Admin ID from request state
            post_id: Creator post ID
            comments: Optional approval comments
            
        Returns:
            Dictionary with success message
        """
        try:
            # Get post
            post = db.query(CreatorPost).filter(CreatorPost.id == post_id).first()

            if not post:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Post request not found"
                )

            if post.status != CreatorPostStatus.PENDING:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Post is already {post.status.value}"
                )

            # Update post status
            post.status = CreatorPostStatus.APPROVED
            post.action_date = datetime.now()
            post.action_by = admin_id
            post.action_comments = comments

            db.commit()

            return {
                "message": "Post request approved successfully",
                "postId": post_id
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
                detail="Database error occurred while approving post"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while approving post"
            )

    @staticmethod
    def reject_post_request(
        db: Session,
        admin_id: str,
        post_id: int,
        comments: Optional[str] = None
    ) -> dict:
        """
        Reject a creator post request.
        
        Args:
            db: Database session
            admin_id: Admin ID from request state
            post_id: Creator post ID
            comments: Optional rejection comments
            
        Returns:
            Dictionary with success message
        """
        try:
            # Get post
            post = db.query(CreatorPost).filter(CreatorPost.id == post_id).first()

            if not post:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Post request not found"
                )

            if post.status != CreatorPostStatus.PENDING:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Post is already {post.status.value}"
                )

            # Update post status
            post.status = CreatorPostStatus.REJECTED
            post.action_date = datetime.now()
            post.action_by = admin_id
            post.action_comments = comments

            db.commit()

            return {
                "message": "Post request rejected successfully",
                "postId": post_id
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
                detail="Database error occurred while rejecting post"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while rejecting post"
            )
