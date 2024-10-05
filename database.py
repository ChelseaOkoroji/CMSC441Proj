# This is the setup for using SQLAlchemy to make a database

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = "sqlite:///ezcommerce.db" # This works for multiple databases, the URL would just need to be changed

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
# need session to access database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# constructs base class (used in models.py)
Base = declarative_base()
