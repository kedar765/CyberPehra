from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from app.database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    crime_type = Column(String, nullable=False)

    fraud_amount = Column(Float, nullable=True)

    location = Column(String, nullable=True)

    latitude = Column(Float, nullable=True)

    longitude = Column(Float, nullable=True)

    complaint_time = Column(
        DateTime,
        default=datetime.utcnow
    )

    status = Column(
        String,
        default="pending"
    )