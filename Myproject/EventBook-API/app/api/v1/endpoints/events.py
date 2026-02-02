from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.db.database import get_db
from app.schemas.schemas import Event, EventCreate, EventUpdate, EventWithDetails
from app.models.models import Event as EventModel, User
from app.core.security import get_current_active_user, get_current_organizer

router = APIRouter()


@router.post("/", response_model=Event, status_code=status.HTTP_201_CREATED)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_organizer)
):
    """Create a new event (organizer only)"""
    db_event = EventModel(
        **event.dict(),
        organizer_id=current_user.id,
        available_seats=event.total_seats
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@router.get("/", response_model=List[Event])
def list_events(
    skip: int = 0,
    limit: int = 50,
    category_id: Optional[int] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    start_date: Optional[datetime] = None,
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    """List events with filtering"""
    query = db.query(EventModel)
    
    if is_active is not None:
        query = query.filter(EventModel.is_active == is_active)
    if category_id:
        query = query.filter(EventModel.category_id == category_id)
    if location:
        query = query.filter(EventModel.location.ilike(f"%{location}%"))
    if search:
        query = query.filter(EventModel.title.ilike(f"%{search}%"))
    if start_date:
        query = query.filter(EventModel.start_date >= start_date)
    
    events = query.order_by(EventModel.start_date).offset(skip).limit(limit).all()
    return events


@router.get("/{event_id}", response_model=EventWithDetails)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get event by ID with details"""
    event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.put("/{event_id}", response_model=Event)
def update_event(
    event_id: int,
    event_update: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_organizer)
):
    """Update event (organizer only - own events)"""
    event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if user is the organizer of this event
    if event.organizer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this event")
    
    for key, value in event_update.dict(exclude_unset=True).items():
        setattr(event, key, value)
    
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_organizer)
):
    """Delete event (organizer only - own events)"""
    event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if user is the organizer of this event
    if event.organizer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this event")
    
    db.delete(event)
    db.commit()
    return None


@router.get("/organizer/my-events", response_model=List[Event])
def get_organizer_events(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_organizer)
):
    """Get all events created by current organizer"""
    events = db.query(EventModel).filter(
        EventModel.organizer_id == current_user.id
    ).order_by(EventModel.created_at.desc()).offset(skip).limit(limit).all()
    return events
