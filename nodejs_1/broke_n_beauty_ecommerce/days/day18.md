# Day 18: Cart UI Implementation (Vanilla JS)

## Overview
Day 18 focused on implementing a cart UI demo using vanilla JavaScript, HTML, and CSS. This standalone demo showcases DOM manipulation techniques for a functional shopping cart, including product display, add-to-cart functionality, and dynamic cart updates.

## Web Page Interaction

### getElementById Usage
- **productGrid**: References the container for displaying product cards
- **cartList**: References the unordered list for cart items
- **cartTotals**: References the div displaying the subtotal

### getElementsByClassName Usage
- **addButtons**: Retrieves all elements with class 'add-btn' to attach click event listeners for adding products to cart

### getElementsByTagName Usage
- **allButtons**: Retrieves all button elements to set title attributes for accessibility

## Dynamic CSS Changes

### Highlight Class Manipulation
- When a product is added to cart, the corresponding product card receives the 'highlight' class (dashed outline) for 800ms
- Uses `classList.add('highlight')` and `setTimeout` with `classList.remove('highlight')` for visual feedback

## Descriptive Variable Names

### cartItems Array
- Stores cart items with product details and quantities
- Updated when adding items, incrementing quantity for existing products

## Array Iteration

### Product Rendering
- `products.forEach(p => { ... })`: Loops through products array to create and append product card elements

### Cart Rendering
- `cartItems.forEach(item => { ... })`: Loops through cart items to calculate subtotals and render cart list items

## Mathematical Operations

### Subtotal Calculation
- `calculateSubtotal(price, quantity)`: Function returning price * quantity
- Used in cart rendering to compute line totals

## Output Results

### Demo Functionality
- Displays 4 products in a grid layout
- "Add to Cart" buttons add items or increment quantities
- Cart section shows items with quantities, prices, and line totals
- Subtotal updates dynamically
- Visual highlight on product cards when added

### Test Output
- Sample calculation: price = 10, quantity = 2 → subtotal = 20
- Console logs subtotal value
- DOM updates subtotal display element

## File Location
- **frontend/day18.html**: Complete HTML file with embedded CSS and JavaScript