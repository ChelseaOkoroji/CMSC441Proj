# This is the main file of the website that will eventually include FastAPI
# Currently, it just tests database.py, models.py, schemas.py, and operations.py
# The main function has a loop where the user can enter new users to be added to the user database

#from fastapi import FastAPI, HTTPException, Depends, status, Request, Query
from fastapi import FastAPI, HTTPException, Depends, UploadFile, status, Request,Query
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import operations, models, schemas, reset
from fastapi.middleware.cors import CORSMiddleware # Needed since React is a different application, 
                                                   # need to enable cors (cross-origin resource sharing)
from pydantic import ValidationError
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from itsdangerous import URLSafeTimedSerializer
from dotenv import load_dotenv
import os
import bcrypt
from typing import Optional

import cloud_config
from cloudinary.uploader import upload

# FastAPI instance
app = FastAPI()

load_dotenv("tokenvalidation.env")
# Secret key for token generation
SECRET_KEY = os.getenv("TOKEN_KEY")
serializer = URLSafeTimedSerializer(SECRET_KEY)

origins = [
    "http://localhost:3000",
    "localhost:3000"
] # React app origin

# Let FastAPI allow requests from React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True, # Allow credentials (such as cookies) to be included in cross-origin requests
    allow_methods=["*"], # Allow all HTTP methods (GET, POST, DELETE, etc.) for cross-origin requests (* signifies all)
    allow_headers=["*"] # Allow all HTTP headers in cross-origin requests
)   

# Create a dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create database tables
# Note: normally you'd want to use migrations
models.Base.metadata.create_all(bind=engine)

# FastAPI functions



def upload_image_to_cloudinary(image: UploadFile) -> str:
    """Uploads an image to Cloudinary and returns the URL."""
    try:
        result = upload(image.file)
        return result["secure_url"]
    except Exception as e:
        print(f"Error uploading to Cloudinary: {e}")
        return None

# Used when input data does not match pydantic model
@app.exception_handler(RequestValidationError)
def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, 
        content={"detail": "Invalid input"}
    )

# ****CREATE****

# Add user
# TESTED
@app.post("/register/", status_code=status.HTTP_201_CREATED, response_model=schemas.User)
def add_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email is already in system
    db_user_email = operations.get_user_by_email(db, email=user.email)
    if db_user_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    # Check if userID is already in system
    db_user_id = operations.get_user_by_id(db, userID=user.userID)
    if db_user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    return operations.create_user(db, user)

# Add product
# TESTED
@app.post("/users/{userID}/products/", status_code=status.HTTP_201_CREATED, response_model=schemas.Product)
def add_product(product: schemas.ProductCreate, image: UploadFile = Body(...), db: Session = Depends(get_db)):


    image_url = upload_image_to_cloudinary(image)
    if image_url is None:
        raise HTTPException(status_code=500, detail="Image upload failed")

    product.image_url = image_url
    return operations.create_product(db, product)

# Add favorite
# TESTED
@app.post("/browse/product/{productID}/", status_code=status.HTTP_201_CREATED, response_model=schemas.Favorite)
def add_favorite(favorite: schemas.FavoriteCreate, db: Session = Depends(get_db)):
    return operations.create_favorite(db, favorite)

# ****READ****

# Used if user forgot their password (sends email)
# TESTED
@app.post("/forget-password/{email}/", status_code=status.HTTP_200_OK)
def send_email(email: str, db: Session = Depends(get_db)):
    user = operations.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Email not found")
    # Generate token, then link
    token = serializer.dumps(user.email, salt='password-reset-salt')
    reset_link = f"http://localhost:3000/reset-password?email={user.email}&token={token}"
    # Send email
    status_code = reset.send_reset_link(user.email, reset_link)
    if status_code != 202:
        raise HTTPException(status_code=status_code, detail="Failed to send verification email. Please check email validity.")
    return operations.create_password_reset_token(db, user.email, token)

# Reset password functionality (used after user clicks link in email)
# TESTED
@app.post("/reset-password/", status_code=status.HTTP_200_OK)
def reset_password(reset: schemas.ResetPassword, db: Session = Depends(get_db)):
    try:
        # Verify token
        email = serializer.loads(reset.token, salt='password-reset-salt', max_age=900)  # 15 minutes expiry
        # Check if the token exists and is valid
        token_record = operations.get_token(db, reset.token)
        if token_record is None or token_record.status != 'valid':
            raise HTTPException(status_code=400, detail="Invalid or expired token.")

        # Update user's password in the database
        hashed_password = bcrypt.hashpw(reset.new_password.encode("utf-8"), bcrypt.gensalt())
        user = operations.get_user_by_email(db, email)
        if user:
            user.password_hashed = hashed_password.decode("utf-8")
            db.commit()

        # Mark token as used
        operations.update_token_status(db, reset.token, 'used')
        return {"message": "Password has been reset successfully."}

    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token.")

