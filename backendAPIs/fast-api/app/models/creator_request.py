import enum
from uuid import uuid4
from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from .base import Base


class CreatorRequestStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    DEACTIVE = "DEACTIVE"


class CreatorRequest(Base):
    __tablename__ = "creator_requests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    about_self = Column(Text, nullable=False)
    experience = Column(Text, nullable=False)
    links = Column(JSON, nullable=True)
    requested_date = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    action_date = Column(DateTime(timezone=True), nullable=True)
    action_by = Column(String(36), ForeignKey("Admin.id", ondelete="SET NULL"), nullable=True)
    action_comments = Column(Text, nullable=True)
    status = Column(Enum(CreatorRequestStatus), nullable=False, default=CreatorRequestStatus.PENDING)

    user = relationship("User", back_populates="creator_requests")

    def __repr__(self) -> str:
        return f"<CreatorRequest(id={self.id!r}, user_id={self.user_id!r}, status={self.status!r})>"
