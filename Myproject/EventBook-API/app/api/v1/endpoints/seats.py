from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from app.db.database import get_db
from app.schemas.schemas import Seat, SeatCreate, SeatBulkCreate
from app.models.models import Seat as SeatModel, Event as EventModel, User
from app.core.security import get_current_organizer

router = APIRouter()


@router.post("/", response_model=Seat, status_code=status.HTTP_201_CREATED)
def create_seat(
    seat: SeatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_organizer)
):
    """Create a single seat"""
    # Verify event exists and belongs to organizer
    event = db.query(EventModel).filter(EventModel.id == seat.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_seat = SeatModel(**seat.dict())
    db.add(db_seat)
    
    # Update total seats count
    event.total_seats += 1
    event.available_seats += 1
    
    db.commit()
    db.refresh(db_seat)
    return db_seat


@router.post("/bulk", status_code=status.HTTP_201_CREATED)
def create_seats_bulk(
    bulk_data: SeatBulkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_organizer)
):
    """Create multiple seats at once"""
    # Verify event exists and belongs to organizer
    event = db.query(EventModel).filter(EventModel.id == bulk_data.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    seats_created = 0
    for seat_data in bulk_data.seats:
        db_seat = SeatModel(
            event_id=bulk_data.event_id,
            **seat_data
        )
        db.add(db_seat)
        seats_created += 1
    
    # Update event seat counts
    event.total_seats += seats_created
    event.available_seats += seats_created
    
    db.commit()
    return {"message": f"Created {seats_created} seats", "total_seats": event.total_seats}


@router.get("/event/{event_id}", response_model=List[Seat])
def get_event_seats(
    event_id: int,
    tier: str = None,
    available_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get all seats for an event"""
    query = db.query(SeatModel).filter(SeatModel.event_id == event_id)
    
    if tier:
        query = query.filter(SeatModel.tier == tier)
    if available_only:
        query = query.filter(SeatModel.is_available == True)
    
    seats = query.order_by(SeatModel.row_number, SeatModel.seat_number).all()
    return seats


@router.get("/{seat_id}", response_model=Seat)
def get_seat(seat_id: int, db: Session = Depends(get_db)):
    """Get seat by ID"""
    seat = db.query(SeatModel).filter(SeatModel.id == seat_id).first()
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found")
    return seat


@router.post("/{seat_id}/reserve")
def reserve_seat(seat_id: int, db: Session = Depends(get_db)):
    """Reserve a seat for 10 minutes"""
    seat = db.query(SeatModel).filter(SeatModel.id == seat_id).first()
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found")
    
    if not seat.is_available:
        raise HTTPException(status_code=400, detail="Seat not available")
    
    if seat.is_reserved and seat.reserved_until > datetime.utcnow():
        raise HTTPException(status_code=400, detail="Seat already reserved")
    
    # Reserve for 10 minutes
    seat.is_reserved = True
    seat.reserved_until = datetime.utcnow() + timedelta(minutes=10)
    
    db.commit()
    db.refresh(seat)
    return {"message": "Seat reserved", "reserved_until": seat.reserved_until}


@router.post("/{seat_id}/release")
def release_seat(seat_id: int, db: Session = Depends(get_db)):
    """Release a reserved seat"""
    seat = db.query(SeatModel).filter(SeatModel.id == seat_id).first()
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found")
    
    seat.is_reserved = False
    seat.reserved_until = None
    
    db.commit()
    return {"message": "Seat released"}


@router.delete("/{seat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_seat(
    seat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_organizer)
):
    """Delete a seat"""
    seat = db.query(SeatModel).filter(SeatModel.id == seat_id).first()
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found")
    
    # Verify event belongs to organizer
    event = db.query(EventModel).filter(EventModel.id == seat.event_id).first()
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Update event seat counts
    event.total_seats -= 1
    if seat.is_available:
        event.available_seats -= 1
    
    db.delete(seat)
    db.commit()
    return None
