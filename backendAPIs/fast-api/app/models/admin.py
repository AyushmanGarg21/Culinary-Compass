from uuid import uuid4
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.sql import func

from .base import Base


class Admin(Base):
    __tablename__ = "Admin"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name = Column(String(200), nullable=True)
    email = Column(String(320), nullable=False, index=True)
    password = Column(String(512), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    def __repr__(self) -> str:
        return f"<Admin(id={self.id!r}, email={self.email!r})>"
