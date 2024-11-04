# This file is where the CRUD operations are written
# These will be used in main.py inside the FastAPI functions

from sqlalchemy.orm import Session
from sqlalchemy import and_
import models, schemas
import bcrypt
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import and_, or_, desc, asc
from typing import Optional, List
from math import ceil
from pydantic import BaseModel
from .database import get_db



# CREATE operations

# **** User-related functions ****

# Create new user
def create_user(db: Session, user: schemas.UserCreate):
    # Hash password
    hashed_password = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    # New user
    new_user = models.User(userID=user.userID, email=user.email, password_hashed=hashed_password.decode("utf-8"))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

#this all below is a single function
#it takes in parameters defined and then helps to load the webpage
def list_products(
    db: Session,
    skip: int = 0,
    limit: int = 25,
    name: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort: Optional[str] = None
):
    #first get the database query
    query = db.query(models.Product)
    
    #then apply the necessary filters
    #name filters by name, category filters by category, min_price and max_price define price
    if name:
        query = query.filter(models.Product.name.ilike(f"%{name}%"))
    if category:
        query = query.filter(models.Product.category == category)
    if min_price is not None:
        query = query.filter(models.Product.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Product.price <= max_price)
    
    #Apply sorting based on filters
    if sort:
        if sort == "priceAsc":
            query = query.order_by(asc(models.Product.price))
        elif sort == "priceDesc":
            query = query.order_by(desc(models.Product.price))
        elif sort == "newest":
            query = query.order_by(desc(models.Product.productID))
    
    #get total and then paginate the page
    total = query.count()
    products = query.offset(skip).limit(limit).all()
    
    return products, total

#Update the router so that the products are now listed
router = APIRouter(prefix="/api", tags=["products"])
@router.get("/products", response_model=schemas.ItemPageResponse)
#new function helps to get the products
async def get_products_paginated(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort: Optional[str] = None
):
    skip = (page - 1) * limit
    
    products, total = list_products(
        db=db,
        skip=skip,
        limit=limit,
        name=search,
        category=category,
        min_price=min_price,
        max_price=max_price,
        sort=sort
    )
    
    total_pages = ceil(total / limit)
    
    return {
        "items": products,
        "total": total,
        "page": page,
        "pages": total_pages
    }

@router.get("/products/{product_id}", response_model=schemas.Product)
async def get_product_detail(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/products/user/{user_id}", response_model=List[schemas.Product])
async def get_user_products_endpoint(
    user_id: str,
    db: Session = Depends(get_db)
):
    products = get_user_products(db, user_id)
    return products

# Create new product
def create_product(db: Session, product: schemas.ProductCreate):
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# **** Favorite-related functions ****

# Create new favorite
def create_favorite(db: Session, favorite: schemas.FavoriteCreate):
    new_favorite = models.Favorite(**favorite.dict())
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return new_favorite

# READ operations

# **** User-related functions ****

# Checks if given userID exists
def get_user_by_id(db: Session, userID: str):
    return db.query(models.User).filter(models.User.userID == userID).first()

# Checks if given email exists
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

# Check password 
def check_password(db: Session, password_to_check: str, user: models.User):
    return bcrypt.checkpw(password_to_check.encode("utf-8"), user.password_hashed.encode("utf-8"))

# **** Product-related functions ****

# Get specific product
def get_product(db: Session, productID: int):
    return db.query(models.Product).filter(models.Product.productID == productID).first()

# Get all products in a certain category
def get_products_by_category(db: Session, category: str):
    #return db.query(models.Product).filter(models.Product)
    pass

# Get all products <= price
def get_products_by_price(db: Session, price: float):
    return db.query(models.Product).filter(models.Product.price <= price)

# Get all products being sold by a user
def get_user_products(db: Session, userID: str):
    user = get_user_by_id(db, userID)
    return user.products

# **** Favorite-related functions ****

# Get specific favorite
def get_favorite(db: Session, favoriteID: int):
    return db.query(models.Favorite).filter(models.Favorite.favoriteID == favoriteID)

# Get all favorites of a user
def get_user_favorites(db: Session, userID: str):
    user = get_user_by_id(db, userID)
    return user.favorites

# UPDATE operations

#def update_price(db: Session, productID: int):

# DELETE operations

# **** User-related functions ****

# Delete user
def delete_user(db: Session, userID: str):
    db.delete(get_user_by_id(db, userID))
    db.commit()

# **** Product-related functions ****

# Delete product
def delete_product(db: Session, productID: str):
    db.delete(get_product(db, productID))
    db.commit()

# **** Favorite-related functions ****

# Add favorite

# Delete favorite
def delete_favorite(db: Session, favoriteID: str):
    db.delete(get_favorite(db, favoriteID))
    db.commit()

# HELPER FUNCTIONS (TOKEN)

# Create a token
def create_password_reset_token(db: Session, email: str, token: str):
    db_token = models.PasswordResetToken(email=email, token=token)
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token

# Return a token
def get_token(db: Session, token: str):
    return db.query(models.PasswordResetToken).filter(models.PasswordResetToken.token == token).first()

# Update a token's status
def update_token_status(db: Session, token: str, status: str):
    db_token = get_token(db, token)
    if db_token:
        db_token.status = status
        db.commit()

# Get products using optional filters
def get_products(db: Session, filters: schemas.ProductSearch):
    query = db.query(models.Product)
    # Now check filters
    if filters.name is not None:
        query = query.filter(models.Product.name.ilike(f"%{filters.name}%"))
    if filters.max_price is not None:
        query = query.filter(models.Product.price <= filters.max_price)
    if filters.category is not None:
        query = query.filter(models.Product.category == filters.category)
    if filters.color is not None:
        query = query.filter(models.Product.color == filters.color)
    # Do the query
    return query.all()