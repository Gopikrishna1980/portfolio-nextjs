# EventBook API - Quick Start Guide 🚀

## Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd EventBook-API
pip install -r requirements.txt
```

### 2. Configure Database
```bash
# Create PostgreSQL database
createdb eventbook

# Or copy and configure .env
cp .env.example .env
# Edit DATABASE_URL in .env
```

### 3. Start the Server
```bash
python main.py
```

Visit: **http://localhost:8000/docs**

---

## 📍 Quick API Test

### 1. Register User
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@test.com",
    "password": "password123",
    "full_name": "Test Organizer",
    "role": "organizer"
  }'
```

### 2. Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@test.com",
    "password": "password123"
  }'
```

Copy the `access_token` from response.

### 3. Create Category
```bash
curl -X POST "http://localhost:8000/api/v1/categories/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Concert",
    "slug": "concert",
    "description": "Live music events"
  }'
```

### 4. Create Event
```bash
curl -X POST "http://localhost:8000/api/v1/events/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Rock Festival 2026",
    "category_id": 1,
    "venue": "Madison Square Garden",
    "location": "New York",
    "start_date": "2026-06-15T19:00:00",
    "end_date": "2026-06-15T23:00:00",
    "total_seats": 100
  }'
```

### 5. Add Seats
```bash
curl -X POST "http://localhost:8000/api/v1/seats/bulk" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": 1,
    "seats": [
      {"seat_number": "A1", "row_number": "A", "tier": "VIP", "price": 500},
      {"seat_number": "A2", "row_number": "A", "tier": "VIP", "price": 500},
      {"seat_number": "B1", "row_number": "B", "tier": "Premium", "price": 300}
    ]
  }'
```

### 6. Register User & Book Ticket
```bash
# Register regular user
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "password123",
    "full_name": "Test User",
    "role": "user"
  }'

# Login as user
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "password123"
  }'

# Book ticket
curl -X POST "http://localhost:8000/api/v1/bookings/" \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": 1,
    "seat_id": 1
  }'
```

---

## 🎯 Common Operations

### Get All Events
```bash
curl "http://localhost:8000/api/v1/events/"
```

### Get Event Seats
```bash
curl "http://localhost:8000/api/v1/seats/event/1?available_only=true"
```

### Get My Bookings
```bash
curl "http://localhost:8000/api/v1/bookings/" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Organizer Stats
```bash
curl "http://localhost:8000/api/v1/analytics/organizer/dashboard" \
  -H "Authorization: Bearer ORGANIZER_TOKEN"
```

---

## 📊 Test Data Setup Script

Create a Python script to populate test data:

```python
import requests

API_URL = "http://localhost:8000/api/v1"

# 1. Register & Login Organizer
register_resp = requests.post(f"{API_URL}/auth/register", json={
    "email": "organizer@test.com",
    "password": "password123",
    "full_name": "Event Organizer",
    "role": "organizer"
})

login_resp = requests.post(f"{API_URL}/auth/login", json={
    "email": "organizer@test.com",
    "password": "password123"
})
token = login_resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# 2. Create Categories
categories = [
    {"name": "Concert", "slug": "concert"},
    {"name": "Sports", "slug": "sports"},
    {"name": "Conference", "slug": "conference"}
]
for cat in categories:
    requests.post(f"{API_URL}/categories/", json=cat, headers=headers)

# 3. Create Event
event_resp = requests.post(f"{API_URL}/events/", json={
    "title": "Summer Music Festival",
    "category_id": 1,
    "venue": "Central Park",
    "location": "New York",
    "start_date": "2026-07-20T18:00:00",
    "end_date": "2026-07-20T23:00:00",
    "total_seats": 50
}, headers=headers)

event_id = event_resp.json()["id"]

# 4. Create Seats
seats = []
for row in ["A", "B", "C"]:
    for num in range(1, 11):
        seats.append({
            "seat_number": f"{row}{num}",
            "row_number": row,
            "tier": "VIP" if row == "A" else "Premium",
            "price": 500 if row == "A" else 300
        })

requests.post(f"{API_URL}/seats/bulk", json={
    "event_id": event_id,
    "seats": seats
}, headers=headers)

print("✅ Test data created successfully!")
```

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Verify database exists
psql -U postgres -l | grep eventbook
```

### Port Already in Use
```bash
# Find and kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill -9
```

### Module Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## 📚 Next Steps

1. ✅ Explore API at `/docs`
2. ✅ Test authentication flow
3. ✅ Create events and seats
4. ✅ Book tickets
5. ✅ Set up Stripe for payments
6. ✅ Test QR code verification

---

**Happy Coding! 🎉**
