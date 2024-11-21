# These are the tables for the database
# SQLAlchemy uses ORM (object-relational mapping) rather than writing SQL
# So far I have written three tables, not sure what other tables we want
# Will things like pictures and stuff just go under Product or in their own class?

from sqlalchemy import Boolean, Integer, Float, String, Column, ForeignKey, DateTime, Text, Index
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timedelta

# All attributes for users of the website
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    userID = Column(String, nullable=False, unique=True, index=True)
    email = Column(String, nullable=False, index=True)
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

    userID = Column(Integer, ForeignKey('users.userID', ondelete='CASCADE', onupdate='CASCADE'))

# All attributes for favorites functionality
class Favorite(Base):
    __tablename__ = "favorites"

    favoriteID = Column(Integer, primary_key=True, index=True)

    userID = Column(String, ForeignKey('users.userID', ondelete='CASCADE', onupdate='CASCADE'))
    productID = Column(Integer, ForeignKey('products.productID', ondelete='CASCADE', onupdate='CASCADE'))

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    token = Column(String, unique=True)
    status = Column(String, default='valid')  # 'valid' or 'used'
    created_at = Column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, index=True)
    receiver_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey('products.productID', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, index=True)

    message = Column(Text, nullable=False)
    sent_at = Column(DateTime, default=datetime.now())
    is_read = Column(Boolean, default=False)
    parent_id = Column(Integer, ForeignKey('messages.id', ondelete='SET NULL'), nullable=True) # If this isn't the first message
    convo_id = Column(Integer, index=True) # Group messages (like messages between same people) 
    
    parent_message = relationship("Message", remote_side=[id]) # Message threading (replies)
    #sender = relationship("User", foreign_keys=[sender_id])
    #receiver = relationship("User", foreign_keys=[receiver_id])
    product = relationship("Product", foreign_keys=[product_id])

    def __repr__(self):
        return f"<Message from {self.sender_id} to {self.receiver_id} about product {self.product_id} at {self.sent_at}>"
