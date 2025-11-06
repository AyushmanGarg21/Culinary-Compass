from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from .base import Base


class AuthProvider(Base):
    __tablename__ = "auth_providers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    provider_name = Column(String(200), nullable=False)
    provider_type = Column(String(100), nullable=True)
    config = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # backref: UserAuthIdentity.provider
    identities = relationship("UserAuthIdentity", back_populates="provider", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<AuthProvider(id={self.id!r}, provider_name={self.provider_name!r})>"
