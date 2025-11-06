from sqlalchemy import Column, Integer, String, CHAR
from sqlalchemy.orm import relationship

from .base import Base


class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    code = Column(CHAR(2), unique=True, index=True, nullable=True)
    phone_code = Column(CHAR(5), nullable=True)

    # relationships
    cities = relationship("City", back_populates="country", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Country(id={self.id!r}, code={self.code!r}, name={self.name!r})>"
