from uuid import uuid4
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from .base import Base


class UserAuthIdentity(Base):
    __tablename__ = "user_auth_identities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    provider_id = Column(Integer, ForeignKey("auth_providers.id", ondelete="CASCADE"), nullable=False, index=True)
    email = Column(String(320), nullable=True, index=True)
    phone_no = Column(String(32), nullable=True)
    password_hash = Column(String(512), nullable=True)
    access_token = Column(String(2048), nullable=True)
    refresh_token = Column(String(2048), nullable=True)
    token_expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", back_populates="auth_identities")
    provider = relationship("AuthProvider")

    def __repr__(self) -> str:  
        return f"<UserAuthIdentity(id={self.id!r}, user_id={self.user_id!r}, provider_id={self.provider_id!r})>"
