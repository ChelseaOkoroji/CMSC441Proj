# pydantic is used to validate the data types coming in to the FastAPI functions
# pydantic schemas are also used to return data in a formatted way 
# For example, class User(UserBase is used to send information to the frontend
from pydantic import BaseModel, EmailStr, model_validator, field_validator, Field
from typing import Optional, List
from datetime import datetime
import uuid

# Shared fields of ProductCreate and Product
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    quantity: int
    color: str
    category: str
    image: str
    userID: str # Username of seller

# Additional fields needed to create product
class ProductCreate(ProductBase):
    pass

# Data that is returned when product is queried 
# Returned data will include what is in ProductBase
class Product(ProductBase):
    productID: int # productID is not sent with other information (since user will not know it)
                   # It is generated after the user enters the product information

    class Config:
        from_attributes = True

class PaginatedProducts(BaseModel):
    items: List[Product]
    total: int
    page: int
    pages: int

    class Config:
        from_attributes = True

# Shared fields of FavoriteCreate and Favorite
class FavoriteBase(BaseModel):
    userID: str 
    productID: int

# Additional fields needed to create favorite
class FavoriteCreate(FavoriteBase):
    pass

# Data that is returned when favorite is queried 
# Returned data will include what is in FavoriteBase
class Favorite(FavoriteBase):
    favoriteID: int
    product: Product

    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    sender_id: str
    receiver_id: str
    product_id: int
    message: str
    is_read: Optional[bool] = False
    parent_id: Optional[int] = None
    convo_id: Optional[str] = str(uuid.uuid4())
    
    class Config:
        from_attributes = True

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    sent_at: datetime
    #sender: "User" # Forward reference
    #receiver: "User" # Forward reference
    parent_message: Optional["Message"] = None
    product: Product

    class Config:
        from_attributes = True

# Shared fields of UserCreate and User
class UserBase(BaseModel):
    userID: str
    email: EmailStr

# Additional fields needed to create user
class UserCreate(UserBase):
    password: str

# Data that is returned when user is queried 
# Returned data will include what is in UserBase
class User(UserBase):
    products: list[Product] = []
    favorites: list[Favorite] = []

    class Config:
        from_attributes = True

# Used for logging in
# Frontend sends data to the backend function, which uses this schema
# to validate that the data matches the below types
class UserLogin(BaseModel):
    userID: str
    password: str

class ResetPassword(BaseModel):
    token: str
    new_password: str

class ProductSearch(BaseModel):
    name: Optional[str] = None
    max_price: Optional[float] = None
    color: Optional[str] = None
    category: Optional[str] = None

# Resolve forward references
Message.update_forward_refs()