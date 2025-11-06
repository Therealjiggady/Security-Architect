# Day 17: Cart Functionality Implementation

## Overview
Day 17 focused on implementing cart functionality for the e-commerce application, including backend models, schemas, API routes, and frontend context management. Additionally, a centralized JavaScript file was created with constants and mathematical operations for cart calculations.

## Cart Schema and API Routes

### Cart Model
- **File Location**: `backend/app/models/cart.py`
- **Implementation Details**: 
  - SQLAlchemy ORM model for the `carts` table
  - Fields: `id` (primary key), `user_id` (foreign key to users), `product_id` (foreign key to products), `quantity` (integer, default 1)
  - Relationships: `user` and `product` with backrefs
  - Includes `__repr__` method for debugging

### Cart Schemas
- **File Location**: `backend/app/schemas/cart.py`
- **Implementation Details**:
  - `AddToCartRequest`: Pydantic model with `product_id` and `quantity` fields
  - `CartRead`: Pydantic model with `id`, `product_id`, and `quantity` fields
  - Configured for ORM mode compatibility with both Pydantic v1 and v2

### Cart API Routes
- **File Location**: `backend/app/routers/cart.py`
- **Implementation Details**:
  - FastAPI router with prefix `/cart`
  - `POST /cart/add`: Adds items to cart, handles existing items by incrementing quantity
  - `DELETE /cart/remove/{cart_item_id}`: Removes specific cart items
  - Authentication required using JWT tokens
  - Error handling for user/product not found scenarios

## Centralized JavaScript

### Cart Context
- **File Location**: `frontend/src/contexts/CartContext.jsx`
- **Implementation Details**:
  - React Context for managing cart state across the application
  - State management with `useState` for cart items
  - Local storage persistence for cart data
  - Functions: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getTotalItems`, `getTotalPrice`
  - Provider component wrapping children components

## Constants

### Cart Constants
- **File Location**: `backend/static/test.js`
- **Implementation Details**:
  - `CART_LIMIT = 10`: Maximum number of items allowed in cart
  - `TAX_RATE = 0.08`: Tax rate for calculations (8%)

## Mathematical Operations

### Cart Calculations
- **File Location**: `backend/static/test.js`
- **Implementation Details**:
  - `calculateSubtotal(price, quantity)`: Function to calculate subtotal by multiplying price and quantity
  - Returns the product of price and quantity

## Output Results

### Test Output
- **File Location**: `backend/static/test.js`
- **Implementation Details**:
  - Sample calculation with `price = 10` and `quantity = 2`
  - `subtotal = calculateSubtotal(price, quantity)` results in 20
  - Console output: `console.log(subtotal)` displays 20
  - DOM manipulation: Updates element with id 'subtotal' to display "Subtotal: 20"