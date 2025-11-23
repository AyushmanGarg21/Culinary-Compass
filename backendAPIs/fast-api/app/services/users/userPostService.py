"""Service layer for user post and social operations."""
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import OperationalError, DatabaseError, IntegrityError
from sqlalchemy import and_, or_, func
from fastapi import HTTPException, status

from app.models.creator_post import CreatorPost, CreatorPostStatus
from app.models.follow import Follow
from app.models.user import User


class UserPostService:
    """Service class for user post and social operations."""

    @staticmethod
    def get_user_feed(
        db: Session,
        user_id: str,
        skip: int = 0,
        limit: int = 10
    ) -> dict:
        """
        Get feed of approved posts from followed users.
        
        Args:
            db: Database session
            user_id: User ID from request state
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            Dictionary with posts list and pagination info
        """
        try:
            # Get posts from followed users
            posts_query = db.query(CreatorPost).join(
                Follow,
                CreatorPost.user_id == Follow.followed_user_id
            ).filter(
                and_(
                    Follow.following_user_id == user_id,
                    CreatorPost.status == CreatorPostStatus.APPROVED
                )
            ).order_by(CreatorPost.created_at.desc())

            # Get total count
            total = posts_query.count()

            # Get paginated posts with user info
            posts = posts_query.options(
                joinedload(CreatorPost.user).joinedload(User.country),
                joinedload(CreatorPost.user).joinedload(User.city)
            ).offset(skip).limit(limit).all()

            posts_data = []
            for post in posts:
                post_info = {
                    "id": post.id,
                    "user_id": post.user_id,
                    "user_name": post.user.name,
                    "user_profile_pic": post.user.profile_pic,
                    "title": post.title,
                    "overview": post.overview,
                    "cooking_time": post.cooking_time,
                    "cuisine_type": post.cuisine_type,
                    "servings": post.servings,
                    "image": post.image,
                    "ingredients": post.ingredients,
                    "instructions": post.instructions,
                    "created_at": post.created_at.isoformat() if post.created_at else None
                }
                posts_data.append(post_info)

            return {
                "posts": posts_data,
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
                detail="Database error occurred while fetching feed"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching feed"
            )

    @staticmethod
    def get_following_list(
        db: Session,
        user_id: str,
        skip: int = 0,
        limit: int = 10
    ) -> dict:
        """
        Get list of users that the current user is following.
        
        Args:
            db: Database session
            user_id: User ID from request state
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            Dictionary with following list and pagination info
        """
        try:
            # Get following relationships
            following_query = db.query(Follow).filter(
                Follow.following_user_id == user_id
            ).order_by(Follow.created_at.desc())

            # Get total count
            total = following_query.count()

            # Get paginated following with user details
            following = following_query.options(
                joinedload(Follow.followed).joinedload(User.country),
                joinedload(Follow.followed).joinedload(User.city)
            ).offset(skip).limit(limit).all()

            following_data = []
            for follow in following:
                user = follow.followed
                user_info = {
                    "user_id": user.id,
                    "name": user.name,
                    "profile_pic": user.profile_pic,
                    "about_me": user.about_me,
                    "city": user.city.name if user.city else None,
                    "country": user.country.name if user.country else None,
                    "gender": user.gender,
                    "language": user.language,
                    "is_creator": user.is_creator,
                    "followed_at": follow.created_at.isoformat() if follow.created_at else None
                }
                following_data.append(user_info)

            return {
                "following": following_data,
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
                detail="Database error occurred while fetching following list"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching following list"
            )

    @staticmethod
    def follow_user(db: Session, user_id: str, target_user_id: str) -> dict:
        """
        Follow a user.
        
        Args:
            db: Database session
            user_id: Current user ID from request state
            target_user_id: User ID to follow
            
        Returns:
            Dictionary with success message
        """
        try:
            # Check if trying to follow self
            if user_id == target_user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="You cannot follow yourself"
                )

            # Check if target user exists
            target_user = db.query(User).filter(User.id == target_user_id).first()
            if not target_user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            # Check if already following
            existing_follow = db.query(Follow).filter(
                and_(
                    Follow.following_user_id == user_id,
                    Follow.followed_user_id == target_user_id
                )
            ).first()

            if existing_follow:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="You are already following this user"
                )

            # Create follow relationship
            follow = Follow(
                following_user_id=user_id,
                followed_user_id=target_user_id
            )
            db.add(follow)
            db.commit()

            return {"message": "User followed successfully"}

        except HTTPException:
            raise
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to follow user due to data integrity issue"
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
                detail="Database error occurred while following user"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while following user"
            )

    @staticmethod
    def unfollow_user(db: Session, user_id: str, target_user_id: str) -> dict:
        """
        Unfollow a user.
        
        Args:
            db: Database session
            user_id: Current user ID from request state
            target_user_id: User ID to unfollow
            
        Returns:
            Dictionary with success message
        """
        try:
            # Find and delete follow relationship
            follow = db.query(Follow).filter(
                and_(
                    Follow.following_user_id == user_id,
                    Follow.followed_user_id == target_user_id
                )
            ).first()

            if not follow:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="You are not following this user"
                )

            db.delete(follow)
            db.commit()

            return {"message": "User unfollowed successfully"}

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
                detail="Database error occurred while unfollowing user"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while unfollowing user"
            )

    @staticmethod
    def search_creators(
        db: Session,
        search_query: Optional[str] = None,
        skip: int = 0,
        limit: int = 10
    ) -> dict:
        """
        Search for creators by name.
        
        Args:
            db: Database session
            search_query: Search term for creator name
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            Dictionary with creators list and pagination info
        """
        try:
            # Build query for creators
            creators_query = db.query(User).filter(User.is_creator == True)

            # Add search filter if provided
            if search_query:
                creators_query = creators_query.filter(
                    User.name.ilike(f"%{search_query}%")
                )

            # Get total count
            total = creators_query.count()

            # Get paginated creators with location info
            creators = creators_query.options(
                joinedload(User.country),
                joinedload(User.city)
            ).offset(skip).limit(limit).all()

            creators_data = []
            for creator in creators:
                creator_info = {
                    "user_id": creator.id,
                    "name": creator.name,
                    "profile_pic": creator.profile_pic,
                    "about_me": creator.about_me,
                    "city": creator.city.name if creator.city else None,
                    "country": creator.country.name if creator.country else None,
                    "gender": creator.gender,
                    "language": creator.language
                }
                creators_data.append(creator_info)

            return {
                "creators": creators_data,
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
                detail="Database error occurred while searching creators"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while searching creators"
            )

    @staticmethod
    def get_creator_details(db: Session, creator_id: str) -> dict:
        """
        Get detailed information about a creator.
        
        Args:
            db: Database session
            creator_id: Creator user ID
            
        Returns:
            Dictionary with creator details
        """
        try:
            # Get creator with location info
            creator = db.query(User).options(
                joinedload(User.country),
                joinedload(User.city)
            ).filter(
                and_(
                    User.id == creator_id,
                    User.is_creator == True
                )
            ).first()

            if not creator:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Creator not found"
                )

            # Get follower count
            follower_count = db.query(func.count(Follow.following_user_id)).filter(
                Follow.followed_user_id == creator_id
            ).scalar()

            # Get post count
            post_count = db.query(func.count(CreatorPost.id)).filter(
                and_(
                    CreatorPost.user_id == creator_id,
                    CreatorPost.status == CreatorPostStatus.APPROVED
                )
            ).scalar()

            location = None
            if creator.city and creator.country:
                location = f"{creator.city.name}, {creator.country.name}"
            elif creator.country:
                location = creator.country.name

            return {
                "user_id": creator.id,
                "name": creator.name,
                "profile_pic": creator.profile_pic,
                "about_me": creator.about_me,
                "location": location,
                "gender": creator.gender,
                "language": creator.language,
                "follower_count": follower_count or 0,
                "post_count": post_count or 0
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
                detail="Database error occurred while fetching creator details"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching creator details"
            )
