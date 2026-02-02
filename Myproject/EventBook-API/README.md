# EventBook API 🎟️

A comprehensive event booking platform backend built with FastAPI, featuring interactive seat selection, Stripe payments, QR code tickets, and real-time analytics.

![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-4169E1?logo=postgresql)
![Stripe](https://img.shields.io/badge/Stripe-Payment-008CDD?logo=stripe)

## ✨ Features

### 🎫 Event Management
- **Complete CRUD Operations** - Create, read, update, delete events
- **Category Organization** - Organize events by categories (Concert, Sports, Conference, etc.)
- **Advanced Filtering** - Search by location, date, category, and keywords
- **Multi-Tier Seating** - VIP, Premium, Standard, and Economy tiers
- **Real-time Availability** - Live seat availability updates

### 🪑 Seat Management
- **Interactive Seat Maps** - Visual seat selection with row/seat numbers
- **Seat Reservation** - Temporary hold seats for 10 minutes during checkout
- **Bulk Seat Creation** - Create multiple seats at once for efficiency
- **Tier-based Pricing** - Different pricing for different seat tiers
- **Availability Tracking** - Real-time seat status management

### 📱 Booking System
- **Easy Booking Flow** - Simple 3-step booking process
- **Unique Booking Numbers** - Auto-generated booking references
- **QR Code Tickets** - Instant digital tickets with QR codes
- **Booking Management** - View, cancel, and track bookings
- **Check-in System** - QR code verification for event entry

### 💳 Payment Integration
- **Stripe Integration** - Secure payment processing
- **Multiple Payment Methods** - Credit cards, digital wallets
- **Payment Tracking** - Complete payment history and status
- **Refund Support** - Handle cancellations and refunds
- **Revenue Analytics** - Track earnings by event and tier

### ⭐ Reviews & Ratings
- **Post-Event Reviews** - Rate events after attending
- **5-Star Rating System** - Standard rating scale
- **Comment System** - Detailed feedback from attendees
- **Review Management** - Edit and delete your own reviews

### 📊 Analytics Dashboard
- **Organizer Dashboard** - Complete overview of events and revenue
- **Event Statistics** - Detailed stats per event
- **Revenue Breakdown** - Track earnings by seat tier
- **Booking Insights** - Monitor bookings and attendance
- **Real-time Metrics** - Live data updates

### 🔐 Authentication & Authorization
- **JWT Authentication** - Secure token-based auth
- **Role-based Access** - User, Organizer, Admin roles
- **Protected Endpoints** - Route-level authorization
- **Password Hashing** - Bcrypt for secure password storage

## 🏗️ Tech Stack

- **Framework**: FastAPI 0.115.6
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with python-jose
- **Payments**: Stripe API integration
- **QR Codes**: qrcode library with PIL
- **Security**: Passlib with bcrypt hashing
- **Validation**: Pydantic schemas
- **Documentation**: OpenAPI (Swagger UI)

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Stripe Account (for payments)
- pip or Poetry

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EventBook-API
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials and Stripe keys
```

### 5. Set Up Database
```bash
# Create PostgreSQL database
createdb eventbook

# Or using psql
psql -U postgres
CREATE DATABASE eventbook;
\q
```

### 6. Run the Server
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Core Endpoints

#### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - Login and get JWT tokens

#### Users (`/api/v1/users`)
- `GET /me` - Get current user profile
- `PUT /me` - Update profile
- `GET /{user_id}` - Get user by ID

#### Categories (`/api/v1/categories`)
- `POST /` - Create category (organizer)
- `GET /` - List all categories
- `GET /{category_id}` - Get category details
- `GET /slug/{slug}` - Get category by slug

#### Events (`/api/v1/events`)
- `POST /` - Create event (organizer)
- `GET /` - List events (with filtering)
- `GET /{event_id}` - Get event details
- `PUT /{event_id}` - Update event (organizer)
- `DELETE /{event_id}` - Delete event (organizer)
- `GET /organizer/my-events` - Get organizer's events

**Query Parameters for Listing:**
- `category_id` - Filter by category
- `location` - Filter by location
- `search` - Search in title
- `start_date` - Filter by start date
- `is_active` - Show only active events

#### Seats (`/api/v1/seats`)
- `POST /` - Create single seat (organizer)
- `POST /bulk` - Create multiple seats (organizer)
- `GET /event/{event_id}` - Get all event seats
- `GET /{seat_id}` - Get seat details
- `POST /{seat_id}/reserve` - Reserve seat (10 min hold)
- `POST /{seat_id}/release` - Release reserved seat

**Seat Tiers:** VIP, Premium, Standard, Economy

#### Bookings (`/api/v1/bookings`)
- `POST /` - Create booking
- `GET /` - Get user's bookings
- `GET /{booking_id}` - Get booking details
- `GET /number/{booking_number}` - Get booking by number
- `POST /verify-qr` - Verify QR code and check-in
- `PUT /{booking_id}/cancel` - Cancel booking
- `GET /event/{event_id}/bookings` - Get event bookings (organizer)

**Booking Status:** pending, confirmed, cancelled, attended

#### Payments (`/api/v1/payments`)
- `POST /` - Create payment
- `GET /{payment_id}` - Get payment details
- `GET /booking/{booking_id}` - Get payment for booking
- `PUT /{payment_id}/confirm` - Confirm payment
- `PUT /{payment_id}/fail` - Mark payment as failed
- `GET /user/history` - Get payment history

**Payment Status:** pending, completed, failed, refunded

#### Reviews (`/api/v1/reviews`)
- `POST /` - Create review (after attending)
- `GET /event/{event_id}` - Get event reviews
- `GET /{review_id}` - Get review details
- `PUT /{review_id}` - Update review
- `DELETE /{review_id}` - Delete review
- `GET /user/my-reviews` - Get user's reviews

#### Analytics (`/api/v1/analytics`)
- `GET /organizer/dashboard` - Organizer dashboard stats
- `GET /event/{event_id}/stats` - Event statistics
- `GET /event/{event_id}/revenue` - Event revenue breakdown

## 🗃️ Database Schema

### Core Models

**User**
- id, email, password_hash, full_name, phone
- role: user | organizer | admin
- is_active, created_at, updated_at

**Category**
- id, name, slug, description, icon
- created_at

**Event**
- id, title, description, category_id, organizer_id
- venue, location, address
- start_date, end_date, image_url
- total_seats, available_seats, is_active
- created_at, updated_at

**Seat**
- id, event_id, seat_number, row_number
- tier (VIP/Premium/Standard/Economy), price
- is_available, is_reserved, reserved_until
- created_at

**Booking**
- id, user_id, event_id, seat_id
- booking_number, qr_code
- status (pending/confirmed/cancelled/attended)
- total_amount, booking_date, checked_in_at
- created_at, updated_at

**Payment**
- id, booking_id, stripe_payment_intent_id
- amount, currency
- status (pending/completed/failed/refunded)
- payment_method, payment_date
- created_at, updated_at

**Review**
- id, user_id, event_id
- rating (1-5), comment
- created_at, updated_at

## 🔐 Authentication

All protected endpoints require a valid JWT token:

```bash
# Login to get token
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Use token in requests
curl -X GET "http://localhost:8000/api/v1/users/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 💳 Stripe Integration

### Setup Stripe

1. Create account at [stripe.com](https://stripe.com)
2. Get your API keys from Dashboard
3. Add keys to `.env` file

### Test Cards

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Authentication Required: `4000 0025 0000 3155`

### Webhook Events

Configure webhook endpoint in Stripe Dashboard:
```
https://your-api-domain.com/api/v1/payments/webhook
```

Events to listen:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

## 📱 QR Code System

### QR Code Generation
- Unique QR code generated for each booking
- Uses URL-safe random tokens (32 bytes)
- Encoded booking data for verification

### QR Code Verification
```bash
POST /api/v1/bookings/verify-qr
{
  "qr_code": "unique_qr_code_string"
}
```

Response includes:
- Booking validity
- Attendee information
- Check-in timestamp
- Event details

## 🧪 Testing

### Run Tests
```bash
pytest tests/
```

### Test Coverage
```bash
pytest --cov=app tests/
```

### Manual Testing with cURL

**Create Event:**
```bash
curl -X POST "http://localhost:8000/api/v1/events/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Rock Concert 2026",
    "category_id":1,
    "venue":"Madison Square Garden",
    "location":"New York",
    "start_date":"2026-06-15T19:00:00",
    "end_date":"2026-06-15T23:00:00",
    "total_seats":1000
  }'
```

**Book Ticket:**
```bash
curl -X POST "http://localhost:8000/api/v1/bookings/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_id":1,
    "seat_id":1
  }'
```

## 📦 Project Structure

```
EventBook-API/
├── app/
│   ├── api/v1/
│   │   ├── endpoints/
│   │   │   ├── auth.py          # Authentication
│   │   │   ├── users.py         # User management
│   │   │   ├── categories.py    # Event categories
│   │   │   ├── events.py        # Event CRUD
│   │   │   ├── seats.py         # Seat management
│   │   │   ├── bookings.py      # Booking system
│   │   │   ├── payments.py      # Payment processing
│   │   │   ├── reviews.py       # Reviews & ratings
│   │   │   └── analytics.py     # Analytics & stats
│   │   └── __init__.py
│   ├── core/
│   │   ├── config.py            # Configuration
│   │   └── security.py          # Auth & security
│   ├── db/
│   │   └── database.py          # Database connection
│   ├── models/
│   │   └── models.py            # SQLAlchemy models
│   ├── schemas/
│   │   └── schemas.py           # Pydantic schemas
│   └── utils/
├── main.py                      # Application entry point
├── requirements.txt             # Dependencies
├── .env.example                 # Environment template
├── .gitignore
└── README.md
```

## 🚀 Deployment

### Using Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Deployment Platforms
- **Render**: Easy deployment with PostgreSQL
- **Railway**: Simple deployment
- **AWS**: EC2 + RDS
- **Heroku**: With Heroku Postgres
- **Google Cloud**: Cloud Run + Cloud SQL

## 🔧 Environment Variables

Required variables in `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/eventbook
SECRET_KEY=your-secret-key
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
ALLOWED_ORIGINS=http://localhost:3000
```

## 🤝 API Integration Example

### JavaScript/TypeScript
```typescript
// Login
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
};

// Get Events
const getEvents = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/api/v1/events/', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Create Booking
const createBooking = async (eventId: number, seatId: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/api/v1/bookings/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ event_id: eventId, seat_id: seatId })
  });
  return response.json();
};
```

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- FastAPI for the excellent framework
- SQLAlchemy for ORM capabilities
- Stripe for payment processing
- Pydantic for data validation

## 📞 Support

For support, email support@eventbook.com or open an issue in the repository.

---

**Built with ❤️ using FastAPI**
