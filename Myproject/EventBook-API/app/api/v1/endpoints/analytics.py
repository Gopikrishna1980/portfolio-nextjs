from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.db.database import get_db
from app.schemas.schemas import OrganizerStats, EventStats
from app.models.models import (
    Event as EventModel,
    Booking as BookingModel,
    Payment as PaymentModel,
    Seat as SeatModel,
    User,
    BookingStatus,
    PaymentStatus
)
from app.core.security import get_current_organizer

router = APIRouter()


@router.get("/organizer/dashboard", response_model=OrganizerStats)
def get_organizer_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_organizer)
):
    """Get dashboard statistics for organizer"""
    # Get all events by organizer
    events = db.query(EventModel).filter(EventModel.organizer_id == current_user.id).all()
    event_ids = [event.id for event in events]
    
    # Total events
    total_events = len(events)
    
    # Active events
    active_events = len([e for e in events if e.is_active])
    
    # Total bookings
    total_bookings = db.query(BookingModel).filter(
        BookingModel.event_id.in_(event_ids)
    ).count()
    
    # Total revenue from completed payments
    total_revenue = db.query(func.sum(PaymentModel.amount)).join(
        BookingModel
    ).filter(
        BookingModel.event_id.in_(event_ids),
        PaymentModel.status == PaymentStatus.completed
    ).scalar() or 0.0
    
    # Total attendees (confirmed + attended bookings)
    total_attendees = db.query(BookingModel).filter(
        BookingModel.event_id.in_(event_ids),
        BookingModel.status.in_([BookingStatus.confirmed, BookingStatus.attended])
    ).count()
    
    return {
        "total_events": total_events,
        "active_events": active_events,
        "total_bookings": total_bookings,
        "total_revenue": float(total_revenue),
        "total_attendees": total_attendees
    }


@router.get("/event/{event_id}/stats", response_model=EventStats)
def get_event_stats(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_organizer)
):
    """Get detailed statistics for a specific event"""
    # Verify event exists and belongs to organizer
    event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.organizer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Total seats
    total_seats = event.total_seats
    
    # Booked seats
    booked_seats = db.query(SeatModel).filter(
        SeatModel.event_id == event_id,
        SeatModel.is_available == False
    ).count()
    
    # Available seats
    available_seats = event.available_seats
    
    # Total revenue
    total_revenue = db.query(func.sum(PaymentModel.amount)).join(
        BookingModel
    ).filter(
        BookingModel.event_id == event_id,
        PaymentModel.status == PaymentStatus.completed
    ).scalar() or 0.0
    
    # Bookings by tier
    bookings_by_tier = {}
    tiers = db.query(SeatModel.tier, func.count(SeatModel.id)).join(
        BookingModel
    ).filter(
        SeatModel.event_id == event_id,
        SeatModel.is_available == False
    ).group_by(SeatModel.tier).all()
    
    for tier, count in tiers:
        bookings_by_tier[tier.value] = count
    
    # Recent bookings (last 10)
    recent_bookings = db.query(BookingModel).filter(
        BookingModel.event_id == event_id
    ).order_by(BookingModel.created_at.desc()).limit(10).all()
    
    return {
        "event_id": event_id,
        "total_seats": total_seats,
        "booked_seats": booked_seats,
        "available_seats": available_seats,
        "total_revenue": float(total_revenue),
        "bookings_by_tier": bookings_by_tier,
        "recent_bookings": recent_bookings
    }


@router.get("/event/{event_id}/revenue")
def get_event_revenue(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_organizer)
):
    """Get revenue breakdown for an event"""
    # Verify event exists and belongs to organizer
    event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.organizer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Revenue by tier
    revenue_by_tier = {}
    tiers_revenue = db.query(
        SeatModel.tier,
        func.sum(PaymentModel.amount)
    ).join(BookingModel).join(PaymentModel).filter(
        SeatModel.event_id == event_id,
        PaymentModel.status == PaymentStatus.completed
    ).group_by(SeatModel.tier).all()
    
    for tier, revenue in tiers_revenue:
        revenue_by_tier[tier.value] = float(revenue or 0)
    
    # Total revenue
    total_revenue = sum(revenue_by_tier.values())
    
    # Completed payments count
    completed_payments = db.query(PaymentModel).join(BookingModel).filter(
        BookingModel.event_id == event_id,
        PaymentModel.status == PaymentStatus.completed
    ).count()
    
    return {
        "event_id": event_id,
        "total_revenue": total_revenue,
        "revenue_by_tier": revenue_by_tier,
        "completed_payments": completed_payments
    }
