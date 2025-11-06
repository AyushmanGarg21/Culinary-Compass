import enum
from uuid import uuid4
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    JSON,
    Enum,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from .base import Base


class CreatorPostStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class CreatorPost(Base):
    __tablename__ = "creator_posts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    overview = Column(Text, nullable=False)
    cooking_time = Column(Integer, nullable=False)
    cuisine_type = Column(String(200), nullable=False)
    servings = Column(Integer, nullable=False)
    image = Column(String(1024), nullable=True)
    ingredients = Column(JSON, nullable=False)  # store ingredient list as JSON array
    instructions = Column(Text, nullable=True)
    action_date = Column(DateTime(timezone=True), nullable=True)
    action_by = Column(String(36), ForeignKey("Admin.id", ondelete="SET NULL"), nullable=True)
    action_comments = Column(Text, nullable=True)
    status = Column(Enum(CreatorPostStatus), nullable=False, default=CreatorPostStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", back_populates="creator_posts")

    def __repr__(self) -> str:
        return f"<CreatorPost(id={self.id!r}, title={self.title!r})>"
