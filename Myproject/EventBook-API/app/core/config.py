from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # API Settings
    PROJECT_NAME: str = "EventBook API"
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/eventbook"
    
    # JWT Settings
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
    ]
    
    # Stripe (for payments)
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    
    # QR Code Settings
    QR_CODE_SIZE: int = 300
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
