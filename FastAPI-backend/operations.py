# This file is where the CRUD operations are written
# These will be used in main.py inside the FastAPI functions

from sqlalchemy.orm import Session
import models, schemas
import bcrypt

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

# **** Product-related functions ****

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