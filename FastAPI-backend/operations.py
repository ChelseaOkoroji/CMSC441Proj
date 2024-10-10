# This file is where the CRUD operations are written
# These will be used in main.py inside the FastAPI functions

from sqlalchemy.orm import Session
import models, schemas

# CREATE operations

# Create new user
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = user.password + "blah"
    #user = models.User(**user.dict(), password_hashed=hashed_password)
    new_user = models.User(userID=user.userID, email=user.email, password_hashed=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Create new product
def create_product(db: Session, product: schemas.ProductCreate):
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# Create new favorite
def create_favorite(db: Session, favorite: schemas.FavoriteCreate):
    new_favorite = models.Favorite(**favorite.dict())
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return new_favorite

# READ operations

# Get user using userID
# Can also be used to check if given userID exists
def get_user_by_id(db: Session, id: str):
    return db.query(models.User).filter(models.User.userID == id).first()

# Get user using email
# Can also be used to check if given email exists
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

# Get specific product
def get_product(db: Session, id: int):
    return db.query(models.Product).filter(models.Product.productID == id).first()
    # return db.query(models.Product).filter(productID == id).first() <-- This may work as well?

# Get all products in a certain category
def get_products_by_category(db: Session, category: str):
    #return db.query(models.Product).filter(models.Product)
    pass

# Get all products <= price
def get_products_by_price(db: Session, price: float):
    return db.query(models.Product).filter(models.Product.price <= price)

# UPDATE operations

# DELETE operations

# Delete user
def delete_user(db: Session, id: str):
    db.delete(get_user_by_id(db, id))
    db.commit()

# Delete product
# NOT FINISHED
def delete_product(db: Session, id: str):
    db.delete(get_product(db, id))
    db.commit()