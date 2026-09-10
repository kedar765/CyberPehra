from pydantic import BaseModel


class WithdrawalRequest(BaseModel):
    transaction_amount: float
    transaction_hour: int
    transaction_frequency: int
    previous_fraud_count: int
    latitude: float
    longitude: float


class WithdrawalResponse(BaseModel):
    risk_score: int
    risk_level: str
    latitude: float
    longitude: float
    hotspot_status: str
    recommendation: str