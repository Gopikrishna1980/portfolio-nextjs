from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    users,
    categories,
    events,
    seats,
    bookings,
    payments,
    reviews,
    analytics
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(events.router, prefix="/events", tags=["Events"])
api_router.include_router(seats.router, prefix="/seats", tags=["Seats"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
api_router.include_router(payments.router, prefix="/payments", tags=["Payments"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])


@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "EventBook API"}
