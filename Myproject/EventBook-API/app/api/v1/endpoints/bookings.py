from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import secrets
from app.db.database import get_db
from app.schemas.schemas import Booking, BookingCreate, BookingWithDetails, QRCodeVerification, QRCodeResponse
from app.models.models import (
    Booking as BookingModel,
    Seat as SeatModel,
    Event as EventModel,
    User,
    BookingStatus
)
from app.core.security import get_current_active_user

router = APIRouter()


def generate_booking_number():
    """Generate unique booking number"""
    return f"BK{datetime.now().strftime('%Y%m%d')}{secrets.token_hex(4).upper()}"


def generate_qr_code():
    """Generate unique QR code"""
    return secrets.token_urlsafe(32)


@router.post("/", response_model=Booking, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new booking"""
    # Verify event exists
    event = db.query(EventModel).filter(EventModel.id == booking.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Verify seat exists and is available
    seat = db.query(SeatModel).filter(SeatModel.id == booking.seat_id).first()
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found")
    
    if not seat.is_available:
        raise HTTPException(status_code=400, detail="Seat not available")
    
    # Create booking
    db_booking = BookingModel(
        user_id=current_user.id,
        event_id=booking.event_id,
        seat_id=booking.seat_id,
        booking_number=generate_booking_number(),
        qr_code=generate_qr_code(),
        total_amount=seat.price,
        status=BookingStatus.pending
    )
    
    # Mark seat as unavailable
    seat.is_available = False
    seat.is_reserved = False
    
    # Update event available seats
    event.available_seats -= 1
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.get("/", response_model=List[Booking])
def list_user_bookings(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all bookings for current user"""
    bookings = db.query(BookingModel).filter(
        BookingModel.user_id == current_user.id
    ).order_by(BookingModel.created_at.desc()).offset(skip).limit(limit).all()
    return bookings


@router.get("/{booking_id}", response_model=BookingWithDetails)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get booking by ID"""
    booking = db.query(BookingModel).filter(BookingModel.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Verify user owns this booking or is organizer
    if booking.user_id != current_user.id and current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return booking


@router.get("/number/{booking_number}", response_model=BookingWithDetails)
def get_booking_by_number(
    booking_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get booking by booking number"""
    booking = db.query(BookingModel).filter(BookingModel.booking_number == booking_number).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Verify user owns this booking or is organizer
    if booking.user_id != current_user.id and current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return booking


@router.post("/verify-qr", response_model=QRCodeResponse)
def verify_qr_code(
    qr_data: QRCodeVerification,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Verify QR code and check-in attendee"""
    # Only organizers can verify QR codes
    if current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="Only organizers can verify QR codes")
    
    booking = db.query(BookingModel).filter(BookingModel.qr_code == qr_data.qr_code).first()
    
    if not booking:
        return QRCodeResponse(valid=False, message="Invalid QR code")
    
    if booking.status == BookingStatus.cancelled:
        return QRCodeResponse(valid=False, booking=booking, message="Booking cancelled")
    
    if booking.checked_in_at:
        return QRCodeResponse(
            valid=True,
            booking=booking,
            message=f"Already checked in at {booking.checked_in_at}"
        )
    
    # Check in the attendee
    booking.status = BookingStatus.attended
    booking.checked_in_at = datetime.utcnow()
    db.commit()
    db.refresh(booking)
    
    return QRCodeResponse(valid=True, booking=booking, message="Check-in successful")


@router.put("/{booking_id}/cancel", response_model=Booking)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Cancel a booking"""
    booking = db.query(BookingModel).filter(BookingModel.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Verify user owns this booking
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if booking.status == BookingStatus.cancelled:
        raise HTTPException(status_code=400, detail="Booking already cancelled")
    
    if booking.status == BookingStatus.attended:
        raise HTTPException(status_code=400, detail="Cannot cancel attended booking")
    
    # Cancel booking
    booking.status = BookingStatus.cancelled
    
    # Make seat available again
    seat = db.query(SeatModel).filter(SeatModel.id == booking.seat_id).first()
    seat.is_available = True
    
    # Update event available seats
    event = db.query(EventModel).filter(EventModel.id == booking.event_id).first()
    event.available_seats += 1
    
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/event/{event_id}/bookings", response_model=List[BookingWithDetails])
def get_event_bookings(
    event_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all bookings for an event (organizer only)"""
    # Verify event belongs to organizer
    event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.organizer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    bookings = db.query(BookingModel).filter(
        BookingModel.event_id == event_id
    ).order_by(BookingModel.created_at.desc()).offset(skip).limit(limit).all()
    return bookings
