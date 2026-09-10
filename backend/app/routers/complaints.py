from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate, ComplaintResponse


router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)


@router.post("/", response_model=ComplaintResponse)
def create_complaint(
    complaint: ComplaintCreate,
    db: Session = Depends(get_db)
):
    new_complaint = Complaint(
        crime_type=complaint.crime_type,
        fraud_amount=complaint.fraud_amount,
        location=complaint.location,
        latitude=complaint.latitude,
        longitude=complaint.longitude
    )

    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    return new_complaint


@router.get("/", response_model=list[ComplaintResponse])
def get_complaints(
    db: Session = Depends(get_db)
):
    complaints = db.query(Complaint).all()

    return complaints