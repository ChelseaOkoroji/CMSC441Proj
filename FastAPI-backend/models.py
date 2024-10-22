# These are the tables for the database
# SQLAlchemy uses ORM (object-relational mapping) rather than writing SQL
# So far I have written three tables, not sure what other tables we want
# Will things like pictures and stuff just go under Product or in their own class?

from sqlalchemy import Integer, Float, String, Column, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timedelta

# All attributes for users of the website
class User(Base):
    __tablename__ = "users"

    userID = Column(String, primary_key=True, index=True)
    email = Column(String, nullable=False)
    password_hashed = Column(String, nullable=False)

    products = relationship("Product", cascade='all,delete', backref='seller')
    favorites = relationship("Favorite", cascade='all,delete', backref='favorited_by')

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
    image = Column(String, nullable=False)

    userID = Column(String, ForeignKey('users.userID', ondelete='CASCADE', onupdate='CASCADE'))

# All attributes for favorites functionality
class Favorite(Base):
    __tablename__ = "favorites"

    favoriteID = Column(Integer, primary_key=True, index=True)

    userID = Column(String, ForeignKey('users.userID', ondelete='CASCADE', onupdate='CASCADE'))
    productID = Column(Integer, ForeignKey('products.productID', ondelete='CASCADE', onupdate='CASCADE'))

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    resetID = Column(Integer, primary_key=True, index=True)
    userID = Column(String, ForeignKey('users.userID', ondelete='CASCADE', onupdate='CASCADE'))
    token = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)