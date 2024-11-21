# pydantic is used to validate the data types for the columns in the tables
from pydantic import BaseModel, EmailStr, model_validator
from typing import Optional, List
from datetime import datetime

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
    userID: int # Really id (not userID in table)
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
    convo_id: Optional[int] = None

    # Needs to be changed
    @model_validator(mode='after')
    def calc_convo_id(cls, instance):
        sender_id = instance.sender_id
        receiver_id = instance.receiver_id
        product_id = instance.product_id

        # Make convo_id
        instance.convo_id = sender_id + receiver_id + str(product_id)
        return instance

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
    name: Optional[str] = None
    
    @model_validator(mode='after')
    def set_name(cls, instance):
        userID = instance.userID
        # name = userID (default)
        instance.name = userID
        return instance

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