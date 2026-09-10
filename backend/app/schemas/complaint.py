from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ComplaintCreate(BaseModel):
    crime_type: str
    fraud_amount: Optional[float] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ComplaintResponse(BaseModel):
    id: int
    crime_type: str
    fraud_amount: Optional[float]
    location: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    complaint_time: datetime
    status: str

    class Config:
        from_attributes = True