# Get user's products they have listed
# TESTED
@app.get("/users/{userID}/products/", status_code=status.HTTP_200_OK, response_model=list[schemas.Product])
def get_user_products(userID: str, db: Session = Depends(get_db)):
    return operations.get_user_products(db, userID)

#@app.get("/browse/", status_code=status.HTTP_200_OK, response_model=list[schemas.Product])

# Login function
# TESTED
@app.post("/login/", status_code=status.HTTP_200_OK, response_model=schemas.User)
def user_login(user_to_check: schemas.UserLogin, db: Session = Depends(get_db)):
    user = operations.get_user_by_id(db, user_to_check.userID)
    if not user or not operations.check_password(db, user_to_check.password, user):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    return user

# Get products based on filterable arguments (name, price, category, color)
# TESTED
@app.get("/products/", status_code=status.HTTP_200_OK, response_model=list[schemas.Product])
def get_products(products: schemas.ProductSearch = Depends(), db: Session = Depends(get_db)):
    return operations.get_products(db, products)

# ****UPDATE****

# ****DELETE****

# Delete specific product
# TESTED
@app.delete("/users/{userID}/products/{productID}/", status_code=status.HTTP_200_OK)
def delete_product(userID: str, productID: int, db: Session = Depends(get_db)):
    products = operations.get_user_products(db, userID)
    for product in products:
        if product.productID == productID:
            operations.delete_product(db, productID)

# Delete user (which will also delete any products they were selling)
# TESTED
@app.delete("/users/{userID}/", status_code=status.HTTP_200_OK)
def delete_user(userID: str, db: Session = Depends(get_db)):
    operations.delete_user(db, userID)

"""
if __name__ == "__main__":
    generator = get_db()
    Session = next(generator)

    # Test ability to insert new user (Note: checking for the case where the user is already in the
    # database is done in the FastAPI functions above (not being worked on right now and commented out), 
    # so trying to insert a repeat user will result in an error)
    cont = cont = int(input("Enter 1 to enter user, 0 to skip: "))
    while(cont == 1):
        user = input("Enter username: ")
        email = input("Enter email: ")
        password = input("Enter password: ")
        test1 = schemas.UserCreate(userID=user, email=email, password=password)
        operations.create_user(Session, test1)
        cont = int(input("Enter 1 to continue, 0 to end: "))

    # Test ability to insert new product
    cont = int(input("Enter 1 to enter product, 0 to skip: "))
    while(cont == 1):
        name = input("Enter name of product: ")
        description = input("Enter description: ")
        price = input("Enter price: ")
        quantity = input("Enter quantity: ")
        color = input("Enter color: ")
        category = input("Enter category: ")
        userID = input("Enter userID: ") # In the final product, we will just extract the user's ID since they will be logged in
        test1 = schemas.ProductCreate(name=name, description=description, price=price, 
                                        quantity=quantity, color=color, category=category, userID=userID)
        operations.create_product(Session, test1)
        cont = int(input("Enter 1 to continue, 0 to end: "))

    # Test ability to delete a user
    cont = int(input("Enter 1 to delete user, 0 to skip: "))
    while(cont == 1):
        userID = input("Enter username: ")
        operations.delete_user(Session, userID)
        cont = int(input("Enter 1 to continue, 0 to end: "))

    # Test ability to add a favorite
    cont = int(input("Enter 1 to add favorite, 0 to skip: "))
    while(cont == 1):
        userID = input("Enter username: ")
        productID = input("Enter productID: ")
        fav = schemas.FavoriteCreate(userID=userID, productID=productID)
        operations.create_favorite(Session, fav)
        cont = int(input("Enter 1 to continue, 0 to end: "))

    # Test ability to delete a favorite
    cont = int(input("Enter 1 to delete favorite, 0 to skip: "))
    while(cont == 1):
        favID = input("Enter favoriteID: ")
        operations.delete_favorite(Session, favID)
        cont = int(input("Enter 1 to continue, 0 to end: "))

    user = operations.get_user_by_id(Session, "tstepp")
    print(schemas.User.from_orm(user))

    favs = operations.get_user_favorites(Session, "tstepp")
    for i in favs:
        print(schemas.Favorite.from_orm(i))
    """

