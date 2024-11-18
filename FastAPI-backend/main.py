# This is the main file of the website that will eventually include FastAPI
# Currently, it just tests database.py, models.py, schemas.py, and operations.py
# The main function has a loop where the user can enter new users to be added to the user database
from cloudinary.uploader import upload
from fastapi import FastAPI, File, HTTPException, Depends, UploadFile, status, Request, Query, Form

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import operations, models, schemas, reset
from fastapi.middleware.cors import CORSMiddleware # Needed since React is a different application, 
                                                   # need to enable cors (cross-origin resource sharing)
from pydantic import ValidationError, EmailStr
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from itsdangerous import URLSafeTimedSerializer
from dotenv import load_dotenv
import os
import bcrypt
from typing import Optional
from typing import List
import math
import cloud_config
import asyncio
# FastAPI instance
app = FastAPI()

# Load environment variables
load_dotenv("tokenvalidation.env")
SECRET_KEY = os.getenv("TOKEN_KEY")
#error check
if SECRET_KEY is None:
    raise RuntimeError("TOKEN_KEY environment variable is not set. Please check your tokenvalidation.env file.")
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


#image helpper functions
async def upload_image_to_cloudinary(image: UploadFile) -> str:
    """Uploads an image to Cloudinary asynchronously and returns the URL."""
    try:
        loop = asyncio.get_event_loop()
        # Run the synchronous upload function in an executor
        result = await loop.run_in_executor(None, upload, image.file)
        return result["secure_url"]
    except Exception as e:
        print(f"Error uploading to Cloudinary: {e}")
        return None	

# FastAPI functions

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
@app.post("/create-product/", status_code=status.HTTP_201_CREATED, response_model=schemas.Product)
async def add_product(
    userID: str = Form(...), 
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    quantity: int = Form(...),
    color: str = Form(...),
    category: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        # Upload the image to Cloudinary
        image_url = await upload_image_to_cloudinary(image)
        if image_url is None:
            raise HTTPException(status_code=500, detail="Image upload failed")
        
        # Create the product data, including userID
        product_data = schemas.ProductCreate(
            name=name,
            description=description,
            price=price,
            quantity=quantity,
            color=color,
            category=category,
            image=image_url,
            userID=userID  # Include userID here
        )

        # Insert product in the database
        return operations.create_product(db, product_data)

    except Exception as e:
        # Log the error and return a detailed response
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


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
            raise HTTPException(status_code=400, detail="Invalid or expired token. Please enter new password reset request.")

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
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token. Please enter new password reset request.")

# Get user's products they have listed
# TESTED
@app.get("/user-products/{userID}/", status_code=status.HTTP_200_OK, response_model=list[schemas.Product])
async def get_user_products(userID: str, db: Session = Depends(get_db)):
    return operations.get_user_products(db, userID)

# Update user's profile
@app.put("/update-profile/{userID}/", status_code=status.HTTP_200_OK, response_model=schemas.User)
async def update_profile(
    userID: str, 
    newUserID: str = Form(...),
    newEmail: EmailStr = Form(...),
    #newProfileImage: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Check if email is already in system (if the email is different than what it was)
    if(newEmail != operations.get_user_by_id(db, userID=userID).email):
        db_user_email = operations.get_user_by_email(db, email=newEmail)
        if db_user_email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    # Check if userID is already in system (if the userID is different than what it was)
    if(newUserID != userID):
        db_user_id = operations.get_user_by_id(db, userID=newUserID)
        if db_user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    # Otherwise, update database
    return await operations.update_user(db, oldUserID=userID, newUserID=newUserID, newEmail=newEmail)

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
@app.get("/products/", status_code=status.HTTP_200_OK, response_model=schemas.PaginatedProducts)
async def get_products_paginated(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(25, ge=1, le=100, description="Items per page"),
    name: Optional[str] = None,
    max_price: Optional[float] = None,
    color: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Create filter object
    filters = schemas.ProductSearch(
        name=name,
        max_price=max_price,
        color=color,
        category=category
    )
    
    # Get filtered products
    all_products = operations.get_products(db, filters)
    
    # Calculate pagination
    total_items = len(all_products)
    total_pages = math.ceil(total_items / limit)
    
    # Get paginated subset
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_products = all_products[start_idx:end_idx]
    
    return {
        "items": paginated_products,
        "total": total_items,
        "page": page,
        "pages": total_pages
    }

# ****UPDATE****

# ****DELETE****

# Delete specific product
# TESTED
@app.delete("/products/{productID}/", status_code=status.HTTP_200_OK)
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

# Since we are not using JWTs at the moment, I commented out the code and
# just added a success message since the frontend will simply be deleting
# the session storage and redirecting the user to the home page
@app.post("/logout/{userID}/", status_code=status.HTTP_200_OK)
async def logout(userID: str, db: Session = Depends(get_db)):
    #Endpoint to handle user logout
    """
    try:
        # Clear the JWT token cookie if you're using cookies
        response.delete_cookie(
            key="access_token",
            httponly=True,
            samesite="lax",
            secure=False  # Set to True if using HTTPS
        )
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    """
    return {"message": "success"}

# MESSAGES

# Create a new message
@app.post("/send-message/", status_code=status.HTTP_200_OK, response_model=schemas.Message)
def create_message(message: schemas.MessageCreate, db: Session = Depends(get_db)):
    # Create the message
    db_message = operations.create_message(db, message)
    return db_message

# Get all messages sent by a user
@app.get("/sent/", response_model=List[schemas.Message])
def get_sent_messages(id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sent_messages = operations.get_sent_messages(db, id, skip, limit)
    return sent_messages

# Get all messages received by a user
@app.get("/received/", status_code=status.HTTP_200_OK, response_model=List[schemas.Message])
def get_received_messages(id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    received_messages = operations.get_received_messages(db, id, skip, limit)
    return received_messages

# Mark a message as read
@app.put("/read/{message_id}/", status_code=status.HTTP_200_OK, response_model=schemas.Message)
def mark_message_as_read(message_id: int, db: Session = Depends(get_db)):
    db_message = operations.mark_read(db, message_id)
    if not db_message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    return db_message
