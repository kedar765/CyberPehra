from pathlib import Path
from fastapi import APIRouter
import pandas as pd
import joblib

from app.schemas.withdrawal import (
    WithdrawalRequest,
    WithdrawalResponse
)

router = APIRouter(
    prefix="/withdrawal",
    tags=["Cash Withdrawal Prediction"]
)

MODEL_PATH = Path(__file__).resolve().parent.parent.parent / "ml" / "cybercrime_model.pkl"
model = joblib.load(MODEL_PATH)


@router.post("/", response_model=WithdrawalResponse)
def predict_withdrawal(data: WithdrawalRequest):

    input_data = pd.DataFrame([{
        "transaction_amount": data.transaction_amount,
        "transaction_hour": data.transaction_hour,
        "transaction_frequency": data.transaction_frequency,
        "previous_fraud_count": data.previous_fraud_count
    }])

    probability = model.predict_proba(input_data)[0][1]
    risk_score = round(probability * 100)

    if risk_score <= 30:
        risk_level = "Low Risk"
    elif risk_score <= 70:
        risk_level = "Medium Risk"
    else:
        risk_level = "High Risk"

    if risk_score > 70:
        hotspot_status = "High-Risk Withdrawal Location"
        recommendation = "Alert nearby banks, ATMs and law-enforcement agencies."
    elif risk_score > 30:
        hotspot_status = "Potential Risk Location"
        recommendation = "Monitor the location and transaction activity."
    else:
        hotspot_status = "Normal Location"
        recommendation = "No immediate action required."

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "latitude": data.latitude,
        "longitude": data.longitude,
        "hotspot_status": hotspot_status,
        "recommendation": recommendation
    }