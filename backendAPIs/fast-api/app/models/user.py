import enum
from uuid import uuid4

from sqlalchemy import (
    Column,
    String,
    Integer,
    Text,
    Boolean,
    ForeignKey,
    DateTime,
    Index,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from .base import Base


class GenderEnum(enum.Enum):
    Male = "Male"
    Female = "Female"
    Other = "Other"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    profile_pic = Column(String(1024), nullable=True)
    name = Column(String(200), nullable=True)
    email = Column(String(320), nullable=False, index=True)
    phone_no = Column(String(32), nullable=True)
    country_id = Column(Integer, ForeignKey("countries.id", ondelete="SET NULL"), nullable=True, index=True)
    city_id = Column(Integer, ForeignKey("cities.id", ondelete="SET NULL"), nullable=True, index=True)
    gender = Column(String(16), nullable=True)
    language = Column(String(32), nullable=True)
    age = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    weight = Column(Integer, nullable=True)
    calories_target = Column(Integer, nullable=True)
    about_me = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    is_creator = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # relationships
    country = relationship("Country", lazy="joined")
    city = relationship("City", lazy="joined")
    auth_identities = relationship("UserAuthIdentity", back_populates="user", cascade="all, delete-orphan")
    creator_requests = relationship("CreatorRequest", back_populates="user", cascade="all, delete-orphan")
    creator_posts = relationship("CreatorPost", back_populates="user", cascade="all, delete-orphan")
    meal_plans = relationship("MealPlanner", back_populates="user", cascade="all, delete-orphan")
    sent_messages = relationship("UserMessage", back_populates="sender", foreign_keys="UserMessage.sender_id", cascade="all, delete-orphan")
    received_messages = relationship("UserMessage", back_populates="receiver", foreign_keys="UserMessage.recevier_id", cascade="all, delete-orphan")
    following = relationship("Follow", back_populates="follower", foreign_keys="Follow.following_user_id", cascade="all, delete-orphan")
    followers = relationship("Follow", back_populates="followed", foreign_keys="Follow.followed_user_id", cascade="all, delete-orphan")
    admin_messages = relationship("AdminMessage", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:  
        return f"<User(id={self.id!r}, email={self.email!r})>"


Index("ix_users_email", User.email)
