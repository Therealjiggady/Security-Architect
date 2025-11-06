# Day 20: Wishlist Frontend Implementation

## Overview
Day 20 focused on implementing the wishlist frontend functionality for the React application, including a dedicated wishlist page, API integration, and UI components to allow users to save and view products.

## Wishlist Page Component

### WishlistPage.jsx
- **File Location**: `frontend/src/WishlistPage.jsx`
- **Implementation Details**:
  - React component for displaying user's saved products
  - Fetches wishlist items from `/wishlist/` API endpoint
  - Displays products in a grid layout with remove functionality
  - Shows empty state when no items are saved
  - Includes navigation header with wishlist count

## API Integration

### Fetch Wishlist Items
- **Method**: `GET /wishlist/`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of wishlist items with `id` and `product_id`
- **Error Handling**: Displays error messages for failed requests

### Remove from Wishlist
- **Method**: `DELETE /wishlist/remove/{wishlist_item_id}`
- **Headers**: `Authorization: Bearer {token}`
- **Functionality**: Removes item from local state after successful deletion

## DOM Outputs

### Wishlist Count in Navbar
- **Implementation**: `Wishlist ({wishlistItems.length})` in navigation
- **Location**: Header navigation in WishlistPage.jsx

### Console Logging
- **Implementation**: `console.log('Wishlist items:', data)` when fetching items
- **Purpose**: Logs wishlist data to console for debugging

## Add Attributes Dynamically

### data-saved Attribute
- **Implementation**: `data-saved={saved ? "true" : undefined}` on product card div
- **Trigger**: Added when user successfully saves product to wishlist
- **Purpose**: Marks saved products with custom data attribute

## Onclick Reaction

### Save Button Handler
- **Implementation**: `onClick={handleSaveToWishlist}`
- **Functionality**: Calls `addToWishlist` function and updates UI state
- **State Change**: Sets `saved` to true on success

## Organize Functions

### addToWishlist Function
- **Signature**: `addToWishlist(productId, userId)` returns `boolean`
- **Implementation**:
  ```javascript
  const addToWishlist = async (productId, userId) => {
    try {
      const response = await fetch('http://localhost:8000/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      return response.ok;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };
  ```
- **Return Value**: `true` on success, `false` on failure

## Product Card Updates

### Save Button
- **File Location**: `frontend/src/components/ProductCard.jsx`
- **Implementation**:
  - Added "Save" button next to "Add to Cart"
  - Changes to "Saved" and red styling when clicked
  - Disabled when user is not logged in
  - Calls `addToWishlist` on click

## Routing Integration

### App.jsx Updates
- **Added Import**: `import WishlistPage from './WishlistPage'`
- **Added Route**: `<Route path="/wishlist" element={<Wishlist />} />`
- **Added Function**: `function Wishlist() { return <WishlistPage /> }`

## User Authentication

### Context Usage
- **Import**: `import { useUser } from '../contexts/UserContext'`
- **Usage**: Checks `user` for authentication and token
- **Fallback**: Disables save functionality when not logged in

## State Management

### Local State
- **saved**: Boolean state for tracking if product is saved
- **wishlistItems**: Array state for storing fetched wishlist items

## Error Handling

### API Errors
- **Display**: Shows error messages in UI
- **Logging**: Console errors for debugging
- **User Feedback**: Button state changes indicate success/failure

## File Location
- **Wishlist Page**: `frontend/src/WishlistPage.jsx`
- **Product Card**: `frontend/src/components/ProductCard.jsx`
- **App Routing**: `frontend/src/App.jsx`