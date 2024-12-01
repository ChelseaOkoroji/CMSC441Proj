from sqlalchemy.orm import Session, aliased
from sqlalchemy import and_, func, update
import models, schemas
import bcrypt
from datetime import datetime

# CREATE operations

# **** User-related functions ****

# Create new user
def create_user(db: Session, user: schemas.UserCreate):
    # Hash password
    hashed_password = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    # New user
    new_user = models.User(userID=user.userID, email=user.email, password_hashed=hashed_password.decode("utf-8"))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# **** Product-related functions ****

# Create new product
def create_product(db: Session, product: schemas.ProductCreate):
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# **** Favorite-related functions ****

# Create new favorite
def create_favorite(db: Session, favorite: schemas.FavoriteCreate):
    new_favorite = models.Favorite(**favorite.dict())
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return new_favorite

# READ operations

# **** User-related functions ****

# Checks if given userID exists
def get_user_by_id(db: Session, userID: str):
    return db.query(models.User).filter(models.User.userID == userID).first()

# Checks if given email exists
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

# Check password 
def check_password(db: Session, password_to_check: str, user: models.User):
    return bcrypt.checkpw(password_to_check.encode("utf-8"), user.password_hashed.encode("utf-8"))

# **** Product-related functions ****

# Get specific product
def get_product(db: Session, productID: int):
    return db.query(models.Product).filter(models.Product.productID == productID).first()

# Get all products in a certain category
def get_products_by_category(db: Session, category: str):
    #return db.query(models.Product).filter(models.Product)
    pass

# Get all products <= price
def get_products_by_price(db: Session, price: float):
    return db.query(models.Product).filter(models.Product.price <= price)

# Get all products being sold by a user
def get_user_products(db: Session, userID: str):
    user = get_user_by_id(db, userID)
    return user.products

# **** Favorite-related functions ****

# Get specific favorite
def get_favorite(db: Session, favoriteID: int):
    return db.query(models.Favorite).filter(models.Favorite.favoriteID == favoriteID)

# Get all favorites of a user
def get_user_favorites(db: Session, userID: str):
    user = get_user_by_id(db, userID)
    return user.favorites

# UPDATE operations

# Update user (only possible for userID, email, and (maybe) profile image)
async def update_user(db: Session, oldUserID: str, newUserID: str, newEmail: str):
    existing_user = get_user_by_id(db, oldUserID)
    # Simply update email
    existing_user.email = newEmail
    # Updating userID is a little more complicated since it is connected to products, favorites, and messages
    # Products
    for product in get_user_products(db, oldUserID):
        product.userID = newUserID
    # Favorites
    for favorite in get_user_favorites(db, oldUserID):
        favorite.userID = newUserID
    # First do sent messages 
    for sent_message in db.query(models.Message).filter(models.Message.sender_id == oldUserID).all():
        sent_message.sender_id = newUserID
    # Then do received messages
    for received_message in db.query(models.Message).filter(models.Message.receiver_id == oldUserID).all():
        received_message.receiver_id = newUserID
    # Now update userID
    existing_user.userID = newUserID
    db.commit()
    db.refresh(existing_user)
    return existing_user

#def update_price(db: Session, productID: int):

# DELETE operations

# **** User-related functions ****

# Delete user
def delete_user(db: Session, userID: str):
    db.delete(get_user_by_id(db, userID))
    db.commit()

# **** Product-related functions ****

# Delete product
def delete_product(db: Session, productID: str):
    db.delete(get_product(db, productID))
    # Must delete all messages related to said productID
    for message in db.query(models.Message).filter(models.Message.product_id == productID).all():
        db.delete(message)
    db.commit()

# **** Favorite-related functions ****

# Add favorite

# Delete favorite
def delete_favorite(db: Session, userID: str, productID: int):
    favorites = db.query(models.Favorite).filter(
        models.Favorite.userID == userID,
        models.Favorite.productID == productID
    ).all()
    for favorite in favorites:
        db.delete(favorite)
    db.commit()

