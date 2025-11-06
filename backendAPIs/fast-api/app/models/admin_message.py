import enum
from sqlalchemy import Column, BigInteger, String, Text, Boolean, ForeignKey, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from .base import Base


class AdminMessageSender(enum.Enum):
    User = "User"
    Admin = "Admin"


class AdminMessage(Base):
    __tablename__ = "admin_messages"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    admin_id = Column(String(36), ForeignKey("Admin.id", ondelete="CASCADE"), nullable=True, index=True)
    sender = Column(Enum(AdminMessageSender), nullable=False)
    content = Column(Text, nullable=True)
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="admin_messages")
    admin = relationship("Admin")

    def __repr__(self) -> str: 
        return f"<AdminMessage(id={self.id!r}, sender={self.sender!r})>"