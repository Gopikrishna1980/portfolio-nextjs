from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.schemas import Review, ReviewCreate, ReviewWithUser
from app.models.models import (
    Review as ReviewModel,
    Booking as BookingModel,
    Event as EventModel,
    User,
    BookingStatus
)
from app.core.security import get_current_active_user

router = APIRouter()


@router.post("/", response_model=Review, status_code=status.HTTP_201_CREATED)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a review for an event (only if user attended)"""
    # Verify event exists
    event = db.query(EventModel).filter(EventModel.id == review.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if user has attended this event
    booking = db.query(BookingModel).filter(
        BookingModel.user_id == current_user.id,
        BookingModel.event_id == review.event_id,
        BookingModel.status == BookingStatus.attended
    ).first()
    
    if not booking:
        raise HTTPException(
            status_code=400,
            detail="You can only review events you have attended"
        )
    
    # Check if user already reviewed this event
    existing_review = db.query(ReviewModel).filter(
        ReviewModel.user_id == current_user.id,
        ReviewModel.event_id == review.event_id
    ).first()
    
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this event")
    
    # Create review
    db_review = ReviewModel(
        **review.dict(),
        user_id=current_user.id
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


@router.get("/event/{event_id}", response_model=List[ReviewWithUser])
def get_event_reviews(
    event_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get all reviews for an event"""
    reviews = db.query(ReviewModel).filter(
        ReviewModel.event_id == event_id
    ).order_by(ReviewModel.created_at.desc()).offset(skip).limit(limit).all()
    return reviews


@router.get("/{review_id}", response_model=ReviewWithUser)
def get_review(review_id: int, db: Session = Depends(get_db)):
    """Get review by ID"""
    review = db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.put("/{review_id}", response_model=Review)
def update_review(
    review_id: int,
    rating: int,
    comment: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a review (only by review author)"""
    review = db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Verify user owns this review
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    review.rating = rating
    if comment:
        review.comment = comment
    
    db.commit()
    db.refresh(review)
    return review


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a review (only by review author)"""
    review = db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Verify user owns this review
    if review.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(review)
    db.commit()
    return None


@router.get("/user/my-reviews", response_model=List[Review])
def get_user_reviews(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all reviews by current user"""
    reviews = db.query(ReviewModel).filter(
        ReviewModel.user_id == current_user.id
    ).order_by(ReviewModel.created_at.desc()).offset(skip).limit(limit).all()
    return reviews
