from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.schemas import User
from app.models.models import User as UserModel
from app.core.security import get_current_active_user

router = APIRouter()


@router.get("/me", response_model=User)
async def get_current_user_info(current_user: UserModel = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user


@router.put("/me", response_model=User)
async def update_user_profile(
    full_name: str = None,
    phone: str = None,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    if full_name:
        current_user.full_name = full_name
    if phone:
        current_user.phone = phone
    
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/{user_id}", response_model=User)
async def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Get user by ID"""
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/", response_model=List[User])
async def list_users(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """List all users (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    users = db.query(UserModel).offset(skip).limit(limit).all()
    return users
