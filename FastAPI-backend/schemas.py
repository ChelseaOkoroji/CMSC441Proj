# pydantic is used to validate the data types for the columns in the tables

from pydantic import BaseModel, EmailStr

# Shared fields of ProductCreate and Product
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    quantity: int
    color: str
    category: str
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

class UserLogin(BaseModel):
    userID: str
    password: str