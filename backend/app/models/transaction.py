from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime

from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    transaction_id = Column(String, unique=True, nullable=False)

    complaint_id = Column(
        Integer,
        ForeignKey("complaints.id"),
        nullable=False
    )

    amount = Column(Float, nullable=False)

    transaction_type = Column(String, nullable=True)

    transaction_time = Column(
        DateTime,
        default=datetime.utcnow
    )

    source_account = Column(String, nullable=True)

    destination_account = Column(String, nullable=True)