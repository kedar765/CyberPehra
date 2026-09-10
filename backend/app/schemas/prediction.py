from pydantic import BaseModel


class PredictionRequest(BaseModel):
    transaction_amount: float
    transaction_hour: int
    transaction_frequency: int
    previous_fraud_count: int
    latitude: float
    longitude: float


class PredictionResponse(BaseModel):
    risk: int
    risk_label: str