# HELPER FUNCTIONS (TOKEN)

# Create a token
def create_password_reset_token(db: Session, email: str, token: str):
    db_token = models.PasswordResetToken(email=email, token=token)
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token

# Return a token
def get_token(db: Session, token: str):
    return db.query(models.PasswordResetToken).filter(models.PasswordResetToken.token == token).first()

# Update a token's status
def update_token_status(db: Session, token: str, status: str):
    db_token = get_token(db, token)
    if db_token:
        db_token.status = status
        db.commit()

# Get products using optional filters
def get_products(db: Session, filters: schemas.ProductSearch):
    query = db.query(models.Product)
    # Now check filters
    if filters.name is not None:
        query = query.filter(models.Product.name.ilike(f"%{filters.name}%"))
    if filters.max_price is not None:
        query = query.filter(models.Product.price <= filters.max_price)
    if (filters.category is not None) and (filters.category != "all"):
        query = query.filter(models.Product.category == filters.category)
    if filters.color is not None:
        query = query.filter(models.Product.color == filters.color)
    # Do the query
    return query.all()

# MESSAGES

# Create a new message
def create_message(db: Session, message: schemas.MessageCreate):
    db_message = models.Message(**message.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

# Get all messages sent by a user
def get_sent_messages(db: Session, userID: str, skip: int = 0, limit: int = 100):
    # Alias for Message table 
    message_alias = aliased(models.Message)
    # Subquery to get the most recent message's timestamp per convo_id
    subquery = db.query(
        func.max(models.Message.sent_at).label('max_timestamp'),
        models.Message.convo_id
    ).filter(
        models.Message.sender_id == userID
    ).group_by(
        models.Message.convo_id
    ).subquery()
    # Main query to get most recent message per convo_id
    query = db.query(models.Message).join(
        subquery,
        models.Message.convo_id == subquery.c.convo_id
    ).filter(
        models.Message.sent_at == subquery.c.max_timestamp
    ).filter(
        models.Message.sender_id == userID  
    ).order_by(models.Message.sent_at.desc())
    query = query.offset(skip).limit(limit)
    return query.all()

# Get all messages received by a user
def get_received_messages(db: Session, userID: str, skip: int = 0, limit: int = 100):
    # Alias for Message table 
    message_alias = aliased(models.Message)
    # Subquery to get the most recent message's timestamp per convo_id
    subquery = db.query(
        func.max(models.Message.sent_at).label('max_timestamp'),
        models.Message.convo_id
    ).filter(
        models.Message.receiver_id == userID
    ).group_by(
        models.Message.convo_id
    ).subquery()
    # Main query to get most recent message per convo_id
    query = db.query(models.Message).join(
        subquery,
        models.Message.convo_id == subquery.c.convo_id
    ).filter(
        models.Message.sent_at == subquery.c.max_timestamp
    ).filter(
        models.Message.receiver_id == userID  
    ).order_by(models.Message.sent_at.desc())
    query = query.offset(skip).limit(limit)
    return query.all()

# Get a specific message by message ID
def get_message_by_id(db: Session, message_id: int):
    return db.query(models.Message).filter(models.Message.id == message_id).first()

# Update read status and return messages with convo_id (used in conversations)
# Only mark read if mark_read = True
def mark_read(db: Session, convo_id: int, mark_read: bool = False):
    # Update all messages with given convo_id
    """
    db_messages = db.query(models.Message).filter(models.Message.convo_id == convo_id).all()
    for db_message in db_messages:
        db_message.is_read = True
    """
    # mark_read determines whether to mark the conversation as read
    if(mark_read):
        db.query(models.Message).filter(models.Message.convo_id == convo_id).update(
            {models.Message.is_read: mark_read}, synchronize_session=False
        )
    db.commit()
    # Need the messages for the frontend display
    updated_messages = db.query(models.Message).filter(models.Message.convo_id == convo_id).all()
    return updated_messages