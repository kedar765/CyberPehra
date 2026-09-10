from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TransactionCreate(BaseModel):
    transaction_id: str
    complaint_id: int
    amount: float
    transaction_type: Optional[str] = None
    transaction_time: Optional[datetime] = None
    source_account: Optional[str] = None
    destination_account: Optional[str] = None


class TransactionResponse(BaseModel):
    id: int
    transaction_id: str
    complaint_id: int
    amount: float
    transaction_type: Optional[str]
    transaction_time: datetime
    source_account: Optional[str]
    destination_account: Optional[str]

    class Config:
        from_attributes = True