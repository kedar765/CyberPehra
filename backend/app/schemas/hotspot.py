from pydantic import BaseModel


class HotspotRequest(BaseModel):
    latitude: float
    longitude: float
    incident_count: int


class HotspotResponse(BaseModel):
    latitude: float
    longitude: float
    incident_count: int
    risk_level: str