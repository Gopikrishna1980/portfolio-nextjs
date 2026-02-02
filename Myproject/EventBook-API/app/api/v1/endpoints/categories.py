from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.db.database import get_db
from app.schemas.schemas import Category, CategoryCreate
from app.models.models import Category as CategoryModel
from app.core.security import get_current_active_user, get_current_organizer
from app.models.models import User

router = APIRouter()


@router.post("/", response_model=Category, status_code=status.HTTP_201_CREATED)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_organizer)
):
    """Create a new event category (organizer only)"""
    # Check if category already exists
    existing = db.query(CategoryModel).filter(CategoryModel.slug == category.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category with this slug already exists")
    
    db_category = CategoryModel(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.get("/", response_model=List[Category])
def list_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all categories"""
    categories = db.query(CategoryModel).offset(skip).limit(limit).all()
    return categories


@router.get("/{category_id}", response_model=Category)
def get_category(category_id: int, db: Session = Depends(get_db)):
    """Get category by ID"""
    category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.get("/slug/{slug}", response_model=Category)
def get_category_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get category by slug"""
    category = db.query(CategoryModel).filter(CategoryModel.slug == slug).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_organizer)
):
    """Delete a category"""
    category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(category)
    db.commit()
    return None
