from sqlalchemy import Column, BigInteger, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from .base import Base


class UserMessage(Base):
    __tablename__ = "user_messages"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    sender_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    recevier_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(Text, nullable=True)
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships back to User
    sender = relationship("User", back_populates="sent_messages", foreign_keys=[sender_id])
    receiver = relationship("User", back_populates="received_messages", foreign_keys=[recevier_id])

    def __repr__(self) -> str:  
        return f"<UserMessage(id={self.id!r}, sender_id={self.sender_id!r}, recevier_id={self.recevier_id!r})>"