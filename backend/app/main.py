from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models.complaint import Complaint
from app.models.transaction import Transaction
from app.models.alert import Alert
from app.routers.complaints import router as complaints_router
from app.routers.transaction import router as transaction_router
from app.routers.prediction import router as prediction_router
from app.routers.hotspot import router as hotspot_router
from app.routers.withdrawal import router as withdrawal_router
from app.routers.alerts import router as alerts_router



Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="CyberPehra API",
    description="AI-Powered Predictive Cybercrime Intelligence System",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(complaints_router)
app.include_router(transaction_router)
app.include_router(prediction_router)
app.include_router(hotspot_router)
app.include_router(withdrawal_router)
app.include_router(alerts_router)

@app.get("/")
def root():
    return {
        "message": "CyberPehra Backend is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }