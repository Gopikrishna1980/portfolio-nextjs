# EventBook API - Complete Endpoints Reference 📚

Base URL: `http://localhost:8000/api/v1`

---

## 🔐 Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login and get JWT tokens | No |

**Roles**: `user`, `organizer`, `admin`

---

## 👥 Users (`/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/me` | Get current user profile | Yes |
| PUT | `/me` | Update current user profile | Yes |
| GET | `/{user_id}` | Get user by ID | Yes |
| GET | `/` | List all users | Yes (Admin) |

---

## 📁 Categories (`/categories`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new category | Yes (Organizer) |
| GET | `/` | List all categories | No |
| GET | `/{category_id}` | Get category by ID | No |
| GET | `/slug/{slug}` | Get category by slug | No |
| DELETE | `/{category_id}` | Delete category | Yes (Organizer) |

**Sample Categories**: Concert, Sports, Conference, Theater, Workshop

---

## 🎪 Events (`/events`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new event | Yes (Organizer) |
| GET | `/` | List events (with filters) | No |
| GET | `/{event_id}` | Get event details | No |
| PUT | `/{event_id}` | Update event | Yes (Organizer - Own) |
| DELETE | `/{event_id}` | Delete event | Yes (Organizer - Own) |
| GET | `/organizer/my-events` | Get organizer's events | Yes (Organizer) |

**Query Parameters for GET /**:
- `category_id` (int) - Filter by category
- `location` (str) - Filter by location (partial match)
- `search` (str) - Search in event title
- `start_date` (datetime) - Filter by start date
- `is_active` (bool) - Show only active events
- `skip` (int) - Pagination offset (default: 0)
- `limit` (int) - Items per page (default: 50)

---

## 🪑 Seats (`/seats`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create single seat | Yes (Organizer) |
| POST | `/bulk` | Create multiple seats | Yes (Organizer) |
| GET | `/event/{event_id}` | Get all seats for event | No |
| GET | `/{seat_id}` | Get seat by ID | No |
| POST | `/{seat_id}/reserve` | Reserve seat (10 min) | No |
| POST | `/{seat_id}/release` | Release reserved seat | No |
| DELETE | `/{seat_id}` | Delete seat | Yes (Organizer) |

**Seat Tiers**: 
- `VIP` - Highest tier
- `Premium` - Mid tier  
- `Standard` - Regular tier
- `Economy` - Budget tier

**Query Parameters for GET /event/{event_id}**:
- `tier` (str) - Filter by tier (VIP/Premium/Standard/Economy)
- `available_only` (bool) - Show only available seats

---

## 🎫 Bookings (`/bookings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new booking | Yes (User) |
| GET | `/` | Get user's bookings | Yes (User) |
| GET | `/{booking_id}` | Get booking by ID | Yes (Owner) |
| GET | `/number/{booking_number}` | Get by booking number | Yes (Owner) |
| POST | `/verify-qr` | Verify QR code & check-in | Yes (Organizer) |
| PUT | `/{booking_id}/cancel` | Cancel booking | Yes (Owner) |
| GET | `/event/{event_id}/bookings` | Get event bookings | Yes (Organizer) |

**Booking Status**:
- `pending` - Payment not completed
- `confirmed` - Payment successful
- `cancelled` - Booking cancelled
- `attended` - Checked in with QR code

**Query Parameters for GET /**:
- `skip` (int) - Pagination offset
- `limit` (int) - Items per page (default: 50)

---

## 💳 Payments (`/payments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create payment | Yes (User) |
| GET | `/{payment_id}` | Get payment by ID | Yes (Owner) |
| GET | `/booking/{booking_id}` | Get payment for booking | Yes (Owner) |
| PUT | `/{payment_id}/confirm` | Confirm payment | Yes (User) |
| PUT | `/{payment_id}/fail` | Mark payment as failed | Yes (User) |
| GET | `/user/history` | Get payment history | Yes (User) |

**Payment Status**:
- `pending` - Awaiting payment
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

**Payment Methods**: Stripe (credit/debit cards, digital wallets)

---

## ⭐ Reviews (`/reviews`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create review | Yes (Attended) |
| GET | `/event/{event_id}` | Get event reviews | No |
| GET | `/{review_id}` | Get review by ID | No |
| PUT | `/{review_id}` | Update review | Yes (Author) |
| DELETE | `/{review_id}` | Delete review | Yes (Author) |
| GET | `/user/my-reviews` | Get user's reviews | Yes (User) |

**Rating**: 1-5 stars  
**Requirement**: Can only review attended events

---

## 📊 Analytics (`/analytics`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/organizer/dashboard` | Organizer dashboard stats | Yes (Organizer) |
| GET | `/event/{event_id}/stats` | Event statistics | Yes (Organizer) |
| GET | `/event/{event_id}/revenue` | Revenue breakdown | Yes (Organizer) |

### Dashboard Stats Response:
```json
{
  "total_events": 10,
  "active_events": 8,
  "total_bookings": 250,
  "total_revenue": 75000.00,
  "total_attendees": 200
}
```

### Event Stats Response:
```json
{
  "event_id": 1,
  "total_seats": 100,
  "booked_seats": 75,
  "available_seats": 25,
  "total_revenue": 22500.00,
  "bookings_by_tier": {
    "VIP": 20,
    "Premium": 30,
    "Standard": 25
  },
  "recent_bookings": [...]
}
```

---

## 📝 Request/Response Examples

### 1. Register User
**Request:**
```json
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "role": "user"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "role": "user",
  "is_active": true,
  "created_at": "2026-02-01T10:00:00",
  "updated_at": "2026-02-01T10:00:00"
}
```

### 2. Create Event
**Request:**
```json
POST /api/v1/events/
Authorization: Bearer YOUR_TOKEN
{
  "title": "Rock Concert 2026",
  "description": "Amazing live performance",
  "category_id": 1,
  "venue": "Madison Square Garden",
  "location": "New York",
  "address": "4 Pennsylvania Plaza, NY 10001",
  "start_date": "2026-06-15T19:00:00",
  "end_date": "2026-06-15T23:00:00",
  "image_url": "https://example.com/event.jpg",
  "total_seats": 1000
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Rock Concert 2026",
  "description": "Amazing live performance",
  "category_id": 1,
  "organizer_id": 2,
  "venue": "Madison Square Garden",
  "location": "New York",
  "address": "4 Pennsylvania Plaza, NY 10001",
  "start_date": "2026-06-15T19:00:00",
  "end_date": "2026-06-15T23:00:00",
  "image_url": "https://example.com/event.jpg",
  "total_seats": 1000,
  "available_seats": 1000,
  "is_active": true,
  "created_at": "2026-02-01T10:00:00",
  "updated_at": "2026-02-01T10:00:00"
}
```

### 3. Create Booking
**Request:**
```json
POST /api/v1/bookings/
Authorization: Bearer USER_TOKEN
{
  "event_id": 1,
  "seat_id": 25
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "event_id": 1,
  "seat_id": 25,
  "booking_number": "BK202602011A2B3C4D",
  "qr_code": "unique_qr_code_string_32_chars_long",
  "status": "pending",
  "total_amount": 500.00,
  "booking_date": "2026-02-01T10:00:00",
  "checked_in_at": null,
  "created_at": "2026-02-01T10:00:00",
  "updated_at": "2026-02-01T10:00:00"
}
```

### 4. Verify QR Code
**Request:**
```json
POST /api/v1/bookings/verify-qr
Authorization: Bearer ORGANIZER_TOKEN
{
  "qr_code": "unique_qr_code_string_32_chars_long"
}
```

**Response:**
```json
{
  "valid": true,
  "booking": {
    "id": 1,
    "booking_number": "BK202602011A2B3C4D",
    "status": "attended",
    "checked_in_at": "2026-06-15T19:05:00",
    "user": {...},
    "event": {...},
    "seat": {...}
  },
  "message": "Check-in successful"
}
```

---

## 🔑 Authentication Header

All protected endpoints require:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📄 Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (Deleted) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

## 🎯 Quick Reference

### Total Endpoints: **50+**

- Authentication: 2 endpoints
- Users: 4 endpoints
- Categories: 5 endpoints  
- Events: 6 endpoints
- Seats: 7 endpoints
- Bookings: 7 endpoints
- Payments: 6 endpoints
- Reviews: 6 endpoints
- Analytics: 3 endpoints
- Health: 1 endpoint

---

**Last Updated:** February 2026  
**API Version:** 1.0.0  
**Documentation:** http://localhost:8000/docs
