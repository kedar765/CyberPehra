from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import pandas as pd
import joblib

from app.database import get_db
from app.models.alert import Alert

from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse
)


router = APIRouter(
    prefix="/predict",
    tags=["Prediction"]
)


model = joblib.load("ml/cybercrime_model.pkl")


@router.post("/", response_model=PredictionResponse)
def predict_risk(
    data: PredictionRequest,
    db: Session = Depends(get_db)
):

    # Data for ML model
    input_data = pd.DataFrame([{
        "transaction_amount": data.transaction_amount,
        "transaction_hour": data.transaction_hour,
        "transaction_frequency": data.transaction_frequency,
        "previous_fraud_count": data.previous_fraud_count
    }])

    # ML prediction probability
    probability = model.predict_proba(input_data)[0][1]

    # Convert probability to 0-100 risk score
    risk_score = round(probability * 100)

    # Risk level
    if risk_score <= 30:
        risk_label = "Low Risk"

    elif risk_score <= 70:
        risk_label = "Medium Risk"

    else:
        risk_label = "High Risk"

    # 🚨 Automatic Alert for High Risk
    if risk_score > 70:

        alert = Alert(
            risk_score=risk_score,
            risk_level=risk_label,
            latitude=data.latitude,
            longitude=data.longitude,
            message="Alert nearby banks, ATMs and law-enforcement agencies.",
            status="active"
        )

        db.add(alert)
        db.commit()

    return {
        "risk": risk_score,
        "risk_label": risk_label
    }