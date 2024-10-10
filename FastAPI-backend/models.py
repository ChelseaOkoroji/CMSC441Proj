# These are the tables for the database
# SQLAlchemy uses ORM (object-relational mapping) rather than writing SQL
# So far I have written three tables, not sure what other tables we want
# Will things like pictures and stuff just go under Product or in their own class?

from sqlalchemy import Integer, Float, String, Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# All attributes for users of the website
class User(Base):
    __tablename__ = "users"

    userID = Column(String, primary_key=True, index=True)
    email = Column(String, nullable=False)
    password_hashed = Column(String, nullable=False)

    items_for_sale = relationship("Product", back_populates="seller")

# All attributes for products on the website
class Product(Base):
    __tablename__ = "products"

    productID = Column(Integer, primary_key=True, index=True) # productID automatically increments for each product
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer)
    color = Column(String)
    category = Column(String) # User will choose from a pre-defined list when they add their product

    userID = Column(String, ForeignKey("users.userID", ondelete="CASCADE", onupdate="CASCADE"))
    seller = relationship("User", back_populates="items_for_sale")

# All attributes for favorites functionality
class Favorite(Base):
    __tablename__ = "favorites"

    favoriteID = Column(Integer, primary_key=True, index=True)

    userID = Column(String, ForeignKey("users.userID", ondelete="CASCADE", onupdate="CASCADE"))
    productID = Column(Integer, ForeignKey("products.productID", ondelete="CASCADE", onupdate="CASCADE"))