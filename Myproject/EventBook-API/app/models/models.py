from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.db.database import Base


class UserRole(str, enum.Enum):
    user = "user"
    organizer = "organizer"
    admin = "admin"


class SeatTier(str, enum.Enum):
    vip = "VIP"
    premium = "Premium"
    standard = "Standard"
    economy = "Economy"


class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    attended = "attended"


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"
    refunded = "refunded"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String)
    role = Column(SQLEnum(UserRole), default=UserRole.user, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bookings = relationship("Booking", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    organized_events = relationship("Event", back_populates="organizer")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    description = Column(Text)
    icon = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    events = relationship("Event", back_populates="category")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text)
    category_id = Column(Integer, ForeignKey("categories.id"))
    organizer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    venue = Column(String, nullable=False)
    location = Column(String, nullable=False)
    address = Column(Text)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    image_url = Column(String)
    total_seats = Column(Integer, default=0)
    available_seats = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    category = relationship("Category", back_populates="events")
    organizer = relationship("User", back_populates="organized_events")
    seats = relationship("Seat", back_populates="event", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="event")
    reviews = relationship("Review", back_populates="event")


class Seat(Base):
    __tablename__ = "seats"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    seat_number = Column(String, nullable=False)
    row_number = Column(String, nullable=False)
    tier = Column(SQLEnum(SeatTier), nullable=False)
    price = Column(Float, nullable=False)
    is_available = Column(Boolean, default=True)
    is_reserved = Column(Boolean, default=False)
    reserved_until = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    event = relationship("Event", back_populates="seats")
    booking = relationship("Booking", back_populates="seat", uselist=False)


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    seat_id = Column(Integer, ForeignKey("seats.id"), nullable=False)
    booking_number = Column(String, unique=True, nullable=False, index=True)
    qr_code = Column(String)
    status = Column(SQLEnum(BookingStatus), default=BookingStatus.pending, nullable=False)
    total_amount = Column(Float, nullable=False)
    booking_date = Column(DateTime, default=datetime.utcnow)
    checked_in_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="bookings")
    event = relationship("Event", back_populates="bookings")
    seat = relationship("Seat", back_populates="booking")
    payment = relationship("Payment", back_populates="booking", uselist=False)


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    stripe_payment_intent_id = Column(String, unique=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="usd")
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.pending, nullable=False)
    payment_method = Column(String)
    payment_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    booking = relationship("Booking", back_populates="payment")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="reviews")
    event = relationship("Event", back_populates="reviews")
