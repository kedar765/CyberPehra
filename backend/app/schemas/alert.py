from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AlertCreate(BaseModel):
    risk_score: float
    risk_level: str
    latitude: float
    longitude: float
    message: str


class AlertResponse(BaseModel):
    id: int
    risk_score: float
    risk_level: str
    latitude: float
    longitude: float
    message: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True