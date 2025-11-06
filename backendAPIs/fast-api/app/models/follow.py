from sqlalchemy import Column, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from .base import Base


class Follow(Base):
    __tablename__ = "follows"

    following_user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    followed_user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    follower = relationship("User", back_populates="following", foreign_keys=[following_user_id])
    followed = relationship("User", back_populates="followers", foreign_keys=[followed_user_id])

    __table_args__ = (
        UniqueConstraint("following_user_id", "followed_user_id", name="uix_user_follows"),
    )

    def __repr__(self) -> str:  
        return f"<Follow(follower={self.following_user_id!r}, followed={self.followed_user_id!r})>"