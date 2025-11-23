"""Service layer for authentication operations."""
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import uuid4
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError, DatabaseError, IntegrityError
from fastapi import HTTPException, status
import bcrypt

from app.models.user import User
from app.models.admin import Admin
from app.models.user_auth_identity import UserAuthIdentity
from app.models.auth_provider import AuthProvider
from app.utils.jwt_utils import (
    create_access_token,
    create_refresh_token,
    decode_token,
    update_user_tokens
)


class AuthService:
    """Service class for authentication operations."""

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt."""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )

    @staticmethod
    def sign_up(
        db: Session,
        email: str,
        password: str,
        name: Optional[str] = None,
        phone_no: Optional[str] = None
    ) -> dict:
        """
        Register a new user.
        
        Args:
            db: Database session
            email: User email
            password: User password
            name: User name (optional)
            phone_no: User phone number (optional)
            
        Returns:
            Dictionary with user data and tokens
        """
        try:
            # Check if user already exists
            existing_identity = db.query(UserAuthIdentity).filter(
                UserAuthIdentity.email == email
            ).first()

            if existing_identity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )

            # Get or create email/password provider
            provider = db.query(AuthProvider).filter(
                AuthProvider.provider_name == "email"
            ).first()

            if not provider:
                provider = AuthProvider(
                    provider_name="email",
                    provider_type="credentials"
                )
                db.add(provider)
                db.flush()

            # Create user
            user = User(
                id=str(uuid4()),
                email=email,
                name=name,
                phone_no=phone_no,
                is_active=True,
                is_creator=False
            )
            db.add(user)
            db.flush()

            # Hash password
            password_hash = AuthService.hash_password(password)

            # Create auth identity
            access_token_expires = datetime.now(timezone.utc) + timedelta(minutes=30)
            access_token = create_access_token(
                user_id=user.id,
                email=email,
                provider_id=provider.id,
                is_admin=False
            )
            refresh_token = create_refresh_token(
                user_id=user.id,
                email=email
            )

            auth_identity = UserAuthIdentity(
                id=str(uuid4()),
                user_id=user.id,
                provider_id=provider.id,
                email=email,
                phone_no=phone_no,
                password_hash=password_hash,
                access_token=access_token,
                refresh_token=refresh_token,
                token_expires_at=access_token_expires
            )
            db.add(auth_identity)
            db.commit()
            db.refresh(user)

            return {
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "phone_no": user.phone_no,
                    "is_creator": user.is_creator,
                    "is_active": user.is_active
                },
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer"
            }

        except HTTPException:
            raise
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user due to data integrity issue"
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
                detail="Database error occurred during sign up"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred during sign up"
            )

    @staticmethod
    def sign_in(db: Session, email: str, password: str) -> dict:
        """
        Authenticate a user.
        
        Args:
            db: Database session
            email: User email
            password: User password
            
        Returns:
            Dictionary with user data and tokens
        """
        try:
            # Find auth identity
            auth_identity = db.query(UserAuthIdentity).filter(
                UserAuthIdentity.email == email
            ).first()

            if not auth_identity or not auth_identity.password_hash:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )

            # Verify password
            if not AuthService.verify_password(password, auth_identity.password_hash):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )

            # Get user
            user = db.query(User).filter(User.id == auth_identity.user_id).first()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Account is deactivated"
                )

            # Generate new tokens
            access_token_expires = datetime.now(timezone.utc) + timedelta(minutes=30)
            access_token = create_access_token(
                user_id=user.id,
                email=email,
                provider_id=auth_identity.provider_id,
                is_admin=False
            )
            refresh_token = create_refresh_token(
                user_id=user.id,
                email=email
            )

            # Update tokens in database
            auth_identity.access_token = access_token
            auth_identity.refresh_token = refresh_token
            auth_identity.token_expires_at = access_token_expires
            db.commit()

            return {
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "phone_no": user.phone_no,
                    "profile_pic": user.profile_pic,
                    "is_creator": user.is_creator,
                    "is_active": user.is_active
                },
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer"
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
                detail="Database error occurred during sign in"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred during sign in"
            )

    @staticmethod
    def admin_sign_in(db: Session, email: str, password: str) -> dict:
        """
        Authenticate an admin.
        
        Args:
            db: Database session
            email: Admin email
            password: Admin password
            
        Returns:
            Dictionary with admin data and tokens
        """
        try:
            # Find admin
            admin = db.query(Admin).filter(Admin.email == email).first()

            if not admin or not admin.password_hash:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )

            # Verify password
            if not AuthService.verify_password(password, admin.password_hash):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )

            if not admin.is_active:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Account is deactivated"
                )

            # Get or create admin provider
            provider = db.query(AuthProvider).filter(
                AuthProvider.provider_name == "admin"
            ).first()

            if not provider:
                provider = AuthProvider(
                    provider_name="admin",
                    provider_type="credentials"
                )
                db.add(provider)
                db.flush()

            # Generate tokens
            access_token_expires = datetime.now(timezone.utc) + timedelta(hours=8)
            access_token = create_access_token(
                user_id=admin.id,
                email=email,
                provider_id=provider.id,
                is_admin=True,
                expires_delta=timedelta(hours=8)
            )
            refresh_token = create_refresh_token(
                user_id=admin.id,
                email=email
            )

            return {
                "admin": {
                    "id": admin.id,
                    "email": admin.email,
                    "name": admin.name,
                    "is_active": admin.is_active
                },
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer"
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
                detail="Database error occurred during admin sign in"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred during admin sign in"
            )

    @staticmethod
    def refresh_access_token(db: Session, refresh_token: str) -> dict:
        """
        Refresh access token using refresh token.
        
        Args:
            db: Database session
            refresh_token: Refresh token
            
        Returns:
            Dictionary with new access token
        """
        try:
            # Decode refresh token
            payload = decode_token(refresh_token)

            if not payload or payload.get("type") != "refresh":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid refresh token"
                )

            user_id = payload.get("sub")
            email = payload.get("email")

            # Find auth identity
            auth_identity = db.query(UserAuthIdentity).filter(
                UserAuthIdentity.user_id == user_id,
                UserAuthIdentity.refresh_token == refresh_token
            ).first()

            if not auth_identity:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid refresh token"
                )

            # Get user
            user = db.query(User).filter(User.id == user_id).first()

            if not user or not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found or inactive"
                )

            # Generate new access token
            access_token_expires = datetime.now(timezone.utc) + timedelta(minutes=30)
            access_token = create_access_token(
                user_id=user.id,
                email=email,
                provider_id=auth_identity.provider_id,
                is_admin=False
            )

            # Update token in database
            auth_identity.access_token = access_token
            auth_identity.token_expires_at = access_token_expires
            db.commit()

            return {
                "access_token": access_token,
                "token_type": "bearer"
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
                detail="Database error occurred during token refresh"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred during token refresh"
            )

    @staticmethod
    def logout(db: Session, user_id: str, provider_id: int) -> dict:
        """
        Logout user by invalidating tokens.
        
        Args:
            db: Database session
            user_id: User ID
            provider_id: Provider ID
            
        Returns:
            Dictionary with success message
        """
        try:
            # Find and clear tokens
            auth_identity = db.query(UserAuthIdentity).filter(
                UserAuthIdentity.user_id == user_id,
                UserAuthIdentity.provider_id == provider_id
            ).first()

            if auth_identity:
                auth_identity.access_token = None
                auth_identity.refresh_token = None
                auth_identity.token_expires_at = None
                db.commit()

            return {
                "message": "Logged out successfully"
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
                detail="Database error occurred during logout"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred during logout"
            )

    @staticmethod
    def get_current_user(db: Session, user_id: str) -> dict:
        """
        Get current user information.
        
        Args:
            db: Database session
            user_id: User ID from token
            
        Returns:
            Dictionary with user data
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            return {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "phone_no": user.phone_no,
                "profile_pic": user.profile_pic,
                "country_id": user.country_id,
                "city_id": user.city_id,
                "gender": user.gender,
                "language": user.language,
                "age": user.age,
                "height": user.height,
                "weight": user.weight,
                "calories_target": user.calories_target,
                "about_me": user.about_me,
                "is_creator": user.is_creator,
                "is_active": user.is_active
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
                detail="Database error occurred while fetching user"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while fetching user"
            )
