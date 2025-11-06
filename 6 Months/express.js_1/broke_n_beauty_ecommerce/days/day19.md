# Day 19: Wishlist Backend Implementation

## Overview
Day 19 focused on implementing the wishlist backend functionality for the e-commerce application, including database models, API schemas, and routes to allow users to save products for later.

## Wishlist Model

### Wishlist Table
- **File Location**: `backend/app/models/wishlist.py`
- **Implementation Details**:
  - SQLAlchemy ORM model for the `wishlists` table
  - Fields: `id` (primary key), `user_id` (foreign key to users), `product_id` (foreign key to products)
  - Relationships: `user` and `product` with backrefs
  - Includes `__repr__` method for debugging

## Wishlist Schemas

### Wishlist Pydantic Schemas
- **File Location**: `backend/app/schemas/wishlist.py`
- **Implementation Details**:
  - `AddToWishlistRequest`: Pydantic model with `product_id` field
  - `WishlistRead`: Pydantic model with `id` and `product_id` fields
  - Configured for ORM mode compatibility with both Pydantic v1 and v2

## Wishlist API Routes

### Wishlist Router
- **File Location**: `backend/app/routers/wishlist.py`
- **Implementation Details**:
  - FastAPI router with prefix `/wishlist`
  - `POST /wishlist/add`: Adds products to wishlist with validation
  - `GET /wishlist/`: Retrieves user's wishlist items
  - `DELETE /wishlist/remove/{wishlist_item_id}`: Removes specific wishlist items
  - Authentication required using JWT tokens

## Named Constants

### MAX_WISHLIST_SIZE
- **Definition**: `MAX_WISHLIST_SIZE = 10`
- **Usage**: Limits the number of items a user can have in their wishlist

## Direct Code Flow

### Else If Branch for Wishlist Item Availability
- **Implementation**:
  ```python
  if in_stock and not in_cart:
      # Add to wishlist
  elif in_stock:
      # Else if branch: handle case when in stock but already in cart
  else:
      # Out of stock
  ```

## Logical Operator

### In Stock and Not in Cart Check
- **Implementation**: `if (in_stock && !in_cart):`
- **Details**:
  - `in_stock`: Checks if any product variant has stock > 0
  - `!in_cart`: Checks if product is not already in user's cart

## Looping Structure

### Iterate Wishlist Entries
- **Implementation**:
  ```python
  wishlist_items = db.query(models.Wishlist).filter(models.Wishlist.user_id == user.id).all()
  result = []
  for item in wishlist_items:
      result.append(WishlistRead(id=item.id, product_id=item.product_id))
  return result
  ```
- **Purpose**: Processes each wishlist item when retrieving/saving the wishlist

## Database Integration

### Table Creation
- **Method**: `Base.metadata.create_all(bind=engine)` in `main.py`
- **Result**: Automatically creates the `wishlists` table on application startup

## API Endpoints

### Available Routes
- `POST /wishlist/add` - Add product to wishlist
- `GET /wishlist/` - Get user's wishlist
- `DELETE /wishlist/remove/{id}` - Remove item from wishlist

## Error Handling

### Validation Checks
- User authentication
- Product existence
- Duplicate prevention
- Stock availability
- Cart status
- Wishlist size limits

## File Location
- **Model**: `backend/app/models/wishlist.py`
- **Schema**: `backend/app/schemas/wishlist.py`
- **Router**: `backend/app/routers/wishlist.py`