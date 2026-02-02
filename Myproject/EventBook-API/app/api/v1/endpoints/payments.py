from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.database import get_db
from app.schemas.schemas import Payment, PaymentCreate
from app.models.models import (
    Payment as PaymentModel,
    Booking as BookingModel,
    User,
    PaymentStatus,
    BookingStatus
)
from app.core.security import get_current_active_user

router = APIRouter()


@router.post("/", response_model=Payment, status_code=status.HTTP_201_CREATED)
def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a payment for a booking"""
    # Verify booking exists and belongs to user
    booking = db.query(BookingModel).filter(BookingModel.id == payment.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if payment already exists
    existing_payment = db.query(PaymentModel).filter(
        PaymentModel.booking_id == payment.booking_id
    ).first()
    if existing_payment:
        raise HTTPException(status_code=400, detail="Payment already exists for this booking")
    
    # Create payment
    db_payment = PaymentModel(
        **payment.dict(),
        status=PaymentStatus.pending
    )
    
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment


@router.get("/{payment_id}", response_model=Payment)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get payment by ID"""
    payment = db.query(PaymentModel).filter(PaymentModel.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Verify user owns the booking for this payment
    booking = db.query(BookingModel).filter(BookingModel.id == payment.booking_id).first()
    if booking.user_id != current_user.id and current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return payment


@router.get("/booking/{booking_id}", response_model=Payment)
def get_payment_by_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get payment for a specific booking"""
    # Verify booking exists and belongs to user
    booking = db.query(BookingModel).filter(BookingModel.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.user_id != current_user.id and current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    payment = db.query(PaymentModel).filter(PaymentModel.booking_id == booking_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    return payment


@router.put("/{payment_id}/confirm", response_model=Payment)
def confirm_payment(
    payment_id: int,
    payment_intent_id: str,
    payment_method: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Confirm a payment (update status to completed)"""
    payment = db.query(PaymentModel).filter(PaymentModel.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Verify user owns the booking
    booking = db.query(BookingModel).filter(BookingModel.id == payment.booking_id).first()
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Update payment status
    payment.status = PaymentStatus.completed
    payment.stripe_payment_intent_id = payment_intent_id
    payment.payment_method = payment_method
    payment.payment_date = datetime.utcnow()
    
    # Update booking status
    booking.status = BookingStatus.confirmed
    
    db.commit()
    db.refresh(payment)
    return payment


@router.put("/{payment_id}/fail", response_model=Payment)
def fail_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Mark payment as failed"""
    payment = db.query(PaymentModel).filter(PaymentModel.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Verify user owns the booking
    booking = db.query(BookingModel).filter(BookingModel.id == payment.booking_id).first()
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    payment.status = PaymentStatus.failed
    db.commit()
    db.refresh(payment)
    return payment


@router.get("/user/history", response_model=List[Payment])
def get_user_payment_history(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get payment history for current user"""
    # Get all bookings for user
    bookings = db.query(BookingModel).filter(BookingModel.user_id == current_user.id).all()
    booking_ids = [booking.id for booking in bookings]
    
    # Get payments for those bookings
    payments = db.query(PaymentModel).filter(
        PaymentModel.booking_id.in_(booking_ids)
    ).order_by(PaymentModel.created_at.desc()).offset(skip).limit(limit).all()
    
    return payments
