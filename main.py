# This is the main file of the website that will eventually include FastAPI
# Currently, it just tests database.py, models.py, schemas.py, and operations.py
# The main function has a loop where the user can enter new users to be added to the user database

from fastapi import FastAPI, HTTPException, Depends, status
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import operations, models, schemas

# Create database tables
models.Base.metadata.create_all(bind=engine)

# FastAPI instance
#app = FastAPI()

# Create a dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create
"""
# Add user
@app.post("/users/", response_model=schemas.User)
def add_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user_email = operations.get_user_by_email(db, email=user.email)
    if db_user_email:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    db_user_id = operations.get_user_by_id(db, id=user.userID)
    if db_user_id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Username already used")
    return operations.create_user(db, user)

# Add product
@app.post("/products/", response_model=schemas.Product)
def add_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return operations.create_product(db, product)

# Read

# Get user's email from their ID
# Used if user forgot their password
@app.get("/users/{user_id}", response_model=schemas.User.email)
def get_user_email(user_id: str, db: Session = Depends(get_db)):
    user = operations.get_user_by_id(db, id=user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="No such username exists")
    return user.email
"""

if __name__ == "__main__":
    generator = get_db()
    Session = next(generator)

    cont = 1
    while(cont == 1):
        user = input("Enter username: ")
        email = input("Enter email: ")
        password = input("Enter password: ")
        test1 = schemas.UserCreate(userID=user, email=email, password=password)
        operations.create_user(Session, test1)
        cont = int(input("Enter 1 to continue, 0 to end: "))

    #test3 = schemas.ProductCreate(name="car", description="cool", price=208.73, quantity=1, color="green", userID=test1.userID)
    #operations.create_product(Session, test3)


