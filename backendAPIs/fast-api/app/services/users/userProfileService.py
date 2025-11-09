"""Service layer for user profile operations."""
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError, DatabaseError
from fastapi import HTTPException, status
from passlib.context import CryptContext

from app.models.user import User
from app.models.user_auth_identity import UserAuthIdentity
from app.models.country import Country
from app.models.city import City
from app.schemas.userProfileSchema import UpdateUserProfileRequest, UpdatePasswordRequest


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserProfileService:
    """Service class for user profile operations."""

    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
        """
        Get user profile by ID with error handling.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            User object
            
        Raises:
            HTTPException: If user not found or database error
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with id {user_id} not found"
                )
            return user
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
                detail="Database error occurred while fetching user"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching user"
            )

    @staticmethod
    def update_user_profile(
        db: Session, 
        user_id: str, 
        update_data: UpdateUserProfileRequest
    ) -> User:
        """
        Update user profile details with error handling.
        
        Args:
            db: Database session
            user_id: User ID
            update_data: Profile update data
            
        Returns:
            Updated User object
            
        Raises:
            HTTPException: If user not found, validation fails, or database error
        """
        try:
            # Get user
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with id {user_id} not found"
                )

            # Get update fields
            update_fields = update_data.model_dump(exclude_unset=True)
            
            if not update_fields:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No fields to update"
                )

            # Validate country_id if provided
            if "country_id" in update_fields and update_fields["country_id"] is not None:
                country = db.query(Country).filter(
                    Country.id == update_fields["country_id"]
                ).first()
                if not country:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Country with id {update_fields['country_id']} not found"
                    )

            # Validate city_id if provided
            if "city_id" in update_fields and update_fields["city_id"] is not None:
                city = db.query(City).filter(
                    City.id == update_fields["city_id"]
                ).first()
                if not city:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"City with id {update_fields['city_id']} not found"
                    )

            # Update user fields
            for field, value in update_fields.items():
                setattr(user, field, value)

            db.commit()
            db.refresh(user)
            return user

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
                detail="Database error occurred while updating user profile"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while updating user profile"
            )

    @staticmethod
    def update_password(
        db: Session,
        user_id: str,
        password_data: UpdatePasswordRequest
    ) -> dict:
        """
        Update user password with old password verification.
        
        Args:
            db: Database session
            user_id: User ID
            password_data: Old and new password
            
        Returns:
            Success message dict
            
        Raises:
            HTTPException: If user not found, old password incorrect, or database error
        """
        try:
            # Get user
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with id {user_id} not found"
                )

            # Get user auth identity (assuming email/password provider)
            auth_identity = db.query(UserAuthIdentity).filter(
                UserAuthIdentity.user_id == user_id,
                UserAuthIdentity.password_hash.isnot(None)
            ).first()

            if not auth_identity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User does not have a password set. Cannot update password."
                )

            # Verify old password
            if not pwd_context.verify(password_data.old_password, auth_identity.password_hash):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Old password is incorrect"
                )

            # Check if new password is same as old password
            if password_data.old_password == password_data.new_password:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="New password must be different from old password"
                )

            # Hash and update new password
            auth_identity.password_hash = pwd_context.hash(password_data.new_password)
            
            db.commit()
            return {"message": "Password updated successfully"}

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
                detail="Database error occurred while updating password"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while updating password"
            )
