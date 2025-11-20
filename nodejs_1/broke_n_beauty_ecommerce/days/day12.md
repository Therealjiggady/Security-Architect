# Day 12: Configure Context API for Global State Management

## Objective
Set up Context API to manage global state for user session and cart in the React frontend.

## What Was Done
- Created `UserContext.jsx` for managing user authentication state (login, logout, session checking).
- Created `CartContext.jsx` for managing shopping cart state (add, remove, update items, persist to localStorage).
- Updated `App.jsx` to wrap the application with `UserProvider` and `CartProvider`.
- Tested the setup by running the development server successfully.

## Files Created/Modified
- `frontend/src/contexts/UserContext.jsx` (new)
- `frontend/src/contexts/CartContext.jsx` (new)
- `frontend/src/App.jsx` (modified)

## Usage
Components can now use `useUser()` and `useCart()` hooks to access and modify global state.

## Next Steps
Integrate these contexts into specific components like ProfilePage for user data and CartPage for cart functionality.