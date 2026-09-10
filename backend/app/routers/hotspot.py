from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.complaint import Complaint

router = APIRouter(
    prefix="/hotspot",
    tags=["Hotspot Prediction"]
)


@router.get("/")
def get_hotspots(db: Session = Depends(get_db)):

    hotspots = (
        db.query(
            Complaint.latitude,
            Complaint.longitude,
            func.count(Complaint.id).label("incident_count")
        )
        .filter(
            Complaint.latitude.isnot(None),
            Complaint.longitude.isnot(None)
        )
        .group_by(
            Complaint.latitude,
            Complaint.longitude
        )
        .all()
    )

    result = []

    for hotspot in hotspots:

        incident_count = hotspot.incident_count

        if incident_count >= 10:
            risk_level = "High Risk"
        elif incident_count >= 5:
            risk_level = "Medium Risk"
        else:
            risk_level = "Low Risk"

        result.append({
            "latitude": hotspot.latitude,
            "longitude": hotspot.longitude,
            "incident_count": incident_count,
            "risk_level": risk_level
        })

    # Sort highest-risk locations first
    result.sort(
        key=lambda x: x["incident_count"],
        reverse=True
    )

    return {
        "total_hotspots": len(result),
        "hotspots": result
    }