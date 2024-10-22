from datetime import timedelta, datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
import operations, models, schemas

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = 'f489lsowhc7207fno6kdq8y21njqteye83y2hflknc8239hfwehfdldfdj903ud'
ALGORITHM = 'HS256'

oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

# Create a dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/token", response_model=schemas.Token)
def login_for_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                    db: Session = Depends(get_db)):
    user = check_user(form_data.username, form_data.password, db)
    token = create_access_token(user.email, user.userID, timedelta(hours=2))
    return {'access_token': token, 'token_type': 'bearer'}

def check_user(userID: str, password: str, db):
    user = operations.get_user_by_id(db, userID)
    if not user or not operations.check_password(db, password, user):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    return user

def create_access_token(email: str, userID: str, expires_delta: timedelta):
    encode = {'sub': email, 'id': userID}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, ALGORITHM)

def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get('sub')
        userID: str = payload.get('id')
        if email is None or userID is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Could not validate user")
        return {'email': email, 'userID': userID}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Could not validate user")