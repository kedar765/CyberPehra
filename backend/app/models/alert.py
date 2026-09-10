from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    risk_score = Column(Float, nullable=False)

    risk_level = Column(String, nullable=False)

    latitude = Column(Float, nullable=False)

    longitude = Column(Float, nullable=False)

    message = Column(String, nullable=False)

    status = Column(String, default="active")

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )