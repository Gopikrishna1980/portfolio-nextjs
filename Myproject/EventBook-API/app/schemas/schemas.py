from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class UserRole(str, Enum):
    user = "user"
    organizer = "organizer"
    admin = "admin"


class SeatTier(str, Enum):
    vip = "VIP"
    premium = "Premium"
    standard = "Standard"
    economy = "Economy"


class BookingStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    attended = "attended"


class PaymentStatus(str, Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"
    refunded = "refunded"


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: UserRole = UserRole.user


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Event Schemas
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: int
    venue: str
    location: str
    address: Optional[str] = None
    start_date: datetime
    end_date: datetime
    image_url: Optional[str] = None
    total_seats: int = 0


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    venue: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class Event(EventBase):
    id: int
    organizer_id: int
    available_seats: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EventWithDetails(Event):
    category: Optional[Category] = None
    organizer: Optional[User] = None


# Seat Schemas
class SeatBase(BaseModel):
    event_id: int
    seat_number: str
    row_number: str
    tier: SeatTier
    price: float


class SeatCreate(SeatBase):
    pass


class SeatBulkCreate(BaseModel):
    event_id: int
    seats: List[dict]  # List of seat configurations


class Seat(SeatBase):
    id: int
    is_available: bool
    is_reserved: bool
    reserved_until: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Booking Schemas
class BookingBase(BaseModel):
    event_id: int
    seat_id: int


class BookingCreate(BookingBase):
    pass


class Booking(BookingBase):
    id: int
    user_id: int
    booking_number: str
    qr_code: Optional[str] = None
    status: BookingStatus
    total_amount: float
    booking_date: datetime
    checked_in_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BookingWithDetails(Booking):
    event: Optional[Event] = None
    seat: Optional[Seat] = None
    user: Optional[User] = None


# Payment Schemas
class PaymentBase(BaseModel):
    booking_id: int
    amount: float
    currency: str = "usd"


class PaymentCreate(PaymentBase):
    stripe_payment_intent_id: Optional[str] = None


class Payment(PaymentBase):
    id: int
    stripe_payment_intent_id: Optional[str] = None
    status: PaymentStatus
    payment_method: Optional[str] = None
    payment_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Review Schemas
class ReviewBase(BaseModel):
    event_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    pass


class Review(ReviewBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReviewWithUser(Review):
    user: Optional[User] = None


# Analytics Schemas
class OrganizerStats(BaseModel):
    total_events: int
    active_events: int
    total_bookings: int
    total_revenue: float
    total_attendees: int


class EventStats(BaseModel):
    event_id: int
    total_seats: int
    booked_seats: int
    available_seats: int
    total_revenue: float
    bookings_by_tier: dict
    recent_bookings: List[Booking]


# QR Code Verification
class QRCodeVerification(BaseModel):
    qr_code: str


class QRCodeResponse(BaseModel):
    valid: bool
    booking: Optional[BookingWithDetails] = None
    message: str
